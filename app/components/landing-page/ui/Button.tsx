'use client';
import React from 'react';

interface ButtonProps {
  variant?: 'primary' | 'secondary' | 'ghost' | 'outline';
  size?: 'sm' | 'md' | 'lg';
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
  disabled?: boolean;
  type?: 'button' | 'submit' | 'reset';
}

export default function Button({
  variant = 'primary',
  size = 'md',
  children,
  className = '',
  onClick,
  disabled = false,
  type = 'button',
}: ButtonProps) {
  const baseClasses = 'inline-flex items-center justify-center font-medium rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed';
  
  const variants = {
    primary: 'text-white hover:shadow-lg transform hover:-translate-y-0.5 shadow-md focus:ring-blue-500',
    secondary: 'bg-gray-100 text-gray-900 hover:bg-gray-200 focus:ring-gray-500',
    ghost: 'text-gray-600 hover:text-blue-600 hover:bg-blue-50 focus:ring-blue-500',
    outline: 'border-2 text-white hover:opacity-90 hover:shadow-lg focus:ring-blue-500 transform hover:-translate-y-0.5',
  };
  
  const sizes = {
    sm: 'px-4 py-2 text-sm',
    md: 'px-6 py-3 text-base',
    lg: 'px-8 py-4 text-lg',
  };
  
  const classes = `${baseClasses} ${variants[variant]} ${sizes[size]} ${className}`;
  
  const primaryStyle = variant === 'primary' ? {
    background: 'linear-gradient(45deg, #1d1f89 0%, #46adb6 100%)'
  } : {};

  const outlineStyle = variant === 'outline' ? {
    background: 'linear-gradient(45deg, #1d1f89 0%, #46adb6 100%)',
    border: 'none'
  } : {};

  const buttonStyle = variant === 'primary' ? primaryStyle : variant === 'outline' ? outlineStyle : {};
  
  return (
    <button
      type={type}
      className={classes}
      style={buttonStyle}
      onClick={onClick}
      disabled={disabled}
    >
      {children}
    </button>
  );
}
