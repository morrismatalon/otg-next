'use client'

import { useState, useTransition } from 'react'
import Image from 'next/image'
import type { Listing } from '@/lib/data'
import { updateListing, deleteListing } from '@/app/dashboard/listings/actions'
import styles from '@/styles/ListingManager.module.css'

interface Props {
  listings: Listing[]
}

interface EditForm {
  title: string
  description: string
  price: string
  category: string
}

export default function ListingManager({ listings: initial }: Props) {
  const [listings, setListings] = useState(initial)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editForm, setEditForm] = useState<EditForm>({ title: '', description: '', price: '', category: '' })
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [isPending, startTransition] = useTransition()

  function openEdit(listing: Listing) {
    setEditingId(listing.id)
    setEditForm({
      title: listing.name,
      description: listing.description,
      price: String(listing.priceNum),
      category: listing.category,
    })
    setError(null)
  }

  function cancelEdit() {
    setEditingId(null)
    setError(null)
  }

  function handleSave(listing: Listing) {
    const priceNum = parseFloat(editForm.price)
    if (!editForm.title.trim() || !editForm.price.trim() || isNaN(priceNum) || priceNum <= 0) {
      setError('Title and a valid price are required.')
      return
    }
    startTransition(async () => {
      const result = await updateListing(listing.id, {
        title: editForm.title.trim(),
        description: editForm.description.trim(),
        price: priceNum,
        price_display: `${listing.currency} ${priceNum.toLocaleString('en', { minimumFractionDigits: 0 })}`,
        category: editForm.category.trim(),
      })
      if (result.error) {
        setError(result.error)
        return
      }
      setListings((prev) =>
        prev.map((l) =>
          l.id === listing.id
            ? {
                ...l,
                name: editForm.title.trim(),
                description: editForm.description.trim(),
                priceNum,
                price: `${listing.currency} ${priceNum.toLocaleString('en', { minimumFractionDigits: 0 })}`,
                category: editForm.category.trim(),
              }
            : l
        )
      )
      setEditingId(null)
    })
  }

  function handleDelete(id: string) {
    startTransition(async () => {
      const result = await deleteListing(id)
      if (result.error) {
        setError(result.error)
        setConfirmDeleteId(null)
        return
      }
      setListings((prev) => prev.filter((l) => l.id !== id))
      setConfirmDeleteId(null)
    })
  }

  if (listings.length === 0) {
    return (
      <div className={styles.empty}>
        <p>No listings yet. Head to the dashboard to add your first piece.</p>
      </div>
    )
  }

  return (
    <div className={styles.list}>
      {error && <div className={styles.errorBanner}>{error}</div>}
      {listings.map((listing) => (
        <div key={listing.id} className={styles.row}>
          <div className={styles.imgWrap}>
            <Image
              src={listing.imageSrc}
              alt={listing.name}
              fill
              style={{ objectFit: 'cover' }}
              sizes="80px"
            />
          </div>

          {editingId === listing.id ? (
            <div className={styles.editForm}>
              <input
                className={styles.input}
                value={editForm.title}
                onChange={(e) => setEditForm((f) => ({ ...f, title: e.target.value }))}
                placeholder="Title"
              />
              <textarea
                className={styles.textarea}
                value={editForm.description}
                onChange={(e) => setEditForm((f) => ({ ...f, description: e.target.value }))}
                placeholder="Description"
                rows={3}
              />
              <div className={styles.editRow}>
                <input
                  className={styles.input}
                  value={editForm.price}
                  onChange={(e) => setEditForm((f) => ({ ...f, price: e.target.value }))}
                  placeholder="Price (number)"
                  type="number"
                  min="0"
                  step="any"
                />
                <input
                  className={styles.input}
                  value={editForm.category}
                  onChange={(e) => setEditForm((f) => ({ ...f, category: e.target.value }))}
                  placeholder="Category"
                />
              </div>
              <div className={styles.editActions}>
                <button
                  className={styles.saveBtn}
                  onClick={() => handleSave(listing)}
                  disabled={isPending}
                >
                  {isPending ? 'Saving…' : 'Save'}
                </button>
                <button className={styles.cancelBtn} onClick={cancelEdit} disabled={isPending}>
                  Cancel
                </button>
              </div>
            </div>
          ) : (
            <div className={styles.info}>
              <div className={styles.name}>{listing.name}</div>
              <div className={styles.meta}>
                <span>{listing.price}</span>
                <span>{listing.category}</span>
                <span>{listing.city}</span>
              </div>
              <div className={styles.desc}>{listing.description}</div>
            </div>
          )}

          {editingId !== listing.id && (
            <div className={styles.actions}>
              <button className={styles.editBtn} onClick={() => openEdit(listing)}>
                Edit
              </button>
              {confirmDeleteId === listing.id ? (
                <div className={styles.confirmDelete}>
                  <span>Delete?</span>
                  <button
                    className={styles.confirmYes}
                    onClick={() => handleDelete(listing.id)}
                    disabled={isPending}
                  >
                    Yes
                  </button>
                  <button
                    className={styles.confirmNo}
                    onClick={() => setConfirmDeleteId(null)}
                    disabled={isPending}
                  >
                    No
                  </button>
                </div>
              ) : (
                <button
                  className={styles.deleteBtn}
                  onClick={() => setConfirmDeleteId(listing.id)}
                >
                  Delete
                </button>
              )}
            </div>
          )}
        </div>
      ))}
    </div>
  )
}
