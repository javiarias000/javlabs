import { useState, useEffect, useRef } from 'react';
import { useSpring } from 'framer-motion';

export default function useCounterAnimation(targetValue, options = {}) {
  const { duration = 2, from = 0 } = options;
  const [isInView, setIsInView] = useState(false);
  const ref = useRef(null);

  const spring = useSpring(isInView ? targetValue : from, {
    mass: 1,
    damping: 20,
    stiffness: 100,
    duration: isInView ? duration : 0,
  });

  return { spring, ref, setIsInView };
}
