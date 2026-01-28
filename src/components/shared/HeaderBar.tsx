import { ReactNode } from 'react';

type HeaderBarProps = {
  title: string;
  description?: string;
  rightContent?: ReactNode;
  className?: string;
};

const HeaderBar = ({ title, description, rightContent, className = '' }: HeaderBarProps) => {
  return (
    <div
      className={`flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between sm:gap-4 ${className}`}
    >
      {/* Left Side - Title and Description */}
      <div className="flex flex-col gap-0.5 sm:gap-1">
        <h1 className="text-primary text-xl font-semibold sm:text-2xl">{title}</h1>
        {description && <p className="text-xs text-slate-500 sm:text-sm">{description}</p>}
      </div>

      {/* Right Side - Button or Custom Content */}
      {rightContent && <div className="sm:ml-auto">{rightContent}</div>}
    </div>
  );
};

export default HeaderBar;
