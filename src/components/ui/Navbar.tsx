'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { scrollToSection, subscribeScroll, Section } from '@/lib/scrollStore';

const NAV_ITEMS: { label: string; section: Section }[] = [
  { label: 'PRODUCT', section: 'product' },
  { label: 'TECHNOLOGY', section: 'technology' },
  { label: 'SOUND', section: 'sound' },
  { label: 'ABOUT', section: 'about' }
];

export default function Navbar() {
  const [activeSection, setActiveSection] = useState<Section>('top');
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    return subscribeScroll((p) => {
      if (p < 0.9) setActiveSection('top');
      else if (p < 1.9) setActiveSection('technology');
      else if (p < 2.9) setActiveSection('sound');
      else if (p < 3.9) setActiveSection('product');
      else setActiveSection('about');
    });
  }, []);

  const handleNavClick = (section: Section) => {
    setIsMenuOpen(false);
    scrollToSection(section);
  };

  return (
    <>
      <nav id="global-nav" className="fixed top-0 left-0 w-full z-[100] px-6 md:px-12 py-5 flex justify-between items-center text-[10px] font-black tracking-[0.2em] uppercase opacity-0 overflow-x-hidden backdrop-blur-md bg-[var(--background)]/80 border-b border-foreground/5 transition-all duration-300">
        <div className="flex-1">
          <button 
            onClick={() => handleNavClick('top')} 
            className="text-foreground hover:text-coral transition-colors flex items-center gap-2 w-max cursor-pointer"
            aria-label="Scroll to top"
          >
            <span className="block w-1.5 h-1.5 bg-coral rounded-full" />
            <span className="font-black text-xs tracking-[0.3em]">SONA</span>
          </button>
        </div>

        {/* Desktop Links */}
        <div className="hidden md:flex gap-12 justify-center flex-1">
          {NAV_ITEMS.map((item) => {
            const isActive = activeSection === item.section;
            return (
              <button 
                key={item.label} 
                onClick={() => handleNavClick(item.section)} 
                className="relative group text-foreground/60 hover:text-foreground transition-colors py-2 flex items-center gap-2"
                aria-current={isActive ? 'page' : undefined}
              >
                {isMounted && isActive && <span className="block w-1 h-1 bg-coral rounded-full absolute -left-3 top-1/2 -translate-y-1/2" />}
                {item.label}
                <span className="block absolute bottom-0 left-1/2 -translate-x-1/2 w-0 h-[1.5px] bg-coral transition-all duration-300 group-hover:w-full opacity-0 group-hover:opacity-100" />
              </button>
            );
          })}
        </div>

        {/* Desktop Explore */}
        <div className="hidden md:flex flex-1 justify-end">
          <button 
            onClick={() => handleNavClick('next')} 
            className="group flex items-center gap-3 text-foreground hover:text-coral transition-colors cursor-pointer"
            aria-label="Explore next section"
          >
            <span>EXPLORE</span>
            <span className="block w-8 h-[1px] bg-foreground/60 group-hover:bg-coral group-hover:w-12 transition-all duration-300 relative">
              <span className="block absolute right-0 top-1/2 -translate-y-1/2 w-1.5 h-1.5 border-t border-r border-foreground/60 group-hover:border-coral rotate-45 transition-colors" />
            </span>
          </button>
        </div>

        {/* Mobile Menu Toggle */}
        <div className="flex md:hidden justify-end flex-1">
          <button 
            onClick={() => setIsMenuOpen(true)}
            className="flex flex-col gap-[4px] w-6 group items-end p-2 -mr-2 cursor-pointer"
            aria-expanded={isMenuOpen}
            aria-label="Open menu"
          >
            <span className="w-full h-[1.5px] bg-foreground group-hover:bg-coral transition-colors" />
            <span className="w-3/4 h-[1.5px] bg-foreground group-hover:bg-coral transition-colors" />
          </button>
        </div>
      </nav>

      {/* Mobile Menu Overlay */}
      <div 
        className={`fixed inset-0 z-[110] bg-[var(--background)] flex flex-col transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] md:hidden ${
          isMenuOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
      >
        <div className="w-full px-6 py-5 flex justify-between items-center border-b border-foreground/5">
          <button 
            onClick={() => handleNavClick('top')} 
            className="text-foreground hover:text-coral transition-colors flex items-center gap-2 cursor-pointer"
          >
            <span className="block w-1.5 h-1.5 bg-coral rounded-full" />
            <span className="font-black text-xs tracking-[0.3em] uppercase">SONA</span>
          </button>
          
          <button 
            onClick={() => setIsMenuOpen(false)}
            className="text-[10px] font-black tracking-[0.2em] uppercase text-foreground hover:text-coral transition-colors p-2 -mr-2"
            aria-label="Close menu"
          >
            CLOSE
          </button>
        </div>

        <div className="flex-1 flex flex-col justify-center px-10 gap-8">
          {NAV_ITEMS.map((item) => {
            const isActive = activeSection === item.section;
            return (
              <button
                key={item.label}
                onClick={() => handleNavClick(item.section)}
                className="text-left flex items-center gap-4 text-3xl font-black tracking-widest uppercase transition-colors"
                style={{ color: isActive ? 'var(--foreground)' : 'var(--foreground)', opacity: isActive ? 1 : 0.4 }}
              >
                {isMounted && isActive && <span className="block w-2 h-2 bg-coral rounded-full" />}
                {item.label}
              </button>
            );
          })}
        </div>

        <div className="p-10 border-t border-foreground/5">
          <button 
            onClick={() => handleNavClick('next')}
            className="flex items-center gap-4 text-xs font-black tracking-[0.2em] uppercase text-foreground hover:text-coral transition-colors"
          >
            EXPLORE THE PRODUCT →
          </button>
        </div>
      </div>
    </>
  );
}
