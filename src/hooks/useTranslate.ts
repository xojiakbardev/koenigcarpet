"use client"

import { useState, useEffect } from "react"
import { useDebounce } from "./useDebounce"

type Lang = "en" | "ru" | "tr"

export function useTranslate(value: string, lang: Lang) {
  const debounced = useDebounce(value, 600)
  const [translations, setTranslations] = useState<{ ru?: string; tr?: string }>({})
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (!debounced || !lang) return

    const fetchTranslations = async () => {
      setLoading(true)
      try {
        const res = await fetch("/api/translate", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ lang, value: debounced }),
        })
        const data = await res.json()
        setTranslations(data.translations || {})
      } catch (err) {
        console.error("Translate failed", err)
      } finally {
        setLoading(false)
      }
    }

    fetchTranslations()
  }, [debounced, lang])

  return { translations, loading }
}
