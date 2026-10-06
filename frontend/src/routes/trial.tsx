import { createFileRoute } from "@tanstack/react-router";
import React, { useState } from "react";
import {
  Calendar,
  Clock,
  Globe,
  Sparkles,
  Phone,
  Mail,
  CheckCircle2,
  ArrowRight,
  ArrowLeft,
  Heart,
  ShieldAlert,
  Share2,
  CalendarPlus,
  Send,
  User,
  Briefcase,
  Activity,
  Award,
  Check,
  Flame,
} from "lucide-react";
import { AmbientAuraCanvas } from "@/components/ui/AmbientAuraCanvas";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Badge } from "@/components/ui/badge";
import { api, type TrialRegistrationInput } from "@/lib/api";
import { toast } from "sonner";

export const Route = createFileRoute("/trial")({
  head: () => ({
    meta: [
      { title: "Register — 14-Day Free Yoga Program | Mivora Academy" },
      {
        name: "description",
        content:
          "Register for Mivora Academy's 14-Day Free Online Yoga Program (04–17 October 2026, 5:15 AM – 6:15 AM). Breathe. Move. Begin.",
      },
    ],
  }),
  component: TrialRegistrationPage,
});

const PROFESSION_OPTIONS = [
  "Student",
  "Working Professional",
  "Business Owner",
  "Homemaker",
  "Retired",
  "Other",
];

const EXPERIENCE_OPTIONS = [
  { value: "Never — I'm completely new to yoga", label: "Never — I'm completely new to yoga" },
  { value: "Occasionally", label: "Occasionally" },
  { value: "Regularly", label: "Regularly" },
];

const GOAL_OPTIONS = [
  "Flexibility",
  "Strength",
  "Stress Relief",
  "Better Sleep",
  "Focus & Concentration",
  "General Fitness",
  "Morning Routine",
  "Relaxation",
  "Overall Wellbeing",
  "Other",
];

const COMMITMENT_OPTIONS = [
  { value: "Yes, I'm committed 🙌", label: "Yes, I'm committed 🙌" },
  { value: "I'll attend as often as possible", label: "I'll attend as often as possible" },
  { value: "I'm not sure yet", label: "I'm not sure yet" },
];

const HEAR_ABOUT_OPTIONS = [
  "WhatsApp",
  "Friend / Family",
  "Teacher / College",
  "Business / Professional Group",
  "Social Media",
  "Mivora Academy",
  "Other",
];

const TOTAL_STEPS = 8;

