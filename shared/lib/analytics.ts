declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
  }
}

export const trackEvent = (eventName: string, params?: Record<string, string>) => {
  if (typeof window === 'undefined' || !window.gtag) {
    return;
  }
  window.gtag('event', eventName, params);
};
