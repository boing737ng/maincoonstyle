import type { AnimalStatus } from "@prisma/client";
import { STATUS_LABELS, STATUS_STYLES } from "@/lib/format";
import { cn } from "@/lib/cn";

export function StatusBadge({ status }: { status: AnimalStatus }) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-md border px-2 py-1 text-xs font-semibold backdrop-blur-sm",
        STATUS_STYLES[status]
      )}
    >
      {STATUS_LABELS[status]}
    </span>
  );
}
