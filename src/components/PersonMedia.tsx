import Icon from './Icon';

export default function PersonMedia({ name, avatar, images, onChange }: { name:string; avatar?:string; images?:string[]; onChange:(avatar?:string, images?:string[])=>void }) {
  const read=(file:File,callback:(value:string)=>void)=>{const reader=new FileReader();reader.onload=()=>callback(String(reader.result));reader.readAsDataURL(file)};
  const uploadAvatar=(file?:File)=>{if(file)read(file,value=>onChange(value,images))};
  const uploadImage=(file?:File)=>{if(file)read(file,value=>onChange(avatar,[...(images||[]),value].slice(-12)))};
  return <div className="person-media"><div className="avatar-wrap"><label className="avatar person-avatar person-avatar-upload" title="Upload avatar">{avatar?<img src={avatar} alt={name}/>:name.slice(0,1)}<span><Icon name="Camera" size={11}/></span><input type="file" accept="image/*" onChange={e=>uploadAvatar(e.target.files?.[0])}/></label>{avatar&&<button className="remove-avatar" title="Remove avatar" onClick={()=>onChange(undefined,images)}>×</button>}</div>{images?.length?<div className="person-images">{images.map((image,index)=><div className="person-image-wrap" key={index}><img src={image} alt={`${name} memory ${index+1}`}/><button title="Delete photo" onClick={()=>onChange(avatar,images.filter((_,photoIndex)=>photoIndex!==index))}>×</button></div>)}</div>:null}<label className="add-person-image"><Icon name="ImagePlus" size={13}/> Add photo<input type="file" accept="image/*" onChange={e=>uploadImage(e.target.files?.[0])}/></label></div>;
}
