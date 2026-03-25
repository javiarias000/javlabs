import { motion } from 'framer-motion';

const ScrollReveal = ({
  children,
  variants = 'fadeInUp',
  delay = 0,
  className = '',
  viewport = { once: true, amount: 0.2 },
  ...props
}) => {
  const defaultVariants = {
    hidden: { opacity: 0, y: 60 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: 'easeOut', delay } }
  };

  const fadeIn = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { duration: 0.6, delay } }
  };

  const scaleIn = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: { opacity: 1, scale: 1, transition: { duration: 0.6, ease: 'back.out(1.7)', delay } }
  };

  const variantsMap = {
    fadeInUp: defaultVariants,
    fadeIn,
    scaleIn
  };

  const selectedVariants = variantsMap[variants] || defaultVariants;

  return (
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={viewport}
      variants={selectedVariants}
      className={className}
      {...props}
    >
      {children}
    </motion.div>
  );
};

export default ScrollReveal;
