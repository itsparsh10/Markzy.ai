'use client';
import React, { useEffect, useState } from 'react';
import { HeroParallax } from '../../ui/hero-parallax';

export default function Hero() {
  const products = [
    {
      title: "Website Copy Writer",
      description: "Landing pages, sales pages & website content that converts visitors into customers instantly",
      icon: "fas fa-globe",
      color: "text-blue-600",
      bgColor: "bg-blue-100"
    },
    {
      title: "Sales Letter",
      description: "Persuasive sales letters & direct response copy that drives immediate action & revenue",
      icon: "fas fa-file-contract",
      color: "text-green-600",
      bgColor: "bg-green-100"
    },
    {
      title: "LinkedIn Posts",
      description: "Thought-leadership content & professional posts that build authority & grow your network",
      icon: "fab fa-linkedin",
      color: "text-blue-700",
      bgColor: "bg-blue-50"
    },
    {
      title: "Email Marketing",
      description: "Welcome sequences, newsletters & promotional campaigns that nurture leads into loyal customers",
      icon: "fas fa-envelope",
      color: "text-purple-600",
      bgColor: "bg-purple-100"
    },
    {
      title: "Blog Generator",
      description: "SEO-optimized articles & thought-leadership content that ranks high & drives organic traffic",
      icon: "fas fa-pen-fancy",
      color: "text-orange-600",
      bgColor: "bg-orange-100"
    },
    {
      title: "Facebook Ads",
      description: "High-converting ad copy & creative concepts that maximize ROAS & reduce cost-per-click",
      icon: "fab fa-facebook",
      color: "text-blue-500",
      bgColor: "bg-blue-50"
    },
    {
      title: "Google Ads",
      description: "Search ads, display copy & keyword-optimized content that dominates search results",
      icon: "fab fa-google",
      color: "text-red-600",
      bgColor: "bg-red-100"
    },
    {
      title: "Instagram Posts",
      description: "Viral captions, story templates & visual content strategies that boost engagement rates",
      icon: "fab fa-instagram",
      color: "text-pink-600",
      bgColor: "bg-pink-100"
    },
    {
      title: "YouTube Scripts",
      description: "Hook-heavy intros, engaging storylines & call-to-actions that increase watch time & subscribers",
      icon: "fab fa-youtube",
      color: "text-red-500",
      bgColor: "bg-red-50"
    },
    {
      title: "Product Descriptions",
      description: "Benefit-focused copy & compelling features that showcase value & increase conversion rates",
      icon: "fas fa-shopping-cart",
      color: "text-emerald-600",
      bgColor: "bg-emerald-100"
    },
    {
      title: "Brand Messaging",
      description: "Core messaging frameworks & brand voice guidelines that create consistent communication",
      icon: "fas fa-copyright",
      color: "text-indigo-600",
      bgColor: "bg-indigo-100"
    },
    {
      title: "Content Strategy",
      description: "Editorial calendars, content pillars & distribution plans that drive sustainable growth",
      icon: "fas fa-chart-line",
      color: "text-teal-600",
      bgColor: "bg-teal-100"
    },
    {
      title: "Press Releases",
      description: "Media-ready announcements & newsworthy content that generates coverage & builds credibility",
      icon: "fas fa-newspaper",
      color: "text-gray-600",
      bgColor: "bg-gray-100"
    },
    {
      title: "Story Magic",
      description: "Customer stories, case studies & narrative frameworks that emotionally connect with audiences",
      icon: "fas fa-magic",
      color: "text-violet-600",
      bgColor: "bg-violet-100"
    },
    {
      title: "Buyer Personas",
      description: "Detailed customer profiles, pain points & behavioral insights for precision targeting",
      icon: "fas fa-user-circle",
      color: "text-cyan-600",
      bgColor: "bg-cyan-100"
    },
  ];

  return (
    <HeroParallax products={products} />
  );
}
