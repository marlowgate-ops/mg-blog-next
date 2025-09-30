import s from './CategoryHero.module.css';

interface CategoryHeroProps {
  title: string;
  description: string;
  tags: string[];
  icon: string;
}

export default function CategoryHero({ title, description, tags, icon }: CategoryHeroProps) {
  return (
    <div className={s.hero}>
      <div className={s.content}>
        <div className={s.icon}>{icon}</div>
        <h1 className={s.title}>{title}</h1>
        <p className={s.description}>{description}</p>
        
        <div className={s.tags}>
          {tags.map((tag, index) => (
            <span key={index} className={s.tag}>
              {tag}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}