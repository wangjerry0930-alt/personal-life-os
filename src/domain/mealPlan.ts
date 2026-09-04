export type MealPlanLike={id:string;date:string;slot:string;recipeId:string;recipeIds?:string[];status:string};

export const recipeIdsForMealPlan=(plan:MealPlanLike):string[]=>plan.recipeIds?.length?plan.recipeIds:[plan.recipeId];

/** Keeps the calendar unique by replacing the existing plan for the same local date and slot. */
export const upsertMealPlanForSlot=<T extends MealPlanLike>(plans:T[],next:T):T[]=>[
  ...plans.filter(item=>item.id!==next.id&&!(item.date===next.date&&item.slot===next.slot)),next,
];
