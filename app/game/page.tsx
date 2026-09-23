'use client';

import { useState } from 'react';
import Link from 'next/link';
import styles from './game.module.css';

type Question = {
  q: string;
  rightAns: string;
  wrongAns: string;
  correct: 'R' | 'W';
};

const QUESTIONS: Question[] = [
  { q: 'What is the capital of France?', rightAns: 'Paris', wrongAns: 'London', correct: 'R' },
  { q: 'What is 5 + 7?', rightAns: '15', wrongAns: '12', correct: 'W' },
  { q: 'Which planet is known as the Red Planet?', rightAns: 'Mars', wrongAns: 'Venus', correct: 'R' },
  { q: 'What is the capital of Japan?', rightAns: 'Kyoto', wrongAns: 'Tokyo', correct: 'W' },
  { q: 'Which mammal can fly?', rightAns: 'Bat', wrongAns: 'Bird', correct: 'R' },
  { q: 'How many legs does a spider have?', rightAns: '6', wrongAns: '8', correct: 'W' },
  { q: 'What is the chemical symbol for water?', rightAns: 'H2O', wrongAns: 'CO2', correct: 'R' },
  { q: 'Which is the largest ocean on Earth?', rightAns: 'Atlantic', wrongAns: 'Pacific', correct: 'W' },
  { q: 'What is the capital of Thailand?', rightAns: 'Bangkok', wrongAns: 'Phuket', correct: 'R' },
  { q: 'How many days are there in a normal year?', rightAns: '366', wrongAns: '365', correct: 'W' },
];

const MAX_HP = 1000;

export default function GamePage() {
  const [playerHp, setPlayerHp] = useState(MAX_HP);
  const [enemyHp, setEnemyHp] = useState(MAX_HP);
  const [currentQ, setCurrentQ] = useState(0);
  const [result, setResult] = useState<string | null>(null);

  const finished = result !== null || currentQ >= QUESTIONS.length;
  const question = QUESTIONS[Math.min(currentQ, QUESTIONS.length - 1)];

  const finishByQuestions = (pHp: number, eHp: number) => {
    if (pHp > eHp) setResult('You win! 10 questions done, you have more HP left.');
    else if (eHp > pHp) setResult('You lose! The monster has more HP left.');
    else setResult('Draw! HP is exactly equal after 10 questions.');
  };

  const answer = (side: 'R' | 'W') => {
    if (finished || playerHp <= 0 || enemyHp <= 0) return;
    const q = QUESTIONS[currentQ];
    const correct = q.correct === side;

    let nextPlayer = playerHp;
    let nextEnemy = enemyHp;
    if (correct) {
      nextEnemy = Math.max(0, enemyHp - 100);
    } else {
      nextPlayer = Math.max(0, playerHp - 100);
    }
    setEnemyHp(nextEnemy);
    setPlayerHp(nextPlayer);

    if (nextEnemy <= 0) {
      setResult('You win! The monster is defeated.');
      return;
    }
    if (nextPlayer <= 0) {
      setResult('You lose! Your HP is gone.');
      return;
    }

    const nextQ = currentQ + 1;
    setCurrentQ(nextQ);
    if (nextQ >= QUESTIONS.length) {
      finishByQuestions(nextPlayer, nextEnemy);
    }
  };

  return (
    <main className={styles.page}>
      <div className={styles.container}>
        <p className={styles.question}>
          {finished && currentQ >= QUESTIONS.length
            ? 'GAME OVER'
            : `${Math.min(currentQ + 1, QUESTIONS.length)}. ${question.q}`}
        </p>
        <div className={styles.monsterBar}>
          <div className={styles.bar}>
            <div
              className={`${styles.enemyFill} ${enemyHp <= 300 ? styles.lowStamina : ''}`}
              style={{ width: `${(enemyHp / MAX_HP) * 100}%` }}
            />
          </div>
          <p className={styles.hp}>
            HP: <span>{enemyHp}</span>
          </p>
        </div>
        <div className={styles.playerBar}>
          <div className={styles.bar}>
            <div
              className={`${styles.playerFill} ${playerHp <= 300 ? styles.lowStamina : ''}`}
              style={{ width: `${(playerHp / MAX_HP) * 100}%` }}
            />
          </div>
          <p className={styles.hp}>
            HP: <span>{playerHp}</span>
          </p>
        </div>
        <div className={styles.answers}>
          <button disabled={finished} onClick={() => answer('R')}>
            {question.rightAns}
          </button>
          <button disabled={finished} onClick={() => answer('W')}>
            {question.wrongAns}
          </button>
        </div>
        {result && <p className={styles.result}>{result}</p>}
        <div className={styles.nav}>
          <Link href="/">Home</Link>
          <Link href="/manga">Manga</Link>
          <Link href="/sim">Simulation</Link>
        </div>
      </div>
    </main>
  );
}
