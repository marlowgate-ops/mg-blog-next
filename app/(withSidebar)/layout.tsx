import Container from '@/components/Container';
import Sidebar from '@/components/Sidebar';
import styles from './layout.module.css';

export default function WithSidebarLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <Container>
      <div className={styles.layout}>
        <main className={styles.main}>
          {children}
        </main>
        <div className={styles.sidebar}>
          <Sidebar />
        </div>
      </div>
    </Container>
  );
}