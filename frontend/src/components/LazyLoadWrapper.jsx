import { lazy, Suspense } from 'react';

/**
 * Wrapper para carga perezosa con fallback optimizado
 * @param {Function} importFn - Función de importación dinámica
 * @param {Object} props - Props del componente
 * @param {JSX.Element} fallback - Elemento mientras carga (default: skeleton)
 */
export default function LazyLoad({ importFn, fallback, ...props }) {
  const LazyComponent = lazy(importFn);

  return (
    <Suspense fallback={fallback || <div style={{ minHeight: '200px' }} />}>
      <LazyComponent {...props} />
    </Suspense>
  );
}

/**
 * Componente skeleton genérico para placeholders
 */
export function Skeleton({ className = '', style = {} }) {
  return (
    <div
      className={`animate-pulse bg-gray-700 rounded ${className}`}
      style={style}
    />
  );
}

/**
 * Skeleton específico para tarjetas de servicios
 */
export function ServiceCardSkeleton() {
  return (
    <div className="bg-navy-card rounded-2xl p-8 border border-gray-800">
      <Skeleton className="h-12 w-12 mb-4" />
      <Skeleton className="h-6 w-3/4 mb-3" />
      <Skeleton className="h-4 w-full mb-2" />
      <Skeleton className="h-4 w-2/3" />
    </div>
  );
}

/**
 * Skeleton para sección de estadísticas
 */
export function StatsSkeleton() {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
      {[1,2,3,4].map(i => (
        <div key={i} className="text-center">
          <Skeleton className="h-10 w-20 mx-auto mb-2" />
          <Skeleton className="h-4 w-16 mx-auto" />
        </div>
      ))}
    </div>
  );
}
