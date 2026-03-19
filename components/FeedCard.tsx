import Image from 'next/image'
import styles from '@/styles/FeedCard.module.css'

interface FeedCardProps {
  imageSrc: string
  designer: string
  name: string
  price: string
  city: string
}

export default function FeedCard({ imageSrc, designer, name, price, city }: FeedCardProps) {
  return (
    <div className={styles.card}>
      <div className={styles.cardImg}>
        <Image
          src={imageSrc}
          alt={name}
          fill
          style={{ objectFit: 'cover' }}
          sizes="(max-width: 768px) 50vw, 25vw"
        />
      </div>
      <div className={styles.cardDesigner}>{designer}</div>
      <div className={styles.cardName}>{name}</div>
      <div className={styles.cardFoot}>
        <span className={styles.cardPrice}>{price}</span>
        <span className={styles.cardCity}>{city}</span>
      </div>
    </div>
  )
}
