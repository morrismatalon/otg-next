'use client'

import { useTransition } from 'react'
import { updateApplicationStatus } from '@/app/admin/actions'
import styles from '@/styles/Admin.module.css'

export default function AdminApproveButtons({
  id,
  status,
}: {
  id: string
  status: string
}) {
  const [isPending, startTransition] = useTransition()

  function handleUpdate(newStatus: 'approved' | 'rejected') {
    startTransition(async () => {
      await updateApplicationStatus(id, newStatus)
    })
  }

  if (status !== 'pending') {
    return (
      <span className={`${styles.badge} ${status === 'approved' ? styles.badgeApproved : styles.badgeRejected}`}>
        {status}
      </span>
    )
  }

  return (
    <div className={styles.actionBtns}>
      <button
        className={styles.approveBtn}
        onClick={() => handleUpdate('approved')}
        disabled={isPending}
      >
        Approve
      </button>
      <button
        className={styles.rejectBtn}
        onClick={() => handleUpdate('rejected')}
        disabled={isPending}
      >
        Reject
      </button>
    </div>
  )
}
