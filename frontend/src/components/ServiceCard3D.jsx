'use client';

import { motion, useMotionValue, useSpring } from 'framer-motion';
import { Link } from 'react-router-dom';

export default function ServiceCard3D({ icon, boxClass, iconClass, linkClass, title, desc }) {
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  // Suavizar el movimiento
  const xSpring = useSpring(x, { stiffness: 300, damping: 30 });
  const ySpring = useSpring(y, { stiffness: 300, damping: 30 });

  const handleMouseMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;

    // Calcular rotación basada en posición del mouse (-1 a 1)
    const xRot = ((mouseY / height) - 0.5) * 2; // Rotación en X (basada en Y)
    const yRot = -((mouseX / width) - 0.5) * 2; // Rotación en Y (basada en X)

    x.set(xRot * 5); // Max 5 grados
    y.set(yRot * 5);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <motion.div
      className="group relative p-8 bg-navy-darker border border-slate-800 rounded-xl glow-hover transition-all duration-300"
      style={{
        rotateX: xSpring,
        rotateY: ySpring,
        transformStyle: 'preserve-3d',
        perspective: '1000px',
      }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      whileHover={{ scale: 1.02 }}
      transition={{ type: 'spring', stiffness: 300, damping: 30 }}
    >
      {/* Capa de brillo que sigue al mouse */}
      <motion.div
        className="absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none"
        style={{
          background: `radial-gradient(circle at ${50 + y.get() * 20}% ${50 - x.get() * 20}%, rgba(13, 127, 242, 0.15) 0%, transparent 50%)`,
        }}
      />

      {/* Contenido con perspectiva */}
      <div className="relative z-10" style={{ transform: 'translateZ(20px)' }}>
        <div className={`w-14 h-14 mb-6 rounded-lg flex items-center justify-center border transition-colors duration-300 ${boxClass}`}>
          <span className={`material-symbols-outlined text-3xl ${iconClass}`}>{icon}</span>
        </div>
        <h3 className="font-michroma text-lg text-white mb-4 uppercase leading-tight">{title}</h3>
        <p className="font-montserrat text-slate-400 text-sm leading-relaxed mb-6">{desc}</p>
        <Link
          to="/servicios"
          className={`${linkClass} text-xs font-bold uppercase tracking-widest flex items-center gap-2 hover:gap-4 transition-all duration-300`}
        >
          Saber más <span className="material-symbols-outlined text-sm">arrow_forward</span>
        </Link>
      </div>

      {/* Borde con gradiente sutil en hover */}
      <div className="absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none bg-gradient-to-br from-primary/20 via-transparent to-accent/20" style={{ zIndex: -1 }} />
    </motion.div>
  );
}
