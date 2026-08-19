type Listener = (progress: number) => void;
const listeners = new Set<Listener>();
let currentProgress = 0;

export const setScrollProgress = (p: number) => {
  currentProgress = p;
  listeners.forEach((l) => l(p));
};

export const getScrollProgress = () => currentProgress;

export const subscribeScroll = (listener: Listener) => {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
};

export type Section = 'top' | 'technology' | 'sound' | 'product' | 'about' | 'next';
let scrollToSectionCallback: ((section: Section) => void) | null = null;

export const registerScrollToSection = (callback: (section: Section) => void) => {
  scrollToSectionCallback = callback;
};

export const scrollToSection = (section: Section) => {
  if (scrollToSectionCallback) scrollToSectionCallback(section);
};
