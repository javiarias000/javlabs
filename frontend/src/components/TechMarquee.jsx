'use client';

import { motion } from 'framer-motion';

const techLogos = [
  { src: '/logos/n8n.png', name: 'n8n' },
  { src: '/logos/supabase.png', name: 'supabase' },
  { src: '/logos/redis.png', name: 'redis' },
  { src: '/logos/docker.png', name: 'docker' },
  { src: '/logos/easypanel.png', name: 'easypanel' },
  { src: '/logos/hostinger.png', name: 'hostinger' },
  { src: '/logos/chatwoot.png', name: 'chatwoot' },
  { src: '/logos/whatsapp.png', name: 'whatsapp' },
  { src: '/logos/instagram.png', name: 'instagram' },
  { src: '/logos/meta.png', name: 'meta' },
  { src: '/logos/messenger.png', name: 'messenger' },
  { src: '/logos/python.png', name: 'python' },
  { src: '/logos/json.png', name: 'json' }
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
          {duplicatedLogos.map((logo, i) => (
            <motion.div
              key={`${logo.src}-${i}`}
              className="tech-logo flex-shrink-0"
              whileHover={{ scale: 1.15, filter: 'brightness(1.3)' }}
              transition={{ duration: 0.3 }}
            >
              <img
                src={logo.src}
                alt={`${logo.name} logo`}
                width={40}
                height={40}
                loading="lazy"
                className="h-10 w-auto object-contain transition-opacity"
              />
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
