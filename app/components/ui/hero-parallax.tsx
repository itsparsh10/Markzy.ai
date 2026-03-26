"use client";
import React, { useState, useEffect } from "react";
import {
  motion,
  useScroll,
  useTransform,
  useSpring,
  MotionValue,
  AnimatePresence,
} from "framer-motion";
import { cn } from "@/lib/utils";
import RotatingText from './RotatingText';

export const HeroParallax = ({
  products,
}: {
  products: {
    title: string;
    description: string;
    icon: string;
    color: string;
    bgColor: string;
  }[];
}) => {
  const firstRow = products.slice(0, 5);
  const secondRow = products.slice(5, 10);
  const thirdRow = products.slice(10, 15);
  const ref = React.useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });

  // Optimized spring config for ultra-smooth animations
  const springConfig = { 
    stiffness: 100, 
    damping: 30, 
    bounce: 0,
    mass: 0.8,
    restDelta: 0.001,
    restSpeed: 0.001
  };

  // Smoother, more refined transform calculations
  const translateX = useSpring(
    useTransform(scrollYProgress, [0, 1], [0, 800]),
    springConfig
  );
  const translateXReverse = useSpring(
    useTransform(scrollYProgress, [0, 1], [0, -800]),
    springConfig
  );
  const rotateX = useSpring(
    useTransform(scrollYProgress, [0, 0.25], [15, 0]),
    springConfig
  );
  const opacity = useSpring(
    useTransform(scrollYProgress, [0, 0.15], [0.3, 1]),
    springConfig
  );
  const rotateZ = useSpring(
    useTransform(scrollYProgress, [0, 0.25], [20, 0]),
    springConfig
  );
  const translateY = useSpring(
    useTransform(scrollYProgress, [0, 0.6], [-200, 100]),
    springConfig
  );

  return (
    <div
      ref={ref}
      className="h-[130vh] sm:h-[135vh] lg:h-[140vh] py-10 sm:py-12 lg:py-16 overflow-hidden antialiased relative flex flex-col self-auto [perspective:1200px] [transform-style:preserve-3d]"
      style={{
        willChange: 'transform',
        backfaceVisibility: 'hidden',
      }}
    >
      <Header />
      <motion.div
        style={{
          rotateX,
          rotateZ,
          translateY,
          opacity,
          willChange: 'transform, opacity',
          backfaceVisibility: 'hidden',
        }}
        className="transform-gpu"
      >
        <motion.div className="mb-4 flex flex-row-reverse space-x-reverse space-x-6 sm:mb-6 sm:space-x-10 lg:space-x-16 will-change-transform">
          {firstRow.map((product) => (
            <ProductCard
              product={product}
              translate={translateX}
              key={product.title}
            />
          ))}
        </motion.div>
        <motion.div className="mb-4 flex flex-row space-x-6 sm:mb-6 sm:space-x-10 lg:space-x-16 will-change-transform">
          {secondRow.map((product) => (
            <ProductCard
              product={product}
              translate={translateXReverse}
              key={product.title}
            />
          ))}
        </motion.div>
        <motion.div className="flex flex-row-reverse space-x-reverse space-x-6 sm:space-x-10 lg:space-x-16 will-change-transform">
          {thirdRow.map((product) => (
            <ProductCard
              product={product}
              translate={translateX}
              key={product.title}
            />
          ))}
        </motion.div>
      </motion.div>
    </div>
  );
};

