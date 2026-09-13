import { notFound } from "next/navigation";
import { getProductById } from "@/lib/products";
import { ProductForm } from "@/components/admin/ProductForm";
import { ProductPhotoManager } from "@/components/admin/ProductPhotoManager";
import { ProductDeleteButton } from "@/components/admin/ProductDeleteButton";

export default async function EditProductPage({ params }: { params: Promise<{ id: string }> }) {
  const product = await getProductById((await params).id);
  if (!product) notFound();
  return <div className="max-w-3xl"><h1 className="mb-6 text-2xl font-semibold">Редактировать товар № {product.number}</h1><ProductPhotoManager productId={product.id} photos={product.photos} /><ProductForm product={product} /><div className="mt-8 border-t border-border pt-6"><ProductDeleteButton productId={product.id} /></div></div>;
}
