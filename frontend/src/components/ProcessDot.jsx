'use client';

import { motion } from 'framer-motion';

export default function ProcessDot({ stepIndex, totalSteps, isActive }) {
  // Cada step tiene diferentes posiciones en la línea (0%, 50%, 100% para 3 pasos)
  const positions = [16, 50, 84]; // Percentajes ajustados para 3 pasos

  const circlePhaseDuration = 2; // 2 segundos circulando en cada paso
  const travelDuration = 1; // 1 segundo viajando entre pasos

  return (
    <motion.div
      className="absolute z-30"
      style={{
        width: '12px',
        height: '12px',
        borderRadius: '50%',
        background: 'radial-gradient(circle, #0d7ff2 0%, #8b5cf6 100%)',
        boxShadow: '0 0 16px rgba(13, 127, 242, 0.8), 0 0 32px rgba(139, 92, 246, 0.6)',
      }}
      animate={
        isActive
          ? {
              left: ['0%', '100%'],
              top: [
                '2rem', // Empieza en el centro del primer círculo
                '2rem',
                '2rem', // 2s circulando
                '2rem', // Comienza a viajar
                '2rem', // Viaja
                '2rem', // Llega al segundo
                '2rem', // 2s circulando
                '2rem',
                '2rem',
              ]
            }
          : {}
      }
      transition={
        isActive
          ? {
              left: {
                duration: totalSteps * (circlePhaseDuration + travelDuration),
                repeat: Infinity,
                ease: 'linear',
                times: [0, 0.35, 0.35, 0.4, 0.6, 0.65, 0.65, 0.7, 1]
              },
              rotate: {
                duration: 1.5,
                repeat: Infinity,
                ease: 'linear'
              }
            }
          : {}
      }
    />
  );
}
