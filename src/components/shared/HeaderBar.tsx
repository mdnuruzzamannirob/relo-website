import { ReactNode } from 'react';

type HeaderBarProps = {
  title: string;
  description?: string;
  rightContent?: ReactNode;
  className?: string;
};

const HeaderBar = ({ title, description, rightContent, className = '' }: HeaderBarProps) => {
  return (
    <div className={`flex items-center justify-between gap-4 ${className}`}>
      {/* Left Side - Title and Description */}
      <div className="flex flex-col gap-1">
        <h1 className="text-primary text-2xl font-semibold">{title}</h1>
        {description && <p className="text-sm text-slate-500">{description}</p>}
      </div>

      {/* Right Side - Button or Custom Content */}
      <div className="ml-auto">{rightContent && rightContent}</div>
    </div>
  );
};

export default HeaderBar;
