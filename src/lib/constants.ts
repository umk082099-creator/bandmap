import { Instrument, Style } from './types';

export const CITIES = [
  '东莞', '北京', '上海', '广州', '深圳',
  '成都', '杭州', '武汉', '长沙', '佛山',
  '惠州', '西安', '南京', '重庆',
] as const;

export const INSTRUMENTS: { value: Instrument; label: string }[] = [
  { value: '吉他', label: '吉他' },
  { value: '贝斯', label: '贝斯' },
  { value: '鼓', label: '鼓' },
  { value: '主唱', label: '主唱' },
  { value: '键盘', label: '键盘' },
  { value: '其他', label: '其他' },
];

export const STYLES: { value: Style; label: string }[] = [
  { value: '日系摇滚', label: '日系摇滚' },
  { value: 'ACG', label: 'ACG' },
  { value: '独立摇滚', label: '独立摇滚' },
  { value: '后摇', label: '后摇' },
  { value: '金属', label: '金属' },
  { value: '朋克', label: '朋克' },
  { value: '流行摇滚', label: '流行摇滚' },
  { value: '布鲁斯', label: '布鲁斯' },
  { value: '爵士', label: '爵士' },
  { value: '视觉系', label: '视觉系' },
  { value: '其他', label: '其他' },
];

export const RECRUITMENT_TYPE_LABELS: Record<string, string> = {
  band_seeking: '乐队招人',
  musician_seeking: '乐手求职',
};

export const STATUS_LABELS: Record<string, string> = {
  active: '招募中',
  filled: '已招满',
  expired: '已过期',
};

export const STATUS_COLORS: Record<string, string> = {
  active: 'bg-green-500/20 text-green-400 border-green-500/30',
  filled: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
  expired: 'bg-red-500/20 text-red-400 border-red-500/30',
};
