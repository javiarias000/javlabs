import { useEffect, useRef, useState } from 'react';
import { useSpring, motion } from 'framer-motion';

const AnimatedNumber = ({ value, suffix = '', duration = 2, delay = 0 }) => {
  const [isInView, setIsInView] = useState(false);
  const ref = useRef(null);

  const targetValue = typeof value === 'number' ? value : parseInt(value.replace(/\D/g, '')) || 0;

  const spring = useSpring({
    from: 0,
    to: isInView ? targetValue : 0,
    stiffness: 100,
    damping: 20,
    mass: 1,
    duration: isInView ? duration : 0,
    delay: delay,
  });

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true);
        }
      },
      { threshold: 0.5 }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <motion.span ref={ref} className="font-michroma text-3xl md:text-4xl text-white">
      {Math.round(spring.value).toLocaleString()}
      {suffix}
    </motion.span>
  );
};

export default AnimatedNumber;
