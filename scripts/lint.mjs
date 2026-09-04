import { readFileSync } from 'node:fs';
import { join } from 'node:path';

const root=process.cwd();
const files=['src/store/useAppStore.ts','src/services/activityService.ts','src/services/habitService.ts','src/components/FoodMealsPage.tsx','src/components/QuestBoard.tsx'];
for(const file of files){const text=readFileSync(join(root,file),'utf8');for(const token of ['PROGRESS_RESET','resetProgress'])if(text.includes(token))throw new Error(`${file} contains forbidden destructive migration token: ${token}`)}
const index=readFileSync(join(root,'dist/index.html'),'utf8');if(!index.includes('/personal-life-os/'))throw new Error('dist/index.html is missing the GitHub Pages base path');
console.log(`lint checks passed for ${files.length} source files and Pages base path`);
