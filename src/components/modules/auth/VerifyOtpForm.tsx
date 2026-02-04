'use client';

import ButtonComp from '@/components/shared/ButtonComp';
import Logo from '@/components/shared/Logo';
import { useVerifyOTPMutation } from '@/store/apis/authApi';
import { useRouter } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';

const VerifyOtpForm = () => {
  const router = useRouter();
  const inputsRef = useRef<(HTMLInputElement | null)[]>([]);
  const [email, setEmail] = useState<string>('');
  const [otpValues, setOtpValues] = useState<string[]>(Array(6).fill(''));
  const [verifyOTP, { isLoading }] = useVerifyOTPMutation();
  const [resendTimer, setResendTimer] = useState(0);

  useEffect(() => {
    const storedEmail = sessionStorage.getItem('forgotPasswordEmail');
    if (!storedEmail) {
      router.push('/forgot-password');
      return;
    }
    setEmail(storedEmail);
    inputsRef.current[0]?.focus();
  }, [router]);

  useEffect(() => {
    if (resendTimer > 0) {
      const timer = setTimeout(() => setResendTimer(resendTimer - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [resendTimer]);

  const handleChange = (value: string, index: number) => {
    if (!/^\d?$/.test(value)) return;

    const newOtpValues = [...otpValues];
    newOtpValues[index] = value;
    setOtpValues(newOtpValues);

    if (value && index < 5) {
      inputsRef.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, index: number) => {
    if (e.key === 'Backspace' && !e.currentTarget.value && index > 0) {
      inputsRef.current[index - 1]?.focus();
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const otp = otpValues.join('');

    if (otp.length !== 6) {
      return;
    }

    try {
      await verifyOTP({
        email,
        otp,
      }).unwrap();

      // Store email and OTP for reset password form
      sessionStorage.setItem('resetPasswordEmail', email);
      sessionStorage.setItem('resetPasswordOTP', otp);
      router.push('/reset-password');
    } catch (error: any) {
      console.error('OTP verification failed:', error);
    }
  };

  return (
    <div className="flex min-h-[calc(100vh-119px)] items-center justify-center py-14">
      <div className="border-brand-100 w-full max-w-120 rounded-xl border p-8 shadow-sm">
        <div className="mb-5 flex flex-col items-center text-center">
          <Logo />
          <h2 className="text-primary mt-3 text-2xl font-semibold">Verify OTP</h2>
          <p className="text-sm text-slate-500">Enter the 6-digit code sent to your email</p>
          {email && <p className="mt-1 text-xs text-slate-400">{email}</p>}
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* OTP BOXES */}
          <div className="flex justify-center gap-3">
            {Array.from({ length: 6 }).map((_, index) => (
              <input
                key={index}
                ref={(el) => {
                  inputsRef.current[index] = el;
                }}
                type="text"
                inputMode="numeric"
                maxLength={1}
                value={otpValues[index]}
                onChange={(e) => handleChange(e.target.value, index)}
                onKeyDown={(e) => handleKeyDown(e, index)}
                disabled={isLoading}
                className="border-brand-100 h-11 w-11 rounded-md border text-center text-lg font-medium transition outline-none focus:ring-1 focus:ring-slate-300 disabled:cursor-not-allowed disabled:opacity-50"
              />
            ))}
          </div>

          <ButtonComp
            type="submit"
            loading={isLoading}
            loadingText="Verifying..."
            size="lg"
            disabled={isLoading || otpValues.join('').length !== 6}
            className="h-11 w-full"
          >
            Verify
          </ButtonComp>
        </form>

        <p className="mt-5 text-center text-sm text-slate-500">
          Didn&apos;t receive the code?{' '}
          <span
            className={`font-medium transition ${
              resendTimer === 0
                ? 'text-primary cursor-pointer hover:underline'
                : 'cursor-not-allowed text-slate-400'
            }`}
            onClick={() => {
              if (resendTimer === 0 && email) {
                // Call resend OTP API
                setResendTimer(60);
              }
            }}
          >
            {resendTimer > 0 ? `Resend OTP in ${resendTimer}s` : 'Resend OTP'}
          </span>
        </p>
      </div>
    </div>
  );
};

export default VerifyOtpForm;
