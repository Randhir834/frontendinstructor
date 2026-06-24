import { cn } from '@/utils/cn';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  hover?: boolean;
  gradient?: boolean;
}

export default function Card({ children, className, hover = false, gradient = false }: CardProps) {
  return (
    <div 
      className={cn(
        'bg-white rounded-2xl border border-gray-200 shadow-sm transition-all duration-300',
        hover && 'hover:shadow-lg hover:-translate-y-1 hover:border-gray-300 cursor-pointer',
        gradient && 'relative overflow-hidden',
        className
      )}
    >
      {gradient && (
        <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500"></div>
      )}
      <div className={gradient ? 'pt-2' : ''}>
        {children}
      </div>
    </div>
  );
}

export function CardHeader({ children, className }: CardProps) {
  return <div className={cn('mb-4 pb-4 border-b border-gray-100', className)}>{children}</div>;
}

export function CardTitle({ children, className }: CardProps) {
  return (
    <h3 className={cn(
      'text-base sm:text-lg font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent',
      className
    )}>
      {children}
    </h3>
  );
}

export function CardContent({ children, className }: CardProps) {
  return <div className={cn('', className)}>{children}</div>;
}
