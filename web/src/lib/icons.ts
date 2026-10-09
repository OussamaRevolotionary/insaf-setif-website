import { CalendarDays, Globe, HandHeart, HeartHandshake, Landmark, Megaphone, ShieldCheck, UsersRound } from 'lucide-react';
import type { IconKey } from '@/data/content';

export const ICONS: Record<IconKey, typeof ShieldCheck> = {
  shield: ShieldCheck,
  users: UsersRound,
  handshake: HeartHandshake,
  heart: HandHeart,
  globe: Globe,
  landmark: Landmark,
  megaphone: Megaphone,
  calendar: CalendarDays,
};
