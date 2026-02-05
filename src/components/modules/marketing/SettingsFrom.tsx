'use client';

import { Button } from '@/components/ui/button';
import { useAuth } from '@/hooks/useAuth';
import {
  useChangePasswordMutation,
  useProfileImageMutation,
  useProfileUpdateMutation,
} from '@/store/apis/authApi';
import { ChangePasswordFormData, changePasswordSchema } from '@/lib/schema/auth';
import { zodResolver } from '@hookform/resolvers/zod';
import { AlertCircle, Eye, EyeOff, Loader2, Upload } from 'lucide-react';
import Image from 'next/image';
import { useEffect, useRef, useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';

export default function SettingsForm() {
  const { user } = useAuth();
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Profile state
  const [profileData, setProfileData] = useState({
    name: '',
    phone: '',
    location: '',
  });

  const [originalProfileData, setOriginalProfileData] = useState({
    name: '',
    phone: '',
    location: '',
  });

  // Password state - using React Hook Form
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting, isDirty },
    reset: resetPasswordForm,
  } = useForm<ChangePasswordFormData>({
    resolver: zodResolver(changePasswordSchema),
    mode: 'onChange',
  });

  const [showPasswords, setShowPasswords] = useState({
    old: false,
    new: false,
    confirm: false,
  });

  // API mutations
  const [profileImageMutation, { isLoading: isUploadingImage }] = useProfileImageMutation();
  const [profileUpdateMutation, { isLoading: isUpdatingProfile }] = useProfileUpdateMutation();
  const [changePasswordMutation, { isLoading: isChangingPassword }] = useChangePasswordMutation();

  // Initialize profile data from user
  useEffect(() => {
    if (user) {
      const initialData = {
        name: user.name || '',
        phone: user.phone || '',
        location: user.location || '',
      };
      setProfileData(initialData);
      setOriginalProfileData(initialData);
    }
  }, [user]);

  // Check if profile data has changed
  const hasProfileChanges =
    profileData.name !== originalProfileData.name ||
    profileData.phone !== originalProfileData.phone ||
    profileData.location !== originalProfileData.location;

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    const validTypes = ['image/png', 'image/jpeg', 'image/jpg', 'image/gif'];
    if (!validTypes.includes(file.type)) {
      toast.error('Please upload a valid image file (PNG, JPG, or GIF)');
      return;
    }

    // Validate file size (2MB)
    if (file.size > 2 * 1024 * 1024) {
      toast.error('Image size should be less than 2MB');
      return;
    }

    // Upload image immediately
    try {
      const formData = new FormData();
      formData.append('image', file);
      await profileImageMutation(formData).unwrap();
    } catch (error) {
      // Error handled by mutation
    }
  };

  const handleProfileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setProfileData({
      ...profileData,
      [e.target.name]: e.target.value,
    });
  };

  const handleProfileSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Check if there are any changes
    if (!hasProfileChanges) {
      toast.info('No changes to save');
      return;
    }

    // Validate required fields
    if (!profileData.name.trim()) {
      toast.error('Name is required');
      return;
    }

    try {
      const formData = new FormData();

      // Create data object and append as JSON string
      // Send empty strings instead of undefined for optional fields
      const data = {
        name: profileData.name.trim(),
        phone: profileData.phone.trim() || '',
        location: profileData.location.trim() || '',
      };

      formData.append('data', JSON.stringify(data));

      await profileUpdateMutation(formData).unwrap();

      // Update original data after successful save
      setOriginalProfileData(profileData);
    } catch (error) {
      // Error handled by mutation
    }
  };

  const handleCancelProfile = () => {
    setProfileData(originalProfileData);
    toast.info('Changes cancelled');
  };

  const handlePasswordSubmit = async (formData: ChangePasswordFormData) => {
    try {
      await changePasswordMutation({
        oldPassword: formData.oldPassword,
        newPassword: formData.newPassword,
        confirmNewPassword: formData.confirmPassword,
      }).unwrap();

      // Clear form
      resetPasswordForm();
    } catch (error) {
      // Error handled by mutation
    }
  };

  const handleCancelPassword = () => {
    resetPasswordForm();
    toast.info('Password form cleared');
  };

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <div className="app-container min-h-[calc(100vh-119px)] py-8 pb-14">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-primary text-2xl font-semibold">Account Settings</h1>
        <p className="mt-1 text-sm text-slate-500">Manage your account preferences</p>
      </div>

      <div className="space-y-6">
        {/* Profile Information */}
        <form onSubmit={handleProfileSubmit}>
          <div className="border-brand-100 rounded-xl border p-6">
            <h2 className="text-primary mb-6 text-base font-semibold">Profile Information</h2>

            <div className="mb-6 flex items-center gap-4">
              <div
                onClick={handleUploadClick}
                className="bg-primary relative flex size-20 min-w-20 cursor-pointer items-center justify-center rounded-full text-white"
              >
                {user?.profileImage ? (
                  <Image
                    src={user.profileImage}
                    alt="Profile"
                    width={80}
                    height={80}
                    className="size-full rounded-full object-cover"
                    unoptimized
                  />
                ) : (
                  <span className="text-sm font-medium">{getInitials(user?.name || 'U')}</span>
                )}
                {isUploadingImage && (
                  <div className="absolute inset-0 flex items-center justify-center rounded-full bg-black/50">
                    <Loader2 className="size-6 animate-spin text-white" />
                  </div>
                )}
              </div>

              <div>
                {/* Upload Button */}
                <Button
                  variant="outline"
                  className="h-11"
                  type="button"
                  onClick={handleUploadClick}
                  disabled={isUploadingImage}
                >
                  <Upload className="mr-2 size-4" />
                  Upload Photo
                </Button>

                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/png, image/jpeg, image/jpg, image/gif"
                  className="hidden"
                  onChange={handleFileChange}
                />

                <p className="mt-1 text-xs text-slate-500">JPG, PNG or GIF. Max 2MB</p>
              </div>
            </div>

            {/* rest of your form */}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="space-y-1.5">
                <label htmlFor="name" className="text-primary text-sm font-medium">
                  Full Name
                </label>
                <input
                  id="name"
                  name="name"
                  value={profileData.name}
                  onChange={handleProfileInputChange}
                  placeholder="John Doe"
                  className="border-brand-100 focus:bg-brand-50/50 h-11 w-full rounded-md border px-4 text-sm transition-all outline-none placeholder:text-slate-400 focus:ring-1 focus:ring-slate-300"
                />
              </div>

              <div className="space-y-1.5">
                <label htmlFor="phone" className="text-primary text-sm font-medium">
                  Phone Number
                </label>
                <input
                  id="phone"
                  name="phone"
                  value={profileData.phone}
                  onChange={handleProfileInputChange}
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
                  value={profileData.location}
                  onChange={handleProfileInputChange}
                  placeholder="New York, NY"
                  className="border-brand-100 focus:bg-brand-50/50 h-11 w-full rounded-md border px-4 text-sm transition-all outline-none placeholder:text-slate-400 focus:ring-1 focus:ring-slate-300"
                />
              </div>
            </div>
          </div>

          <div className="mt-4 flex gap-3">
            <Button
              type="submit"
              className="h-11"
              disabled={isUpdatingProfile || !hasProfileChanges}
            >
              {isUpdatingProfile ? (
                <>
                  <Loader2 className="mr-2 size-4 animate-spin" />
                  Saving...
                </>
              ) : (
                'Save Changes'
              )}
            </Button>
            {hasProfileChanges && (
              <Button
                type="button"
                variant="outline"
                className="h-11"
                onClick={handleCancelProfile}
                disabled={isUpdatingProfile}
              >
                Cancel
              </Button>
            )}
          </div>
        </form>

        {/* Change Password Form */}
        <form onSubmit={handleSubmit(handlePasswordSubmit)}>
          <div className="border-brand-100 rounded-xl border p-6">
            <h2 className="text-primary mb-6 text-base font-semibold">Change Password</h2>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              {/* Current Password Field */}
              <div className="space-y-1.5">
                <label htmlFor="oldPassword" className="text-primary text-sm font-medium">
                  Current Password
                </label>
                <div className="relative">
                  <input
                    id="oldPassword"
                    type={showPasswords.old ? 'text' : 'password'}
                    placeholder="••••••••"
                    {...register('oldPassword')}
                    className="border-brand-100 focus:bg-brand-50/50 h-11 w-full rounded-md border px-4 pr-10 text-sm transition-all outline-none placeholder:text-slate-400 focus:ring-1 focus:ring-slate-300 disabled:cursor-not-allowed disabled:opacity-50"
                  />

                  {/* toggle */}
                  <button
                    type="button"
                    onClick={() => setShowPasswords({ ...showPasswords, old: !showPasswords.old })}
                    className="absolute top-2.5 right-2.5 p-1 text-slate-400"
                  >
                    {showPasswords.old ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>

                {errors.oldPassword && (
                  <div className="mt-1 flex items-center gap-1 text-xs text-red-500">
                    <AlertCircle size={14} />
                    {errors.oldPassword.message}
                  </div>
                )}
              </div>

              <div className=""></div>

              {/* New Password Field */}
              <div className="space-y-1.5">
                <label htmlFor="newPassword" className="text-primary text-sm font-medium">
                  New Password
                </label>
                <div className="relative">
                  <input
                    id="newPassword"
                    type={showPasswords.new ? 'text' : 'password'}
                    placeholder="••••••••"
                    {...register('newPassword')}
                    className="border-brand-100 focus:bg-brand-50/50 h-11 w-full rounded-md border px-4 pr-10 text-sm transition-all outline-none placeholder:text-slate-400 focus:ring-1 focus:ring-slate-300 disabled:cursor-not-allowed disabled:opacity-50"
                  />

                  {/* toggle */}
                  <button
                    type="button"
                    onClick={() => setShowPasswords({ ...showPasswords, new: !showPasswords.new })}
                    className="absolute top-2.5 right-2.5 p-1 text-slate-400"
                  >
                    {showPasswords.new ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>

                {errors.newPassword && (
                  <div className="mt-1 flex items-center gap-1 text-xs text-red-500">
                    <AlertCircle size={14} />
                    {errors.newPassword.message}
                  </div>
                )}
              </div>

              {/* Confirm Password Field */}
              <div className="space-y-1.5">
                <label htmlFor="confirmPassword" className="text-primary text-sm font-medium">
                  Confirm New Password
                </label>
                <div className="relative">
                  <input
                    id="confirmPassword"
                    type={showPasswords.confirm ? 'text' : 'password'}
                    placeholder="••••••••"
                    {...register('confirmPassword')}
                    className="border-brand-100 focus:bg-brand-50/50 h-11 w-full rounded-md border px-4 pr-10 text-sm transition-all outline-none placeholder:text-slate-400 focus:ring-1 focus:ring-slate-300 disabled:cursor-not-allowed disabled:opacity-50"
                  />

                  {/* toggle */}
                  <button
                    type="button"
                    onClick={() =>
                      setShowPasswords({ ...showPasswords, confirm: !showPasswords.confirm })
                    }
                    className="absolute top-2.5 right-2.5 p-1 text-slate-400"
                  >
                    {showPasswords.confirm ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>

                {errors.confirmPassword && (
                  <div className="mt-1 flex items-center gap-1 text-xs text-red-500">
                    <AlertCircle size={14} />
                    {errors.confirmPassword.message}
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="mt-4 flex gap-3">
            <Button type="submit" className="h-11" disabled={isSubmitting || isChangingPassword}>
              {isSubmitting || isChangingPassword ? (
                <>
                  <Loader2 className="mr-2 size-4 animate-spin" />
                  Updating...
                </>
              ) : (
                'Update Password'
              )}
            </Button>
            {isDirty && (
              <Button
                type="button"
                variant="outline"
                className="h-11"
                onClick={handleCancelPassword}
                disabled={isSubmitting || isChangingPassword}
              >
                Cancel
              </Button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
}
