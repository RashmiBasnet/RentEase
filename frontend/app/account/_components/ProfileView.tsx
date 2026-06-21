"use client";

import Image from "next/image";
import { useRef, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import {
  BadgeCheck,
  Camera,
  Mail,
  MapPin,
  Phone,
  ShieldCheck,
  User as UserIcon,
} from "lucide-react";
import { Button } from "../../_components/Button";
import { TextField } from "../../_components/TextField";
import { PasswordField } from "../../_components/PasswordField";
import { cn } from "../../_components/cn";
import {
  handleUpdateLocation,
  handleUpdateProfile,
  handleUpdateProfilePicture,
} from "@/lib/actions/user-action";

type Profile = {
  fullName?: string;
  email?: string;
  phoneNumber?: string;
  role?: string;
  isVerified?: boolean;
  profilePicture?: string;
  avatarUrl?: string;
  createdAt?: string;
};

const memberSince = (d?: string) =>
  d
    ? new Date(d).toLocaleDateString("en-US", { month: "long", year: "numeric" })
    : "—";

export function ProfileView({ profile }: { profile: Profile }) {
  const router = useRouter();
  const fileRef = useRef<HTMLInputElement>(null);
  const [uploading, startUpload] = useTransition();
  const [locating, startLocating] = useTransition();
  const [saving, setSaving] = useState(false);

  const [fullName, setFullName] = useState(profile.fullName ?? "");
  const [email, setEmail] = useState(profile.email ?? "");
  const [phoneNumber, setPhoneNumber] = useState(profile.phoneNumber ?? "");
  const [password, setPassword] = useState("");

  const initial = (profile.fullName ?? "U").charAt(0).toUpperCase();

  const onPickPhoto = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    startUpload(async () => {
      const res = await handleUpdateProfilePicture(file);
      if (res.success) {
        toast.success("Profile photo updated");
        router.refresh();
      } else {
        toast.error(res.message ?? "Could not update photo");
      }
    });
    e.target.value = "";
  };

  const onSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName.trim()) {
      toast.error("Full name is required");
      return;
    }
    setSaving(true);
    const payload: Record<string, string> = {
      fullName: fullName.trim(),
      email: email.trim(),
      phoneNumber: phoneNumber.trim(),
    };
    if (password.trim()) payload.password = password.trim();

    const res = await handleUpdateProfile(payload);
    setSaving(false);

    if (res.success) {
      toast.success("Profile saved");
      setPassword("");
      router.refresh();
    } else {
      toast.error(res.message ?? "Could not save profile");
    }
  };

  const onUseLocation = () => {
    if (!navigator.geolocation) {
      toast.error("Geolocation is not supported on this device");
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        startLocating(async () => {
          const res = await handleUpdateLocation({
            lat: pos.coords.latitude,
            lng: pos.coords.longitude,
          });
          if (res.success) {
            toast.success("Location updated");
          } else {
            toast.error(res.message ?? "Could not update location");
          }
        });
      },
      () => toast.error("Permission denied for location")
    );
  };

  return (
    <div>
      <header>
        <h1 className="text-3xl font-extrabold tracking-tight text-[var(--color-text)] sm:text-4xl">
          My Profile
        </h1>
        <p className="mt-1 text-[var(--color-text-secondary)]">
          Manage your account details and preferences.
        </p>
      </header>

      <div className="mt-8 grid gap-6 lg:grid-cols-[20rem_1fr]">
        {/* Identity card */}
        <aside className="h-fit rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] p-6 text-center shadow-[var(--shadow-sm)]">
          <div className="relative mx-auto h-28 w-28">
            <div className="h-28 w-28 overflow-hidden rounded-full bg-[var(--color-primary)] text-[var(--color-on-primary)]">
              {profile.avatarUrl ? (
                <Image
                  src={profile.avatarUrl}
                  alt={profile.fullName ?? "User"}
                  width={112}
                  height={112}
                  className="h-full w-full object-cover"
                />
              ) : (
                <span className="flex h-full w-full items-center justify-center text-4xl font-bold">
                  {initial}
                </span>
              )}
            </div>
            <button
              type="button"
              onClick={() => fileRef.current?.click()}
              disabled={uploading}
              aria-label="Change photo"
              className="absolute bottom-1 right-1 flex h-9 w-9 items-center justify-center rounded-full border-2 border-[var(--color-surface)] bg-[var(--color-primary)] text-[var(--color-on-primary)] shadow-[var(--shadow-sm)] transition-colors hover:bg-[var(--color-primary-hover)] disabled:opacity-60"
            >
              <Camera size={16} />
            </button>
            <input
              ref={fileRef}
              type="file"
              accept="image/*"
              hidden
              onChange={onPickPhoto}
            />
          </div>

          <h2 className="mt-4 text-lg font-bold text-[var(--color-text)]">
            {profile.fullName}
          </h2>
          <p className="text-sm text-[var(--color-text-muted)]">{profile.email}</p>

          <div className="mt-3 flex flex-wrap items-center justify-center gap-2">
            <span
              className={cn(
                "inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold capitalize",
                profile.role === "admin"
                  ? "bg-[var(--color-primary-50)] text-[var(--color-primary)]"
                  : "bg-[var(--color-surface-inset)] text-[var(--color-text-secondary)]"
              )}
            >
              <UserIcon size={13} /> {profile.role ?? "user"}
            </span>
            {profile.isVerified && (
              <span className="inline-flex items-center gap-1.5 rounded-full bg-[var(--color-success-soft-bg)] px-2.5 py-1 text-xs font-semibold text-[var(--color-success-soft-text)]">
                <BadgeCheck size={13} /> Verified
              </span>
            )}
          </div>

          <p className="mt-4 border-t border-[var(--color-border)] pt-4 text-xs text-[var(--color-text-muted)]">
            Member since {memberSince(profile.createdAt)}
          </p>

          <Button
            type="button"
            variant="outline"
            size="sm"
            fullWidth
            className="mt-4"
            leftIcon={<MapPin size={15} />}
            onClick={onUseLocation}
            disabled={locating}
          >
            {locating ? "Updating..." : "Use current location"}
          </Button>
        </aside>

        {/* Edit form */}
        <form
          onSubmit={onSave}
          className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] p-6 shadow-[var(--shadow-sm)]"
        >
          <h2 className="text-lg font-bold text-[var(--color-text)]">
            Account Details
          </h2>
          <p className="mt-1 text-sm text-[var(--color-text-muted)]">
            Update your personal information.
          </p>

          <div className="mt-6 grid gap-4 sm:grid-cols-2">
            <TextField
              label="Full Name"
              icon={<UserIcon size={18} />}
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
            />
            <TextField
              label="Phone Number"
              icon={<Phone size={18} />}
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
              placeholder="98XXXXXXXX"
            />
            <div className="sm:col-span-2">
              <TextField
                label="Email"
                type="email"
                icon={<Mail size={18} />}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div className="sm:col-span-2">
              <PasswordField
                label="New Password"
                placeholder="Leave blank to keep current password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoComplete="new-password"
              />
            </div>
          </div>

          <div className="mt-6 flex items-center gap-2 rounded-lg bg-[var(--color-surface-inset)] px-3 py-2.5 text-xs text-[var(--color-text-muted)]">
            <ShieldCheck size={15} className="text-[var(--color-primary)]" />
            Your information is kept private and secure.
          </div>

          <div className="mt-6 flex justify-end">
            <Button type="submit" size="lg" disabled={saving}>
              {saving ? "Saving..." : "Save Changes"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
