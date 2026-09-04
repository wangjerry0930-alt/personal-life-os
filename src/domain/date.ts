/** Business dates must follow the user's local calendar, not UTC. */
export const localDateKey=(date:Date=new Date()):string=>{const year=date.getFullYear();const month=String(date.getMonth()+1).padStart(2,'0');const day=String(date.getDate()).padStart(2,'0');return `${year}-${month}-${day}`};
export const addLocalDays=(date:Date,days:number):Date=>{const next=new Date(date);next.setDate(next.getDate()+days);return next};
