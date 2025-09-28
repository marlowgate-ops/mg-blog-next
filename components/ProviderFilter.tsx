import styles from './providerfilter.module.css';

interface ProviderFilterProps {
  sources: string[];
  selectedSource: string | null;
  onSourceChange: (source: string | null) => void;
}

export default function ProviderFilter({ sources, selectedSource, onSourceChange }: ProviderFilterProps) {
  return (
    <div className={styles.filter}>
      <button
        className={`${styles.button} ${selectedSource === null ? styles.active : ''}`}
        onClick={() => onSourceChange(null)}
      >
        すべて
      </button>
      {sources.map(source => (
        <button
          key={source}
          className={`${styles.button} ${selectedSource === source ? styles.active : ''}`}
          onClick={() => onSourceChange(source)}
        >
          {source}
        </button>
      ))}
    </div>
  );
}