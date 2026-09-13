"use client";

import type { ProductPhoto } from "@prisma/client";
import { useActionState } from "react";
import { deleteProductPhotoAction, setProductCoverAction } from "@/app/admin/actions";
import { publicUrl } from "@/lib/shared";

export function ProductPhotoManager({ productId, photos }: { productId: string; photos: ProductPhoto[] }) {
  if (!photos.length) return null;
  return <div className="mb-8 rounded-lg border border-border bg-card p-4"><p className="mb-3 text-sm font-medium">Существующие фото</p><ul className="grid grid-cols-2 gap-3 sm:grid-cols-3">{photos.map((photo, index) => <Photo key={photo.id} photo={photo} productId={productId} index={index} />)}</ul></div>;
}
function Photo({ photo, productId, index }: { photo: ProductPhoto; productId: string; index: number }) {
  const [, coverAction, coverPending] = useActionState(setProductCoverAction, { ok: false });
  const [, deleteAction, deletePending] = useActionState(deleteProductPhotoAction, { ok: false });
  return <li className="overflow-hidden rounded-md border border-border"><img src={publicUrl(photo.objectKey)} alt={`Фото ${index + 1}`} className="h-24 w-full object-cover" /><div className="flex justify-between gap-1 p-2 text-xs"><form action={coverAction}><input name="productId" type="hidden" value={productId} /><input name="photoId" type="hidden" value={photo.id} /><button disabled={coverPending} className="text-accent">{photo.isCover ? "Обложка" : "Сделать обложкой"}</button></form><form action={deleteAction}><input name="productId" type="hidden" value={productId} /><input name="photoId" type="hidden" value={photo.id} /><button disabled={deletePending} className="text-red-400">Удалить</button></form></div></li>;
}
