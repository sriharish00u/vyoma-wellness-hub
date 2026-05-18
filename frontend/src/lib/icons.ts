import { Sparkles, HeartPulse, Wind, Dumbbell, Sunrise, Brain, Users, ShieldCheck, Trophy, type LucideIcon } from "lucide-react";

export const iconMap: Record<string, LucideIcon> = {
  Sparkles, HeartPulse, Wind, Dumbbell, Sunrise, Brain, Users, ShieldCheck, Trophy,
};

export function getIcon(name: string): LucideIcon {
  return iconMap[name] ?? Sparkles;
}
