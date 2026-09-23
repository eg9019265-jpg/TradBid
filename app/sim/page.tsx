'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import styles from './sim.module.css';

const HISTORY_LEN = 25;

function fmt(n: number) {
  return `฿${n.toLocaleString('th-TH', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

export default function SimPage() {
  const [cash, setCash] = useState(10000);
  const [shares, setShares] = useState(0);
  const [price, setPrice] = useState(100);
  const [prevPrice, setPrevPrice] = useState(100);
  const [history, setHistory] = useState<number[]>(() => Array(HISTORY_LEN).fill(100));
  const [amount, setAmount] = useState(1);

  useEffect(() => {
    const id = setInterval(() => {
      setPrice((p) => {
        const volatility = 0.04;
        const changePercent = (Math.random() - 0.49) * 2 * volatility;
        let next = p * (1 + changePercent);
        if (next < 5) next = 5;
        setPrevPrice(p);
        setHistory((h) => [...h.slice(1), next]);
        return next;
      });
    }, 1000);
    return () => clearInterval(id);
  }, []);

  const diff = price - prevPrice;
  const percent = prevPrice !== 0 ? (diff / prevPrice) * 100 : 0;
  const totalAsset = cash + shares * price;

  const maxH = Math.max(...history);
  const minH = Math.min(...history);
  const range = maxH - minH || 1;

  const buy = () => {
    const n = Math.floor(amount) || 0;
    if (n <= 0) return;
    const cost = n * price;
    if (cash >= cost) {
      setCash((c) => c - cost);
      setShares((s) => s + n);
      alert(`🟢 ซื้อหุ้นสำเร็จจำนวน ${n} หุ้น เป็นเงิน ฿${cost.toFixed(2)}`);
    } else {
      alert('❌ เงินสดในพอร์ตไม่เพียงพอสำหรับการซื้อจำนวนนี้!');
    }
  };

  const sell = () => {
    const n = Math.floor(amount) || 0;
    if (n <= 0) return;
    if (shares >= n) {
      const revenue = n * price;
      setShares((s) => s - n);
      setCash((c) => c + revenue);
      alert(`🔴 ขายหุ้นสำเร็จจำนวน ${n} หุ้น ได้รับเงิน ฿${revenue.toFixed(2)}`);
    } else {
      alert('❌ คุณมีจำนวนหุ้นไม่พอขาย!');
    }
  };

  return (
    <main className={styles.body}>
      <div className={styles.wrapper}>
        <header className={styles.portfolio}>
          <div className={styles.infoBox}>
            CASH<span>{fmt(cash)}</span>
          </div>
          <div className={styles.infoBox}>
            ALL<span>{fmt(totalAsset)}</span>
          </div>
          <div className={styles.infoBox}>
            MY TRADE<span>{shares}</span> หุ้น
          </div>
        </header>

        <main className={styles.board}>
          <div>
            <h2>
              TRADE<span className={styles.stockName}>GAMEX (GX)</span>
            </h2>
            <div className={styles.priceDisplay}>
              ราคาปัจจุบัน:{' '}
              <span
                className={
                  diff > 0 ? styles.priceUp : diff < 0 ? styles.priceDown : styles.priceFlat
                }
              >
                {fmt(price)}
              </span>{' '}
              <span
                className={
                  diff > 0
                    ? styles.changeUp
                    : diff < 0
                      ? styles.changeDown
                      : styles.changeNeutral
                }
              >
                {diff > 0
                  ? `(+${percent.toFixed(2)}%)`
                  : diff < 0
                    ? `(${percent.toFixed(2)}%)`
                    : '(0.00%)'}
              </span>
            </div>
          </div>

          <div className={styles.graph}>
            <div className={styles.chart}>
              {history.map((p, i) => (
                <div
                  key={i}
                  className={styles.bar}
                  style={{
                    height: `${((p - minH) / range) * 80 + 10}%`,
                    backgroundColor:
                      i > 0 ? (p >= history[i - 1] ? '#19cb69' : '#f44336') : '#19cb69',
                  }}
                />
              ))}
            </div>
          </div>

          <section className={styles.controls}>
            <div className={styles.inputRow}>
              <label htmlFor="shareAmount">จำนวนหุ้นที่ต้องการ:</label>
              <input
                type="number"
                id="shareAmount"
                value={amount}
                min={1}
                onChange={(e) => setAmount(parseInt(e.target.value) || 0)}
              />
            </div>
            <div className={styles.buttons}>
              <button className={styles.buyBtn} onClick={buy}>
                BUY
              </button>
              <button className={styles.sellBtn} onClick={sell}>
                SELL
              </button>
            </div>
          </section>
        </main>

        <div className={styles.nav}>
          <Link href="/">Home</Link>
          <Link href="/manga">Manga</Link>
          <Link href="/game">Quiz</Link>
        </div>
      </div>
    </main>
  );
}
