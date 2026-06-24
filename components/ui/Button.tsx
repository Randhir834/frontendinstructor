import { cn } from '@/utils/cn';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'gradient';
  size?: 'sm' | 'md' | 'lg';
  children: React.ReactNode;
  isLoading?: boolean;
}

export default function Button({
  variant = 'primary',
  size = 'md',
  className,
  children,
  isLoading = false,
  disabled,
  ...props
}: ButtonProps) {
  return (
    <button
      className={cn(
        'group relative inline-flex items-center justify-center font-semibold rounded-xl transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-60 disabled:cursor-not-allowed overflow-hidden',
        // Base animations
        'transform active:scale-95',
        {
          // Primary: Blue gradient with hover lift
          'bg-gradient-to-r from-blue-500 to-cyan-500 text-white shadow-lg hover:shadow-xl hover:-translate-y-0.5 hover:from-blue-600 hover:to-cyan-600 focus:ring-blue-500': 
            variant === 'primary',
          
          // Secondary: Outline with gradient border on hover
          'bg-white text-blue-600 border-2 border-blue-500 hover:bg-gradient-to-r hover:from-blue-50 hover:to-cyan-50 hover:border-blue-600 hover:shadow-md focus:ring-blue-500': 
            variant === 'secondary',
          
          // Outline: Simple with smooth transitions
          'border-2 border-gray-200 text-gray-700 bg-white hover:border-gray-300 hover:bg-gray-50 hover:shadow-sm focus:ring-gray-400': 
            variant === 'outline',
          
          // Ghost: Minimal with smooth background
          'text-gray-600 hover:text-gray-800 hover:bg-gradient-to-r hover:from-gray-50 hover:to-gray-100': 
            variant === 'ghost',
          
          // Gradient: Premium multi-color gradient
          'bg-gradient-to-r from-purple-500 via-pink-500 to-purple-500 text-white shadow-lg hover:shadow-xl hover:-translate-y-0.5 hover:from-purple-600 hover:via-pink-600 hover:to-purple-600 focus:ring-purple-500': 
            variant === 'gradient',
        },
        {
          'px-3 py-2 text-xs sm:px-4 sm:text-sm': size === 'sm',
          'px-4 py-2.5 text-sm sm:px-5': size === 'md',
          'px-5 py-3 text-sm sm:px-7 sm:py-3.5 sm:text-base': size === 'lg',
        },
        className
      )}
      disabled={disabled || isLoading}
      {...props}
    >
      {/* Shimmer effect overlay */}
      {(variant === 'primary' || variant === 'gradient') && (
        <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-in-out"></span>
      )}
      
      {/* Loading spinner */}
      {isLoading && (
        <svg className="animate-spin -ml-1 mr-2 h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
      )}
      
      <span className="relative z-10">{children}</span>
    </button>
  );
}
