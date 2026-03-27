import { useEffect, useRef, useState, lazy, Suspense } from 'react';

/**
 * Lazy load component when it enters viewport
 * @param {React.ComponentType} component - Component to lazy load
 * @param {Object} options - { threshold: 0-1, rootMargin: string, placeholder: JSX }
 */
export default function LazyOnScroll({ component: Component, children, threshold = 0.1, rootMargin = '0px', placeholder }) {
  const ref = useRef(null);
  const [isVisible, setIsVisible] = useState(false);
  const [hasLoaded, setHasLoaded] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasLoaded) {
          setIsVisible(true);
          // Once loaded, we can disconnect if we want to avoid re-triggering
          // But we keep observing for reset scenarios? Disconnect for simplicity
          observer.disconnect();
        }
      },
      { threshold, rootMargin }
    );

    const currentRef = ref.current;
    if (currentRef) {
      observer.observe(currentRef);
    }

    return () => {
      if (currentRef) {
        observer.unobserve(currentRef);
      }
    };
  }, [hasLoaded]);

  const WrappedComponent = lazy(Component);

  return (
    <div ref={ref} style={{ minHeight: placeholder ? undefined : '1px' }}>
      {isVisible ? (
        <Suspense fallback={placeholder || <div style={{ minHeight: '200px' }} />}>
          <WrappedComponent>{children}</WrappedComponent>
        </Suspense>
      ) : placeholder ? (
        placeholder
      ) : null}
    </div>
  );
}

/**
 * useIntersectionObserver hook for custom implementations
 */
export function useIntersectionObserver(options = {}) {
  const ref = useRef(null);
  const [isIntersecting, setIsIntersecting] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      setIsIntersecting(entry.isIntersecting);
    }, options);

    const current = ref.current;
    if (current) observer.observe(current);

    return () => {
      if (current) observer.unobserve(current);
    };
  }, []);

  return [ref, isIntersecting];
}
