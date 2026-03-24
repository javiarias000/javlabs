import React from 'react';
import './Section.css';

/**
 * Section Component
 * Contenedor semántico para secciones de página con encabezado y espaciado opcional.
 *
 * @param {Object} props
 * @param {React.ReactNode} props.children - Contenido de la sección
 * @param {string} props.title - Título de la sección
 * @param {string} props.subtitle - Subtítulo o descripción
 * @param {boolean} props.centered - Centrar el contenido horizontalmente
 * @param {boolean} props.spaced - Añadir padding vertical
 * @param {'light' | 'dark' | 'gradient'} props.background - Tipo de fondo
 * @param {string} props.className - Clases CSS adicionales
 * @param {React.HTMLAttributes<HTMLElement>} props - Otras props de section
 */
const Section = ({
  children,
  title,
  subtitle,
  centered = true,
  spaced = true,
  background = 'light',
  className = '',
  id,
  ...props
}) => {
  const classNames = [
    'section',
    `section-${background}`,
    spaced && 'section-spaced',
    centered && 'section-centered',
    className
  ].filter(Boolean).join(' ');

  return (
    <section className={classNames} id={id} {...props}>
      <div className="section-container">
        {(title || subtitle) && (
          <div className={`section-header ${centered ? 'section-header-centered' : ''}`}>
            {title && <h2 className="section-title">{title}</h2>}
            {subtitle && <p className="section-subtitle">{subtitle}</p>}
          </div>
        )}
        <div className="section-content">{children}</div>
      </div>
    </section>
  );
};

export default Section;
