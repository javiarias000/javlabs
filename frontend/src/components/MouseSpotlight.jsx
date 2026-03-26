import { useEffect, useState } from 'react';

export default function MouseSpotlight({ size = 400, opacity = 0.08, color = '#0d7ff2' }) {
  const [position, setPosition] = useState(() => {
    if (typeof window !== 'undefined') {
      return { x: window.innerWidth / 2, y: window.innerHeight / 2 };
    }
    return { x: 0, y: 0 };
  });

  const alpha = Math.round(opacity * 255).toString(16).padStart(2, '0');

  return (
    <div
      className="pointer-events-none fixed inset-0 z-0"
      style={{
        background: `radial-gradient(circle ${size}px at ${position.x}px ${position.y}px, ${color}${alpha}, transparent)`,
        mixBlendMode: 'screen',
        transition: 'background 0.1s ease-out',
      }}
    />
  );
}
