import s from './RegulatorBadge.module.css';

interface RegulatorBadgeProps {
  name: string;
}

export default function RegulatorBadge({ name }: RegulatorBadgeProps) {
  const getRegulatorInfo = (regulator: string) => {
    const regulatorMap: Record<string, { icon: string; color: string; fullName: string }> = {
      '金融庁': {
        icon: '🏛️',
        color: 'primary',
        fullName: '金融庁（日本）'
      },
      '日本証券業協会': {
        icon: '📊',
        color: 'secondary',
        fullName: '日本証券業協会'
      },
      'FCA': {
        icon: '🇬🇧',
        color: 'primary',
        fullName: 'Financial Conduct Authority'
      },
      'CFTC': {
        icon: '🇺🇸',
        color: 'primary',
        fullName: 'Commodity Futures Trading Commission'
      },
      'ASIC': {
        icon: '🇦🇺',
        color: 'primary',
        fullName: 'Australian Securities and Investments Commission'
      },
      'CySEC': {
        icon: '🇪🇺',
        color: 'secondary',
        fullName: 'Cyprus Securities and Exchange Commission'
      }
    };

    return regulatorMap[regulator] || {
      icon: '⚖️',
      color: 'default',
      fullName: regulator
    };
  };

  const info = getRegulatorInfo(name);

  return (
    <div className={`${s.badge} ${s[info.color]}`} title={info.fullName}>
      <span className={s.icon}>{info.icon}</span>
      <span className={s.name}>{name}</span>
    </div>
  );
}