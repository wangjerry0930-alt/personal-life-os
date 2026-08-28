export type Person={id:string;name:string;relationship?:string;organisation?:string;location?:string;interests:string[];notes?:string;lastInteraction?:string;nextFollowUp?:string;cadence?:string;avatar?:string;images?:string[];interactions?:Array<{id:string;date:string;note:string;channel?:string}>};
export type PersonFact={id:string;personId:string;fact:string;category:string;source:string;dateLearned:string;private:boolean;tags:string[]};
export type Interaction={id:string;personId:string;date:string;channel:string;location:string;summary:string;topics:string;promises:string;followUps:string};
export type ImportantDate={id:string;personId:string;label:string;date:string;recurring:boolean;notes:string};
