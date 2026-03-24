'use client';

import { motion, useScroll, useTransform } from 'framer-motion';
import { useEffect, useState } from 'react';

export default function ParticleBackground() {
  const { scrollY } = useScroll();
  const [particles, setParticles] = useState([]);

  // Generar partículas una sola vez en el cliente
  useEffect(() => {
    const generatedParticles = Array.from({ length: 60 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 4 + 1,
      duration: Math.random() * 20 + 10,
      delay: Math.random() * 5,
      color: Math.random() > 0.5 ? 'primary' : 'accent',
    }));
    setParticles(generatedParticles);
  }, []);

  // Parallax effect basado en scroll
  const y1 = useTransform(scrollY, [0, 1000], [0, -100]);
  const y2 = useTransform(scrollY, [0, 1000], [0, 100]);

  if (particles.length === 0) return null;

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {/* Partículas con parallax */}
      <motion.div style={{ y: y1 }} className="absolute inset-0">
        {particles.slice(0, 30).map((particle) => (
          <motion.div
            key={`p1-${particle.id}`}
            className="absolute rounded-full will-change-transform"
            style={{
              left: `${particle.x}%`,
              top: `${particle.y}%`,
              width: particle.size,
              height: particle.size,
              backgroundColor: particle.color === 'primary' ? 'rgba(13, 127, 242, 0.4)' : 'rgba(139, 92, 246, 0.4)',
              boxShadow: `0 0 ${particle.size * 2}px ${particle.color === 'primary' ? 'rgba(13, 127, 242, 0.3)' : 'rgba(139, 92, 246, 0.3)'}`,
            }}
            animate={{
              y: [-20, 20, -20],
              x: [-10, 10, -10],
              opacity: [0.2, 0.7, 0.2],
            }}
            transition={{
              duration: particle.duration,
              delay: particle.delay,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
          />
        ))}
      </motion.div>

      <motion.div style={{ y: y2 }} className="absolute inset-0">
        {particles.slice(30).map((particle) => (
          <motion.div
            key={`p2-${particle.id}`}
            className="absolute rounded-full will-change-transform"
            style={{
              left: `${particle.x}%`,
              top: `${particle.y}%`,
              width: particle.size * 0.75,
              height: particle.size * 0.75,
              backgroundColor: particle.color === 'primary' ? 'rgba(13, 127, 242, 0.3)' : 'rgba(139, 92, 246, 0.3)',
            }}
            animate={{
              y: [-15, 15, -15],
              x: [-8, 8, -8],
              opacity: [0.15, 0.5, 0.15],
            }}
            transition={{
              duration: particle.duration * 0.8,
              delay: particle.delay,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
          />
        ))}
      </motion.div>

      {/* Gradientes sutiles de fondo */}
      <div className="absolute inset-0 bg-gradient-radial from-transparent via-primary/[0.02] to-transparent" style={{
        background: 'radial-gradient(circle at 20% 30%, rgba(13, 127, 242, 0.08) 0%, transparent 50%), radial-gradient(circle at 80% 70%, rgba(139, 92, 246, 0.08) 0%, transparent 50%)',
      }} />
    </div>
  );
}
