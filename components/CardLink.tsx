import Link from 'next/link';
import s from './CardLink.module.css';

interface CardLinkProps {
  href: string;
  title: string;
  description?: string;
  icon?: React.ReactNode;
  className?: string;
  onClick?: () => void;
}

export default function CardLink({ 
  href, 
  title, 
  description, 
  icon, 
  className = '',
  onClick
}: CardLinkProps) {
  return (
    <Link 
      href={href} 
      className={`${s.cardLink} ${className}`}
      onClick={onClick}
    >
      {icon && <div className={s.icon}>{icon}</div>}
      <div className={s.content}>
        <h3 className={s.title}>{title}</h3>
        {description && <p className={s.description}>{description}</p>}
      </div>
    </Link>
  );
}