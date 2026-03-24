'use client';

import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';

export default function FloatingContactButton() {
  const [isHovered, setIsHovered] = useState(false);
  const [isMobileExpanded, setIsMobileExpanded] = useState(false);

  return (
    <>
      {/* Desktop version with tooltip */}
      <motion.div
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 1, duration: 0.5, type: 'spring' }}
        className="fixed bottom-6 right-6 z-50 hidden md:block"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <Link
          to="/contacto"
          className="relative flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br from-primary to-accent shadow-glow-primary hover:shadow-glow-accent transition-all duration-300 group"
          aria-label="Contactar con nosotros"
        >
          {/* Pulse animation ring */}
          <motion.div
            className="absolute inset-0 rounded-full border-2 border-primary"
            animate={isHovered ? { scale: [1, 1.3, 1], opacity: [0.7, 0, 0.7] } : { scale: 1, opacity: 0 }}
            transition={{ duration: 2, repeat: Infinity }}
          />

          {/* Main icon */}
          <motion.span
            className="material-symbols-outlined text-white text-3xl relative z-10"
            animate={isHovered ? { scale: 1.1 } : { scale: 1 }}
            transition={{ duration: 0.3 }}
          >
            chat_bubble
          </motion.span>

          {/* Tooltip */}
          <AnimatePresence>
            {isHovered && (
              <motion.div
                initial={{ opacity: 0, x: 10, scale: 0.9 }}
                animate={{ opacity: 1, x: 0, scale: 1 }}
                exit={{ opacity: 0, x: 10, scale: 0.9 }}
                className="absolute bottom-full right-0 mb-3 px-4 py-2 bg-navy-darker border border-slate-700 rounded-lg shadow-2xl whitespace-nowrap"
              >
                <p className="text-white font-bold text-sm font-montserrat">¡Hablemos!</p>
                <div className="absolute top-full right-4 -mt-1">
                  <div className="w-0 h-0 border-l-4 border-r-4 border-t-4 border-l-transparent border-r-transparent border-t-navy-darker" />
                </div>
                <div className="absolute top-1/2 -left-1 w-1 h-8 bg-gradient-to-b from-primary to-accent rounded-full" />
              </motion.div>
            )}
          </AnimatePresence>
        </Link>
      </motion.div>

      {/* Mobile version (smaller, expandible on click) */}
      <motion.div
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 1.2, duration: 0.5, type: 'spring' }}
        className="fixed bottom-6 right-6 z-50 md:hidden"
      >
        <motion.button
          onClick={() => setIsMobileExpanded(!isMobileExpanded)}
          className="relative flex items-center justify-center w-14 h-14 rounded-full bg-gradient-to-br from-primary to-accent shadow-glow-primary"
          aria-label="Menu de contacto"
          animate={isMobileExpanded ? { rotate: 45 } : { rotate: 0 }}
          transition={{ duration: 0.3 }}
        >
          <span className="material-symbols-outlined text-white text-2xl">
            {isMobileExpanded ? 'close' : 'chat_bubble'}
          </span>
        </motion.button>

        {/* Mobile expanded menu */}
        <AnimatePresence>
          {isMobileExpanded && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.8, y: 20 }}
              className="absolute bottom-20 right-0 flex flex-col gap-3"
            >
              <Link
                to="/contacto"
                className="flex items-center gap-3 px-4 py-3 bg-navy-darker border border-slate-700 rounded-xl shadow-2xl min-w-[160px]"
                onClick={() => setIsMobileExpanded(false)}
              >
                <span className="material-symbols-outlined text-primary">email</span>
                <span className="text-white text-sm font-montserrat">Email</span>
              </Link>
              <a
                href="https://wa.me/593XXXXXXXXX"
                className="flex items-center gap-3 px-4 py-3 bg-navy-darker border border-slate-700 rounded-xl shadow-2xl min-w-[160px]"
                target="_blank"
                rel="noopener noreferrer"
              >
                <span className="material-symbols-outlined text-accent">phone</span>
                <span className="text-white text-sm font-montserrat">WhatsApp</span>
              </a>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </>
  );
}