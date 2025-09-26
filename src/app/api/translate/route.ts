import { NextResponse } from "next/server"

type Lang = "en" | "ru" | "tr"

async function translateWithDeepL(value: string, target: Lang): Promise<string> {
  const apiKey = "891f7991-37d2-4031-b362-6ae9bce8665e:fx"

  const url = `https://api-free.deepl.com/v2/translate`

  const params = new URLSearchParams({
    auth_key: apiKey,
    text: value,
    target_lang: target.toUpperCase(),
  })

  const res = await fetch(url, {
    method: "POST",
    body: params,
  })

  if (!res.ok) {
    const errText = await res.text()
    console.error("DeepL API error:", errText)
    throw new Error("Failed to translate")
  }

  const data = await res.json()
  return data.translations[0].text
}

export async function POST(req: Request) {
  try {
    const { lang, value } = await req.json()

    if (!lang || !value) {
      return NextResponse.json({ error: "Invalid params" }, { status: 400 })
    }

    const targets: Lang[] = ["en", "ru", "tr"].filter((l) => l !== lang) as Lang[]

    const translations: Record<string, string> = {}
    for (const t of targets) {
      translations[t] = await translateWithDeepL(value, t)
    }

    return NextResponse.json({ translations })
  } catch (err) {
    console.error("Translate API error:", err)
    return NextResponse.json({ error: "Server error" }, { status: 500 })
  }
}
