'use client';

import { useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import ProductScene from "@/components/3d/ProductScene";
import { setScrollProgress } from "@/lib/scrollStore";

gsap.registerPlugin(useGSAP, ScrollTrigger);

export default function Home() {
  const containerRef = useRef<HTMLElement>(null);
  
  // State for Configurator
  const [selectedSize, setSelectedSize] = useState('M');
  const [quantity, setQuantity] = useState(1);
  const [selectedVariant, setSelectedVariant] = useState(0);

  const VARIANTS = [
    { 
      id: 'red', name: 'SONA Red', 
      primary: '#FF4D4D', secondary: '#F0F0F0', detail: '#30323B', 
      accentColor: '#FF4D4D', accentSoft: 'rgba(255, 77, 77, 0.2)' 
    },
    { 
      id: 'midnight', name: 'Midnight', 
      primary: '#171820', secondary: '#FFFFFF', detail: '#30323B', 
      accentColor: '#1A1A1A', accentSoft: 'rgba(26, 26, 26, 0.2)' 
    },
    { 
      id: 'forest', name: 'Forest', 
      primary: '#2A6A50', secondary: '#D8E1D5', detail: '#315C50', 
      accentColor: '#4CA37C', accentSoft: 'rgba(76, 163, 124, 0.2)' 
    },
    { 
      id: 'cobalt', name: 'Cobalt', 
      primary: '#1746A2', secondary: '#DCE8F5', detail: '#3266C2', 
      accentColor: '#5B8DEF', accentSoft: 'rgba(91, 141, 239, 0.2)' 
    }
  ];
  const activeVariant = VARIANTS[selectedVariant];
  
  // Phase 1-4 Refs (Hero)
  const heroContentRef = useRef<HTMLDivElement>(null);
  const introTitleRef = useRef<HTMLHeadingElement>(null);
  const introSubtitleRef = useRef<HTMLParagraphElement>(null);
  const indicatorRef = useRef<HTMLDivElement>(null);
  const accent1Ref = useRef<HTMLDivElement>(null);
  const accent2Ref = useRef<HTMLDivElement>(null);
  
  const revealContentRef = useRef<HTMLDivElement>(null);
  const revealLine1Ref = useRef<HTMLSpanElement>(null);
  const revealLine2Ref = useRef<HTMLSpanElement>(null);
  const revealLine3Ref = useRef<HTMLSpanElement>(null);
  const comicLinesRef = useRef<HTMLDivElement>(null);

  // Phase 5 Refs (Product Design Reveal)
  const section2Ref = useRef<HTMLDivElement>(null);
  const designTextLine1Ref = useRef<HTMLSpanElement>(null);
  const designTextLine2Ref = useRef<HTMLSpanElement>(null);
  const designTextLine3Ref = useRef<HTMLSpanElement>(null);
  const designSubtextRef = useRef<HTMLParagraphElement>(null);
  const spec1Ref = useRef<HTMLDivElement>(null);
  const spec2Ref = useRef<HTMLDivElement>(null);
  const spec3Ref = useRef<HTMLDivElement>(null);

  // Phase 6 Refs (Engineered For Sound)
  const section3Ref = useRef<HTMLDivElement>(null);
  const engTextLine1Ref = useRef<HTMLSpanElement>(null);
  const engTextLine2Ref = useRef<HTMLSpanElement>(null);
  const engTextLine3Ref = useRef<HTMLSpanElement>(null);
  const engSubtextRef = useRef<HTMLParagraphElement>(null);
  const blueprintRef = useRef<HTMLDivElement>(null);
  const anno1Ref = useRef<HTMLDivElement>(null);
  const anno2Ref = useRef<HTMLDivElement>(null);
  const anno3Ref = useRef<HTMLDivElement>(null);
  const anno4Ref = useRef<HTMLDivElement>(null);

  // Phase 7 Refs (Product Features Showcase)
  const section4Ref = useRef<HTMLDivElement>(null);
  const soundTextLine1Ref = useRef<HTMLSpanElement>(null);
  const soundTextLine2Ref = useRef<HTMLSpanElement>(null);
  const soundTextLine3Ref = useRef<HTMLSpanElement>(null);
  const soundWavesRef = useRef<HTMLDivElement>(null);
  const feature1Ref = useRef<HTMLParagraphElement>(null);
  const feature2Ref = useRef<HTMLDivElement>(null);
  const feature3Ref = useRef<HTMLDivElement>(null);
  const feature4Ref = useRef<HTMLDivElement>(null);
  const feature5Ref = useRef<HTMLDivElement>(null);

  // Phase 8 Refs (Configurator)
  const section5Ref = useRef<HTMLDivElement>(null);
  const configContentRef = useRef<HTMLDivElement>(null);

  // Footer Refs
  const footerRef = useRef<HTMLElement>(null);
  const footerStatementRef = useRef<HTMLDivElement>(null);
  const footerCtaRef = useRef<HTMLDivElement>(null);
  const footerBottomRef = useRef<HTMLDivElement>(null);
  const hugeWordmarkRef = useRef<HTMLHeadingElement>(null);

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
        end: "+=15000",
        scrub: 1,
        pin: true,
        onUpdate: (self) => {
          setScrollProgress(self.progress * 5.0);
        }
      }
    });

    // --- PHASE 1 to 4: HERO (Time 0.0 to 1.0) ---
    scrollTl.to(heroContentRef.current, { y: -150, scale: 0.9, opacity: 0, ease: "power2.inOut", duration: 0.2 }, 0); 
    scrollTl.to(accent1Ref.current, { scale: 1.15, rotation: 15, ease: "power1.inOut", duration: 0.55 }, 0.2);
    scrollTl.fromTo([revealLine1Ref.current, revealLine2Ref.current, revealLine3Ref.current], 
      { y: 40, opacity: 0 }, { y: 0, opacity: 1, ease: "power2.out", duration: 0.15, stagger: 0.05 }, 0.75
    );
    scrollTl.fromTo(comicLinesRef.current, { opacity: 0, scale: 0.9 }, { opacity: 1, scale: 1, ease: "power2.out", duration: 0.1 }, 0.75);
    scrollTl.to({}, { duration: 0.1 }, 0.9);

    // --- PHASE 5: PRODUCT DESIGN REVEAL (Time 1.0 to 2.0) ---
    // Start at 1.0, must end before 1.75
    scrollTl.to(revealContentRef.current, { y: -50, opacity: 0, duration: 0.1 }, 1.0);
    scrollTl.fromTo(section2Ref.current, { opacity: 0 }, { opacity: 1, duration: 0.1 }, 1.1);
    scrollTl.fromTo(designTextLine1Ref.current, { y: 30, opacity: 0 }, { y: 0, opacity: 1, duration: 0.2 }, 1.1);
    scrollTl.fromTo(designTextLine2Ref.current, { y: 30, opacity: 0 }, { y: 0, opacity: 1, duration: 0.2 }, 1.2);
    scrollTl.fromTo(designTextLine3Ref.current, { y: 30, opacity: 0 }, { y: 0, opacity: 1, duration: 0.2 }, 1.3);
    scrollTl.fromTo(designSubtextRef.current, { y: 20, opacity: 0 }, { y: 0, opacity: 1, duration: 0.2 }, 1.4);
    scrollTl.fromTo([spec1Ref.current, spec2Ref.current, spec3Ref.current],
      { opacity: 0, scale: 0.9, x: 20 }, { opacity: 1, scale: 1, x: 0, ease: "back.out(1.2)", duration: 0.3, stagger: 0.1 }, 1.5
    );
    scrollTl.to({}, { duration: 0.2 }, 1.8);

    // --- PHASE 6: ENGINEERED FOR SOUND (Time 2.0 to 3.0) ---
    // Start at 2.0, must end before 2.75
    scrollTl.to(section2Ref.current, { opacity: 0, duration: 0.1 }, 2.0);
    scrollTl.fromTo(section3Ref.current, { opacity: 0 }, { opacity: 1, duration: 0.1 }, 2.05);
    scrollTl.fromTo(blueprintRef.current, { scale: 0.9, opacity: 0 }, { scale: 1, opacity: 1, duration: 0.2 }, 2.1);
    scrollTl.fromTo(engTextLine1Ref.current, { y: 20, opacity: 0 }, { y: 0, opacity: 1, duration: 0.15 }, 2.1);
    scrollTl.fromTo(engTextLine2Ref.current, { y: 20, opacity: 0 }, { y: 0, opacity: 1, duration: 0.15 }, 2.15);
    scrollTl.fromTo(engTextLine3Ref.current, { y: 20, opacity: 0 }, { y: 0, opacity: 1, duration: 0.15 }, 2.2);
    scrollTl.fromTo(engSubtextRef.current, { opacity: 0 }, { opacity: 1, duration: 0.15 }, 2.25);
    
    // Animate feature callouts on right side
    scrollTl.fromTo(anno1Ref.current, { x: 20, opacity: 0 }, { x: 0, opacity: 1, duration: 0.15 }, 2.3);
    scrollTl.fromTo(anno2Ref.current, { x: 20, opacity: 0 }, { x: 0, opacity: 1, duration: 0.15 }, 2.35);
    scrollTl.fromTo(anno3Ref.current, { x: 20, opacity: 0 }, { x: 0, opacity: 1, duration: 0.15 }, 2.4);
    scrollTl.fromTo(anno4Ref.current, { x: 20, opacity: 0 }, { x: 0, opacity: 1, duration: 0.15 }, 2.45);
    
    // Draw lines
    scrollTl.to('.anno-line', { strokeDashoffset: 0, duration: 0.2, stagger: 0.05 }, 2.4);
    scrollTl.to('.anno-dot', { opacity: 1, duration: 0.1, stagger: 0.05 }, 2.5);

    // --- PHASE 7: PRODUCT FEATURES SHOWCASE (Time 3.0 to 4.0) ---
    // Start at 3.0, must end before 3.75
    scrollTl.to(section3Ref.current, { opacity: 0, duration: 0.1 }, 3.0);
    scrollTl.fromTo(section4Ref.current, { opacity: 0 }, { opacity: 1, duration: 0.1 }, 3.05);
    scrollTl.fromTo(soundWavesRef.current, { scale: 0.8, opacity: 0 }, { scale: 1, opacity: 1, duration: 0.2 }, 3.1);
    scrollTl.fromTo(soundTextLine1Ref.current, { y: 20, opacity: 0 }, { y: 0, opacity: 1, duration: 0.15 }, 3.15);
    scrollTl.fromTo(soundTextLine2Ref.current, { y: 20, opacity: 0 }, { y: 0, opacity: 1, duration: 0.15 }, 3.2);
    scrollTl.fromTo(soundTextLine3Ref.current, { y: 20, opacity: 0 }, { y: 0, opacity: 1, duration: 0.15 }, 3.25);
    scrollTl.fromTo(feature1Ref.current, { y: 20, opacity: 0 }, { y: 0, opacity: 1, duration: 0.2 }, 3.3);
    
    // Animate the 4 horizontal features
    scrollTl.fromTo([feature2Ref.current, feature3Ref.current, feature4Ref.current, feature5Ref.current], 
      { y: 30, opacity: 0 }, { y: 0, opacity: 1, duration: 0.2, stagger: 0.05 }, 3.4);
    
    scrollTl.to({}, { duration: 0.2 }, 3.9);

    // --- PHASE 8: PRODUCT CONFIGURATOR (Time 4.0 to 5.0) ---
    // Start at 4.0, must end before 4.75
    scrollTl.to(section4Ref.current, { opacity: 0, duration: 0.1 }, 4.0);
    scrollTl.fromTo(section5Ref.current, { opacity: 0, pointerEvents: 'none' }, { opacity: 1, pointerEvents: 'auto', duration: 0.1 }, 4.0);
    scrollTl.fromTo(configContentRef.current,
      { x: -50, opacity: 0 },
      { x: 0, opacity: 1, ease: "power2.out", duration: 0.3 },
      4.1
    );

  });

  useGSAP(() => {
    if (!footerRef.current) return;
    
    const footerTl = gsap.timeline({
      scrollTrigger: {
        trigger: footerRef.current,
        start: "top 80%",
        toggleActions: "play none none reverse"
      }
    });
    
    footerTl.fromTo(footerStatementRef.current, { y: 30, opacity: 0 }, { y: 0, opacity: 1, duration: 0.8, ease: "power2.out" })
            .fromTo(footerCtaRef.current, { y: 20, opacity: 0 }, { y: 0, opacity: 1, duration: 0.6, ease: "power2.out" }, "-=0.4")
            .fromTo(footerBottomRef.current, { opacity: 0 }, { opacity: 1, duration: 0.8 }, "-=0.2");
            
    gsap.fromTo(hugeWordmarkRef.current, 
      { y: 100, opacity: 0, scale: 0.95 }, 
      { 
        y: 0, opacity: 1, scale: 1, 
        ease: "power2.out",
        scrollTrigger: {
          trigger: hugeWordmarkRef.current,
          start: "top bottom",
          end: "bottom bottom",
          scrub: 1
        }
      }
    );
  }, { scope: footerRef });

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <>
    <main ref={containerRef} className="relative w-screen h-screen overflow-hidden bg-[var(--background)]">
      
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
        
        <div className="absolute bottom-[18vh] flex flex-col items-center">
          <p ref={introSubtitleRef} className="text-sm md:text-lg font-bold tracking-[0.2em] text-muted opacity-0">
            SOUND. UNBOUND.
          </p>
        </div>
        
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
        <ProductScene activeVariant={activeVariant} />
      </div>

      {/* Product Reveal Overlay (Phase 3 & 4) */}
      <div ref={revealContentRef} className="absolute inset-0 z-30 flex flex-col justify-end items-center pb-[8vh] pointer-events-none">
        <div className="text-center">
          <h2 className="text-4xl md:text-6xl font-black leading-[0.9] tracking-tighter text-foreground flex flex-col items-center">
            <span ref={revealLine1Ref} className="block opacity-0">ENGINEERED</span>
            <span ref={revealLine2Ref} className="block text-coral opacity-0">TO MOVE</span>
            <span ref={revealLine3Ref} className="block opacity-0">YOU.</span>
          </h2>
        </div>
        <div ref={comicLinesRef} className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full max-w-[800px] flex items-center justify-between px-10 opacity-0">
          <div className="w-16 h-[2px] bg-coral/60 rotate-45" />
          <div className="w-16 h-[2px] bg-coral/60 -rotate-45" />
        </div>
      </div>

      {/* SECTION 2: PRODUCT DESIGN REVEAL (Phase 5) */}
      <div ref={section2Ref} className="absolute inset-0 z-30 flex flex-col md:flex-row items-center pointer-events-none px-8 md:px-24">
        {/* Left Side Typography */}
        <div className="flex-1 flex flex-col justify-center items-start pt-32 md:pt-0">
          <h2 className="text-5xl md:text-7xl lg:text-[7vw] font-black leading-[0.9] tracking-tighter text-foreground flex flex-col">
            <span ref={designTextLine1Ref} className="opacity-0">DESIGNED</span>
            <span ref={designTextLine2Ref} className="text-coral opacity-0">TO BE</span>
            <span ref={designTextLine3Ref} className="opacity-0">HEARD.</span>
          </h2>
          <p ref={designSubtextRef} className="mt-8 text-muted max-w-sm font-medium tracking-wide opacity-0">
            Precision-built for immersive sound, comfort, and movement.
          </p>
        </div>

        {/* Right Side Callouts (Appears around the headphone) */}
        <div className="flex-1 relative h-full hidden md:block">
           <div ref={spec1Ref} className="absolute top-[30%] left-[10%] flex items-center gap-4 opacity-0">
              <div className="text-right">
                <p className="text-sm font-black tracking-widest text-foreground">40MM</p>
                <p className="text-[10px] text-muted font-bold tracking-widest uppercase">Custom Driver</p>
              </div>
              <div className="w-12 h-[2px] bg-foreground/20 rounded-full" />
           </div>
           
           <div ref={spec2Ref} className="absolute top-[55%] right-[5%] flex items-center gap-4 flex-row-reverse opacity-0">
              <div className="text-left">
                <p className="text-sm font-black tracking-widest text-foreground">ACTIVE</p>
                <p className="text-[10px] text-muted font-bold tracking-widest uppercase">Noise Control</p>
              </div>
              <div className="w-12 h-[2px] bg-foreground/20 rounded-full" />
           </div>
           
           <div ref={spec3Ref} className="absolute bottom-[20%] left-[20%] flex items-center gap-4 opacity-0">
              <div className="text-right">
                <p className="text-sm font-black tracking-widest text-foreground">24H</p>
                <p className="text-[10px] text-muted font-bold tracking-widest uppercase">Battery</p>
              </div>
              <div className="w-12 h-[2px] bg-foreground/20 rounded-full" />
           </div>
        </div>
      </div>

      {/* SECTION 3: ENGINEERED FOR SOUND (Phase 6) - STACKED ON MOBILE */}
      <div ref={section3Ref} className="absolute inset-0 z-30 flex flex-col md:flex-row items-center pointer-events-none overflow-hidden">
        
        {/* LEFT 50% COLUMN: Blueprint Graphic */}
        <div ref={blueprintRef} className="absolute inset-0 md:left-0 md:top-0 md:w-1/2 md:h-full flex items-center justify-center opacity-0 -z-10">
          <svg viewBox="0 0 100 100" className="w-[80vw] h-[80vw] max-w-[800px] max-h-[800px] stroke-foreground/15 stroke-[0.1]" fill="none">
             <circle cx="50" cy="50" r="45" strokeDasharray="1 3" />
             <circle cx="50" cy="50" r="30" strokeDasharray="3 5" className="stroke-coral/30" />
             <circle cx="50" cy="50" r="10" strokeDasharray="1 3" />
             <line x1="50" y1="0" x2="50" y2="100" strokeDasharray="2 4" />
             <line x1="0" y1="50" x2="100" y2="50" strokeDasharray="2 4" />
             <circle cx="85" cy="15" r="4" className="stroke-coral/20 stroke-[0.1]" />
          </svg>
        </div>

        {/* RIGHT 50% COLUMN: Typography & Features */}
        <div className="relative md:absolute md:right-0 md:top-0 w-full md:w-1/2 h-full flex flex-col justify-end md:justify-center items-center md:items-start text-center md:text-left px-[5vw] xl:px-[8vw] pb-[8vh] md:pb-0">
          
          <h2 className="text-4xl md:text-6xl lg:text-[6vw] font-black leading-[0.9] tracking-tighter text-foreground flex flex-col">
            <span ref={engTextLine1Ref} className="opacity-0">ENGINEERED</span>
            <span ref={engTextLine2Ref} className="text-coral opacity-0">FOR</span>
            <span ref={engTextLine3Ref} className="opacity-0">SOUND.</span>
          </h2>
          <p ref={engSubtextRef} className="mt-6 text-muted max-w-sm font-medium tracking-wide opacity-0 text-[13px] md:text-sm">
            Precision-built for immersive sound, comfort, and movement.
          </p>
          
          {/* Vertical Feature Stack on Right Side */}
          <div className="mt-8 md:mt-12 flex flex-col gap-4 md:gap-8 relative z-10 w-max">
             
             {/* 01 ERGONOMIC FIT */}
             <div ref={anno1Ref} className="relative opacity-0 flex flex-col items-center md:items-start z-10 w-max">
                <p className="text-xs md:text-sm font-black tracking-widest text-foreground flex items-center justify-center md:justify-start gap-3">
                  <span className="text-coral flex items-center justify-center w-5 h-5 rounded-full border border-coral/30 text-[9px]">01</span>
                  ERGONOMIC FIT
                </p>
                {/* Connector SVG gently spanning from headphone bounding box to the text */}
                <svg className="hidden md:block absolute bottom-1/2 right-[100%] mr-4 w-[16vw] h-[4vh] overflow-visible -z-10" viewBox="0 0 100 100" preserveAspectRatio="none">
                   <path d="M 0 0 L 80 100 L 100 100" pathLength="1" stroke="currentColor" vectorEffect="non-scaling-stroke" strokeWidth="1" fill="none" className="text-foreground/30 anno-line" />
                   <circle cx="0" cy="0" r="3" className="fill-coral anno-dot opacity-0" />
                </svg>
             </div>
             
             {/* 02 ACTIVE NOISE CONTROL */}
             <div ref={anno2Ref} className="relative opacity-0 flex flex-col items-center md:items-start z-10 w-max">
                <p className="text-xs md:text-sm font-black tracking-widest text-foreground flex items-center justify-center md:justify-start gap-3">
                  <span className="text-coral flex items-center justify-center w-5 h-5 rounded-full border border-coral/30 text-[9px]">02</span>
                  ACTIVE NOISE CONTROL
                </p>
                <svg className="hidden md:block absolute top-1/2 right-[100%] mr-4 w-[18vw] h-[2vh] overflow-visible -z-10" viewBox="0 0 100 100" preserveAspectRatio="none">
                   <path d="M 0 100 L 80 0 L 100 0" pathLength="1" stroke="currentColor" vectorEffect="non-scaling-stroke" strokeWidth="1" fill="none" className="text-foreground/30 anno-line" />
                   <circle cx="0" cy="100" r="3" className="fill-coral anno-dot opacity-0" />
                </svg>
             </div>
             
             {/* 03 PRECISION DRIVER */}
             <div ref={anno3Ref} className="relative opacity-0 flex flex-col items-center md:items-start z-10 w-max">
                <p className="text-xs md:text-sm font-black tracking-widest text-foreground flex items-center justify-center md:justify-start gap-3">
                  <span className="text-coral flex items-center justify-center w-5 h-5 rounded-full border border-coral/30 text-[9px]">03</span>
                  PRECISION DRIVER
                </p>
                <svg className="hidden md:block absolute top-1/2 right-[100%] mr-4 w-[18vw] h-[3vh] overflow-visible -z-10" viewBox="0 0 100 100" preserveAspectRatio="none">
                   <path d="M 0 100 L 80 0 L 100 0" pathLength="1" stroke="currentColor" vectorEffect="non-scaling-stroke" strokeWidth="1" fill="none" className="text-foreground/30 anno-line" />
                   <circle cx="0" cy="100" r="3" className="fill-coral anno-dot opacity-0" />
                </svg>
             </div>
             
             {/* 04 IMMERSIVE AUDIO */}
             <div ref={anno4Ref} className="relative opacity-0 flex flex-col items-center md:items-start z-10 w-max">
                <p className="text-xs md:text-sm font-black tracking-widest text-foreground flex items-center justify-center md:justify-start gap-3">
                  <span className="text-coral flex items-center justify-center w-5 h-5 rounded-full border border-coral/30 text-[9px]">04</span>
                  IMMERSIVE AUDIO
                </p>
                <svg className="hidden md:block absolute top-1/2 right-[100%] mr-4 w-[16vw] h-[6vh] overflow-visible -z-10" viewBox="0 0 100 100" preserveAspectRatio="none">
                   <path d="M 0 100 L 80 0 L 100 0" pathLength="1" stroke="currentColor" vectorEffect="non-scaling-stroke" strokeWidth="1" fill="none" className="text-foreground/30 anno-line" />
                   <circle cx="0" cy="100" r="3" className="fill-coral anno-dot opacity-0" />
                </svg>
             </div>
             
          </div>
        </div>
      </div>

      {/* SECTION 4: PRODUCT FEATURES SHOWCASE (Phase 7) */}
      <div ref={section4Ref} className="absolute inset-0 z-30 flex flex-col items-center justify-end pb-[1vh] lg:pb-[2vh] pointer-events-none overflow-hidden">
        
        {/* TOP: Blueprint Rings */}
        <div ref={soundWavesRef} className="absolute top-[2vh] left-1/2 -translate-x-1/2 flex items-center justify-center opacity-0 -z-10 w-[60vh] h-[60vh] max-w-[700px] max-h-[700px]">
          {/* Gradient mask to fade out the bottom of the technical lines so they don't compete with typography */}
          <div className="absolute bottom-0 left-0 w-full h-1/3 bg-gradient-to-t from-[var(--background)] to-transparent z-10 pointer-events-none" />
          <svg viewBox="0 0 100 100" className="w-full h-full stroke-foreground/15 stroke-[0.1]" fill="none">
             {/* Main concentric rings */}
             <circle cx="50" cy="50" r="45" strokeDasharray="1 2" />
             <circle cx="50" cy="50" r="35" />
             <circle cx="50" cy="50" r="25" strokeDasharray="2 4" />
             
             {/* Symmetrical Crosshairs */}
             <line x1="50" y1="0" x2="50" y2="100" strokeDasharray="2 4" />
             <line x1="0" y1="50" x2="100" y2="50" strokeDasharray="2 4" />
             
             {/* Technical markers exactly matching reference */}
             <circle cx="85" cy="50" r="2" className="stroke-coral/40" />
             <circle cx="15" cy="50" r="2" className="stroke-coral/40" />
             <circle cx="50" cy="15" r="2" className="stroke-coral/40" />
             <circle cx="50" cy="85" r="2" className="stroke-coral/40" />
             
             {/* Outer edge accents */}
             <path d="M 80 20 L 85 15 M 20 20 L 15 15 M 20 80 L 15 85 M 80 80 L 85 85" className="stroke-coral/40 stroke-[0.2]" />
             
             <circle cx="85" cy="15" r="0.5" className="fill-coral" />
             <circle cx="15" cy="15" r="0.5" className="fill-coral" />
             <circle cx="15" cy="85" r="0.5" className="fill-coral" />
             <circle cx="85" cy="85" r="0.5" className="fill-coral" />
          </svg>
        </div>

        {/* MIDDLE: Section Title & Description */}
        <div className="w-full flex flex-col items-center text-center px-6 mb-8 xl:mb-12">
          <p ref={soundTextLine1Ref} className="text-[10px] md:text-xs font-bold tracking-[0.3em] text-coral uppercase mb-4 opacity-0">
            SECTION 04
          </p>
          <h2 className="text-4xl md:text-5xl lg:text-[4.5vw] font-black leading-[0.9] tracking-tighter text-foreground flex flex-col items-center">
            <span ref={soundTextLine2Ref} className="opacity-0">ENGINEERED</span>
            <span ref={soundTextLine3Ref} className="opacity-0">
              <span className="text-coral">FOR</span> SOUND.
            </span>
          </h2>
          <p ref={feature1Ref} className="mt-6 xl:mt-8 text-muted max-w-lg font-medium tracking-wide opacity-0 text-xs md:text-sm">
            Every detail matters. Built for pure audio performance, all-day comfort, and a deeper connection to your sound.
          </p>
        </div>

        {/* BOTTOM: Four Horizontal Features */}
        <div className="w-full px-4 md:px-8 lg:px-16 grid grid-cols-1 md:grid-cols-4 gap-12 md:gap-0">
           
           {/* 01 ERGONOMIC FIT */}
           <div ref={feature2Ref} className="flex flex-col items-center text-center px-4 md:px-6 opacity-0">
              <div className="w-16 h-16 rounded-full border border-foreground/15 flex items-center justify-center mb-6 relative">
                 <div className="absolute top-1.5 right-1.5 w-1.5 h-1.5 rounded-full bg-coral" />
                 <svg viewBox="0 0 24 24" className="w-8 h-8 stroke-foreground stroke-[1.5]" fill="none">
                    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" strokeDasharray="1 2"/>
                    <circle cx="12" cy="10" r="3" />
                 </svg>
              </div>
              <p className="text-[10px] font-bold tracking-widest text-coral mb-2">01</p>
              <h3 className="text-xs lg:text-sm font-black tracking-widest text-foreground uppercase mb-3">ERGONOMIC FIT</h3>
              <p className="text-xs text-muted leading-relaxed">Designed for all-day comfort and stability.</p>
           </div>
           
           {/* 02 ACTIVE NOISE CONTROL */}
           <div ref={feature3Ref} className="flex flex-col items-center text-center px-4 md:px-6 md:border-l border-foreground/10 opacity-0">
              <div className="w-16 h-16 rounded-full border border-foreground/15 flex items-center justify-center mb-6 relative">
                 <div className="absolute top-1.5 right-1.5 w-1.5 h-1.5 rounded-full bg-coral" />
                 <svg viewBox="0 0 24 24" className="w-8 h-8 stroke-foreground stroke-[1.5]" fill="none">
                    <path d="M3 12h3l3-9 5 18 3-9h4" />
                 </svg>
              </div>
              <p className="text-[10px] font-bold tracking-widest text-coral mb-2">02</p>
              <h3 className="text-xs lg:text-sm font-black tracking-widest text-foreground uppercase mb-3">ACTIVE NOISE CONTROL</h3>
              <p className="text-xs text-muted leading-relaxed">Blocks distractions and keeps you in the zone.</p>
           </div>

           {/* 03 PRECISION DRIVER */}
           <div ref={feature4Ref} className="flex flex-col items-center text-center px-4 md:px-6 md:border-l border-foreground/10 opacity-0">
              <div className="w-16 h-16 rounded-full border border-foreground/15 flex items-center justify-center mb-6 relative">
                 <div className="absolute top-1.5 right-1.5 w-1.5 h-1.5 rounded-full bg-coral" />
                 <svg viewBox="0 0 24 24" className="w-8 h-8 stroke-foreground stroke-[1.5]" fill="none">
                    <circle cx="12" cy="12" r="8" />
                    <circle cx="12" cy="12" r="3" className="fill-foreground stroke-foreground" />
                    <circle cx="12" cy="12" r="1" className="fill-var(--background) stroke-var(--background)" />
                 </svg>
              </div>
              <p className="text-[10px] font-bold tracking-widest text-coral mb-2">03</p>
              <h3 className="text-xs lg:text-sm font-black tracking-widest text-foreground uppercase mb-3">PRECISION DRIVER</h3>
              <p className="text-xs text-muted leading-relaxed">Custom-tuned 40mm dynamic driver for powerful clarity.</p>
           </div>
           
           {/* 04 IMMERSIVE AUDIO */}
           <div ref={feature5Ref} className="flex flex-col items-center text-center px-4 md:px-6 md:border-l border-foreground/10 opacity-0">
              <div className="w-16 h-16 rounded-full border border-foreground/15 flex items-center justify-center mb-6 relative">
                 <div className="absolute top-1.5 right-1.5 w-1.5 h-1.5 rounded-full bg-coral" />
                 <svg viewBox="0 0 24 24" className="w-8 h-8 stroke-foreground stroke-[1.5]" fill="none">
                    <path d="M8 12a4 4 0 0 1 8 0 M5 12a7 7 0 0 1 14 0 M2 12a10 10 0 0 1 20 0" strokeLinecap="round" />
                 </svg>
              </div>
              <p className="text-[10px] font-bold tracking-widest text-coral mb-2">04</p>
              <h3 className="text-xs lg:text-sm font-black tracking-widest text-foreground uppercase mb-3">IMMERSIVE AUDIO</h3>
              <p className="text-xs text-muted leading-relaxed">Rich, detailed sound with a wide soundstage experience.</p>
           </div>

        </div>
      </div>
      
      {/* SECTION 5: PRODUCT CONFIGURATOR (Phase 8) */}
      <div ref={section5Ref} className="absolute inset-0 z-30 flex flex-col-reverse md:flex-row opacity-0 pointer-events-none overflow-hidden" style={{ '--accent': activeVariant.accentColor, '--accent-soft': activeVariant.accentSoft } as React.CSSProperties}>
        
        {/* LEFT: Configurator UI */}
        <div className="w-full md:w-1/2 h-auto min-h-[50vh] md:h-full flex items-start md:items-center justify-center md:justify-end md:pr-[5vw] xl:pr-[8vw] z-40 bg-gradient-to-b md:bg-gradient-to-r from-[var(--background)] via-[var(--background)] to-transparent overflow-y-auto pb-8 md:pb-0">
          <div ref={configContentRef} className="w-full max-w-sm px-6 opacity-0 flex flex-col pt-4 md:pt-0 pointer-events-auto">
            
            <p className="text-[10px] font-bold tracking-[0.3em] uppercase mb-4" style={{ color: 'var(--accent)' }}>SONA / 01</p>
            <h2 className="text-4xl md:text-5xl font-black leading-none tracking-tighter text-foreground mb-3">SONA ONE</h2>
            <p className="text-sm text-muted font-medium tracking-wide mb-6">Immersive wireless audio engineered for movement.</p>
            
            <p className="text-2xl md:text-3xl font-black tracking-tight text-foreground mb-8">₹24,999</p>

            {/* SIZE */}
            <div className="mb-6">
              <p className="text-[10px] font-bold tracking-widest text-foreground uppercase mb-3">SIZE</p>
              <div className="flex gap-3">
                {['S', 'M', 'L'].map(size => (
                  <button 
                    key={size}
                    onClick={() => setSelectedSize(size)}
                    className="w-12 h-10 border border-foreground/15 text-xs font-bold transition-all duration-300"
                    style={{ 
                      backgroundColor: selectedSize === size ? 'var(--accent)' : 'transparent',
                      borderColor: selectedSize === size ? 'var(--accent)' : '',
                      color: selectedSize === size ? '#FFF' : 'var(--foreground)'
                    }}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>

            {/* COLOR */}
            <div className="mb-6">
              <p className="text-[10px] font-bold tracking-widest text-foreground uppercase mb-3">COLOR <span className="text-muted ml-2">{activeVariant.name}</span></p>
              <div className="flex gap-4">
                {VARIANTS.map((variant, idx) => (
                  <button 
                    key={variant.id}
                    onClick={() => setSelectedVariant(idx)}
                    className="w-8 h-8 rounded-full flex items-center justify-center transition-all duration-300"
                    style={{ 
                      border: selectedVariant === idx ? `2px solid var(--accent)` : '2px solid transparent'
                    }}
                  >
                    <div 
                      className="w-6 h-6 rounded-full"
                      style={{ backgroundColor: variant.primary }}
                    />
                  </button>
                ))}
              </div>
            </div>

            {/* QUANTITY */}
            <div className="mb-10">
              <p className="text-[10px] font-bold tracking-widest text-foreground uppercase mb-3">QUANTITY</p>
              <div className="flex items-center gap-4 border border-foreground/15 w-max px-2 py-1">
                <button onClick={() => setQuantity(q => Math.max(1, q - 1))} className="w-8 h-8 flex items-center justify-center text-foreground hover:bg-foreground/5 transition-colors">
                  −
                </button>
                <span className="w-6 text-center text-sm font-bold">{quantity}</span>
                <button onClick={() => setQuantity(q => q + 1)} className="w-8 h-8 flex items-center justify-center text-foreground hover:bg-foreground/5 transition-colors">
                  +
                </button>
              </div>
            </div>

            {/* ACTIONS */}
            <div className="flex flex-col gap-3">
              <button 
                className="w-full py-4 text-xs font-black tracking-widest uppercase transition-all duration-300 transform hover:-translate-y-1 hover:shadow-xl"
                style={{ backgroundColor: 'var(--accent)', color: '#FFF', boxShadow: `0 10px 25px var(--accent-soft)` }}
              >
                Buy Now
              </button>
              <button 
                className="w-full py-4 border text-xs font-black tracking-widest uppercase text-foreground transition-all duration-300 transform hover:-translate-y-1 hover:bg-foreground hover:text-[var(--background)]"
                style={{ borderColor: 'var(--accent)' }}
              >
                Add To Cart
              </button>
            </div>
            
          </div>
        </div>

        {/* RIGHT: 3D Headphone Container */}
        <div className="w-full md:w-1/2 h-[50vh] md:h-full relative pointer-events-none">
          {/* Subtle radar graphic behind headphone */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[70%] h-[70%] max-w-[600px] max-h-[600px] -z-10 opacity-30">
            <svg viewBox="0 0 100 100" className="w-full h-full stroke-foreground/10 stroke-[0.1]" fill="none">
               <circle cx="50" cy="50" r="45" strokeDasharray="2 4" />
               <circle cx="50" cy="50" r="25" />
               <line x1="5" y1="50" x2="95" y2="50" />
               <line x1="50" y1="5" x2="50" y2="95" />
            </svg>
          </div>
        </div>
        
      </div>
      
    </main>

    {/* FINAL FOOTER */}
    <footer ref={footerRef} className="relative w-full bg-[var(--background)] pt-12 pb-8 overflow-hidden z-40 border-t border-foreground/10 flex flex-col items-center">
      
      {/* TOP ROW: STATEMENT + CTA */}
      <div className="relative w-full px-6 md:px-12 lg:px-24 flex flex-col md:flex-row items-start md:items-center justify-between pt-8 pb-12 gap-12 md:gap-0">
        
        {/* 1. TOP FOOTER STATEMENT */}
        <div ref={footerStatementRef} className="flex flex-col items-start justify-center opacity-0">
          <h2 className="text-6xl md:text-[8vw] font-black leading-none tracking-tighter text-foreground mb-1">SONA</h2>
          <p className="text-xs md:text-sm font-bold tracking-[0.4em] text-muted">SOUND. UNBOUND.</p>
        </div>

        {/* 3. PRODUCT CTA */}
        <div ref={footerCtaRef} className="flex flex-col items-start md:items-end text-left md:text-right opacity-0">
          <h3 className="text-2xl md:text-3xl font-black tracking-tighter text-foreground mb-2">READY TO HEAR DIFFERENT?</h3>
          <p className="text-xs md:text-sm text-muted font-medium tracking-wide mb-6">Experience sound engineered for movement.</p>
          <button className="group relative bg-foreground text-[var(--background)] px-8 py-4 text-xs font-black tracking-widest uppercase overflow-hidden hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1">
            <span className="relative z-10 flex items-center gap-3">
              EXPLORE SONA ONE 
              <span className="group-hover:translate-x-1 transition-transform duration-300">→</span>
            </span>
          </button>
        </div>

      </div>

      <div className="w-full px-6 md:px-12 lg:px-24">



        {/* 4. BOTTOM BRAND AREA */}
        <div ref={footerBottomRef} className="flex flex-col md:flex-row justify-between items-center py-8 opacity-0 gap-6 md:gap-0">
          <div className="flex flex-col items-center md:items-start text-center md:text-left gap-1">
            <p className="text-sm font-black tracking-widest text-foreground">SONA ONE</p>
            <p className="text-[10px] text-muted font-bold tracking-wider uppercase">Immersive wireless audio engineered for movement.</p>
            <p className="text-[10px] text-muted/60 font-bold tracking-wider uppercase mt-2">© 2026 SONA</p>
          </div>
          
          <div className="flex gap-6">
            <a href="#" className="text-[10px] font-bold tracking-widest text-foreground hover:text-coral transition-colors">PRIVACY</a>
            <a href="#" className="text-[10px] font-bold tracking-widest text-foreground hover:text-coral transition-colors">TERMS</a>
            <a href="#" className="text-[10px] font-bold tracking-widest text-foreground hover:text-coral transition-colors">CONTACT</a>
          </div>
          
          <div className="flex gap-6">
            <a href="#" className="text-[10px] font-bold tracking-widest text-foreground hover:text-coral transition-colors">INSTAGRAM</a>
            <a href="#" className="text-[10px] font-bold tracking-widest text-foreground hover:text-coral transition-colors">X</a>
            <a href="#" className="text-[10px] font-bold tracking-widest text-foreground hover:text-coral transition-colors">YOUTUBE</a>
          </div>
        </div>
      </div>

      {/* 5. HUGE FINAL WORDMARK */}
      <div className="w-full relative mt-12 overflow-hidden flex justify-center">
        <h1 
          ref={hugeWordmarkRef} 
          className="text-[25vw] leading-[0.75] font-black tracking-tighter text-foreground relative opacity-0"
        >
          SONA
          <div className="absolute bottom-[20%] right-[-2%] w-4 h-4 md:w-8 md:h-8 bg-coral rounded-full" />
        </h1>
        
        <button 
          onClick={scrollToTop}
          className="absolute bottom-8 right-8 text-[10px] font-black tracking-widest text-foreground uppercase hover:text-coral transition-colors flex items-center gap-2"
        >
          BACK TO TOP <span>↑</span>
        </button>
      </div>
      
    </footer>
    </>
  );
}
