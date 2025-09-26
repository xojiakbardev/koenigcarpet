import { normalizeValue } from "@/lib/normalize"

type Lang = "en" | "ru" | "tr"

export interface LocalizedField {
  en: string
  ru: string
  tr: string
  value?: string
}

export async function autoFillTranslations(
  field: LocalizedField,
  sourceLang: Lang = "en"
): Promise<LocalizedField> {
  const text = field[sourceLang]
  if (!text) return field

  const targets: Lang[] = ["en", "ru", "tr"].filter((l) => l !== sourceLang) as Lang[]

  const translations = await Promise.all(
    targets.map(async (lang) => {
      try {
        const res = await fetch("/api/translate", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ text, target: lang }),
        })
        const data = await res.json()
        return { [lang]: data.translatedText || text }
      } catch (err) {
        console.error("translate error", err)
        return { [lang]: text }
      }
    })
  )

  // merge results
  const merged: LocalizedField = { ...field }
  for (const t of translations) Object.assign(merged, t)

  return normalizeValue(merged)
}
