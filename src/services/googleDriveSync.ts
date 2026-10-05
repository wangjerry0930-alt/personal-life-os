import type { RepositorySnapshot } from '../domain/types';

export const GOOGLE_DRIVE_CLIENT_ID_KEY='personal-life-os-google-client-id';
const FILE_NAME='personal-life-os-repository.json';
const DRIVE_SCOPE='https://www.googleapis.com/auth/drive.file';
type TokenClient={requestAccessToken:(options?:{prompt?:string})=>void};
type DriveFile={id:string;name:string;modifiedTime:string;mimeType:string};
type GoogleWindow=Window&{google?:{accounts?:{oauth2?:{initTokenClient:(config:{client_id:string;scope:string;callback:(response:{access_token?:string;error?:string})=>void})=>TokenClient}}}};

let scriptPromise:Promise<void>|null=null;
function loadIdentityScript(){
  if((window as GoogleWindow).google?.accounts?.oauth2)return Promise.resolve();
  if(scriptPromise)return scriptPromise;
  scriptPromise=new Promise((resolve,reject)=>{const script=document.createElement('script');script.src='https://accounts.google.com/gsi/client';script.async=true;script.onload=()=>resolve();script.onerror=()=>reject(new Error('Could not load Google sign-in.'));document.head.appendChild(script)});
  return scriptPromise;
}

async function accessToken(clientId:string){
  await loadIdentityScript();
  const oauth=(window as GoogleWindow).google?.accounts?.oauth2;
  if(!oauth)throw new Error('Google sign-in is unavailable in this browser.');
  return new Promise<string>((resolve,reject)=>{const client=oauth.initTokenClient({client_id:clientId,scope:DRIVE_SCOPE,callback:response=>response.access_token?resolve(response.access_token):reject(new Error(response.error||'Google authorization failed.'))});client.requestAccessToken({prompt:''})});
}

async function driveRequest<T>(token:string,url:string,init:RequestInit={}):Promise<T>{
  const response=await fetch(url,{...init,headers:{Authorization:`Bearer ${token}`,...(init.headers||{})}});
  if(!response.ok)throw new Error(`Google Drive ${response.status}`);
  return response.json() as Promise<T>;
}

async function findSnapshot(token:string){
  const query=encodeURIComponent(`name='${FILE_NAME}' and trashed=false`);
  const result=await driveRequest<{files:DriveFile[]}>(token,`https://www.googleapis.com/drive/v3/files?q=${query}&orderBy=modifiedTime%20desc&fields=files(id,name,modifiedTime,mimeType)`);
  return result.files?.[0]||null;
}

function multipartBody(metadata:Record<string,unknown>,snapshot:RepositorySnapshot){
  const boundary='lifeos-boundary';
  return{body:`--${boundary}\r\nContent-Type: application/json; charset=UTF-8\r\n\r\n${JSON.stringify(metadata)}\r\n--${boundary}\r\nContent-Type: application/json\r\n\r\n${JSON.stringify(snapshot)}\r\n--${boundary}--`,headers:{'Content-Type':`multipart/related; boundary=${boundary}`}};
}

export async function uploadDriveSnapshot(snapshot:RepositorySnapshot,clientId:string){
  const token=await accessToken(clientId);const existing=await findSnapshot(token);const metadata={name:FILE_NAME,mimeType:'application/json'};const payload=multipartBody(metadata,snapshot);const url=existing?`https://www.googleapis.com/upload/drive/v3/files/${existing.id}?uploadType=multipart`:'https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart';
  const file=await driveRequest<DriveFile>(token,url,{method:existing?'PATCH':'POST',headers:payload.headers,body:payload.body});
  return{updatedAt:file.modifiedTime};
}

export async function downloadDriveSnapshot(clientId:string){
  const token=await accessToken(clientId);const file=await findSnapshot(token);if(!file)return null;
  const snapshot=await driveRequest<RepositorySnapshot>(token,`https://www.googleapis.com/drive/v3/files/${file.id}?alt=media`);
  return{updatedAt:file.modifiedTime,payload:snapshot};
}
