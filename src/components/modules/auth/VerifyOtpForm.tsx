'use client';

import ButtonComp from '@/components/shared/ButtonComp';
import Logo from '@/components/shared/Logo';
import { useRouter } from 'next/navigation';
import { useEffect, useRef } from 'react';

const VerifyOtpForm = () => {
  const router = useRouter();
  const inputsRef = useRef<(HTMLInputElement | null)[]>([]);
  const isLoading = false;

  useEffect(() => {
    inputsRef.current[0]?.focus();
  }, []);
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    router.push('/reset-password');
  };

  const handleChange = (value: string, index: number) => {
    if (!/^\d?$/.test(value)) return;

    if (value && index < 5) {
      inputsRef.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, index: number) => {
    if (e.key === 'Backspace' && !e.currentTarget.value && index > 0) {
      inputsRef.current[index - 1]?.focus();
    }
  };

  return (
    <div className="flex min-h-[calc(100vh-119px)] items-center justify-center py-14">
      <div className="border-brand-100 w-full max-w-120 rounded-xl border p-8 shadow-sm">
        <div className="mb-5 flex flex-col items-center text-center">
          <Logo />
          <h2 className="text-primary mt-3 text-2xl font-semibold">Verify OTP</h2>
          <p className="text-sm text-slate-500">Enter the 6-digit code sent to your email</p>
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
                onChange={(e) => handleChange(e.target.value, index)}
                onKeyDown={(e) => handleKeyDown(e, index)}
                className="border-brand-100 h-11 w-11 rounded-md border text-center text-lg font-medium transition outline-none focus:ring-1 focus:ring-slate-300"
              />
            ))}
          </div>

          <ButtonComp
            type="submit"
            loading={isLoading}
            loadingText="Verifying..."
            size="lg"
            className="h-11 w-full"
          >
            Verify
          </ButtonComp>
        </form>

        <p className="mt-5 text-center text-sm text-slate-500">
          Didn’t receive the code?{' '}
          <span className="text-primary cursor-pointer font-medium transition hover:underline">
            Resend OTP
          </span>
        </p>
      </div>
    </div>
  );
};

export default VerifyOtpForm;
