import { cn } from '@/lib/utils';
import { ReactNode } from 'react';

interface TypographyProps {
  as: 'h1' | 'h2' | 'h3' | 'h4' | 'p' | 'code' | 'small' | 'span';
  children: ReactNode;
  isMuted?: boolean;
  className?: string;
}

export const Typography = ({
  as,
  children,
  isMuted,
  className,
}: TypographyProps) => {
  const Component = as;

  const h1CustomClassName =
    'scroll-m-20 text-center text-4xl font-extrabold tracking-tight text-balance';
  const h2CustomClassName =
    'scroll-m-20 border-b pb-2 text-3xl font-semibold tracking-tight first:mt-0';
  const h3CustomClassName = 'scroll-m-20 text-2xl font-semibold tracking-tight';
  const h4CustomClassName = 'scroll-m-20 text-xl font-semibold tracking-tight';
  const pCustomClassName = 'leading-7 [&:not(:first-child)]:mt-2';
  const spanCustomClassName = 'leading-7';
  const codeCustomClassName =
    'bg-muted relative rounded px-[0.3rem] py-[0.2rem] font-mono text-sm font-semibold';
  const smallCustomClassName = 'text-sm leading-none font-medium';

  const mapCustomClassName = {
    h1: h1CustomClassName,
    h2: h2CustomClassName,
    h3: h3CustomClassName,
    h4: h4CustomClassName,
    p: pCustomClassName,
    code: codeCustomClassName,
    small: smallCustomClassName,
    span: spanCustomClassName,
  };

  return (
    <Component
      className={cn(
        isMuted && 'text-muted-foreground',
        mapCustomClassName[as],
        className
      )}
    >
      {children}
    </Component>
  );
};
