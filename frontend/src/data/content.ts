import { Sparkles, HeartPulse, Wind, Dumbbell, Sunrise, Brain, Users, ShieldCheck, Trophy } from "lucide-react";

export const programs = [
  { slug: "morning-yoga", title: "Morning Yoga Flow", level: "Beginner", duration: "20 min", icon: Sunrise, tag: "Yoga", desc: "Gentle vinyasa to wake the body and steady the mind." },
  { slug: "strength-foundations", title: "Strength Foundations", level: "Intermediate", duration: "35 min", icon: Dumbbell, tag: "Fitness", desc: "Progressive bodyweight + dumbbell strength sessions." },
  { slug: "pranayama-basics", title: "Pranayama Basics", level: "All levels", duration: "15 min", icon: Wind, tag: "Breathwork", desc: "Structured breath practice for calm focus." },
  { slug: "calm-mind", title: "Calm Mind Meditation", level: "All levels", duration: "12 min", icon: Brain, tag: "Meditation", desc: "Guided sessions to reduce stress and reset focus." },
  { slug: "core-cardio", title: "Core & Cardio", level: "Intermediate", duration: "25 min", icon: HeartPulse, tag: "Fitness", desc: "Low-impact cardio with core stability work." },
  { slug: "daily-discipline", title: "Daily Discipline", level: "All levels", duration: "10 min", icon: Sparkles, tag: "Motivation", desc: "A daily micro-habit framework that compounds." },
];

export const features = [
  { icon: Sunrise, title: "Daily live sessions", desc: "Show up every morning to a guided, structured class." },
  { icon: Users, title: "Coach-led cohorts", desc: "Practice alongside a small group with real accountability." },
  { icon: ShieldCheck, title: "Safe progressions", desc: "Modifications for every body, every level, every day." },
  { icon: Trophy, title: "Habit streaks", desc: "Track your consistency — discipline is the real outcome." },
];

export const testimonials = [
  { name: "Aarti S.", role: "Member, 6 months", quote: "Vyoma helped me build a 90-day yoga streak. The classes feel calm, never rushed." },
  { name: "Rohan M.", role: "Member, 1 year", quote: "Finally a fitness platform that doesn't shout at me. Just steady, daily progress." },
  { name: "Meera K.", role: "Member, 4 months", quote: "Breathwork has changed my sleep. The coaches are patient and clear." },
];

export const stats = [
  { value: "120k+", label: "Active members" },
  { value: "1.8M", label: "Sessions completed" },
  { value: "60+", label: "Certified coaches" },
  { value: "4.9", label: "Avg. rating" },
];

export const plans = [
  { name: "Starter", price: "Free", period: "forever", features: ["3 sessions / week", "Library preview", "Community access"], cta: "Get started", highlight: false },
  { name: "Member", price: "₹499", period: "/ month", features: ["Daily live sessions", "Full program library", "Habit tracker", "Coach Q&A"], cta: "Become a member", highlight: true },
  { name: "Annual", price: "₹3,999", period: "/ year", features: ["Everything in Member", "Two months free", "Priority support", "Member events"], cta: "Go annual", highlight: false },
];