export function TrialRegistrationPage() {
  const [step, setStep] = useState(1);
  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Form State
  const [formData, setFormData] = useState<TrialRegistrationInput>({
    fullName: "",
    age: 0,
    whatsappNumber: "",
    email: "",
    profession: "",
    professionOther: "",
    yogaExperience: "",
    goals: [],
    goalsOther: "",
    hopesToGain: "",
    hasPhysicalRestrictions: "No",
    physicalRestrictionsDetail: "",
    morningCommitment: "",
    comfortableFollowingGuidance: "Yes",
    hearAbout: "",
    hearAboutOther: "",
    agreeTerms: false,
    futureUpdates: "Yes",
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateStep = (currentStep: number): boolean => {
    const newErrors: Record<string, string> = {};

    if (currentStep === 2) {
      if (!formData.fullName.trim() || formData.fullName.trim().length < 2) {
        newErrors.fullName = "Please enter your full name (minimum 2 characters)";
      }
      if (!formData.age || formData.age < 5 || formData.age > 120) {
        newErrors.age = "Please enter a valid age (between 5 and 120)";
      }
      const cleanPhone = formData.whatsappNumber.replace(/[\s+-]/g, "");
      if (!cleanPhone || cleanPhone.length < 8) {
        newErrors.whatsappNumber = "Please enter a valid 10-digit WhatsApp / Phone number";
      }
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!formData.email.trim() || !emailRegex.test(formData.email.trim())) {
        newErrors.email = "Please enter a valid email address";
      }
    } else if (currentStep === 3) {
      if (!formData.profession) {
        newErrors.profession = "Please select your current profession";
      }
      if (formData.profession === "Other" && !formData.professionOther?.trim()) {
        newErrors.professionOther = "Please specify your profession";
      }
    } else if (currentStep === 4) {
      if (!formData.yogaExperience) {
        newErrors.yogaExperience = "Please select your yoga experience level";
      }
      if (formData.goals.length === 0) {
        newErrors.goals = "Please select at least one benefit you would like to improve";
      }
      if (formData.goals.includes("Other") && !formData.goalsOther?.trim()) {
        newErrors.goalsOther = "Please specify your other goal";
      }
    } else if (currentStep === 5) {
      if (!formData.hasPhysicalRestrictions) {
        newErrors.hasPhysicalRestrictions = "Please choose an option";
      }
      if (formData.hasPhysicalRestrictions === "Yes" && !formData.physicalRestrictionsDetail?.trim()) {
        newErrors.physicalRestrictionsDetail =
          "Please briefly describe your restrictions or limitations so the instructor can guide you safely";
      }
    } else if (currentStep === 6) {
      if (!formData.morningCommitment) {
        newErrors.morningCommitment = "Please select your commitment level";
      }
      if (!formData.comfortableFollowingGuidance) {
        newErrors.comfortableFollowingGuidance = "Please indicate if you are comfortable following guidance";
      }
    } else if (currentStep === 8) {
      if (!formData.agreeTerms) {
        newErrors.agreeTerms = "You must confirm and agree to proceed";
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const nextStep = () => {
    if (validateStep(step)) {
      setStep((prev) => Math.min(prev + 1, TOTAL_STEPS));
      window.scrollTo({ top: 180, behavior: "smooth" });
    } else {
      toast.error("Please fill in the required fields to continue");
    }
  };

  const prevStep = () => {
    setErrors({});
    setStep((prev) => Math.max(prev - 1, 1));
    window.scrollTo({ top: 180, behavior: "smooth" });
  };

  const toggleGoal = (goal: string) => {
    setFormData((prev) => {
      const exists = prev.goals.includes(goal);
      const nextGoals = exists
        ? prev.goals.filter((g) => g !== goal)
        : [...prev.goals, goal];
      return { ...prev, goals: nextGoals };
    });
    if (errors.goals) {
      setErrors((prev) => ({ ...prev, goals: "" }));
    }
  };

  const handleSubmit = async () => {
    if (!validateStep(8)) {
      toast.error("Please agree to the confirmation terms");
      return;
    }

    setIsSubmitting(true);
    try {
      await api.trial.register({
        ...formData,
        age: Number(formData.age),
      });
      setSubmitted(true);
      toast.success("Registration received successfully! Welcome to Mivora Academy.");
      
      // Auto-open the WhatsApp community group link in a new window/tab
      const groupUrl = "https://chat.whatsapp.com/DSf6DMZkENGGx50Qiei720";
      window.open(groupUrl, "_blank", "noopener,noreferrer");

      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Registration failed. Please try again.";
      toast.error(msg);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleAddToCalendar = () => {
    const title = encodeURIComponent("Mivora Academy 14-Day Free Yoga Program");
    const details = encodeURIComponent(
      "Daily Morning Yoga (5:15 AM – 6:15 AM). Breathe. Move. Begin.\nOnline Link & WhatsApp updates: 9043380133"
    );
    const location = encodeURIComponent("Online (Zoom / Meet)");
    // 04 October 2026 05:15 IST (UTC: 20261003T234500Z) to 20261004T004500Z
    const googleCalendarUrl = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${title}&details=${details}&location=${location}&dates=20261004T051500/20261004T061500&recur=RRULE:FREQ=DAILY;COUNT=14`;
    window.open(googleCalendarUrl, "_blank");
  };

  const handleShareWhatsApp = () => {
    const text = encodeURIComponent(
      "🌿 Join me for the MIVORA ACADEMY 14-Day Free Online Yoga Program! (04–17 October 2026, 5:15 AM – 6:15 AM). Register here: " +
        window.location.href
    );
    window.open(`https://wa.me/?text=${text}`, "_blank");
  };

  return (
    <div className="relative min-h-screen bg-background text-foreground selection:bg-emerald/30">
      {/* WebGL Ambient Animated Zen Canvas Background */}
      <AmbientAuraCanvas intensity={0.9} />

      <div className="relative z-10 mx-auto max-w-3xl px-4 py-8 sm:px-6 sm:py-12 lg:px-8">
        {!submitted ? (
          <div>
            {/* Header Hero Branding */}
            <div className="text-center space-y-4 mb-8">
              <div className="inline-flex items-center gap-2 rounded-full border border-emerald/30 bg-emerald/10 px-4 py-1.5 text-xs font-semibold tracking-wide text-emerald backdrop-blur-md">
                <Sparkles className="h-3.5 w-3.5" />
                <span>100% ONLINE • 14 DAYS FREE PROGRAM</span>
              </div>

              <h1 className="font-display text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight text-foreground">
                🌿 MIVORA ACADEMY
              </h1>
              <p className="font-display text-lg sm:text-xl font-medium text-emerald">
                14-Day Free Yoga Program
              </p>
              <p className="text-sm sm:text-base font-semibold italic text-muted-foreground">
                “Breathe. Move. Begin.”
              </p>

              {/* Key Event Badges */}
              <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
                <div className="flex items-center gap-1.5 rounded-lg border border-border bg-card/80 px-3 py-1.5 text-xs font-medium text-foreground shadow-xs backdrop-blur-md">
                  <Calendar className="h-3.5 w-3.5 text-primary" />
                  <span>04 Oct – 17 Oct 2026</span>
                </div>
                <div className="flex items-center gap-1.5 rounded-lg border border-border bg-card/80 px-3 py-1.5 text-xs font-medium text-foreground shadow-xs backdrop-blur-md">
                  <Clock className="h-3.5 w-3.5 text-orange" />
                  <span>5:15 AM – 6:15 AM Daily</span>
                </div>
                <div className="flex items-center gap-1.5 rounded-lg border border-border bg-card/80 px-3 py-1.5 text-xs font-medium text-foreground shadow-xs backdrop-blur-md">
                  <Globe className="h-3.5 w-3.5 text-emerald" />
                  <span>Online via Live Class</span>
                </div>
                <div className="flex items-center gap-1.5 rounded-lg border border-emerald/30 bg-emerald/15 px-3 py-1.5 text-xs font-bold text-emerald shadow-xs backdrop-blur-md">
                  <Flame className="h-3.5 w-3.5 text-emerald" />
                  <span>FREE</span>
                </div>
              </div>
            </div>

            {/* Progress Stepper Bar */}
            <div className="mb-8 rounded-2xl border border-border/80 bg-card/90 p-4 shadow-sm backdrop-blur-xl">
              <div className="flex items-center justify-between text-xs font-semibold text-muted-foreground mb-2">
                <span className="flex items-center gap-1.5 text-foreground">
                  <span className="grid h-5 w-5 place-items-center rounded-full bg-primary text-[10px] text-primary-foreground font-bold">
                    {step}
                  </span>
                  Section {step} of {TOTAL_STEPS}
                </span>
                <span className="text-emerald font-medium">
                  {step === 1 && "Overview"}
                  {step === 2 && "Personal Details"}
                  {step === 3 && "Profession"}
                  {step === 4 && "Yoga Journey"}
                  {step === 5 && "Physical Readiness"}
                  {step === 6 && "Commitment"}
                  {step === 7 && "Source"}
                  {step === 8 && "Confirmation"}
                </span>
              </div>
              <div className="h-2 w-full overflow-hidden rounded-full bg-secondary/80">
                <div
                  className="h-full bg-gradient-to-r from-primary via-emerald to-emerald transition-all duration-500 ease-out"
                  style={{ width: `${(step / TOTAL_STEPS) * 100}%` }}
                />
              </div>
            </div>

            {/* Main Form Container Card */}
            <div className="rounded-3xl border border-border/80 bg-card/95 p-6 sm:p-8 shadow-xl backdrop-blur-2xl transition-all">
              {/* SECTION 1: WELCOME & PROGRAM INFORMATION */}
              {step === 1 && (
                <div className="space-y-6 animate-in fade-in duration-300">
                  <div className="border-b border-border pb-4">
                    <h2 className="font-display text-xl sm:text-2xl font-bold text-foreground flex items-center gap-2">
                      🌿 Welcome to the 14-Day Journey
                    </h2>
                    <p className="text-sm text-muted-foreground mt-1">
                      Start your morning with guided yoga, mindful movement, breathing and relaxation.
                    </p>
                  </div>

                  <div className="rounded-2xl bg-secondary/40 border border-border/60 p-5 space-y-4">
                    <p className="text-sm font-medium text-foreground leading-relaxed">
                      Join <strong>Mivora Academy</strong> for a completely <strong>FREE 14-day online yoga experience</strong> designed to help you build a positive morning routine through guided yoga, breathing, movement and deep relaxation.
                    </p>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                      <div className="flex items-center gap-2.5 text-sm text-foreground">
                        <CheckCircle2 className="h-4 w-4 text-emerald shrink-0" />
                        <span>Guided Yoga Practice</span>
                      </div>
                      <div className="flex items-center gap-2.5 text-sm text-foreground">
                        <CheckCircle2 className="h-4 w-4 text-emerald shrink-0" />
                        <span>Breath &amp; Relaxation</span>
                      </div>
                      <div className="flex items-center gap-2.5 text-sm text-foreground">
                        <CheckCircle2 className="h-4 w-4 text-emerald shrink-0" />
                        <span>Flexibility &amp; Strength</span>
                      </div>
                      <div className="flex items-center gap-2.5 text-sm text-foreground">
                        <CheckCircle2 className="h-4 w-4 text-emerald shrink-0" />
                        <span>Mindful Living</span>
                      </div>
                      <div className="flex items-center gap-2.5 text-sm text-foreground sm:col-span-2">
                        <CheckCircle2 className="h-4 w-4 text-emerald shrink-0" />
                        <span>Positive &amp; Energizing Morning Routine</span>
                      </div>
                    </div>
                  </div>

                  <div className="rounded-xl border border-border bg-card p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs text-muted-foreground">
                    <div className="flex items-center gap-2">
                      <Phone className="h-4 w-4 text-primary" />
                      <span>WhatsApp / Call: <strong className="text-foreground">9043380133</strong></span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Mail className="h-4 w-4 text-emerald" />
                      <span>Email: <strong className="text-foreground">mivoraacademy@gmail.com</strong></span>
                    </div>
                  </div>

                  <div className="pt-4 flex justify-end">
                    <Button
                      onClick={nextStep}
                      size="lg"
                      className="w-full sm:w-auto bg-primary text-primary-foreground font-semibold px-8 gap-2 hover:bg-primary/90 shadow-md"
                    >
                      <span>Begin Registration</span>
                      <ArrowRight className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              )}

              {/* SECTION 2: ABOUT YOU */}
              {step === 2 && (
                <div className="space-y-6 animate-in fade-in duration-300">
                  <div className="border-b border-border pb-4">
                    <div className="flex items-center gap-2 text-primary font-medium text-xs uppercase tracking-wider">
                      <User className="h-4 w-4" />
                      <span>Section 2</span>
                    </div>
                    <h2 className="font-display text-xl sm:text-2xl font-bold text-foreground mt-1">
                      👤 About You
                    </h2>
                    <p className="text-sm text-muted-foreground mt-0.5">
                      Tell us a little about yourself so we can understand our participants better.
                    </p>
                  </div>

                  <div className="space-y-4">
                    <div className="space-y-1.5">
                      <Label htmlFor="fullName" className="text-sm font-semibold">
                        Full Name <span className="text-destructive">*</span>
                      </Label>
                      <Input
                        id="fullName"
                        placeholder="e.g. Priya Sharma"
                        value={formData.fullName}
                        onChange={(e) => {
                          setFormData({ ...formData, fullName: e.target.value });
                          if (errors.fullName) setErrors({ ...errors, fullName: "" });
                        }}
                        className={errors.fullName ? "border-destructive focus-visible:ring-destructive" : ""}
                      />
                      {errors.fullName && <p className="text-xs text-destructive">{errors.fullName}</p>}
                    </div>

                    <div className="space-y-1.5">
                      <Label htmlFor="age" className="text-sm font-semibold">
                        Age <span className="text-destructive">*</span>
                      </Label>
                      <Input
                        id="age"
                        type="number"
                        min={5}
                        max={120}
                        placeholder="e.g. 28"
                        value={formData.age || ""}
                        onChange={(e) => {
                          setFormData({ ...formData, age: Number(e.target.value) });
                          if (errors.age) setErrors({ ...errors, age: "" });
                        }}
                        className={errors.age ? "border-destructive focus-visible:ring-destructive" : ""}
                      />
                      {errors.age && <p className="text-xs text-destructive">{errors.age}</p>}
                    </div>

                    <div className="space-y-1.5">
                      <Label htmlFor="whatsapp" className="text-sm font-semibold">
                        WhatsApp / Phone Number <span className="text-destructive">*</span>
                      </Label>
                      <Input
                        id="whatsapp"
                        type="tel"
                        placeholder="e.g. 9876543210"
                        value={formData.whatsappNumber}
                        onChange={(e) => {
                          setFormData({ ...formData, whatsappNumber: e.target.value });
                          if (errors.whatsappNumber) setErrors({ ...errors, whatsappNumber: "" });
                        }}
                        className={errors.whatsappNumber ? "border-destructive focus-visible:ring-destructive" : ""}
                      />
                      <p className="text-xs text-muted-foreground">
                        We will use this number for important session-related communication and class links.
                      </p>
                      {errors.whatsappNumber && (
                        <p className="text-xs text-destructive">{errors.whatsappNumber}</p>
                      )}
                    </div>

                    <div className="space-y-1.5">
                      <Label htmlFor="email" className="text-sm font-semibold">
                        Email Address <span className="text-destructive">*</span>
                      </Label>
                      <Input
                        id="email"
                        type="email"
                        placeholder="e.g. priya@example.com"
                        value={formData.email}
                        onChange={(e) => {
                          setFormData({ ...formData, email: e.target.value });
                          if (errors.email) setErrors({ ...errors, email: "" });
                        }}
                        className={errors.email ? "border-destructive focus-visible:ring-destructive" : ""}
                      />
                      <p className="text-xs text-muted-foreground">
                        Used for important program updates and schedule details.
                      </p>
                      {errors.email && <p className="text-xs text-destructive">{errors.email}</p>}
                    </div>
                  </div>

                  <div className="pt-4 flex items-center justify-between gap-3 border-t border-border">
                    <Button variant="outline" onClick={prevStep} className="gap-2">
                      <ArrowLeft className="h-4 w-4" /> Back
                    </Button>
                    <Button onClick={nextStep} className="bg-primary text-primary-foreground gap-2">
                      Next <ArrowRight className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              )}

              {/* SECTION 3: ABOUT YOUR WORK */}
              {step === 3 && (
                <div className="space-y-6 animate-in fade-in duration-300">
                  <div className="border-b border-border pb-4">
                    <div className="flex items-center gap-2 text-primary font-medium text-xs uppercase tracking-wider">
                      <Briefcase className="h-4 w-4" />
                      <span>Section 3</span>
                    </div>
                    <h2 className="font-display text-xl sm:text-2xl font-bold text-foreground mt-1">
                      💼 About Your Work
                    </h2>
                    <p className="text-sm text-muted-foreground mt-0.5">
                      This helps us understand the community joining the program.
                    </p>
                  </div>

                  <div className="space-y-4">
                    <Label className="text-sm font-semibold block">
                      What best describes your current profession? <span className="text-destructive">*</span>
                    </Label>

                    <RadioGroup
                      value={formData.profession}
                      onValueChange={(val) => {
                        setFormData({ ...formData, profession: val });
                        if (errors.profession) setErrors({ ...errors, profession: "" });
                      }}
                      className="grid grid-cols-1 sm:grid-cols-2 gap-3"
                    >
                      {PROFESSION_OPTIONS.map((opt) => (
                        <div
                          key={opt}
                          onClick={() => {
                            setFormData({ ...formData, profession: opt });
                            if (errors.profession) setErrors({ ...errors, profession: "" });
                          }}
                          className={`flex items-center space-x-3 rounded-xl border p-4 cursor-pointer transition-all ${
                            formData.profession === opt
                              ? "border-primary bg-primary/10 shadow-xs"
                              : "border-border hover:bg-secondary/40"
                          }`}
                        >
                          <RadioGroupItem value={opt} id={`prof-${opt}`} />
                          <Label htmlFor={`prof-${opt}`} className="cursor-pointer font-medium text-sm flex-1">
                            {opt}
                          </Label>
                        </div>
                      ))}
                    </RadioGroup>
                    {errors.profession && <p className="text-xs text-destructive">{errors.profession}</p>}

                    {formData.profession === "Other" && (
                      <div className="space-y-1.5 pt-2 animate-in fade-in duration-200">
                        <Label htmlFor="professionOther" className="text-xs font-semibold">
                          Please specify your profession <span className="text-destructive">*</span>
                        </Label>
                        <Input
                          id="professionOther"
                          placeholder="e.g. Freelance Designer, Teacher, etc."
                          value={formData.professionOther}
                          onChange={(e) => {
                            setFormData({ ...formData, professionOther: e.target.value });
                            if (errors.professionOther) setErrors({ ...errors, professionOther: "" });
                          }}
                          className={errors.professionOther ? "border-destructive" : ""}
                        />
                        {errors.professionOther && (
                          <p className="text-xs text-destructive">{errors.professionOther}</p>
                        )}
                      </div>
                    )}
                  </div>

                  <div className="pt-4 flex items-center justify-between gap-3 border-t border-border">
                    <Button variant="outline" onClick={prevStep} className="gap-2">
                      <ArrowLeft className="h-4 w-4" /> Back
                    </Button>
                    <Button onClick={nextStep} className="bg-primary text-primary-foreground gap-2">
                      Next <ArrowRight className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              )}

              {/* SECTION 4: YOUR YOGA JOURNEY */}
              {step === 4 && (
                <div className="space-y-6 animate-in fade-in duration-300">
                  <div className="border-b border-border pb-4">
                    <div className="flex items-center gap-2 text-primary font-medium text-xs uppercase tracking-wider">
                      <Activity className="h-4 w-4" />
                      <span>Section 4</span>
                    </div>
                    <h2 className="font-display text-xl sm:text-2xl font-bold text-foreground mt-1">
                      🧘 Your Yoga Journey
                    </h2>
                    <p className="text-sm text-muted-foreground mt-0.5">
                      There is no experience requirement. This program is open to beginners and experienced participants.
                    </p>
                  </div>

                  <div className="space-y-6">
                    {/* Experience question */}
                    <div className="space-y-3">
                      <Label className="text-sm font-semibold block">
                        Have you practiced yoga before? <span className="text-destructive">*</span>
                      </Label>
                      <RadioGroup
                        value={formData.yogaExperience}
                        onValueChange={(val) => {
                          setFormData({ ...formData, yogaExperience: val });
                          if (errors.yogaExperience) setErrors({ ...errors, yogaExperience: "" });
                        }}
                        className="space-y-2.5"
                      >
                        {EXPERIENCE_OPTIONS.map((exp) => (
                          <div
                            key={exp.value}
                            onClick={() => {
                              setFormData({ ...formData, yogaExperience: exp.value });
                              if (errors.yogaExperience) setErrors({ ...errors, yogaExperience: "" });
                            }}
                            className={`flex items-center space-x-3 rounded-xl border p-3.5 cursor-pointer transition-all ${
                              formData.yogaExperience === exp.value
                                ? "border-emerald bg-emerald/10 shadow-xs"
                                : "border-border hover:bg-secondary/40"
                            }`}
                          >
                            <RadioGroupItem value={exp.value} id={`exp-${exp.value}`} />
                            <Label htmlFor={`exp-${exp.value}`} className="cursor-pointer font-medium text-sm flex-1">
                              {exp.label}
                            </Label>
                          </div>
                        ))}
                      </RadioGroup>
                      {errors.yogaExperience && (
                        <p className="text-xs text-destructive">{errors.yogaExperience}</p>
                      )}
                    </div>

                    {/* Goals Checkboxes */}
                    <div className="space-y-3 pt-2">
                      <div className="flex items-center justify-between">
                        <Label className="text-sm font-semibold">
                          What would you like to improve through this 14-day program? <span className="text-destructive">*</span>
                        </Label>
                        <span className="text-xs text-muted-foreground">Select all that apply</span>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                        {GOAL_OPTIONS.map((goal) => {
                          const checked = formData.goals.includes(goal);
                          return (
                            <div
                              key={goal}
                              onClick={() => toggleGoal(goal)}
                              className={`flex items-center space-x-3 rounded-xl border p-3 cursor-pointer transition-all ${
                                checked
                                  ? "border-primary bg-primary/10 text-primary font-medium"
                                  : "border-border hover:bg-secondary/40 text-foreground"
                              }`}
                            >
                              <Checkbox
                                id={`goal-${goal}`}
                                checked={checked}
                                onCheckedChange={() => toggleGoal(goal)}
                              />
                              <Label htmlFor={`goal-${goal}`} className="cursor-pointer text-sm flex-1">
                                {goal}
                              </Label>
                            </div>
                          );
                        })}
                      </div>
                      {errors.goals && <p className="text-xs text-destructive">{errors.goals}</p>}

                      {formData.goals.includes("Other") && (
                        <div className="pt-1.5 space-y-1 animate-in fade-in duration-200">
                          <Label htmlFor="goalsOther" className="text-xs font-semibold">
                            Please specify other goal <span className="text-destructive">*</span>
                          </Label>
                          <Input
                            id="goalsOther"
                            placeholder="e.g. Back pain relief, Posture improvement"
                            value={formData.goalsOther}
                            onChange={(e) => {
                              setFormData({ ...formData, goalsOther: e.target.value });
                              if (errors.goalsOther) setErrors({ ...errors, goalsOther: "" });
                            }}
                            className={errors.goalsOther ? "border-destructive" : ""}
                          />
                          {errors.goalsOther && <p className="text-xs text-destructive">{errors.goalsOther}</p>}
                        </div>
                      )}
                    </div>

                    {/* Hoping to gain optional */}
                    <div className="space-y-1.5 pt-2">
                      <Label htmlFor="hopesToGain" className="text-sm font-semibold">
                        What are you hoping to gain from these 14 days? <span className="text-xs font-normal text-muted-foreground">(Optional)</span>
                      </Label>
                      <Textarea
                        id="hopesToGain"
                        placeholder="Tell us what you would personally like to achieve or experience during this program..."
                        rows={3}
                        value={formData.hopesToGain}
                        onChange={(e) => setFormData({ ...formData, hopesToGain: e.target.value })}
                      />
                    </div>
                  </div>

                  <div className="pt-4 flex items-center justify-between gap-3 border-t border-border">
                    <Button variant="outline" onClick={prevStep} className="gap-2">
                      <ArrowLeft className="h-4 w-4" /> Back
                    </Button>
                    <Button onClick={nextStep} className="bg-primary text-primary-foreground gap-2">
                      Next <ArrowRight className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              )}

              {/* SECTION 5: PHYSICAL READINESS / PRACTICE SAFELY */}
              {step === 5 && (
                <div className="space-y-6 animate-in fade-in duration-300">
                  <div className="border-b border-border pb-4">
                    <div className="flex items-center gap-2 text-emerald font-medium text-xs uppercase tracking-wider">
                      <Heart className="h-4 w-4" />
                      <span>Section 5</span>
                    </div>
                    <h2 className="font-display text-xl sm:text-2xl font-bold text-foreground mt-1">
                      🌱 Practice Safely
                    </h2>
                    <p className="text-sm text-muted-foreground mt-0.5">
                      Yoga should always be practiced within your comfort level. Please let us know about any physical restrictions so the instructor can provide appropriate guidance.
                    </p>
                  </div>

                  <div className="space-y-5">
                    <div className="space-y-3">
                      <Label className="text-sm font-semibold block">
                        Do you have any physical restrictions, injuries, or health limitations that may affect your yoga practice? <span className="text-destructive">*</span>
                      </Label>

                      <div className="grid grid-cols-2 gap-4">
                        <div
                          onClick={() => {
                            setFormData({
                              ...formData,
                              hasPhysicalRestrictions: "No",
                              physicalRestrictionsDetail: "",
                            });
                            if (errors.hasPhysicalRestrictions) {
                              setErrors({ ...errors, hasPhysicalRestrictions: "", physicalRestrictionsDetail: "" });
                            }
                          }}
                          className={`flex items-center justify-center gap-2 rounded-xl border p-4 cursor-pointer font-medium text-sm transition-all ${
                            formData.hasPhysicalRestrictions === "No"
                              ? "border-emerald bg-emerald/15 text-emerald font-bold shadow-xs"
                              : "border-border hover:bg-secondary/40 text-foreground"
                          }`}
                        >
                          <Check className="h-4 w-4" />
                          <span>No</span>
                        </div>

                        <div
                          onClick={() => {
                            setFormData({ ...formData, hasPhysicalRestrictions: "Yes" });
                            if (errors.hasPhysicalRestrictions) {
                              setErrors({ ...errors, hasPhysicalRestrictions: "" });
                            }
                          }}
                          className={`flex items-center justify-center gap-2 rounded-xl border p-4 cursor-pointer font-medium text-sm transition-all ${
                            formData.hasPhysicalRestrictions === "Yes"
                              ? "border-orange bg-orange/15 text-orange font-bold shadow-xs"
                              : "border-border hover:bg-secondary/40 text-foreground"
                          }`}
                        >
                          <ShieldAlert className="h-4 w-4" />
                          <span>Yes</span>
                        </div>
                      </div>
                      {errors.hasPhysicalRestrictions && (
                        <p className="text-xs text-destructive">{errors.hasPhysicalRestrictions}</p>
                      )}
                    </div>

                    {/* Follow-up question if YES */}
                    {formData.hasPhysicalRestrictions === "Yes" && (
                      <div className="space-y-2 rounded-2xl border border-orange/40 bg-orange/5 p-4 animate-in fade-in duration-300">
                        <Label htmlFor="restrictionsDetail" className="text-sm font-semibold text-foreground">
                          Please briefly describe your physical restrictions, injuries, or limitations: <span className="text-destructive">*</span>
                        </Label>
                        <p className="text-xs text-muted-foreground">
                          Please share only information relevant to your yoga practice (e.g. knee pain, lower back sensitivity, high BP, recent surgery).
                        </p>
                        <Textarea
                          id="restrictionsDetail"
                          rows={3}
                          placeholder="Describe here..."
                          value={formData.physicalRestrictionsDetail}
                          onChange={(e) => {
                            setFormData({ ...formData, physicalRestrictionsDetail: e.target.value });
                            if (errors.physicalRestrictionsDetail) {
                              setErrors({ ...errors, physicalRestrictionsDetail: "" });
                            }
                          }}
                          className={errors.physicalRestrictionsDetail ? "border-destructive" : ""}
                        />
                        {errors.physicalRestrictionsDetail && (
                          <p className="text-xs text-destructive">{errors.physicalRestrictionsDetail}</p>
                        )}
                      </div>
                    )}
                  </div>

                  <div className="pt-4 flex items-center justify-between gap-3 border-t border-border">
                    <Button variant="outline" onClick={prevStep} className="gap-2">
                      <ArrowLeft className="h-4 w-4" /> Back
                    </Button>
                    <Button onClick={nextStep} className="bg-primary text-primary-foreground gap-2">
                      Next <ArrowRight className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              )}

              {/* SECTION 6: 14-DAY COMMITMENT */}
              {step === 6 && (
                <div className="space-y-6 animate-in fade-in duration-300">
                  <div className="border-b border-border pb-4">
                    <div className="flex items-center gap-2 text-primary font-medium text-xs uppercase tracking-wider">
                      <Flame className="h-4 w-4" />
                      <span>Section 6</span>
                    </div>
                    <h2 className="font-display text-xl sm:text-2xl font-bold text-foreground mt-1">
                      🔥 Your 14-Day Commitment
                    </h2>
                    <p className="text-sm text-muted-foreground mt-0.5">
                      The program runs every morning from <strong>5:15 AM to 6:15 AM</strong> for 14 days. A little consistency can make a big difference.
                    </p>
                  </div>

                  <div className="space-y-6">
                    {/* Commitment choice */}
                    <div className="space-y-3">
                      <Label className="text-sm font-semibold block">
                        Can you commit to attending the morning sessions regularly? <span className="text-destructive">*</span>
                      </Label>
                      <RadioGroup
                        value={formData.morningCommitment}
                        onValueChange={(val) => {
                          setFormData({ ...formData, morningCommitment: val });
                          if (errors.morningCommitment) setErrors({ ...errors, morningCommitment: "" });
                        }}
                        className="space-y-2.5"
                      >
                        {COMMITMENT_OPTIONS.map((c) => (
                          <div
                            key={c.value}
                            onClick={() => {
                              setFormData({ ...formData, morningCommitment: c.value });
                              if (errors.morningCommitment) setErrors({ ...errors, morningCommitment: "" });
                            }}
                            className={`flex items-center space-x-3 rounded-xl border p-4 cursor-pointer transition-all ${
                              formData.morningCommitment === c.value
                                ? "border-emerald bg-emerald/10 font-semibold shadow-xs"
                                : "border-border hover:bg-secondary/40"
                            }`}
                          >
                            <RadioGroupItem value={c.value} id={`comm-${c.value}`} />
                            <Label htmlFor={`comm-${c.value}`} className="cursor-pointer text-sm flex-1">
                              {c.label}
                            </Label>
                          </div>
                        ))}
                      </RadioGroup>
                      {errors.morningCommitment && (
                        <p className="text-xs text-destructive">{errors.morningCommitment}</p>
                      )}
                    </div>

                    {/* Comfort following guidance */}
                    <div className="space-y-3 pt-2">
                      <Label className="text-sm font-semibold block">
                        Are you comfortable following the instructor's guidance and practicing within your own comfort level? <span className="text-destructive">*</span>
                      </Label>
                      <div className="grid grid-cols-2 gap-3">
                        {["Yes", "No"].map((ans) => (
                          <div
                            key={ans}
                            onClick={() =>
                              setFormData({
                                ...formData,
                                comfortableFollowingGuidance: ans as "Yes" | "No",
                              })
                            }
                            className={`flex items-center justify-center gap-2 rounded-xl border p-3.5 cursor-pointer font-medium text-sm transition-all ${
                              formData.comfortableFollowingGuidance === ans
                                ? "border-primary bg-primary/10 text-primary font-bold shadow-xs"
                                : "border-border hover:bg-secondary/40"
                            }`}
                          >
                            <span>{ans}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="pt-4 flex items-center justify-between gap-3 border-t border-border">
                    <Button variant="outline" onClick={prevStep} className="gap-2">
                      <ArrowLeft className="h-4 w-4" /> Back
                    </Button>
                    <Button onClick={nextStep} className="bg-primary text-primary-foreground gap-2">
                      Next <ArrowRight className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              )}

              {/* SECTION 7: HOW DID YOU FIND US? */}
              {step === 7 && (
                <div className="space-y-6 animate-in fade-in duration-300">
                  <div className="border-b border-border pb-4">
                    <div className="flex items-center gap-2 text-primary font-medium text-xs uppercase tracking-wider">
                      <Award className="h-4 w-4" />
                      <span>Section 7</span>
                    </div>
                    <h2 className="font-display text-xl sm:text-2xl font-bold text-foreground mt-1">
                      📣 Help Us Know How You Found Us
                    </h2>
                    <p className="text-sm text-muted-foreground mt-0.5">
                      Optional — help us understand what channel brought you here.
                    </p>
                  </div>

                  <div className="space-y-4">
                    <Label className="text-sm font-semibold block">
                      How did you hear about this program?
                    </Label>

                    <RadioGroup
                      value={formData.hearAbout}
                      onValueChange={(val) => setFormData({ ...formData, hearAbout: val })}
                      className="grid grid-cols-1 sm:grid-cols-2 gap-2.5"
                    >
                      {HEAR_ABOUT_OPTIONS.map((opt) => (
                        <div
                          key={opt}
                          onClick={() => setFormData({ ...formData, hearAbout: opt })}
                          className={`flex items-center space-x-3 rounded-xl border p-3.5 cursor-pointer transition-all ${
                            formData.hearAbout === opt
                              ? "border-primary bg-primary/10 shadow-xs"
                              : "border-border hover:bg-secondary/40"
                          }`}
                        >
                          <RadioGroupItem value={opt} id={`hear-${opt}`} />
                          <Label htmlFor={`hear-${opt}`} className="cursor-pointer text-sm flex-1">
                            {opt}
                          </Label>
                        </div>
                      ))}
                    </RadioGroup>

                    {formData.hearAbout === "Other" && (
                      <div className="space-y-1 pt-2 animate-in fade-in duration-200">
                        <Label htmlFor="hearOther" className="text-xs font-semibold">
                          Please tell us how you found us
                        </Label>
                        <Input
                          id="hearOther"
                          placeholder="e.g. Community poster, colleague, etc."
                          value={formData.hearAboutOther}
                          onChange={(e) => setFormData({ ...formData, hearAboutOther: e.target.value })}
                        />
                      </div>
                    )}
                  </div>

                  <div className="pt-4 flex items-center justify-between gap-3 border-t border-border">
                    <Button variant="outline" onClick={prevStep} className="gap-2">
                      <ArrowLeft className="h-4 w-4" /> Back
                    </Button>
                    <Button onClick={nextStep} className="bg-primary text-primary-foreground gap-2">
                      Review &amp; Submit <ArrowRight className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              )}

              {/* SECTION 8: FINAL CONFIRMATION & OPTIONAL UPDATES */}
              {step === 8 && (
                <div className="space-y-6 animate-in fade-in duration-300">
                  <div className="border-b border-border pb-4">
                    <div className="flex items-center gap-2 text-emerald font-medium text-xs uppercase tracking-wider">
                      <Sparkles className="h-4 w-4" />
                      <span>Section 8</span>
                    </div>
                    <h2 className="font-display text-xl sm:text-2xl font-bold text-foreground mt-1">
                      ✨ You're Almost There!
                    </h2>
                    <p className="text-sm text-muted-foreground mt-0.5">
                      Thank you for choosing Mivora Academy.
                    </p>
                  </div>

                  {/* Program Summary Card */}
                  <div className="rounded-2xl border border-emerald/30 bg-emerald/10 p-5 space-y-3">
                    <div className="flex items-center justify-between">
                      <h3 className="font-display text-base font-bold text-foreground">
                        14-DAY FREE YOGA PROGRAM
                      </h3>
                      <Badge className="bg-emerald text-emerald-foreground">FREE</Badge>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-foreground/90">
                      <div>📅 <strong>Dates:</strong> 04 October – 17 October 2026</div>
                      <div>⏰ <strong>Time:</strong> 5:15 AM – 6:15 AM (IST)</div>
                      <div>🌐 <strong>Format:</strong> 100% Online</div>
                      <div>👤 <strong>Registered for:</strong> {formData.fullName || "Participant"}</div>
                    </div>
                    <p className="text-xs text-muted-foreground pt-1">
                      Before submitting, please make sure your contact details (WhatsApp: {formData.whatsappNumber || "N/A"}) are correct.
                    </p>
                  </div>

                  {/* Terms & Agreement */}
                  <div className="space-y-4">
                    <div
                      onClick={() => {
                        setFormData({ ...formData, agreeTerms: !formData.agreeTerms });
                        if (errors.agreeTerms) setErrors({ ...errors, agreeTerms: "" });
                      }}
                      className={`flex items-start space-x-3 rounded-2xl border p-4 cursor-pointer transition-all ${
                        formData.agreeTerms
                          ? "border-emerald bg-emerald/10"
                          : "border-border hover:bg-secondary/40"
                      }`}
                    >
                      <Checkbox
                        id="agreeTerms"
                        checked={formData.agreeTerms}
                        onCheckedChange={(checked) => {
                          setFormData({ ...formData, agreeTerms: !!checked });
                          if (errors.agreeTerms) setErrors({ ...errors, agreeTerms: "" });
                        }}
                        className="mt-1"
                      />
                      <Label htmlFor="agreeTerms" className="cursor-pointer text-xs sm:text-sm font-medium leading-relaxed text-foreground">
                        I confirm that the information provided is correct and I understand that the yoga sessions should be practiced according to my own comfort and physical ability. <span className="text-destructive">*</span>
                      </Label>
                    </div>
                    {errors.agreeTerms && <p className="text-xs text-destructive">{errors.agreeTerms}</p>}

                    {/* Section 9: Future Updates */}
                    <div className="rounded-2xl border border-border bg-secondary/30 p-4 space-y-2.5">
                      <Label className="text-xs sm:text-sm font-semibold text-foreground block">
                        🌿 Would you like to receive future yoga and wellness updates from Mivora Academy?
                      </Label>
                      <div className="flex gap-4">
                        {["Yes", "No"].map((opt) => (
                          <div
                            key={opt}
                            onClick={() => setFormData({ ...formData, futureUpdates: opt })}
                            className={`flex items-center gap-2 rounded-lg border px-3 py-1.5 cursor-pointer text-xs font-medium transition-all ${
                              formData.futureUpdates === opt
                                ? "border-primary bg-primary/10 text-primary font-bold"
                                : "border-border hover:bg-card"
                            }`}
                          >
                            <span>{opt}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="pt-4 flex items-center justify-between gap-3 border-t border-border">
                    <Button variant="outline" onClick={prevStep} disabled={isSubmitting} className="gap-2">
                      <ArrowLeft className="h-4 w-4" /> Back
                    </Button>
                    <Button
                      onClick={handleSubmit}
                      disabled={isSubmitting}
                      className="bg-emerald text-emerald-foreground hover:bg-emerald/90 font-bold px-8 shadow-md gap-2"
                    >
                      {isSubmitting ? (
                        <>Submitting...</>
                      ) : (
                        <>
                          <Send className="h-4 w-4" />
                          <span>Submit Registration</span>
                        </>
                      )}
                    </Button>
                  </div>
                </div>
              )}
            </div>
          </div>
        ) : (
          /* SUCCESS CONFIRMATION STATE */
          <div className="rounded-3xl border border-emerald/40 bg-card/95 p-8 sm:p-12 shadow-2xl backdrop-blur-2xl text-center space-y-6 animate-in zoom-in-95 duration-400">
            <div className="mx-auto grid h-20 w-20 place-items-center rounded-full bg-emerald/15 text-emerald ring-8 ring-emerald/10 shadow-lg">
              <CheckCircle2 className="h-10 w-10" />
            </div>

            <div className="space-y-2">
              <h2 className="font-display text-2xl sm:text-3xl font-extrabold text-foreground">
                🎉 Registration Received!
              </h2>
              <p className="text-base text-muted-foreground max-w-lg mx-auto">
                Thank you, <strong>{formData.fullName}</strong>! You are officially registered for the{" "}
                <strong>Mivora Academy 14-Day Free Yoga Program</strong>.
              </p>
            </div>

            {/* Schedule Highlight Box */}
            <div className="max-w-md mx-auto rounded-2xl border border-border bg-secondary/50 p-5 text-sm space-y-3 text-left">
              <div className="flex items-center gap-2 text-foreground font-semibold">
                <Calendar className="h-4 w-4 text-emerald" />
                <span>04 October – 17 October 2026</span>
              </div>
              <div className="flex items-center gap-2 text-foreground font-semibold">
                <Clock className="h-4 w-4 text-orange" />
                <span>5:15 AM – 6:15 AM Daily (IST)</span>
              </div>
              <div className="flex items-center gap-2 text-foreground font-semibold">
                <Globe className="h-4 w-4 text-primary" />
                <span>100% Online • FREE FOR 14 DAYS</span>
              </div>
              <div className="pt-2 border-t border-border/80 text-xs text-muted-foreground leading-relaxed">
                📲 Please keep your WhatsApp (<strong>{formData.whatsappNumber}</strong>) available for important session information, joining links, and daily updates.
              </div>
            </div>

            {/* WhatsApp Group Direct CTA Button */}
            <div className="rounded-2xl border-2 border-emerald bg-emerald/10 p-5 max-w-md mx-auto space-y-3 shadow-md">
              <div className="flex items-center justify-center gap-2 text-emerald font-bold text-sm">
                <Sparkles className="h-4 w-4" />
                <span>STEP 2: JOIN THE OFFICIAL WHATSAPP GROUP</span>
              </div>
              <p className="text-xs text-muted-foreground leading-relaxed">
                All daily live Google Meet / Zoom links, morning reminders, and instructor notes will be shared inside this group.
              </p>
              <Button
                size="lg"
                onClick={() => window.open("https://chat.whatsapp.com/DSf6DMZkENGGx50Qiei720", "_blank", "noopener,noreferrer")}
                className="w-full bg-emerald text-emerald-foreground hover:bg-emerald/90 font-bold py-6 text-sm sm:text-base gap-2 rounded-xl shadow-lg"
              >
                <Phone className="h-5 w-5" />
                <span>👉 Click Here to Join WhatsApp Group</span>
              </Button>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
              <Button
                onClick={handleAddToCalendar}
                variant="outline"
                className="gap-2 border-primary/40 hover:bg-primary/10 text-xs sm:text-sm"
              >
                <CalendarPlus className="h-4 w-4 text-primary" />
                <span>Add to Google Calendar</span>
              </Button>
              <Button
                onClick={handleShareWhatsApp}
                variant="outline"
                className="gap-2 text-xs sm:text-sm border-emerald/40 hover:bg-emerald/10 text-emerald"
              >
                <Share2 className="h-4 w-4" />
                <span>Share with Friends</span>
              </Button>
            </div>

            {/* Contact Details & Tagline */}
            <div className="border-t border-border pt-6 max-w-md mx-auto space-y-3 text-xs text-muted-foreground">
              <p className="font-medium text-foreground">For any questions or assistance:</p>
              <div className="flex justify-center gap-6">
                <a
                  href="https://wa.me/919043380133"
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-1.5 text-emerald hover:underline font-semibold"
                >
                  <Phone className="h-3.5 w-3.5" /> 9043380133
                </a>
                <a
                  href="mailto:mivoraacademy@gmail.com"
                  className="flex items-center gap-1.5 text-primary hover:underline font-semibold"
                >
                  <Mail className="h-3.5 w-3.5" /> mivoraacademy@gmail.com
                </a>
              </div>
              <div className="pt-4 text-sm font-bold text-foreground tracking-widest uppercase">
                Breathe. Move. Begin. 🌿
              </div>
              <p className="text-[11px] text-muted-foreground font-medium">
                LEARN • PRACTICE • TRANSFORM
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
