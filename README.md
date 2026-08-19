# SONA ONE - Premium Headphone Experience

A highly interactive, 3D-driven web experience built to showcase the fictional SONA ONE premium wireless headphones. This project focuses on cinematic product storytelling, fluid scroll animations, and minimalist architectural design.

![Hero Section](/docs/hero.png)

## Core Features

- **Scroll-Driven 3D Exploration:** Built with React Three Fiber and GSAP, the 3D headphone model acts as the continuous central element. As the user scrolls, the camera, lighting, and model rotation smoothly transition between narrative phases.
- **Cinematic Storytelling:** Instead of disjointed sections, the experience flows continuously from a technical blueprint intro, through product reveals, into an immersive sound field, and concludes with an interactive configurator.
- **Premium Minimalist Design:** Employs a restrained color palette, high-fidelity typography, technical polar grids, and extremely subtle hover interactions to evoke the feeling of high-end hardware engineering.
- **Intelligent Navigation:** A custom smooth-scroll navigation system that bridges DOM clicks with the GSAP ScrollTrigger timeline, ensuring that jumping between sections never breaks the 3D animation states.
- **Responsive Architecture:** Distinct mobile and desktop layouts ensure the 3D canvas and typography remain perfectly balanced across all viewports.

![Product Features](/docs/features.png)

## Technology Stack

- **Framework:** Next.js 16 (App Router) & React 19
- **3D Rendering:** Three.js, React Three Fiber, React Three Drei
- **Animation Orchestration:** GSAP (GreenSock) & ScrollTrigger
- **Styling:** Tailwind CSS v4
- **Language:** TypeScript

![Interactive Configurator](/docs/configurator.png)

## Architecture Details

The application is built around a unified scroll architecture. Rather than triggering localized animations based on intersection observers, the entire page is pinned, and a single master GSAP timeline maps the user's scroll progress (from 0.0 to 5.4) to specific states in both the DOM and the 3D canvas.

This centralized state is broadcasted via a lightweight Zustand-style store (`scrollStore.ts`), allowing independent components like the `Navbar` and the `ProductScene` to react to scroll progress in perfect synchronization.

## Getting Started

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Run the development server:**
   ```bash
   npm run dev
   ```

3. **Open the application:**
   Navigate to `http://localhost:3000` in your browser.

## Design Philosophy

The visual direction was heavily inspired by industrial design blueprints and premium audio hardware. 
- Avoidance of conventional SaaS aesthetics (no heavy shadows, large gradients, or excessive glassmorphism).
- Use of functional UI elements (e.g., crosshairs, data nodes, thin technical borders).
- Interactions prioritize exploration over immediate conversion, exemplified by the subtle "EXPLORE SONA" primary CTA.
