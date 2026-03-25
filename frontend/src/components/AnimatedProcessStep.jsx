'use client';

import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';

export default function AnimatedProcessStep({ number, title, description, isLast = false, icon, isActive }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.5 });

  // Determinar color basado en número
  const isEven = parseInt(number) % 2 === 0;
  const stepColorClass = isEven ? 'text-accent' : 'text-primary';
  const borderColorClass = isEven ? 'border-accent' : 'border-primary';
  const glowColor = isEven ? 'rgba(139,92,246,0.6)' : 'rgba(13,127,242,0.6)';

  // Color del borde de carga
  const strokeColor = isEven ? '#8b5cf6' : '#0d7ff2';

  // Variantes de animación
  const containerVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: 'easeOut' }
    }
  };

  const numberVariants = {
    hidden: { scale: 0, opacity: 0 },
    visible: {
      scale: 1,
      opacity: 1,
      transition: { duration: 0.5, delay: 0.2, type: 'spring', stiffness: 300 }
    }
  };

  const contentVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5, delay: 0.4 }
    }
  };

  return (
    <motion.div
      ref={ref}
      initial="hidden"
      animate={isInView ? 'visible' : 'hidden'}
      variants={containerVariants}
      className="relative z-10 flex flex-col items-center md:items-center text-center md:text-left w-full md:w-1/3"
    >
      {/* Círculo con glow y borde animado */}
      <div className="relative mb-6 md:mb-8">
        {/* Glow de fondo */}
        <motion.div
          className="absolute inset-0 rounded-full blur-xl -z-10"
          style={{ backgroundColor: glowColor }}
          animate={isActive ? { opacity: [0.5, 0.8, 0.5] } : { opacity: 0.4 }}
          transition={{ duration: 2, repeat: Infinity }}
        />

        {/* Círculo principal */}
        <div className="relative size-16 md:size-20 lg:size-24">
          {/* SVG para el borde animado de carga */}
          <svg className="absolute inset-0 size-full" viewBox="0 0 60 60">
            {/* Fondo del borde */}
            <circle
              cx="30"
              cy="30"
              r="28"
              fill="none"
              stroke={`${strokeColor}30`}
              strokeWidth="2"
            />
            {/* Borde que se llena circularmente */}
            <motion.circle
              cx="30"
              cy="30"
              r="28"
              fill="none"
              stroke={strokeColor}
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeDasharray="176"
              initial={{ strokeDashoffset: 176 }}
              animate={{ strokeDashoffset: isActive ? 44 : 176 }}
              transition={{
                duration: isActive ? 1.5 : 0,
                ease: 'easeInOut',
                repeat: isActive ? Infinity : 0,
                repeatDelay: 2
              }}
            />
          </svg>

          {/* Contenido del círculo */}
          <motion.div
            variants={numberVariants}
            className={`absolute inset-0 rounded-full bg-navy-darker flex items-center justify-center border-2`}
            style={{
              borderColor: `${strokeColor}60`,
              boxShadow: `0 0 30px ${glowColor}, inset 0 0 20px ${strokeColor}10`
            }}
          >
            {icon ? (
              <span className={`material-symbols-outlined text-2xl md:text-3xl lg:text-4xl ${stepColorClass}`}>{icon}</span>
            ) : (
              <span className={`font-michroma text-xl md:text-2xl ${stepColorClass}`}>{number}</span>
            )}
          </motion.div>
        </div>
      </div>

      {/* Contenido */}
      <motion.div
        variants={contentVariants}
        className="flex flex-col items-center text-center"
      >
        <h4 className="font-michroma text-lg md:text-xl text-white mb-3 uppercase leading-tight">{title}</h4>
        <p className="font-montserrat text-slate-400 text-sm leading-relaxed max-w-xs">
          {description}
        </p>
      </motion.div>
    </motion.div>
  );
}
