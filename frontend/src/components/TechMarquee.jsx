'use client';

import { motion } from 'framer-motion';

const techLogos = [
  '/logos/n8n.png',
  '/logos/supabase.png',
  '/logos/redis.png',
  '/logos/docker.png',
  '/logos/easypanel.png',
  '/logos/hostinger.png',
  '/logos/chatwoot.png',
  '/logos/whatsapp.png',
  '/logos/instagram.png',
  '/logos/meta.png',
  '/logos/messenger.png',
  '/logos/python.png',
  '/logos/json.png'
];

export default function TechMarquee() {
  // Duplicate logos for seamless infinite scroll
  const duplicatedLogos = [...techLogos, ...techLogos];

  return (
    <section className="py-20 bg-background-dark overflow-hidden border-y border-slate-800 relative">
      <div className="max-w-7xl mx-auto px-6 text-center mb-12">
        <p className="text-slate-500 text-xs uppercase tracking-[0.3em] mb-2">Tecnologías que utilizamos</p>
        <h3 className="text-white font-michroma text-xl uppercase">Infraestructura moderna y escalable</h3>
      </div>

      <div className="relative w-full overflow-hidden">
        {/* Fade gradients on sides */}
        <div className="pointer-events-none absolute left-0 top-0 h-full w-32 bg-gradient-to-r from-background-dark to-transparent z-10" />
        <div className="pointer-events-none absolute right-0 top-0 h-full w-32 bg-gradient-to-l from-background-dark to-transparent z-10" />

        {/* Animated marquee track */}
        <motion.div
          className="flex gap-16 items-center"
          animate={{ x: [0, -50 * techLogos.length] }} // Move left by 50% of original set
          transition={{
            duration: 30,
            repeat: Infinity,
            ease: 'linear',
            repeatType: 'loop'
          }}
        >
          {duplicatedLogos.map((src, i) => (
            <motion.div
              key={`${src}-${i}`}
              className="tech-logo flex-shrink-0"
              whileHover={{ scale: 1.15, filter: 'brightness(1.3)' }}
              transition={{ duration: 0.3 }}
            >
              <img
                src={src}
                alt={`tech-${i}`}
                className="h-10 w-auto object-contain transition-opacity"
              />
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
