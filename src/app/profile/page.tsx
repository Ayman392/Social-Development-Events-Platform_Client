"use client";

import { useState } from "react";
import toast from "react-hot-toast";
import { CalendarDays, Mail, UserRound } from "lucide-react";
import { Button } from "@heroui/react";

import PrivateRoute from "@/components/Home/PrivateRoute/page";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { authClient, useSession } from "@/lib/auth-client";
import { validateUrl } from "@/lib/validators";

type ProfileUser = {
  name: string;
  email: string;
  image?: string | null;
  createdAt: Date | string;
};

type FormErrors = Partial<Record<"name" | "image", string>>;

const inputClass = "h-12 rounded-2xl border-0 bg-slate-200/60 px-5 dark:bg-zinc-800/80";

function ProfileForm({ user }: { user: ProfileUser }) {
  // The form starts filled with the current profile
  const [name, setName] = useState(user.name);
  const [image, setImage] = useState(user.image ?? "");
  const [errors, setErrors] = useState<FormErrors>({});
  const [loading, setLoading] = useState(false);

  const memberSince = new Date(user.createdAt).toLocaleDateString("en-US", {
    month: "long",
    year: "numeric",
  });

  // Nothing to save until something has changed
  const unchanged = name.trim() === user.name && image.trim() === (user.image ?? "");

  // Show the typed photo as a live preview, but only when it is a valid link
  const previewSrc = validateUrl(image.trim()) ? image.trim() : undefined;

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    const newErrors: FormErrors = {};
    if (name.trim().length < 2 || name.trim().length > 50) {
      newErrors.name = "Name must be between 2 and 50 characters.";
    }
    if (!validateUrl(image.trim())) {
      newErrors.image = "Please enter a valid photo URL.";
    }

    setErrors(newErrors);
    if (Object.keys(newErrors).length > 0) {
      toast.error("Please fix the highlighted fields.");
      return;
    }

    setLoading(true);
    const { error } = await authClient.updateUser({
      name: name.trim(),
      image: image.trim(),
    });
    setLoading(false);

    if (error) {
      toast.error(error.message || "Could not update your profile. Please try again.");
      return;
    }

    toast.success("Your profile has been updated.");
  }

  return (
    <div className="mx-auto w-full max-w-3xl px-4 py-10 sm:px-6 lg:px-8">
      {/* Heading */}
      <div className="mb-10 text-center">
        <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-600 shadow-lg shadow-blue-500/30">
          <UserRound className="h-7 w-7 text-white" />
        </div>
        <h1 className="mb-2 text-3xl font-bold tracking-tight">My Profile</h1>
        <p className="text-slate-500 dark:text-slate-400">
          See your details and update your name or photo.
        </p>
      </div>

      <Card className="glass-panel gap-0 rounded-[2rem] py-0">
        <CardContent className="p-8">
          {/* Profile summary */}
          <div className="mb-8 flex flex-col items-center gap-5 border-b border-slate-200/60 pb-8 text-center dark:border-zinc-700/60 sm:flex-row sm:text-left">
            <Avatar className="h-24 w-24 border-4 border-white shadow-lg dark:border-zinc-800">
              <AvatarImage src={previewSrc} alt={name} />
              <AvatarFallback className="bg-blue-600 text-3xl font-semibold text-white">
                {(name.trim().charAt(0) || "?").toUpperCase()}
              </AvatarFallback>
            </Avatar>

            <div className="space-y-2">
              <h2 className="text-2xl font-semibold">{user.name}</h2>
              <div className="flex items-center justify-center text-sm text-slate-600 dark:text-slate-300 sm:justify-start">
                <Mail className="mr-2 h-4 w-4 text-blue-500" />
                {user.email}
              </div>
              <div className="flex items-center justify-center text-sm text-slate-600 dark:text-slate-300 sm:justify-start">
                <CalendarDays className="mr-2 h-4 w-4 text-blue-500" />
                Member since {memberSince}
              </div>
            </div>
          </div>

          {/* Update form */}
          <form onSubmit={handleSubmit} className="space-y-5" noValidate>
            <div className="space-y-2">
              <Label htmlFor="profile-name">Full name</Label>
              <Input
                id="profile-name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                aria-invalid={Boolean(errors.name)}
                className={inputClass}
              />
              {errors.name && <p className="px-2 text-sm text-red-500">{errors.name}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="profile-image">Profile photo URL</Label>
              <Input
                id="profile-image"
                value={image}
                onChange={(e) => setImage(e.target.value)}
                placeholder="https://example.com/my-photo.jpg"
                aria-invalid={Boolean(errors.image)}
                className={inputClass}
              />
              {errors.image && <p className="px-2 text-sm text-red-500">{errors.image}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="profile-email">Email</Label>
              <Input
                id="profile-email"
                value={user.email}
                disabled
                className={`${inputClass} opacity-70`}
              />
              <p className="px-2 text-xs text-slate-500 dark:text-slate-400">
                Your email is used to sign in and cannot be changed here.
              </p>
            </div>

            <div className="flex justify-end pt-2">
              <Button
                type="submit"
                isDisabled={loading || unchanged}
                className="h-12 rounded-full bg-slate-900 px-8 text-base font-semibold text-white dark:bg-white dark:text-slate-900"
              >
                {loading ? "Saving..." : "Save changes"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}

function ProfileContent() {
  const { data: session } = useSession();

  // PrivateRoute handles logged-out visitors, so there is nothing to show without a session
  if (!session) return null;

  return <ProfileForm user={session.user} />;
}

export default function ProfilePage() {
  return (
    <PrivateRoute>
      <ProfileContent />
    </PrivateRoute>
  );
}