'use client'

import { useActionState, useState, useRef } from 'react'
import { createListing, type NewListingState } from '@/app/dashboard/new-listing/actions'
import { createClient } from '@/lib/supabase/client'
import styles from '@/styles/NewListing.module.css'

const initialState: NewListingState = {}

const CATEGORIES = ['Outerwear', 'Tops', 'Bottoms', 'Accessories', 'Footwear', 'Other']
const CURRENCIES = [
  { value: 'JPY', label: 'JPY (¥)' },
  { value: 'GBP', label: 'GBP (£)' },
  { value: 'EUR', label: 'EUR (€)' },
  { value: 'KRW', label: 'KRW (₩)' },
  { value: 'USD', label: 'USD ($)' },
]

export default function NewListingForm() {
  const [state, formAction, pending] = useActionState(createListing, initialState)
  const [imageUrl, setImageUrl] = useState('')
  const [uploading, setUploading] = useState(false)
  const [uploadErr, setUploadErr] = useState('')
  const [preview, setPreview] = useState('')
  const fileRef = useRef<HTMLInputElement>(null)

  async function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return

    setUploadErr('')
    setUploading(true)

    try {
      const supabase = createClient()
      const ext = file.name.split('.').pop()
      const path = `listings/${Date.now()}.${ext}`

      const { error } = await supabase.storage
        .from('listing-images')
        .upload(path, file, { upsert: true })

      if (error) throw error

      const { data: { publicUrl } } = supabase.storage
        .from('listing-images')
        .getPublicUrl(path)

      setImageUrl(publicUrl)
      setPreview(URL.createObjectURL(file))
    } catch (err) {
      setUploadErr('Upload failed. Please try again.')
      console.error(err)
    } finally {
      setUploading(false)
    }
  }

  return (
    <form className={styles.form} action={formAction}>
      {/* Hidden field for uploaded image URL */}
      <input type="hidden" name="imageUrl" value={imageUrl} />

      <div className={styles.fieldGroup}>
        <label className={styles.label}>Photo</label>
        <div
          className={`${styles.uploadArea} ${preview ? styles.uploadAreaFilled : ''}`}
          onClick={() => fileRef.current?.click()}
        >
          {preview ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={preview} alt="Preview" className={styles.preview} />
          ) : (
            <div className={styles.uploadPlaceholder}>
              <span className={styles.uploadIcon}>+</span>
              <span className={styles.uploadText}>
                {uploading ? 'Uploading…' : 'Click to upload photo'}
              </span>
            </div>
          )}
        </div>
        <input
          ref={fileRef}
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          style={{ display: 'none' }}
        />
        {uploadErr && <div className={styles.fieldError}>{uploadErr}</div>}
        {preview && (
          <button
            type="button"
            className={styles.removePhoto}
            onClick={() => { setPreview(''); setImageUrl('') }}
          >
            Remove photo
          </button>
        )}
      </div>

      <div className={styles.fieldGroup}>
        <label className={styles.label} htmlFor="title">Title *</label>
        <input
          id="title"
          name="title"
          className={styles.input}
          type="text"
          placeholder="e.g. Panel bomber, iridescent shell"
          required
        />
      </div>

      <div className={styles.fieldGroup}>
        <label className={styles.label} htmlFor="description">Description</label>
        <textarea
          id="description"
          name="description"
          className={styles.textarea}
          placeholder="Describe the piece — materials, fit, edition size, care."
          rows={5}
        />
      </div>

      <div className={styles.row}>
        <div className={styles.fieldGroup}>
          <label className={styles.label} htmlFor="price">Price *</label>
          <input
            id="price"
            name="price"
            className={styles.input}
            type="number"
            step="0.01"
            min="0"
            placeholder="0"
            required
          />
        </div>

        <div className={styles.fieldGroup}>
          <label className={styles.label} htmlFor="currency">Currency *</label>
          <select id="currency" name="currency" className={styles.select} defaultValue="JPY" required>
            {CURRENCIES.map((c) => (
              <option key={c.value} value={c.value}>{c.label}</option>
            ))}
          </select>
        </div>
      </div>

      <div className={styles.fieldGroup}>
        <label className={styles.label} htmlFor="category">Category *</label>
        <select id="category" name="category" className={styles.select} defaultValue="" required>
          <option value="" disabled>Select category</option>
          {CATEGORIES.map((c) => (
            <option key={c} value={c}>{c}</option>
          ))}
        </select>
      </div>

      {state.error && (
        <div className={styles.formError}>{state.error}</div>
      )}

      <div>
        <button
          type="submit"
          className={styles.submit}
          disabled={pending || uploading}
        >
          {pending ? 'Creating…' : 'Create listing'}
        </button>
        <div className={styles.note}>
          Your listing will be live immediately.
        </div>
      </div>
    </form>
  )
}
