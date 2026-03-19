import Nav from '@/components/Nav'
import Footer from '@/components/Footer'
import DesignerGrid from '@/components/DesignerGrid'
import { getAllDesigners } from '@/lib/data'
import styles from '@/styles/DesignersBrowse.module.css'

export default async function DesignersPage() {
  const designers = await getAllDesigners()

  return (
    <>
      <Nav />

      <div className={styles.pageHead}>
        <div className={styles.eyebrow}>Verified studios</div>
        <h1 className={styles.headline}>
          All designers.<br />
          <em>Every one verified.</em>
        </h1>
      </div>

      <DesignerGrid designers={designers} />

      <Footer />
    </>
  )
}
