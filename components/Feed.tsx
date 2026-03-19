import Link from 'next/link'
import Image from 'next/image'
import styles from '@/styles/Feed.module.css'
import feedCardStyles from '@/styles/FeedCard.module.css'
import { getAllListings } from '@/lib/data'

export default async function Feed() {
  const listings = await getAllListings()
  const featured = listings.slice(0, 8)

  return (
    <>
      <div className={styles.secRow}>
        <span className="lbl">New listings</span>
        <Link href="/browse" className={styles.secLink}>View all →</Link>
      </div>
      <div className={styles.listings}>
        {featured.map((item) => (
          <Link key={item.id} href={`/listings/${item.id}`} className={feedCardStyles.card}>
            <div className={feedCardStyles.cardImg}>
              <Image
                src={item.imageSrc}
                alt={item.name}
                fill
                style={{ objectFit: 'cover' }}
                sizes="(max-width: 768px) 50vw, 25vw"
              />
            </div>
            <div className={feedCardStyles.cardDesigner}>{item.designer}</div>
            <div className={feedCardStyles.cardName}>{item.name}</div>
            <div className={feedCardStyles.cardFoot}>
              <span className={feedCardStyles.cardPrice}>{item.price}</span>
              <span className={feedCardStyles.cardCity}>{item.city}</span>
            </div>
          </Link>
        ))}
      </div>
    </>
  )
}
