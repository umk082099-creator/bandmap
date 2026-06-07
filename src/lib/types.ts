export type RecruitmentType = 'band_seeking' | 'musician_seeking';
export type RecruitmentStatus = 'active' | 'filled' | 'expired';
export type Instrument = '吉他' | '贝斯' | '鼓' | '主唱' | '键盘' | '其他';
export type Style =
  | '日系摇滚' | 'ACG' | '独立摇滚' | '后摇' | '金属'
  | '朋克' | '流行摇滚' | '布鲁斯' | '爵士' | '视觉系' | '其他';

export interface Recruitment {
  id: number;
  type: RecruitmentType;
  title: string;
  city: string;
  styles: Style[];
  instrument: Instrument;
  content: string;
  video_url: string | null;
  contact: string;
  status: RecruitmentStatus;
  user_id: string;
  created_at: string;
  updated_at: string;
}

export interface Post {
  id: number;
  title: string;
  content: string;
  video_url: string | null;
  image_url: string | null;
  user_id: string;
  created_at: string;
  updated_at: string;
}

export interface Profile {
  id: string;
  email: string;
  created_at: string;
}
