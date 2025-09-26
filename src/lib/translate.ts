export async function translate(text: string, lang: "ru" | "tr"): Promise<string> {
  if (!text) return ""

  const res = await fetch("/api/translate", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ text, target: lang }),
  })

  if (!res.ok) {
    console.error("Translation failed")
    return text
  }

  const data = await res.json()
  return data.translatedText || text
}
