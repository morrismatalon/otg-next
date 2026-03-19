import styles from '@/styles/Ticker.module.css'

const items = [
  { text: '— New listing: ', bold: 'Asymmetric coat', suffix: ' · Yuto M.' },
  { text: '— Studio verified: ', bold: 'No. 0048', suffix: '' },
  { text: '— New listing: ', bold: 'Deconstructed overshirt', suffix: ' · Reiko A.' },
  { text: '— Application under review', bold: '', suffix: '' },
  { text: '— New listing: ', bold: 'Raw hem trousers', suffix: ' · Dara O.' },
  { text: '— Studio verified: ', bold: 'No. 0049', suffix: '' },
  { text: '— New listing: ', bold: 'Panel bomber', suffix: ' · N. Ferreira' },
]

export default function Ticker() {
  const doubled = [...items, ...items]
  return (
    <div className={styles.ticker}>
      <div className={styles.tickerInner}>
        {doubled.map((item, i) => (
          <span key={i} className={styles.tItem}>
            {item.text}
            {item.bold && <b>{item.bold}</b>}
            {item.suffix}
          </span>
        ))}
      </div>
    </div>
  )
}
