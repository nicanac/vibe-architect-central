import { cn } from '@/lib/utils';

type MaxWidthValue = 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '4xl' | '6xl' | '8xl' | '12xl' | 'full' | 'none';

interface MainContainerProps {
  children: React.ReactNode;
  maxWidth?: MaxWidthValue;
  className?: string;
}

const maxWidthClasses: Record<MaxWidthValue, string> = {
  sm: 'max-w-sm',
  md: 'max-w-md',
  lg: 'max-w-lg',
  xl: 'max-w-xl',
  '2xl': 'max-w-2xl',
  '4xl': 'max-w-4xl',
  '6xl': 'max-w-6xl',
  '8xl': 'max-w-8xl',
  '12xl': 'max-w-12xl',
  full: 'max-w-full',
  none: '',
};

/**
 * MainContainer - Reusable main content wrapper component
 * 
 * Provides consistent container styling with configurable max-width.
 * Default max-width is 12xl to match most page layouts.
 */
export function MainContainer({ 
  children, 
  maxWidth = '12xl', 
  className 
}: MainContainerProps) {
  return (
    <main 
      className={cn(
        'container mx-auto px-4 py-8',
        maxWidthClasses[maxWidth],
        className
      )}
    >
      {children}
    </main>
  );
}
