'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import styles from './manga.module.css';

const PANELS = [
  { src: '/1.jpg', span: 'p1' },
  { src: '/2.jpg', span: 'p2' },
  { src: '/3.jpg', span: 'p3' },
  { src: '/4.jpg', span: 'p4' },
  { src: '/5.jpg', span: 'p1' },
  { src: '/6.jpg', span: 'p2' },
  { src: '/7.jpg', span: 'p3' },
  { src: '/8.jpg', span: 'p4' },
  { src: '/9.jpg', span: 'p1' },
  { src: '/10.jpg', span: 'p2' },
  { src: '/11.jpg', span: 'p3' },
  { src: '/12.jpg', span: 'p4' },
  { src: '/13.jpg', span: 'p1' },
];

const DELAY_TIME = 1600;
const MAX_PANELS_PER_PAGE = 4;

export default function MangaPage() {
  const router = useRouter();
  const [currentIndex, setCurrentIndex] = useState(1);
  const [isAuto, setIsAuto] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const goToGame = useCallback(() => {
    if (timer.current) clearTimeout(timer.current);
    router.push('/game');
  }, [router]);

  const showNextPanel = useCallback(() => {
    setCurrentIndex((prev) => {
      if (prev >= PANELS.length) {
        return prev;
      }
      return prev + 1;
    });
  }, []);

  useEffect(() => {
    if (timer.current) clearTimeout(timer.current);
    if (isAuto) {
      if (currentIndex >= PANELS.length) {
        timer.current = setTimeout(goToGame, 3000);
      } else {
        timer.current = setTimeout(showNextPanel, DELAY_TIME);
      }
    }
    return () => {
      if (timer.current) clearTimeout(timer.current);
    };
  }, [isAuto, currentIndex, showNextPanel, goToGame]);

  const handleGridClick = () => {
    if (!isAuto) showNextPanel();
  };

  const toggleAuto = () => {
    setIsAuto((prev) => !prev);
  };

  const visibleCount = Math.min(currentIndex, PANELS.length);
  const pageStart = Math.floor((visibleCount - 1) / MAX_PANELS_PER_PAGE) * MAX_PANELS_PER_PAGE;

  return (
    <main className={styles.page}>
      <button
        id="auto-btn"
        className={`${styles.autoBtn} ${isAuto ? '' : styles.autoBtnManual}`}
        onClick={toggleAuto}
      >
        {isAuto ? 'AUTO: ON' : 'AUTO: OFF'}
      </button>
      <button className={styles.skipBtn} onClick={goToGame}>
        SKIP
      </button>
      <div className={styles.grid} onClick={handleGridClick}>
        {PANELS.slice(pageStart, visibleCount).map((panel, i) => {
          const realIndex = pageStart + i;
          return (
            <div
              key={panel.src}
              className={`${styles.panel} ${styles.panelActive} ${styles[panel.span]}`}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={panel.src} alt={`Manga panel ${realIndex + 1}`} />
            </div>
          );
        })}
      </div>
    </main>
  );
}
