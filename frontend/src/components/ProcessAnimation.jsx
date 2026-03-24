'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import AnimatedProcessStep from './AnimatedProcessStep';

export default function ProcessAnimation() {
  const [activeStep, setActiveStep] = useState(0);
  const [connectingLines, setConnectingLines] = useState([false, false]);

  useEffect(() => {
    const cycleDuration = 8000;
    let isMounted = true;
    let timers = [];

    const clearAllTimers = () => {
      timers.forEach(t => clearTimeout(t));
      timers = [];
    };

    const runCycle = () => {
      if (!isMounted) return;

      setActiveStep(0);
      setConnectingLines([false, false]);

      timers.push(setTimeout(() => {
        if (isMounted) setActiveStep(1);
      }, 0));

      timers.push(setTimeout(() => {
        if (isMounted) setConnectingLines([true, false]);
      }, 2000));

      timers.push(setTimeout(() => {
        if (isMounted) setActiveStep(2);
      }, 3000));

      timers.push(setTimeout(() => {
        if (isMounted) setConnectingLines([true, true]);
      }, 5000));

      timers.push(setTimeout(() => {
        if (isMounted) setActiveStep(3);
      }, 6000));

      timers.push(setTimeout(() => {
        if (isMounted) {
          clearAllTimers();
          runCycle();
        }
      }, cycleDuration));
    };

    runCycle();

    return () => {
      isMounted = false;
      clearAllTimers();
    };
  }, []);

  const stepPositions = [16.67, 50, 83.33];
  const lineWidth = 33.33;

  return (
    <div className="relative flex flex-col md:flex-row justify-between items-start gap-12 md:gap-8">
      <div className="hidden md:block absolute top-10 left-0 w-full h-0.5 bg-gradient-to-r from-primary/20 via-accent/20 to-primary/20 z-0" />

      {connectingLines.map((active, idx) => (
        <motion.div
          key={idx}
          className="hidden md:block absolute top-10 z-10"
          initial={{ width: '0%', opacity: 0 }}
          animate={
            active
              ? {
                  width: `${lineWidth}%`,
                  opacity: [0, 1, 1]
                }
              : { width: '0%', opacity: 0 }
          }
          transition={{
            duration: 1,
            ease: 'easeInOut'
          }}
          style={{
            left: `${stepPositions[idx]}%`,
            height: '2px',
            background: `linear-gradient(90deg, ${idx === 0 ? '#0d7ff2' : '#8b5cf6'} 0%, ${idx === 0 ? '#8b5cf6' : '#8b5cf6'} 100%)`,
            boxShadow: `0 0 8px ${idx === 0 ? 'rgba(13,127,242,0.8)' : 'rgba(139,92,246,0.8)'}`,
            transformOrigin: 'left center'
          }}
        />
      ))}

      <AnimatedProcessStep
        number="01"
        title="DIAGNÓSTICO"
        description="Te escuchamos. Identificamos qué procesos consumen tu tiempo y qué quieres lograr. Te damos un plan claro en 1 semana."
        icon="search"
        isActive={activeStep >= 1}
      />
      <AnimatedProcessStep
        number="02"
        title="CONSTRUCCIÓN"
        description="Nuestro equipo crea y despliega TODO. Tú NO tocas código. En 2-4 semanas tienes el sistema funcionando."
        icon="construction"
        isActive={activeStep >= 2}
      />
      <AnimatedProcessStep
        number="03"
        title="CRECIMIENTO"
        description="No te dejamos solo. Monitoreo 24/7, mejoras mensuales sin costo extra, y soporte cuando lo necesites. Para siempre."
        icon="trending_up"
        isLast={true}
        isActive={activeStep >= 3}
      />
    </div>
  );
}
