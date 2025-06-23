export async function POST(req) {
  const { text } = await req.json()

  if (!text || text.length < 10) {
    return Response.json({ error: "Text too short" }, { status: 400 })
  }

  const GEMINI_API_KEY = process.env.GEMINI_API_KEY
  const model = "models/gemini-2.5-flash"
  const url = `https://generativelanguage.googleapis.com/v1beta/${model}:generateContent?key=${GEMINI_API_KEY}`

  try {
    const res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [
          {
            parts: [
              {
         text: `
Improve this resume text by:
- Correcting grammar and spelling
- Replacing weak words with strong, ATS-optimized alternatives

Do not:
- Add, remove, or rearrange any words or sentences
- Add quotes, prefixes, or explanations

Return only the improved version as plain text:

${text}
`.trim()
              }
            ]
          }
        ],
        generationConfig: {
          temperature: 0.2,
          topP: 0.8,
          topK: 40
        }
      })
    })

    const json = await res.json()

    if (!res.ok) {
      return Response.json({ error: json.error?.message || "Gemini API error" }, { status: 500 })
    }

    const enhanced = json.candidates?.[0]?.content?.parts?.[0]?.text?.trim()
    if (!enhanced) {
      return Response.json({ error: "No enhanced content" }, { status: 500 })
    }

    return Response.json({ result: enhanced })
  } catch (err) {
    console.error("API error:", err)
    return Response.json({ error: "Failed to call Gemini API" }, { status: 500 })
  }
}
