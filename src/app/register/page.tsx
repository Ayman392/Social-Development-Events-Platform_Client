"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { CheckCircle2, Circle, Eye, EyeOff, ImageIcon, Lock, Mail, User } from "lucide-react";
import { Button } from "@heroui/react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { signUp } from "@/lib/auth-client";
import { validateEmail, validatePassword, validateUrl } from "@/lib/validators";

type FormErrors = {
  name?: string;
  email?: string;
  photoURL?: string;
  password?: string;
};

// The input style shared by every field on this page
const inputClass = "h-12 rounded-2xl border-0 bg-slate-200/60 pl-11 dark:bg-zinc-800/80";
const iconClass = "pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400";

export default function RegisterPage() {
  const router = useRouter();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [photoURL, setPhotoURL] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState<FormErrors>({});
  const [loading, setLoading] = useState(false);

  // The three password rules, checked live while the user types
  const passwordRules = [
    { label: "One uppercase letter", passed: /[A-Z]/.test(password) },
    { label: "One lowercase letter", passed: /[a-z]/.test(password) },
    { label: "At least 6 characters", passed: password.length >= 6 },
  ];

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    // Check every field and collect the messages
    const newErrors: FormErrors = {};
    if (name.trim().length < 2) newErrors.name = "Please enter your full name.";
    if (!validateEmail(email.trim())) newErrors.email = "Please enter a valid email address.";
    if (!validateUrl(photoURL.trim())) newErrors.photoURL = "Please enter a valid photo URL.";

    const passwordErrors = validatePassword(password);
    if (passwordErrors.length > 0) newErrors.password = "Your password does not meet the rules below.";

    setErrors(newErrors);

    if (Object.keys(newErrors).length > 0) {
      // One toast for each password rule that failed
      passwordErrors.forEach((message) => toast.error(message));
      return;
    }

    setLoading(true);
    const { error } = await signUp.email({
      name: name.trim(),
      email: email.trim(),
      password,
      image: photoURL.trim(),
    });
    setLoading(false);

    if (error) {
      toast.error(error.message || "Registration failed. Please try again.");
      return;
    }

    toast.success("Welcome aboard! Your account is ready.");
    router.push("/");
    router.refresh();
  }

  return (
    <div className="mx-auto flex min-h-[80vh] max-w-lg items-center px-4 py-10">
      <div className="glass-panel w-full rounded-[2rem] p-8 shadow-xl">
        {/* Heading */}
        <div className="mb-8 text-center">
          <h1 className="mb-2 text-3xl font-bold tracking-tight">Create your account</h1>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Join HopeNetwork and start making a difference.
          </p>
        </div>

        {/* Live preview of the profile photo */}
        <div className="mb-8 flex flex-col items-center">
          <Avatar className="h-20 w-20 border-4 border-white shadow-lg dark:border-zinc-800">
            <AvatarImage src={validateUrl(photoURL.trim()) ? photoURL.trim() : undefined} alt="Profile preview" />
            <AvatarFallback className="bg-blue-600 text-2xl font-semibold text-white">
              {name.trim() ? name.trim().charAt(0).toUpperCase() : <User className="h-8 w-8" />}
            </AvatarFallback>
          </Avatar>
          <p className="mt-2 text-xs text-slate-500 dark:text-slate-400">Profile photo preview</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5" noValidate>
          {/* Full name */}
          <div className="space-y-2">
            <Label htmlFor="name">Full name</Label>
            <div className="relative">
              <User className={iconClass} />
              <Input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Your full name"
                aria-invalid={Boolean(errors.name)}
                className={inputClass}
              />
            </div>
            {errors.name && <p className="px-2 text-sm text-red-500">{errors.name}</p>}
          </div>

          {/* Email */}
          <div className="space-y-2">
            <Label htmlFor="email">Email address</Label>
            <div className="relative">
              <Mail className={iconClass} />
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                aria-invalid={Boolean(errors.email)}
                className={inputClass}
              />
            </div>
            {errors.email && <p className="px-2 text-sm text-red-500">{errors.email}</p>}
          </div>

          {/* Photo URL */}
          <div className="space-y-2">
            <Label htmlFor="photoURL">Profile photo URL</Label>
            <div className="relative">
              <ImageIcon className={iconClass} />
              <Input
                id="photoURL"
                value={photoURL}
                onChange={(e) => setPhotoURL(e.target.value)}
                placeholder="https://example.com/your-photo.jpg"
                aria-invalid={Boolean(errors.photoURL)}
                className={inputClass}
              />
            </div>
            {errors.photoURL && <p className="px-2 text-sm text-red-500">{errors.photoURL}</p>}
          </div>

          {/* Password */}
          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <div className="relative">
              <Lock className={iconClass} />
              <Input
                id="password"
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Create a password"
                aria-invalid={Boolean(errors.password)}
                className={`${inputClass} pr-12`}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                aria-label={showPassword ? "Hide password" : "Show password"}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 transition-colors hover:text-slate-700 dark:hover:text-white"
              >
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
            {errors.password && <p className="px-2 text-sm text-red-500">{errors.password}</p>}

            {/* Rules turn green as the user types */}
            <ul className="grid gap-1.5 px-2 pt-1 sm:grid-cols-3">
              {passwordRules.map((rule) => (
                <li
                  key={rule.label}
                  className={`flex items-center text-xs transition-colors ${
                    rule.passed ? "text-emerald-600 dark:text-emerald-400" : "text-slate-500 dark:text-slate-400"
                  }`}
                >
                  {rule.passed ? (
                    <CheckCircle2 className="mr-1.5 h-3.5 w-3.5 shrink-0" />
                  ) : (
                    <Circle className="mr-1.5 h-3.5 w-3.5 shrink-0" />
                  )}
                  {rule.label}
                </li>
              ))}
            </ul>
          </div>

          <Button
            type="submit"
            isDisabled={loading}
            className="h-12 w-full rounded-full bg-slate-900 text-base font-semibold text-white dark:bg-white dark:text-slate-900"
          >
            {loading ? "Creating account..." : "Create account"}
          </Button>
        </form>

        <p className="mt-6 text-center text-sm text-slate-500 dark:text-slate-400">
          Already have an account?{" "}
          <Link href="/login" className="font-semibold text-blue-600 hover:underline dark:text-blue-400">
            Login
          </Link>
        </p>
      </div>
    </div>
  );
}