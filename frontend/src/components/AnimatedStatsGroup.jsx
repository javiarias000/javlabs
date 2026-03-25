import { useInView } from 'framer-motion';
import { useRef } from 'react';
import AnimatedNumber from './AnimatedNumber';

const AnimatedStatsGroup = ({ stats }) => {
  const containerRef = useRef(null);
  const isInView = useInView(containerRef, { once: true, amount: 0.3 });

  return (
    <div ref={containerRef} className="flex flex-col md:flex-row justify-between items-center gap-8">
      {stats.map((stat, index) => (
        <div
          key={stat.label}
          className="flex items-center gap-8 w-full md:w-auto"
          style={{
            opacity: isInView ? 1 : 0,
            transform: isInView ? 'translateY(0)' : 'translateY(20px)',
            transition: `all 0.6s ease-out ${index * 0.1}s`
          }}
        >
          {index > 0 && <div className="hidden md:block w-px h-12 bg-gradient-to-b from-primary to-accent" />}
          <div className="flex-1 text-center md:text-left">
            <AnimatedNumber value={stat.value} suffix={stat.suffix || ''} duration={2} delay={index * 0.2} />
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-slate-500 mt-2 mb-1">
              {stat.label}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default AnimatedStatsGroup;
