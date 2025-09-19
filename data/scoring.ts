export type ScoreItem = { name:string; code:string; total:number; by:{ execution:number; app:number; cost:number; support:number } };
export const weights = { execution:0.3, app:0.25, cost:0.3, support:0.15 };
export const scoring: ScoreItem[] = [
  { name:'DMM FX', code:'dmm', total:87, by:{ execution:26, app:23, cost:27, support:11 } },
  { name:'GMOクリック', code:'gmo', total:84, by:{ execution:25, app:21, cost:27, support:11 } },
  { name:'外為どっとコム', code:'gaitame', total:81, by:{ execution:24, app:20, cost:25, support:12 } },
];
