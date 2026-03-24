import React from 'react';
import './Button.css';

/**
 * Button Component
 * Un componente de botón reutilizable con múltiples variantes y tamaños.
 *
 * @param {Object} props
 * @param {React.ReactNode} props.children - Contenido del botón
 * @param {'primary' | 'secondary' | 'outline' | 'ghost'} props.variant - Variante visual
 * @param {'sm' | 'md' | 'lg'} props.size - Tamaño del botón
 * @param {boolean} props.fullWidth - Si el botón ocupa el ancho completo
 * @param {boolean} props.disabled - Estado deshabilitado
 * @param {React.ReactNode} props.icon - Icono opcional
 * @param {'left' | 'right'} props.iconPosition - Posición del icono
 * @param {React.MouseEventHandler} props.onClick - Handler de click
 * @param {string} props.className - Clases CSS adicionales
 * @param {React.ButtonHTMLAttributes<HTMLButtonElement>} props - Otras props de button
 */
const Button = ({
  children,
  variant = 'primary',
  size = 'md',
  fullWidth = false,
  disabled = false,
  icon,
  iconPosition = 'left',
  onClick,
  className = '',
  type = 'button',
  ...props
}) => {
  const classNames = [
    'btn',
    `btn-${variant}`,
    `btn-${size}`,
    fullWidth && 'btn-full',
    disabled && 'btn-disabled',
    className
  ].filter(Boolean).join(' ');

  return (
    <button
      type={type}
      className={classNames}
      onClick={onClick}
      disabled={disabled}
      {...props}
    >
      {icon && iconPosition === 'left' && (
        <span className="btn-icon btn-icon-left">{icon}</span>
      )}
      <span className="btn-content">{children}</span>
      {icon && iconPosition === 'right' && (
        <span className="btn-icon btn-icon-right">{icon}</span>
      )}
    </button>
  );
};

export default Button;
