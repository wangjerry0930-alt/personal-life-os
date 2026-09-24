export type GroceryPrice={id:string;name:string;supermarket:string;packQuantity:number;unit:string;packPrice:number;note:string;updatedAt:string};
export const GROCERY_PRICE_KEY='personal-life-os-grocery-prices-v2';
export const loadGroceryPrices=():GroceryPrice[]=>{try{return JSON.parse(localStorage.getItem(GROCERY_PRICE_KEY)||'[]')}catch{return[]}};
export const saveGroceryPrices=(items:GroceryPrice[])=>{localStorage.setItem(GROCERY_PRICE_KEY,JSON.stringify(items));window.dispatchEvent(new Event('life-os-grocery-prices-changed'))};
