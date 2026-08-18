'use client';

import { useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import ProductScene from "@/components/3d/ProductScene";
import { setScrollProgress } from "@/lib/scrollStore";

gsap.registerPlugin(useGSAP, ScrollTrigger);

export default function Home() {
  const containerRef = useRef<HTMLElement>(null);
  const heroContentRef = useRef<HTMLDivElement>(null);
  const introTitleRef = useRef<HTMLHeadingElement>(null);
  const introSubtitleRef = useRef<HTMLParagraphElement>(null);
  const indicatorRef = useRef<HTMLDivElement>(null);
  const accent1Ref = useRef<HTMLDivElement>(null);
  const accent2Ref = useRef<HTMLDivElement>(null);
  
  // Elements for the product reveal phase
  const revealContentRef = useRef<HTMLDivElement>(null);
  const revealLine1Ref = useRef<HTMLSpanElement>(null);
  const revealLine2Ref = useRef<HTMLSpanElement>(null);
  const revealLine3Ref = useRef<HTMLSpanElement>(null);
  const comicLinesRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    // --- 1. INTRO ANIMATION (Runs once on load) ---
    const introTl = gsap.timeline();
    
    // Animate in the Navbar, Hero title, red accents, and subtitle
    introTl.to("#global-nav", { opacity: 1, duration: 1, ease: "power2.inOut" }, 0.5)
           .fromTo(introTitleRef.current, { y: 50, opacity: 0 }, { y: 0, opacity: 1, duration: 1.2, ease: "power3.out" }, 0.8)
           .fromTo([accent1Ref.current, accent2Ref.current], { opacity: 0, scale: 0.8 }, { opacity: 0.25, scale: 1, duration: 2, ease: "power2.out", stagger: 0.2 }, 1.0)
           .fromTo(introSubtitleRef.current, { opacity: 0, y: 10 }, { opacity: 1, y: 0, duration: 1, ease: "power2.out" }, 2.5)
           .fromTo(indicatorRef.current, { opacity: 0 }, { opacity: 1, duration: 1 }, 3.0);

    gsap.to(".scroll-arrow", { y: 8, repeat: -1, yoyo: true, ease: "power1.inOut", duration: 1.5, delay: 3.5 });

    // --- 2. SCROLL DRIVEN ANIMATION (Scrubbed) ---
    const scrollTl = gsap.timeline({
      scrollTrigger: {
        trigger: containerRef.current,
        start: "top top",
        end: "+=3000",
        scrub: 1,
        pin: true,
        onUpdate: (self) => {
          setScrollProgress(self.progress);
        }
      }
    });

    // 0.0 - 0.2: Typography moves away smoothly
    scrollTl.to(heroContentRef.current, {
      y: -150,
      scale: 0.9,
      opacity: 0,
      ease: "power2.inOut",
    }, 0); // Maps to progress 0

    // 0.2 - 0.75: Camera approaches and headphone rotates (Handled in R3F via store)
    
    // Animate radial rays simultaneously with the camera zoom to add energy
    scrollTl.to(accent1Ref.current, {
      scale: 1.15,
      rotation: 15,
      ease: "power1.inOut",
      duration: 0.55
    }, 0.2);

    // 0.75 - 0.9: Reveal text enters in a staggered line-by-line sequence
    scrollTl.fromTo([revealLine1Ref.current, revealLine2Ref.current, revealLine3Ref.current], 
      { y: 40, opacity: 0 }, 
      { y: 0, opacity: 1, ease: "power2.out", duration: 0.15, stagger: 0.05 }, 
      0.75
    );

    // Subtle comic motion lines appear during the rig separation
    scrollTl.fromTo(comicLinesRef.current,
      { opacity: 0, scale: 0.9 },
      { opacity: 1, scale: 1, ease: "power2.out", duration: 0.1 },
      0.75
    );

    // 0.9 - 1.0: Components reassemble and text remains, we just hold the state.
    scrollTl.to({}, { duration: 0.1 }); 

  });

  return (
    <main ref={containerRef} className="relative w-full h-screen overflow-hidden bg-[var(--background)]">
      
      {/* COMIC-EDITORIAL DETAILS */}
      <div className="absolute inset-0 z-0 flex items-center justify-center pointer-events-none overflow-hidden">
        {/* Radial line burst */}
        <div ref={accent1Ref} className="absolute w-[70vw] h-[70vw] max-w-[900px] max-h-[900px] opacity-0">
          <svg viewBox="0 0 100 100" className="w-full h-full stroke-muted/20 stroke-[0.4]" fill="none">
             {[...Array(24)].map((_, i) => (
                <line 
                  key={i} 
                  x1="50" y1="50" 
                  x2={(50 + 40 * Math.cos(i * (Math.PI / 12))).toFixed(3)} 
                  y2={(50 + 40 * Math.sin(i * (Math.PI / 12))).toFixed(3)} 
                />
             ))}
          </svg>
        </div>
        {/* Small coral circular accent */}
        <div ref={accent2Ref} className="absolute w-16 h-16 rounded-full border-2 border-coral/40 top-[25%] right-[20%] opacity-0 hidden md:block" />
        <div className="absolute w-6 h-6 bg-yellow/50 rounded-full bottom-[28%] left-[22%] opacity-0 mix-blend-multiply" />
      </div>

      {/* Hero Content Overlay */}
      <div ref={heroContentRef} className="absolute inset-0 z-10 flex flex-col justify-start items-center pt-[18vh] pointer-events-none">
        <h1 
          ref={introTitleRef} 
          className="text-[12vw] md:text-[9vw] font-black leading-none tracking-tighter text-foreground opacity-0"
        >
          SONA ONE
        </h1>
        
        {/* Subtitle positioned below where the headphone will settle */}
        <div className="absolute bottom-[18vh] flex flex-col items-center">
          <p ref={introSubtitleRef} className="text-sm md:text-lg font-bold tracking-[0.2em] text-muted opacity-0">
            SOUND. UNBOUND.
          </p>
        </div>
        
        {/* Scroll Indicator */}
        <div ref={indicatorRef} className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 opacity-0">
          <span className="text-[10px] font-bold tracking-widest text-foreground uppercase">
            Scroll to explore
          </span>
          <div className="scroll-arrow text-foreground text-xs">
            ↓
          </div>
        </div>
      </div>

      {/* 3D Scene Background */}
      <div className="absolute inset-0 z-20 pointer-events-none">
        <ProductScene />
      </div>

      {/* Product Reveal Overlay */}
      <div ref={revealContentRef} className="absolute inset-0 z-30 flex flex-col justify-end items-center pb-[8vh] pointer-events-none">
        {/* New Reveal Typography */}
        <div className="text-center">
          <h2 className="text-4xl md:text-6xl font-black leading-[0.9] tracking-tighter text-foreground flex flex-col items-center">
            <span ref={revealLine1Ref} className="block opacity-0">ENGINEERED</span>
            <span ref={revealLine2Ref} className="block text-coral opacity-0">TO MOVE</span>
            <span ref={revealLine3Ref} className="block opacity-0">YOU.</span>
          </h2>
        </div>

        {/* Comic Motion Lines (Subtle rig separation accents) */}
        <div ref={comicLinesRef} className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full max-w-[800px] flex items-center justify-between px-10 opacity-0">
          <div className="w-16 h-[2px] bg-coral/60 rotate-45" />
          <div className="w-16 h-[2px] bg-coral/60 -rotate-45" />
        </div>
      </div>
    </main>
  );
}
