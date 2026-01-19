import { ReactNode } from 'react';
import { Button } from '@/components/ui/button';

type ButtonConfig = {
  label: string;
  onClick?: () => void;
  variant?: 'default' | 'outline' | 'ghost' | 'destructive';
  disabled?: boolean;
  href?: string;
};

type HeaderBarProps = {
  title: string;
  description?: string;
  button?: ButtonConfig;
  rightContent?: ReactNode;
  className?: string;
};

const HeaderBar = ({
  title,
  description,
  button,
  rightContent,
  className = '',
}: HeaderBarProps) => {
  return (
    <div className={`flex items-center justify-between gap-4 ${className}`}>
      {/* Left Side - Title and Description */}
      <div className="flex flex-col gap-1">
        <h1 className="text-primary text-2xl font-semibold">{title}</h1>
        {description && <p className="text-sm text-slate-500">{description}</p>}
      </div>

      {/* Right Side - Button or Custom Content */}
      <div className="ml-auto">
        {rightContent ? (
          rightContent
        ) : button ? (
          <Button
            onClick={button.onClick}
            disabled={button.disabled}
            variant={button.variant}
            className="whitespace-nowrap"
          >
            {button.label}
          </Button>
        ) : null}
      </div>
    </div>
  );
};

export default HeaderBar;
