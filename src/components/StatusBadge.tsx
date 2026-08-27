import type { AnimalStatus } from "@prisma/client";
import { STATUS_LABELS, STATUS_STYLES } from "@/lib/format";
import { cn } from "@/lib/cn";

export function StatusBadge({ status }: { status: AnimalStatus }) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium",
        STATUS_STYLES[status]
      )}
    >
      {STATUS_LABELS[status]}
    </span>
  );
}
