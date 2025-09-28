import s from './SectionTitle.module.css';

interface SectionTitleProps {
  children: React.ReactNode;
  className?: string;
  level?: 'h1' | 'h2' | 'h3';
}

export default function SectionTitle({ 
  children, 
  className = '', 
  level = 'h2' 
}: SectionTitleProps) {
  const Component = level;
  
  return (
    <Component className={`${s.sectionTitle} ${className}`}>
      {children}
    </Component>
  );
}