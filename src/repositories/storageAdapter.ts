export interface StorageAdapter { get<T>(key:string, fallback:T):T; set<T>(key:string, value:T):void; has(key:string):boolean; }

export class LocalStorageAdapter implements StorageAdapter {
  get<T>(key:string, fallback:T):T { try { const value=localStorage.getItem(key); return value===null?fallback:JSON.parse(value) as T; } catch { return fallback; } }
  set<T>(key:string,value:T){ localStorage.setItem(key,JSON.stringify(value)); }
  has(key:string){ return localStorage.getItem(key)!==null; }
}

export const storageAdapter = new LocalStorageAdapter();
