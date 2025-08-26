

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const query = searchParams.get("query")
    const locale = searchParams.get("locale") || "en"

    let products = await import("@/context/data.json").then(m => m.default)

    if (query) {
      products = products.filter(product => {
        const name = product.product_name?.[locale] || product.product_name?.en || ""
        const description = product.description?.[locale] || product.description?.en || ""
        const searchText = `${name} ${description}`.toLowerCase()
        return searchText.includes(query.toLowerCase())
      })
    }

    return Response.json({success: true,products,total: products.length})
  } catch (error) {
    console.error("Search API error:", error)
    return Response.json(
      { success: false, error: "Internal server error" },
      { status: 500 }
    )
  }
}
