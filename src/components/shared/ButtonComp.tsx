'use client';

import { cn } from '@/lib/utils/cn';
import { Button, buttonVariants } from '../ui/button';
import { VariantProps } from 'class-variance-authority';
import { Loader2 } from 'lucide-react';

type ButtonVariants = VariantProps<typeof buttonVariants>;

type ButtonCompProps = {
  className?: string;
  loadingText?: string;
  children?: React.ReactNode;
  loading: boolean;
  disabled?: boolean;
} & React.ComponentProps<typeof Button> &
  Partial<ButtonVariants>;

const ButtonComp = ({
  className,
  loadingText = 'Processing...',
  children,
  loading,
  disabled = false,
  variant,
  size,
  ...props
}: ButtonCompProps) => {
  return (
    <Button
      className={cn('items-center', className)}
      variant={variant}
      size={size}
      disabled={loading || disabled}
      {...props}
    >
      {loading ? (
        <>
          <Loader2 className="animate-spin" />
          {loadingText}
        </>
      ) : (
        children
      )}
    </Button>
  );
};

export default ButtonComp;
