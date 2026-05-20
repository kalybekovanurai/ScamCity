export interface UserProfile {
  id?: number | string;
  username?: string;
  email?: string;
  level: number;
  subLevel: number;
  xp: number;
  rank: string;
  correctPercent: number;
}

export interface ProfileState {
  user: UserProfile | null;
  loading: boolean;
  error: string | null;
}
