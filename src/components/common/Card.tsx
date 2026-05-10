import React from 'react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  glass?: boolean;
}

export const Card: React.FC<CardProps> = ({ 
  children, 
  glass = false,
  className,
  ...props 
}) => {
  return (
    <div 
      className={cn(
        'rounded-[2rem] border transition-all',
        glass ? 'bg-white/70 backdrop-blur-md border-white/20' : 'bg-white border-slate-100',
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
};
