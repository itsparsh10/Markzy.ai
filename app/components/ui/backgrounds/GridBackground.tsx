"use client";
import { cn } from "../../../../lib/utils";
import React from "react";

export function GridBackground({ 
  children, 
  className,
  gridSize = 40
}: { 
  children?: React.ReactNode;
  className?: string;
  gridSize?: number;
}) {
  return (
    <div className={cn("relative flex w-full items-center justify-center bg-white", className)}>
      {/* Grid Background */}
      <div
        className="absolute inset-0 opacity-40"
        style={{
          backgroundSize: `${gridSize}px ${gridSize}px`,
          backgroundImage: `
            linear-gradient(to right, rgba(99, 102, 241, 0.2) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(99, 102, 241, 0.2) 1px, transparent 1px)
          `
        }}
      />
      
      {/* Radial fade overlay */}
      <div 
        className="pointer-events-none absolute inset-0"
        style={{
          background: 'radial-gradient(ellipse 800px 600px at center, transparent 40%, white 100%)'
        }}
      ></div>
      
      {/* Content */}
      <div className="relative z-20 w-full">
        {children}
      </div>
    </div>
  );
}
