export type PollOption = { code:string; name:string; votes:number };
export const pollQuestion = '普段メインで使っているFX口座は？';
// 初期票はアンカー用（表示のみ）。ユーザー投票はlocalStorageで加算。
export const pollOptions: PollOption[] = [
  { code:'dmm', name:'DMM FX', votes:120 },
  { code:'gmo', name:'GMOクリック', votes:95 },
  { code:'gaitame', name:'外為どっとコム', votes:60 },
  { code:'minna', name:'みんなのFX', votes:55 },
  { code:'sbi', name:'SBI FX', votes:50 },
];
