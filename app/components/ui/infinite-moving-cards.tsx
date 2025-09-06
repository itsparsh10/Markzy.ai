"use client";

import { cn } from "@/lib/utils";
import React, { useEffect, useState, useCallback } from "react";

export const InfiniteMovingCards = ({
  items,
  direction = "left",
  speed = "fast",
  pauseOnHover = true,
  className,
}: {
  items: {
    name: string;
    title: string;
    icon: string;
    color: string;
    bgColor: string;
  }[];
  direction?: "left" | "right";
  speed?: "fast" | "normal" | "slow";
  pauseOnHover?: boolean;
  className?: string;
}) => {
  const containerRef = React.useRef<HTMLDivElement>(null);
  const scrollerRef = React.useRef<HTMLUListElement>(null);
  const [start, setStart] = useState(false);
  
  const getDirection = useCallback(() => {
    if (containerRef.current) {
      if (direction === "left") {
        containerRef.current.style.setProperty(
          "--animation-direction",
          "forwards",
        );
      } else {
        containerRef.current.style.setProperty(
          "--animation-direction",
          "reverse",
        );
      }
    }
  }, [direction]);
  
  const getSpeed = useCallback(() => {
    if (containerRef.current) {
      if (speed === "fast") {
        containerRef.current.style.setProperty("--animation-duration", "15s");
      } else if (speed === "normal") {
        containerRef.current.style.setProperty("--animation-duration", "30s");
      } else {
        containerRef.current.style.setProperty("--animation-duration", "60s");
      }
    }
  }, [speed]);
  
  const addAnimation = useCallback(() => {
    if (containerRef.current && scrollerRef.current) {
      const scrollerContent = Array.from(scrollerRef.current.children);

      scrollerContent.forEach((item) => {
        const duplicatedItem = item.cloneNode(true);
        if (scrollerRef.current) {
          scrollerRef.current.appendChild(duplicatedItem);
        }
      });

      getDirection();
      getSpeed();
      setStart(true);
    }
  }, [getDirection, getSpeed]);

  useEffect(() => {
    addAnimation();
  }, [addAnimation]);
  return (
    <div
      ref={containerRef}
      className={cn(
        "scroller relative z-20 w-full overflow-hidden",
        className,
      )}
    >
      <ul
        ref={scrollerRef}
        className={cn(
          "flex w-max min-w-full shrink-0 flex-nowrap gap-3 sm:gap-4 md:gap-6 py-4 sm:py-6",
          start && "animate-scroll",
          pauseOnHover && "hover:[animation-play-state:paused]",
        )}
      >
        {items.map((item, idx) => (
          <li
            className="relative w-[240px] sm:w-[260px] md:w-[280px] lg:w-[300px] max-w-full shrink-0 rounded-2xl border border-gray-200 bg-white px-4 py-6 sm:px-6 shadow-sm hover:shadow-md transition-all duration-300 group"
            key={`${item.name}-${idx}`}
          >
            <div className="flex flex-col items-center text-center">
              <div className={`w-10 h-10 sm:w-12 sm:h-12 ${item.bgColor} rounded-lg flex items-center justify-center mb-3 sm:mb-4 group-hover:scale-110 transition-transform duration-300`}>
                <i className={`${item.icon} ${item.color} text-lg sm:text-xl`}></i>
              </div>
              <h3 className="font-semibold text-gray-800 mb-2 text-sm sm:text-base">{item.name}</h3>
              <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">{item.title}</p>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};
