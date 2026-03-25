'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import AnimatedProcessStep from './AnimatedProcessStep';

const CONFIG = {
  LINE_TRAVEL: 2000,
  STEP_HOLD: 1500,
  CYCLE_PAUSE: 2000,
};

// Línea conectora simple con partícula que viaja en línea recta
function ConnectingLine({ fromIndex, toIndex, isActive, color, stepPositions }) {
  const startX = stepPositions[fromIndex];
  const endX = stepPositions[toIndex];
  const lineWidth = endX - startX;

  // Posición exacta del centro vertical de los círculos (ajustar según el diseño)
  // Los círculos tienen size-20 = 80px, el contenedor tiene top-10 = 2.5rem = 40px
  const topOffset = '2.5rem'; // same as top-10 (40px)

  return (
    <>
      {/* Línea base */}
      <div
        className="absolute z-0 hidden md:block"
        style={{
          left: `${startX}%`,
          top: topOffset,
          width: `${lineWidth}%`,
          height: '2px',
          background: `linear-gradient(90deg, ${color}20, ${color}30)`,
          transformOrigin: 'left center',
          borderRadius: '1px'
        }}
      />

      {/* Línea animada */}
      <motion.div
        className="absolute z-10 hidden md:block"
        initial={{ width: '0%', opacity: 0 }}
        animate={{
          width: isActive ? `${lineWidth}%` : '0%',
          opacity: isActive ? 1 : 0
        }}
        transition={{
          duration: CONFIG.LINE_TRAVEL,
          ease: 'linear'
        }}
        style={{
          left: `${startX}%`,
          top: topOffset,
          height: '2px',
          background: `linear-gradient(90deg, ${color}, ${color}dd)`,
          boxShadow: `0 0 10px ${color}, 0 0 20px ${color}`,
          transformOrigin: 'left center',
          borderRadius: '1px'
        }}
      />

      {/* Partícula que viaja sobre la línea */}
      {isActive && (
        <motion.div
          className="absolute z-20 hidden md:block"
          style={{
            top: topOffset,
            width: '12px',
            height: '12px',
            borderRadius: '50%',
            background: color,
            boxShadow: `
              0 0 10px ${color},
              0 0 20px ${color},
              0 0 30px ${color}
            `
          }}
          animate={{
            left: [`${startX}%`, `${endX}%`],
            scale: [0.8, 1.2, 0.8],
            opacity: [0, 1, 1, 0]
          }}
          transition={{
            duration: CONFIG.LINE_TRAVEL,
            ease: 'linear',
            times: [0, 0.1, 0.9, 1]
          }}
        />
      )}
    </>
  );
}

export default function ProcessAnimation({ customSteps }) {
  const [activeStep, setActiveStep] = useState(0);
  const [connectingLines, setConnectingLines] = useState([]);

  const defaultSteps = [
    {
      number: '01',
      title: 'DIAGNÓSTICO',
      description: 'Te escuchamos. Identificamos qué procesos consumen tu tiempo y qué quieres lograr. Te damos un plan claro en 1 semana.',
      icon: 'search',
      color: '#0d7ff2'
    },
    {
      number: '02',
      title: 'CONSTRUCCIÓN',
      description: 'Nuestro equipo crea y despliega TODO. Tú NO tocas código. En 2-4 semanas tienes el sistema funcionando.',
      icon: 'construction',
      color: '#8b5cf6'
    },
    {
      number: '03',
      title: 'CRECIMIENTO',
      description: 'No te dejamos solo. Monitoreo 24/7, mejoras mensuales sin costo extra, y soporte cuando lo necesites. Para siempre.',
      icon: 'trending_up',
      color: '#0d7ff2'
    }
  ];

  const steps = customSteps || defaultSteps;
  const totalSteps = steps.length;
  const numLines = totalSteps - 1;

  // Posiciones de los centros de cada paso
  const stepPositions = Array.from({ length: totalSteps }, (_, i) => {
    if (totalSteps === 1) return 50;
    const minPos = 16.67;
    const maxPos = 83.33;
    return minPos + ((maxPos - minPos) / (totalSteps - 1)) * i;
  });

  useEffect(() => {
    setConnectingLines(new Array(numLines).fill(false));
  }, [numLines]);

  useEffect(() => {
    let isMounted = true;
    let timers = [];

    const clearAllTimers = () => {
      timers.forEach(t => clearTimeout(t));
      timers = [];
    };

    const runCycle = () => {
      if (!isMounted) return;

      // Reset
      setActiveStep(0);
      setConnectingLines(new Array(numLines).fill(false));

      let currentTime = 1000;

      for (let i = 0; i < totalSteps; i++) {
        // Activar paso
        timers.push(setTimeout(() => {
          if (isMounted) setActiveStep(i + 1);
        }, currentTime));

        // Activar línea
        if (i < numLines) {
          const lineTime = currentTime + 1000;
          timers.push(setTimeout(() => {
            if (isMounted) {
              setConnectingLines(prev => {
                const newLines = [...prev];
                newLines[i] = true;
                return newLines;
              });
            }
          }, lineTime));

          // Desactivar línea
          const deactivateTime = lineTime + CONFIG.LINE_TRAVEL + CONFIG.STEP_HOLD;
          timers.push(setTimeout(() => {
            if (isMounted) {
              setConnectingLines(prev => {
                const newLines = [...prev];
                newLines[i] = false;
                return newLines;
              });
            }
          }, deactivateTime));
        }

        currentTime += 1500 + CONFIG.LINE_TRAVEL + CONFIG.STEP_HOLD;
      }

      // Reiniciar ciclo
      timers.push(setTimeout(() => {
        if (isMounted) {
          clearAllTimers();
          runCycle();
        }
      }, currentTime + CONFIG.CYCLE_PAUSE));
    };

    runCycle();

    return () => {
      isMounted = false;
      clearAllTimers();
    };
  }, [totalSteps, numLines]);

  return (
    <div className="relative flex flex-col md:flex-row justify-between items-start gap-12 md:gap-8">
      {/* Líneas */}
      {steps.slice(0, -1).map((step, idx) => (
        <ConnectingLine
          key={idx}
          fromIndex={idx}
          toIndex={idx + 1}
          isActive={connectingLines[idx]}
          color={step.color}
          stepPositions={stepPositions}
        />
      ))}

      {/* Pasos */}
      {steps.map((step, idx) => (
        <AnimatedProcessStep
          key={idx}
          number={step.number || `${String(idx + 1).padStart(2, '0')}`}
          title={step.title}
          description={step.description}
          icon={step.icon}
          isLast={idx === steps.length - 1}
          isActive={activeStep >= idx + 1}
        />
      ))}
    </div>
  );
}
