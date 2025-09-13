import React from 'react';
import { ChevronLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { TEXT } from '@/config/text.constants';
import { useNavigate } from '@/hooks/use-navigation';

interface BackButtonProps {
  onClick?: () => void;
  destination?: string;
  className?: string;
  variant?: 'default' | 'subtle' | 'outline';
  size?: 'sm' | 'md' | 'lg';
}

export function BackButton({
  onClick,
  destination = '/',
  className,
  variant = 'outline',
  size = 'sm'
}: BackButtonProps) {
  const navigate = useNavigate();

  const handleClick = () => {
    if (onClick) {
      onClick();
    } else if (destination) {
      navigate(destination);
    }
  };

  const sizeClasses = {
    sm: 'h-9 px-3 text-xs',
    md: 'h-10 px-4 text-sm',
    lg: 'h-11 px-5'
  };

  const variantClasses = {
    default: 'bg-primary text-primary-foreground hover:bg-primary/90',
    subtle: 'bg-background hover:bg-muted/80 border border-border/40',
    outline: 'border-2 border-border/30 hover:bg-accent hover:border-border/50'
  };

  return (
    <Button
      type="button"
      onClick={handleClick}
      className={cn(
        'rounded-full transition-all duration-300 flex items-center gap-2 font-medium shadow-sm',
        variantClasses[variant],
        sizeClasses[size],
        className
      )}
    >
      <ChevronLeft className={cn(
        'transition-all',
        size === 'sm' ? 'w-3.5 h-3.5' : 
        size === 'md' ? 'w-4 h-4' : 'w-5 h-5'
      )} />
      <span>{TEXT.actions.back}</span>
    </Button>
  );
}
