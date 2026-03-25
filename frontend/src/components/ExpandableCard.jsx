'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function ExpandableCard({
  title,
  icon,
  iconColor,
  iconBg,
  borderHover = 'hover:border-primary/40',
  children,
  expandedContent,
  className = '',
  popular = false
}) {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6 }}
    >
      <div className={`bg-background-dark border border-slate-800 rounded-xl p-8 transition-all relative ${borderHover} ${popular ? 'bg-gradient-to-b from-primary/10 via-accent/5 to-transparent border-2 border-primary/50 shadow-2xl shadow-primary/20 scale-105' : ''} ${className}`}>
        <div className="relative z-10">
          <div className={`w-14 h-14 rounded-lg ${iconBg} border ${iconColor.replace('text', 'border')}/30 flex items-center justify-center mb-6 shadow-lg`}>
            <span className={`material-symbols-outlined text-2xl ${iconColor}`}>{icon}</span>
          </div>

          {title && (
            <h3 className="font-michroma text-lg text-white uppercase mb-4 leading-tight">
              {title}
            </h3>
          )}

          {children}

          {expandedContent && (
            <div className="mt-6">
              <button
                onClick={() => setIsExpanded(!isExpanded)}
                className="flex items-center gap-2 text-accent text-sm font-montserrat hover:underline focus:outline-none"
                aria-expanded={isExpanded}
              >
                <span>{isExpanded ? 'Ver menos' : 'Saber más'}</span>
                <motion.span
                  animate={{ rotate: isExpanded ? 180 : 0 }}
                  transition={{ duration: 0.3 }}
                  style={{ display: 'inline-flex' }}
                >
                  <span className="material-symbols-outlined">expand_more</span>
                </motion.span>
              </button>
            </div>
          )}
        </div>
      </div>

      <AnimatePresence>
        {isExpanded && expandedContent && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
            className="overflow-hidden"
          >
            <div className="pt-4 mt-4 border-t border-slate-800">
              {expandedContent}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
