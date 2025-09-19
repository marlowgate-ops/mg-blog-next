export type PollOption = { code:string; name:string; votes:number };
export const pollQuestion = '普段メインで使っているFX口座は？';
export const pollOptions: PollOption[] = [
  { code:'dmm', name:'DMM FX', votes:120 },
  { code:'gmo', name:'GMOクリック', votes:95 },
  { code:'gaitame', name:'外為どっとコム', votes:60 },
];
