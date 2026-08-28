import { useState } from 'react';
import Icon from './Icon';
import type { Language } from '../i18n';
import { getLanguage } from '../i18n';

export default function LanguagePicker(){const[language,setLanguage]=useState<Language>(getLanguage);const change=(next:Language)=>{setLanguage(next);localStorage.setItem('personal-life-os-language',next);document.documentElement.lang=next==='zh'?'zh-CN':'en';window.dispatchEvent(new CustomEvent('life-os-language',{detail:next}))};return <section className="settings-card language-picker"><div className="settings-card-head"><div><h3>Language / 语言</h3><p>切换主要导航、页面标题和后续功能的显示语言。</p></div><Icon name="Languages" size={20}/></div><div className="language-options"><button className={language==='en'?'selected':''} onClick={()=>change('en')}><span>English</span>{language==='en'&&<Icon name="Check" size={15}/>}</button><button className={language==='zh'?'selected':''} onClick={()=>change('zh')}><span>中文</span>{language==='zh'&&<Icon name="Check" size={15}/>}</button></div><p className="muted language-note">Language support is being expanded progressively; new modules will use the same translation layer.</p></section>}
