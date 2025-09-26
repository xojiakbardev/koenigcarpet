import { use } from "react"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import Link from "next/link"
import { RugProduct } from "@/types/product" // sizdagi type nomi
import { normalizeValue } from "@/lib/normalize"

const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000"

interface Props {
  params: Promise<{ locale: string }>
  searchParams: Promise<{ sortBy: string }>
}

export default function AdminPage({ params, searchParams }: Props) {
  const sortBy = use(searchParams).sortBy || "price"
  const pathParams = { locale: use(params).locale }

  const data = use(
    fetch(`${baseUrl}/api/products?sortBy=${sortBy}`, {
      cache: "no-store",
      headers: { "accept-language": pathParams.locale },
    }).then((res) => res.json())
  ) as { products: RugProduct[] }

  const products = data.products

  return (
    <div className="p-6">
      <div className="flex justify-between mb-4">
        <h1 className="text-2xl font-bold">Admin – Products</h1>
        <Link href="/admin/add">
          <Button>Add Product</Button>
        </Link>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Price</TableHead>
            <TableHead>Color</TableHead>
            <TableHead>Collection</TableHead>
            <TableHead>Style</TableHead>
            <TableHead>Stock</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {products.map((p) => {
            const color = normalizeValue(p.color)
            const collection = normalizeValue(p.collection)
            const style = normalizeValue(p.style)

            return (
              <TableRow key={p.id}>
                <TableCell>{p.product_name.en}</TableCell>
                <TableCell>${p.price}</TableCell>
                <TableCell>{color.en} ({color.value})</TableCell>
                <TableCell>{collection.en} ({collection.value})</TableCell>
                <TableCell>{style.en} ({style.value})</TableCell>
                <TableCell>{p.inStock ? "✅" : "❌"}</TableCell>
                <TableCell className="space-x-2">
                  <Link href={`/admin/${p.id}/edit`}>
                    <Button variant="outline">Edit</Button>
                  </Link>
                  {/* delete tugma keyin server action bilan qilinadi */}
                </TableCell>
              </TableRow>
            )
          })}
        </TableBody>
      </Table>
    </div>
  )
}