export const Header = () => {
  const [currentTextIndex, setCurrentTextIndex] = useState(0);
  const texts = ['Marketing Content', 'Sales Copy', 'Blog Posts', 'Email Campaigns'];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTextIndex((prev) => (prev + 1) % texts.length);
    }, 3000);
    
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="relative left-0 top-0 z-10 mx-auto w-full max-w-7xl bg-white/20 px-4 py-6 backdrop-blur-sm sm:px-6 sm:py-8">
      <div className="text-center">
        <h1 className="audiowide-regular text-3xl sm:text-4xl md:text-6xl lg:text-8xl font-bold">
          <span className="text-gray-900 block">Create Magical</span>
          <span 
            className="audiowide-regular pb-2 bg-gradient-to-r from-[#1d1f89] to-[#46adb6] bg-clip-text text-transparent block overflow-hidden"
            style={{ lineHeight: '1.2' }}
          >
            <RotatingText
              texts={['Marketing Content', 'Sales Copy', 'Blog Posts', 'Email Campaigns']}
              mainClassName="inline-flex"
              staggerFrom="last"
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "-120%" }}
              staggerDuration={0.025}
              splitLevelClassName="overflow-hidden pb-0.5 sm:pb-1 md:pb-1"
              elementLevelClassName="bg-gradient-to-r from-[#1d1f89] to-[#46adb6] bg-clip-text text-transparent"
              transition={{ type: "spring", damping: 30, stiffness: 400 }}
              rotationInterval={3000}
            />
          </span>
        </h1>
        <p className="mx-auto mb-8 max-w-4xl px-1 text-base font-medium leading-relaxed text-gray-700 sm:text-lg md:text-2xl">
          Transform your marketing with 100+ AI-powered tools that generate high-converting content across all channels - 
          from blog posts to email campaigns, save you 10+ hours per week, and boost your conversions by 40%.
        </p>
        
        {/* Enhanced Content Section */}
        <div className="mx-auto mt-10 max-w-5xl space-y-8 sm:mt-12">
          <div className="mb-10 grid grid-cols-1 gap-4 sm:gap-6 md:mb-12 md:grid-cols-3 md:gap-8">
            <div className="text-center">
              <div className="text-3xl md:text-4xl font-bold text-blue-600 mb-2">100+</div>
              <div className="text-gray-600 font-medium">AI-Powered Tools</div>
            </div>
            <div className="text-center">
              <div className="text-3xl md:text-4xl font-bold text-blue-600 mb-2">10+</div>
              <div className="text-gray-600 font-medium">Hours Saved Weekly</div>
            </div>
            <div className="text-center">
              <div className="text-3xl md:text-4xl font-bold text-blue-600 mb-2">40%</div>
              <div className="text-gray-600 font-medium">Conversion Boost</div>
            </div>
          </div>
          
          {/* Get Started Button */}
          <div className="mt-10 text-center sm:mt-12">
            <a 
              href="/register" 
              className="inline-flex items-center gap-2 sm:gap-3 rounded-2xl px-6 py-3 text-base font-semibold text-white transition-all duration-300 hover:scale-105 hover:shadow-lg sm:px-8 sm:py-4 sm:text-lg transform"
              style={{
                background: 'linear-gradient(135deg, #1d1f89 0%, #46adb6 100%)',
              }}
            >
              <i className="fas fa-rocket text-xl"></i>
              Get Started Free
            </a>
          </div>

          {/* Trust Indicators */}
          <div className="transform delay-800 flex flex-col items-center justify-center gap-4 text-xs text-gray-500 transition-all duration-1000 sm:flex-row sm:gap-8 sm:text-sm">
            <div className="flex items-center">
              <i className="fas fa-check-circle text-green-500 mr-2"></i>
              No credit card required
            </div>
            <div className="flex items-center">
              <i className="fas fa-check-circle text-green-500 mr-2"></i>
              Free trial going on 
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export const ProductCard = ({
  product,
  translate,
}: {
  product: {
    title: string;
    description: string;
    icon: string;
    color: string;
    bgColor: string;
  };
  translate: MotionValue<number>;
}) => {
  return (
    <motion.div
      style={{
        x: translate,
        willChange: 'transform',
        backfaceVisibility: 'hidden',
      }}
      key={product.title}
      className="group/product relative w-[18rem] shrink-0 transform-gpu sm:w-[22rem] md:w-[26rem] lg:w-[30rem]"
    >
      <div className="block">
        <div className="flex w-full flex-col items-center justify-center rounded-2xl border border-gray-200 bg-white p-5 text-center shadow-sm transition-transform duration-300 hover:scale-[1.02] sm:p-6 md:p-7 lg:p-8">
          <div className={`mb-4 flex h-14 w-14 items-center justify-center rounded-2xl ${product.bgColor} transition-transform duration-300 group-hover/product:scale-110 sm:mb-5 sm:h-16 sm:w-16 lg:mb-6 lg:h-20 lg:w-20`}>
            <i className={`${product.icon} ${product.color} text-xl sm:text-2xl lg:text-3xl`}></i>
          </div>
          <h3 className="mb-3 text-base font-bold text-gray-800 sm:mb-4 sm:text-lg lg:text-xl">{product.title}</h3>
          <p className="text-xs leading-relaxed text-gray-600 sm:text-sm">{product.description}</p>
        </div>
      </div>
    </motion.div>
  );
};
