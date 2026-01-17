'use client';

import { Button } from '@/components/ui/button';
import { Upload } from 'lucide-react';
import { useRef } from 'react';

export default function SettingsForm() {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // for now just logging (no UI change)
    console.log('Selected file:', file);
  };

  return (
    <div className="app-container min-h-[calc(100vh-119px)] pt-8 pb-14">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-primary text-2xl font-semibold">Account Settings</h1>
        <p className="mt-1 text-sm text-slate-500">Manage your account preferences</p>
      </div>

      <div className="space-y-6">
        {/* Profile Information */}
        <div className="border-brand-100 rounded-xl border p-6">
          <h2 className="text-primary mb-6 text-base font-semibold">Profile Information</h2>

          <div className="mb-6 flex items-center gap-4">
            <div
              onClick={handleUploadClick}
              className="bg-primary flex size-20 min-w-20 cursor-pointer items-center justify-center rounded-full text-white"
            >
              <span className="text-sm font-medium">JD</span>
            </div>

            <div>
              {/* Upload Button */}
              <Button variant="outline" className="h-11" type="button" onClick={handleUploadClick}>
                <Upload className="mr-2 size-4" />
                Upload Photo
              </Button>

              <input
                ref={fileInputRef}
                type="file"
                accept="image/png, image/jpeg, image/gif"
                className="hidden"
                onChange={handleFileChange}
              />

              <p className="mt-1 text-xs text-slate-500">JPG, PNG or GIF. Max 2MB</p>
            </div>
          </div>

          {/* rest of your form */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="space-y-1.5">
              <label htmlFor="full-name" className="text-primary text-sm font-medium">
                Full Name
              </label>
              <input
                id="full-name"
                name="full-name"
                placeholder="John Doe"
                className="border-brand-100 focus:bg-brand-50/50 h-11 w-full rounded-md border px-4 text-sm transition-all outline-none placeholder:text-slate-400 focus:ring-1 focus:ring-slate-300"
              />
            </div>

            <div className="space-y-1.5">
              <label htmlFor="phone-number" className="text-primary text-sm font-medium">
                Phone Number
              </label>
              <input
                id="phone-number"
                name="phone-number"
                placeholder="(555) 123-4567"
                className="border-brand-100 focus:bg-brand-50/50 h-11 w-full rounded-md border px-4 text-sm transition-all outline-none placeholder:text-slate-400 focus:ring-1 focus:ring-slate-300"
              />
            </div>

            <div className="space-y-1.5">
              <label htmlFor="location" className="text-primary text-sm font-medium">
                Location
              </label>
              <input
                id="location"
                name="location"
                placeholder="New York, NY"
                className="border-brand-100 focus:bg-brand-50/50 h-11 w-full rounded-md border px-4 text-sm transition-all outline-none placeholder:text-slate-400 focus:ring-1 focus:ring-slate-300"
              />
            </div>
          </div>
        </div>

        <Button className="h-11">Save Changes</Button>

        {/* Change Password Form */}
        <div className="border-brand-100 rounded-xl border p-6">
          <h2 className="text-primary mb-6 text-base font-semibold">Change Password</h2>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="space-y-1.5">
              <label htmlFor="current-password" className="text-primary text-sm font-medium">
                Current Password
              </label>
              <input
                id="current-password"
                type="password"
                name="current-password"
                placeholder="••••••••"
                className="border-brand-100 focus:bg-brand-50/50 h-11 w-full rounded-md border px-4 text-sm transition-all outline-none placeholder:text-slate-400 focus:ring-1 focus:ring-slate-300"
              />
            </div>

            <div className="space-y-1.5">
              <label htmlFor="new-password" className="text-primary text-sm font-medium">
                New Password
              </label>
              <input
                id="new-password"
                type="password"
                name="new-password"
                placeholder="••••••••"
                className="border-brand-100 focus:bg-brand-50/50 h-11 w-full rounded-md border px-4 text-sm transition-all outline-none placeholder:text-slate-400 focus:ring-1 focus:ring-slate-300"
              />
            </div>

            <div className="space-y-1.5">
              <label htmlFor="confirm-password" className="text-primary text-sm font-medium">
                Confirm New Password
              </label>
              <input
                id="confirm-password"
                type="password"
                name="confirm-password"
                placeholder="••••••••"
                className="border-brand-100 focus:bg-brand-50/50 h-11 w-full rounded-md border px-4 text-sm transition-all outline-none placeholder:text-slate-400 focus:ring-1 focus:ring-slate-300"
              />
            </div>
          </div>
        </div>

        <Button className="h-11">Update Password</Button>
      </div>
    </div>
  );
}
