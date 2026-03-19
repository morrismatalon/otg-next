'use client'

import { useState, useRef, useEffect, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import styles from '@/styles/NavSearch.module.css'

interface SearchResult {
  type: 'listing' | 'designer'
  id: string
  title: string
  sub: string
  href: string
}

export default function NavSearch() {
  const [query, setQuery] = useState('')
  const [results, setResults] = useState<SearchResult[]>([])
  const [open, setOpen] = useState(false)
  const [focused, setFocused] = useState(false)
  const [, startTransition] = useTransition()
  const inputRef = useRef<HTMLInputElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const router = useRouter()
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false)
        setFocused(false)
      }
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [])

  async function search(q: string) {
    if (q.trim().length < 2) {
      setResults([])
      setOpen(false)
      return
    }

    const supabase = createClient()
    const term = q.trim()

    const [{ data: listings }, { data: designers }] = await Promise.all([
      supabase
        .from('listings')
        .select('id, title, category, city, designers(name)')
        .ilike('title', `%${term}%`)
        .limit(5),
      supabase
        .from('designers')
        .select('id, name, city, specialty')
        .ilike('name', `%${term}%`)
        .eq('verified', true)
        .limit(3),
    ])

    const listingResults: SearchResult[] = (listings ?? []).map((l) => ({
      type: 'listing',
      id: l.id,
      title: l.title,
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      sub: `${(l.designers as any)?.name ?? ''} · ${l.category} · ${l.city}`,
      href: `/listings/${l.id}`,
    }))

    const designerResults: SearchResult[] = (designers ?? []).map((d) => ({
      type: 'designer',
      id: d.id,
      title: d.name,
      sub: `${d.specialty} · ${d.city}`,
      href: `/designers/${d.id}`,
    }))

    const combined = [...designerResults, ...listingResults]
    setResults(combined)
    setOpen(combined.length > 0)
  }

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const val = e.target.value
    setQuery(val)
    if (debounceRef.current) clearTimeout(debounceRef.current)
    debounceRef.current = setTimeout(() => {
      startTransition(() => { search(val) })
    }, 220)
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === 'Escape') {
      setOpen(false)
      inputRef.current?.blur()
    }
    if (e.key === 'Enter' && query.trim()) {
      setOpen(false)
      router.push(`/browse?q=${encodeURIComponent(query.trim())}`)
    }
  }

  function handleSelect(href: string) {
    setOpen(false)
    setQuery('')
    router.push(href)
  }

  return (
    <div className={`${styles.wrap} ${focused ? styles.wrapFocused : ''}`} ref={containerRef}>
      <div className={styles.inputRow}>
        <svg className={styles.icon} width="11" height="11" viewBox="0 0 11 11" fill="none">
          <circle cx="4.5" cy="4.5" r="3.5" stroke="currentColor" strokeWidth="1.2"/>
          <line x1="7.5" y1="7.5" x2="10" y2="10" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/>
        </svg>
        <input
          ref={inputRef}
          className={styles.input}
          type="text"
          placeholder="Search listings, designers…"
          value={query}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          onFocus={() => {
            setFocused(true)
            if (results.length > 0) setOpen(true)
          }}
          autoComplete="off"
          spellCheck={false}
        />
        {query && (
          <button
            className={styles.clear}
            onClick={() => { setQuery(''); setResults([]); setOpen(false); inputRef.current?.focus() }}
            tabIndex={-1}
            aria-label="Clear"
          >
            ×
          </button>
        )}
      </div>

      {open && results.length > 0 && (
        <div className={styles.dropdown}>
          {results.some(r => r.type === 'designer') && (
            <div className={styles.groupLabel}>Designers</div>
          )}
          {results.filter(r => r.type === 'designer').map((r) => (
            <button key={r.id} className={styles.result} onClick={() => handleSelect(r.href)}>
              <span className={styles.resultTitle}>{r.title}</span>
              <span className={styles.resultSub}>{r.sub}</span>
            </button>
          ))}
          {results.some(r => r.type === 'listing') && (
            <div className={styles.groupLabel}>Listings</div>
          )}
          {results.filter(r => r.type === 'listing').map((r) => (
            <button key={r.id} className={styles.result} onClick={() => handleSelect(r.href)}>
              <span className={styles.resultTitle}>{r.title}</span>
              <span className={styles.resultSub}>{r.sub}</span>
            </button>
          ))}
          <button
            className={styles.seeAll}
            onClick={() => handleSelect(`/browse?q=${encodeURIComponent(query)}`)}
          >
            See all results for &ldquo;{query}&rdquo; →
          </button>
        </div>
      )}
    </div>
  )
}
