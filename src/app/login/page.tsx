"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { Eye, EyeOff, Lock, Mail } from "lucide-react";
import { FaGithub } from "react-icons/fa";
import { FcGoogle } from "react-icons/fc";
import { Button } from "@heroui/react";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { signIn } from "@/lib/auth-client";
import { validateEmail } from "@/lib/validators";

type FormErrors = {
  email?: string;
  password?: string;
};

// The input style shared by every field, same as the Register page
const inputClass = "h-12 rounded-2xl border-0 bg-slate-200/60 pl-11 dark:bg-zinc-800/80";
const iconClass = "pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400";

export default function LoginPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState<FormErrors>({});
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    // Check both fields before talking to the server
    const newErrors: FormErrors = {};
    if (!validateEmail(email.trim())) newErrors.email = "Please enter a valid email address.";
    if (!password) newErrors.password = "Please enter your password.";

    setErrors(newErrors);
    if (Object.keys(newErrors).length > 0) return;

    setLoading(true);
    const { error } = await signIn.email({ email: email.trim(), password });
    setLoading(false);

    if (error) {
      toast.error(error.message || "Login failed. Please check your email and password.");
      return;
    }

    toast.success("Welcome back!");
    router.push("/");
    router.refresh();
  }

  async function handleSocial(provider: "google" | "github") {
    const { error } = await signIn.social({ provider, callbackURL: "/" });
    if (error) {
      toast.error(error.message || "Could not sign in. Please try again.");
    }
  }

  return (
    <div className="mx-auto flex min-h-[80vh] max-w-lg items-center px-4 py-10">
      <div className="glass-panel w-full rounded-[2rem] p-8 shadow-xl">
        {/* Heading */}
        <div className="mb-8 text-center">
          <h1 className="mb-2 text-3xl font-bold tracking-tight">Welcome back</h1>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Log in to join events and track your impact.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5" noValidate>
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
                placeholder="Your password"
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
          </div>

          <Button
            type="submit"
            isDisabled={loading}
            className="h-12 w-full rounded-full bg-slate-900 text-base font-semibold text-white dark:bg-white dark:text-slate-900"
          >
            {loading ? "Signing in..." : "Login"}
          </Button>
        </form>

        {/* Divider */}
        <div className="my-6 flex items-center gap-4">
          <div className="h-px flex-1 bg-slate-200 dark:bg-zinc-700" />
          <span className="text-xs uppercase tracking-wider text-slate-500 dark:text-slate-400">
            or
          </span>
          <div className="h-px flex-1 bg-slate-200 dark:bg-zinc-700" />
        </div>

        {/* Social login */}
        <div className="space-y-3">
          <Button
            type="button"
            onPress={() => handleSocial("google")}
            className="h-12 w-full rounded-full border border-slate-300 bg-transparent text-base font-semibold text-slate-900 dark:border-zinc-600 dark:text-white"
          >
            <FcGoogle className="h-5 w-5" />
            Continue with Google
          </Button>

          <Button
            type="button"
            onPress={() => handleSocial("github")}
            className="h-12 w-full rounded-full border border-slate-300 bg-transparent text-base font-semibold text-slate-900 dark:border-zinc-600 dark:text-white"
          >
            <FaGithub className="h-5 w-5" />
            Continue with GitHub
          </Button>
        </div>

        <p className="mt-6 text-center text-sm text-slate-500 dark:text-slate-400">
          New here?{" "}
          <Link
            href="/register"
            className="font-semibold text-blue-600 hover:underline dark:text-blue-400"
          >
            Create an account
          </Link>
        </p>
      </div>
    </div>
  );
}