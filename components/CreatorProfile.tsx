import Link from 'next/link'
import styles from '@/styles/CreatorProfile.module.css'
import { getAllDesigners } from '@/lib/data'

export default async function CreatorProfile() {
  const designers = await getAllDesigners()
  const featured = designers.slice(0, 3)

  return (
    <>
      <div className={styles.secRow}>
        <span className="lbl">Featured studios</span>
        <Link href="/designers" className={styles.secLink}>All designers →</Link>
      </div>
      <div className={styles.designers}>
        {featured.map((d) => (
          <Link
            key={d.id}
            href={`/designers/${d.id}`}
            className={styles.dCard}
            style={{ display: 'block', textDecoration: 'none', color: 'inherit' }}
          >
            <div className={styles.dInit}>{d.initials}</div>
            <div className={styles.dName}>{d.name}</div>
            <div className={styles.dMeta}>
              Studio No. {d.studioNo} · {d.city}<br />
              {d.specialty} · {d.listingCount} listings
            </div>
            <div className={styles.dStatus}>
              <div className={`${styles.dDot}${d.commissions ? '' : ' ' + styles.off}`} />
              <span className={`${styles.dDotLbl}${d.commissions ? '' : ' ' + styles.off}`}>
                {d.commissions ? 'Open commissions' : 'Listings only'}
              </span>
            </div>
          </Link>
        ))}
      </div>
    </>
  )
}
