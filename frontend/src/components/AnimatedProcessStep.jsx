'use client';

import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';

export default function AnimatedProcessStep({ number, title, description, isLast = false, icon, isActive }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.5 });

  // Variantes de animación
  const containerVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.8, ease: 'easeOut' }
    }
  };

  const numberVariants = {
    hidden: { scale: 0, opacity: 0 },
    visible: {
      scale: 1,
      opacity: 1,
      transition: { duration: 0.6, delay: 0.3, type: 'spring', stiffness: 200 }
    }
  };

  const contentVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, delay: 0.5 }
    }
  };

  // Determinar color basado en número
  const isEven = parseInt(number) % 2 === 0;
  const stepColorClass = isEven ? 'text-accent' : 'text-primary';
  const borderColorClass = isEven ? 'border-accent' : 'border-primary';
  const glowColor = isEven ? 'rgba(139,92,246,0.5)' : 'rgba(13,127,242,0.5)';

  // Color del borde de carga
  const strokeColor = isEven ? '#8b5cf6' : '#0d7ff2';

  return (
    <motion.div
      ref={ref}
      initial="hidden"
      animate={isInView ? 'visible' : 'hidden'}
      variants={containerVariants}
      className="relative z-10 flex flex-col items-center md:items-start text-center md:text-left w-full md:w-1/3"
    >
      {/* Círculo con glow de fondo */}
      <div className="relative mb-8 md:mb-12">
        {/* Glow animado */}
        <motion.div
          className="absolute inset-0 rounded-full blur-xl"
          style={{ backgroundColor: glowColor }}
          animate={isInView ? { opacity: [0.4, 0.7, 0.4] } : { opacity: 0.4 }}
          transition={{ duration: 3, repeat: Infinity }}
        />

        {/* Círculo principal con borde que se "carga" circularmente */}
        <div className="relative size-16 md:size-20">
          {/* SVG para el borde animado de carga */}
          <svg className="absolute inset-0 size-full" viewBox="0 0 60 60">
            {/* Fondo del borde */}
            <circle
              cx="30"
              cy="30"
              r="28"
              fill="none"
              stroke={`${strokeColor}20`}
              strokeWidth="2"
            />
            {/* Borde que se llena circularmente */}
            <motion.circle
              cx="30"
              cy="30"
              r="28"
              fill="none"
              stroke={strokeColor}
              strokeWidth="2"
              strokeLinecap="round"
              strokeDasharray="176"
              initial={{ strokeDashoffset: 176 }}
              animate={{ strokeDashoffset: isActive ? 0 : 176 }}
              transition={{
                duration: isActive ? 2 : 0,
                ease: 'easeInOut'
              }}
            />
          </svg>

          {/* Contenido del círculo */}
          <motion.div
            variants={numberVariants}
            className={`absolute inset-0 rounded-full bg-navy-darker flex items-center justify-center`}
            style={{ boxShadow: `0 0 25px ${glowColor}` }}
          >
            {icon ? (
              <span className={`material-symbols-outlined text-2xl md:text-3xl ${stepColorClass}`}>{icon}</span>
            ) : (
              <span className={`font-michroma text-xl md:text-2xl ${stepColorClass}`}>{number}</span>
            )}
          </motion.div>
        </div>
      </div>

      {/* Contenido */}
      <motion.div
        variants={contentVariants}
        className="flex flex-col items-center md:items-start"
      >
        <h4 className="font-michroma text-lg md:text-xl text-white mb-3 uppercase leading-tight">{title}</h4>
        <p className="font-montserrat text-slate-400 text-sm leading-relaxed max-w-xs">
          {description}
        </p>
      </motion.div>
    </motion.div>
  );
}
