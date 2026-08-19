# SONA ONE — DECISIONS

## 1. Why did I choose this approach?

### 1.1 Interactive 3D instead of a normal product page

I wanted the headphone to actually be part of the experience and not just another image placed in the hero section. So I used the actual 3D headphone model with React Three Fiber and connected its movement with the scroll.

The main reason for this was that I wanted the user to feel like they are exploring the product while scrolling. The headphone changes its position, rotation and scale depending on the section, instead of the user just scrolling through normal text and cards.

The obvious alternative would have been using product images or a video, but I felt that would make SONA look more like a normal ecommerce landing page.

### 1.2 Scroll-driven storytelling

I decided to make scroll the main interaction of the website. Instead of having every section behave independently, the headphone acts like a continuous visual element throughout the experience.

This allowed me to build different moments around the same product. I liked this approach because the animation actually has a reason behind it. It is not just animation for decoration, the movement is connected to the user's progress through the product story.

### 1.3 Separate mobile experience

I didn't want to simply scale down the desktop design to 390px. Some of the desktop layouts, specially the 3D compositions and feature graphics, were not working properly when reduced to a small screen.

So I created mobile-specific layouts and adjusted the 3D positioning and content depending on the viewport. The visual language is still the same, but the composition is different where needed. I felt this was a better choice than trying to fit everything from desktop into one small screen and making the mobile version feel crowded.

---

## 2. What was one trade-off you made under the time limit?

### 2.1 Visual complexity vs performance

The biggest trade-off was between making the experience more cinematic and keeping it lightweight enough for mobile. There were many effects I could have added to the 3D scene, but I avoided going too far with particles, post-processing and other expensive effects.

I wanted the headphone itself to remain the main focus instead of having too many effects competing with it.

If I had more time, I would do more detailed GPU and performance profiling on different mobile devices and optimize the GLTF, materials and rendering pipeline further.

## 3. Where did I use AI and what did I personally verify/change?

### 3.1 Using AI for implementation and debugging

I used AI during development for things like component structure, debugging and figuring out different ways to handle the Three.js and scroll interactions.

It helped me move faster, specially when I was working with React Three Fiber, GSAP and responsive behaviour together.

### 3.2 I rejected and changed AI-generated ideas

One example was the final section. The initial idea was to move the camera physically into the headphone earcup and transition into an internal sound environment.

After implementing/testing the idea, I didn't like how it looked. The headphone clipping and camera movement made the ending feel less controlled, so I changed the concept instead of keeping it just because the implementation was already there.

I eventually went with a much simpler ending where the headphone is centered, the message appears, the headphone gradually scales/moves out of the frame and the final message remains before the footer.

### 3.3 Final verification was done by me

A lot of the mobile work was also iterative. I tested the page at the actual 390px size, looked at where the headphone was positioned, checked text overlaps and changed the layouts when they didn't feel right.

The same process was used for the navbar, product card and section transitions. If an AI suggestion looked technically correct but didn't feel right visually, I changed or rejected it.

So for me AI was mainly a brainstorming tool. I still made the final design decisions and verified the result by actually running and testing the website.