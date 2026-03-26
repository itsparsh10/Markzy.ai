"use client";
import {
  Navbar,
  NavBody,
  NavItems,
  MobileNav,
  NavbarLogo,
  NavbarButton,
  MobileNavHeader,
  MobileNavToggle,
  MobileNavMenu,
} from "../../ui/resizable-navbar";
import { useState } from "react";

export default function Header() {
  const navItems = [
    {
      name: "Features",
      link: "features",
    },
    {
      name: "AI Tools",
      link: "tools",
    },
    {
      name: "Pricing",
      link: "pricing",
    },
  ];

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const smoothScrollTo = (targetId: string) => {
    const element = document.getElementById(targetId);
    if (element) {
      element.scrollIntoView({
        behavior: 'smooth',
        block: 'start'
      });
    }
  };

  return (
    <div className="relative w-full">
      <Navbar>
        {/* Desktop Navigation */}
        <NavBody>
          <NavbarLogo />
          <NavItems items={navItems} onItemClick={() => {}} />
          <div className="flex items-center gap-4">
            <NavbarButton variant="secondary" href="/login">Sign In</NavbarButton>
            <NavbarButton variant="gradient" href="/register">Get Started Free</NavbarButton>
          </div>
        </NavBody>

        {/* Mobile Navigation */}
        <MobileNav>
          <MobileNavHeader>
            <NavbarLogo />
            <div className="flex items-center gap-2">
              <NavbarButton
                variant="gradient"
                href="/register"
                className="px-3 py-1.5 text-xs"
              >
                Start Free
              </NavbarButton>
              <MobileNavToggle
                isOpen={isMobileMenuOpen}
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              />
            </div>
          </MobileNavHeader>

          <MobileNavMenu
            isOpen={isMobileMenuOpen}
            onClose={() => setIsMobileMenuOpen(false)}
          >
            {navItems.map((item, idx) => (
              <button
                key={`mobile-link-${idx}`}
                onClick={() => {
                  smoothScrollTo(item.link);
                  setIsMobileMenuOpen(false);
                }}
                className="relative w-full rounded-md px-2 py-2.5 text-left text-base font-medium text-gray-800 transition-colors hover:bg-slate-100"
              >
                <span className="block">{item.name}</span>
              </button>
            ))}
            <div className="flex w-full flex-col gap-4">
              <NavbarButton
                onClick={() => setIsMobileMenuOpen(false)}
                variant="primary"
                className="w-full border border-blue-200"
                href="/login"
              >
                Sign In
              </NavbarButton>
              <NavbarButton
                onClick={() => setIsMobileMenuOpen(false)}
                variant="gradient"
                className="w-full"
                href="/register"
              >
                Get Started Free
              </NavbarButton>
            </div>
          </MobileNavMenu>
        </MobileNav>
      </Navbar>
    </div>
  );
}
