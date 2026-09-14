import type { Metadata } from "next";
import { getOrders, parseOrderItems } from "@/lib/orders";
import { formatDate } from "@/lib/format";
import {
  OrderDeleteButton,
  OrderStatusButton,
} from "@/components/admin/OrderRowActions";

export const metadata: Metadata = {
  title: "Заявки",
};
export const dynamic = "force-dynamic";

export default async function AdminOrdersPage() {
  const orders = await getOrders();

  return (
    <div>
      <h1 className="mb-6 text-2xl font-semibold tracking-tight">
        Заявки на изделия
      </h1>

      {orders.length === 0 ? (
        <p className="rounded-md border border-border bg-card px-4 py-6 text-sm text-muted">
          Заявок пока нет.
        </p>
      ) : (
        <ul className="space-y-4">
          {orders.map((order) => {
            const items = parseOrderItems(order.itemsJson);
            return (
              <li
                key={order.id}
                className="rounded-lg border border-border bg-card p-5"
              >
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <p className="font-medium text-foreground">
                      {order.customerName}{" "}
                      <a
                        href={`tel:${order.phone}`}
                        className="text-accent hover:text-accent-hover"
                      >
                        {order.phone}
                      </a>
                    </p>
                    <p className="mt-0.5 text-xs text-muted">
                      {formatDate(order.createdAt)}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <OrderStatusButton
                      orderId={order.id}
                      status={order.status}
                    />
                    <OrderDeleteButton orderId={order.id} />
                  </div>
                </div>

                <ul className="mt-3 flex flex-wrap gap-2">
                  {items.map((item) => (
                    <li
                      key={item.productId}
                      className="rounded-md border border-border bg-background px-3 py-1 text-sm text-muted"
                    >
                      {item.label}
                    </li>
                  ))}
                </ul>

                {order.comment ? (
                  <p className="mt-3 border-t border-border pt-3 text-sm leading-relaxed text-muted">
                    {order.comment}
                  </p>
                ) : null}
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
