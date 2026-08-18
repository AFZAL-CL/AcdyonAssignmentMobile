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
