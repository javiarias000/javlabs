import React from 'react';
import './Card.css';

/**
 * Card Component
 * Contenedor versátil para contenido con opciones de imagen, hover y acciones.
 *
 * @param {Object} props
 * @param {React.ReactNode} props.children - Contenido de la card
 * @param {string} props.title - Título de la card
 * @param {string} props.description - Descripción de la card
 * @param {string} props.image - URL de la imagen
 * @param {'top' | 'left' | 'background'} props.imagePosition - Posición de la imagen
 * @param {boolean} props.hover - Habilitar efectos hover
 * @param {React.MouseEventHandler} props.onClick - Handler de click
 * @param {string} props.className - Clases CSS adicionales
 * @param {React.HTMLAttributes<HTMLDivElement>} props - Otras props de div
 */
const Card = ({
  children,
  title,
  description,
  image,
  imagePosition = 'top',
  hover = true,
  onClick,
  className = '',
  imgWidth,
  imgHeight,
  ...props
}) => {
  const classNames = [
    'card',
    `card-image-${imagePosition}`,
    hover && 'card-hover',
    onClick && 'card-clickable',
    className
  ].filter(Boolean).join(' ');

  return (
    <div
      className={classNames}
      onClick={onClick}
      role={onClick ? 'button' : undefined}
      tabIndex={onClick ? 0 : undefined}
      onKeyDown={onClick ? (e) => e.key === 'Enter' && onClick(e) : undefined}
      {...props}
    >
      {image && (
        <div className="card-image-wrapper">
          <img
            src={image}
            alt={title || 'Card image'}
            loading="lazy"
            width={imgWidth}
            height={imgHeight}
            className="card-image"
          />
        </div>
      )}
      <div className="card-content">
        {(title || description) && (
          <div className="card-header">
            {title && <h3 className="card-title">{title}</h3>}
            {description && <p className="card-description">{description}</p>}
          </div>
        )}
        <div className="card-body">{children}</div>
      </div>
    </div>
  );
};

export default Card;
