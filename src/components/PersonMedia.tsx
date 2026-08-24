import Icon from './Icon';

export default function PersonMedia({ name, avatar, images, onChange }: { name:string; avatar?:string; images?:string[]; onChange:(avatar?:string, images?:string[])=>void }) {
  const read=(file:File,callback:(value:string)=>void)=>{const reader=new FileReader();reader.onload=()=>callback(String(reader.result));reader.readAsDataURL(file)};
  const uploadAvatar=(file?:File)=>{if(file)read(file,value=>onChange(value,images))};
  const uploadImage=(file?:File)=>{if(file)read(file,value=>onChange(avatar,[...(images||[]),value].slice(-12)))};
  return <div className="person-media"><label className="avatar person-avatar person-avatar-upload" title="Upload avatar">{avatar?<img src={avatar} alt={name}/>:name.slice(0,1)}<span><Icon name="Camera" size={11}/></span><input type="file" accept="image/*" onChange={e=>uploadAvatar(e.target.files?.[0])}/></label>{images?.length?<div className="person-images">{images.map((image,index)=><img key={index} src={image} alt={`${name} memory ${index+1}`}/>)}</div>:null}<label className="add-person-image"><Icon name="ImagePlus" size={13}/> Add photo<input type="file" accept="image/*" onChange={e=>uploadImage(e.target.files?.[0])}/></label></div>;
}
