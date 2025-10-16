// This is a simple demo endpoint you can swap for a real provider later.

function hashString(str) {
  // djb2 simple hash for deterministic seed
  let hash = 5381
  for (let i = 0; i < str.length; i++) {
    hash = (hash * 33) ^ str.charCodeAt(i)
  }
  return Math.abs(hash)
}

export async function POST(req) {
  try {
    const body = await req.json()
    const prompt = (body?.prompt || "portrait").toString().slice(0, 200)
    const style = (body?.style || "default").toString()
    const count = Math.min(Math.max(Number.parseInt(body?.count ?? 4, 10) || 4, 1), 12)
    const size = Math.min(Math.max(Number.parseInt(body?.size ?? 1024, 10) || 1024, 128), 2048)

    // Derive a deterministic base seed from prompt + style
    const baseSeed = hashString(`${prompt}:${style}:${size}`)

    // For a "CDN-like" stable image URL, we use picsum.photos/seed which is backed by a CDN.
    const images = Array.from({ length: count }).map((_, i) => {
      const seed = `${baseSeed}-${i + 1}`
      const cdnUrl = `https://picsum.photos/seed/${encodeURIComponent(seed)}/${size}/${size}`
      return {
        id: `${seed}`,
        prompt,
        style,
        width: size,
        height: size,
        cdnUrl,
      }
    })

    return new Response(JSON.stringify({ images }), {
      status: 200,
      headers: { "content-type": "application/json" },
    })
  } catch (err) {
    console.error(err)
    return new Response(JSON.stringify({ error: "Invalid request" }), {
      status: 400,
      headers: { "content-type": "application/json" },
    })
  }
}
