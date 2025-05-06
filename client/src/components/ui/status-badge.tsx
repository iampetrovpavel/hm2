import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"

type QuoteStatus = "draft" | "sent" | "in-approval" | "approved" | "rejected" | "lost" | "won" | "cancelled"

interface StatusBadgeProps {
  status: QuoteStatus
}

export function StatusBadge({ status }: StatusBadgeProps) {
  const getStatusColor = (status: QuoteStatus) => {
    switch (status) {
      case "draft":
        return "bg-gray-200 text-gray-800"
      case "sent":
        return "bg-amber-200 text-blue-800"
      case "in-approval":
        return "bg-yellow-100 text-yellow-800"
      case "approved":
        return "bg-lime-200 text-green-800"
      case "rejected":
        return "bg-red-100 text-red-800"
      case "lost":
        return "bg-red-100 text-red-800"
      case "won":
        return "bg-green-300 text-green-800"
      case "cancelled":
        return "bg-gray-100 text-gray-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  return (
    <Badge variant="outline" className={cn("font-normal capitalize px-4 py-1 rounded-none", getStatusColor(status))}>
      {status.replace("-", " ")}
    </Badge>
  )
}

export default StatusBadge
