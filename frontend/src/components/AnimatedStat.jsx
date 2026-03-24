'use client';

import { motion, useInView } from 'framer-motion';
import { useEffect, useState, useRef } from 'react';

export default function AnimatedStat({ value, label, suffix = '', icon, color = 'primary' }) {
  const [displayValue, setDisplayValue] = useState(0);
  const [showTooltip, setShowTooltip] = useState(false);
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.5 });

  // Parse numeric value from string (e.g., "95%" -> 95, "5+" -> 5)
  const numericValue = typeof value === 'string' ? parseInt(value.replace(/\D/g, '')) || 0 : value;

  // Format number with K/M suffix for large numbers
  const formatNumber = (num) => {
    if (num >= 1000000) {
      return (num / 1000000).toFixed(1).replace(/\.0$/, '') + 'M';
    }
    if (num >= 1000) {
      return (num / 1000).toFixed(1).replace(/\.0$/, '') + 'K';
    }
    return num.toLocaleString('es-ES');
  };

  // Get exact formatted value with suffix
  const getExactValue = () => {
    return formatNumber(numericValue) + suffix;
  };

  useEffect(() => {
    if (!isInView) return;

    // Animate number from 0 to numericValue
    let start = 0;
    const duration = 2000; // 2 seconds
    const startTime = performance.now();

    function update(currentTime) {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      // Easing function: easeOutQuart (suave al final)
      const easeOut = 1 - Math.pow(1 - progress, 4);
      const current = Math.floor(start + (numericValue - start) * easeOut);
      setDisplayValue(current);

      if (progress < 1) {
        requestAnimationFrame(update);
      } else {
        setDisplayValue(numericValue);
      }
    }

    requestAnimationFrame(update);
  }, [isInView, numericValue]);

  // Determine color class based on prop
  const colorClasses = {
    primary: 'text-primary shadow-glow-primary',
    accent: 'text-accent shadow-glow-accent',
    success: 'text-[#22C55E]',
    warning: 'text-[#f59e0b]',
  };

  const borderColorClasses = {
    primary: 'border-primary/30',
    accent: 'border-accent/30',
    success: 'border-[#22C55E]/30',
    warning: 'border-[#f59e0b]/30',
  };

  const gradientClasses = {
    primary: 'from-primary to-accent',
    accent: 'from-accent to-primary',
    success: 'from-[#22C55E] to-primary',
    warning: 'from-[#f59e0b] to-accent',
  };

  return (
    <motion.div
      ref={ref}
      initial="hidden"
      animate={isInView ? 'visible' : 'hidden'}
      variants={{
        hidden: { opacity: 0, y: 30 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: 'easeOut' } }
      }}
      className="relative flex items-center gap-8 w-full md:w-auto group cursor-pointer"
      onMouseEnter={() => setShowTooltip(true)}
      onMouseLeave={() => setShowTooltip(false)}
    >
      {/* Divider line with gradient */}
      {label !== 'Procesos Optimizados' && (
        <div className="hidden md:block relative">
          <div className="w-px h-12 bg-gradient-to-b from-primary to-accent" />
        </div>
      )}

      {/* Content */}
      <div className="flex-1 text-center md:text-left relative">
        {/* Tooltip con valor exacto */}
        {showTooltip && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="absolute left-1/2 -translate-x-1/2 -top-16 z-20 px-4 py-3 bg-navy-darker border border-slate-700 rounded-xl shadow-2xl whitespace-nowrap"
          >
            <p className={`text-2xl font-michroma bg-clip-text text-transparent bg-gradient-to-r ${gradientClasses[color]}`}>
              {getExactValue()}
            </p>
            <div className="absolute top-full left-1/2 -translate-x-1/2 -mt-1">
              <div className="w-0 h-0 border-l-4 border-r-4 border-t-4 border-l-transparent border-r-transparent border-t-navy-darker" />
            </div>
          </motion.div>
        )}

        {/* Icon */}
        {icon && (
          <div className="mb-2 flex items-center justify-center md:justify-start">
            <span className={`material-symbols-outlined text-2xl ${colorClasses[color] || 'text-primary'}`}>{icon}</span>
          </div>
        )}

        {/* Label */}
        <p className="text-slate-500 text-xs font-bold uppercase tracking-[0.2em] mb-2">{label}</p>

        {/* Value con gradiente y borde */}
        <div className={`relative inline-block px-4 py-2 rounded-lg border-2 ${borderColorClasses[color] || borderColorClasses.primary} bg-navy-darker/50`}>
          <motion.p
            className={`text-3xl font-michroma bg-clip-text text-transparent bg-gradient-to-r ${gradientClasses[color]}`}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            {formatNumber(displayValue)}
            {suffix}
          </motion.p>
        </div>

        {/* Línea de progreso animada */}
        <motion.div
          className="absolute -bottom-3 left-0 h-0.5 bg-gradient-to-r from-primary to-accent"
          initial={{ width: 0 }}
          animate={{ width: '100%' }}
          transition={{ duration: 1, delay: 0.5 }}
        />
      </div>
    </motion.div>
  );
}