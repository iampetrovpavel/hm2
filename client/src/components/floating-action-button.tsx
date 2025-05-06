"use client"

import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import type { LucideIcon } from "lucide-react"

interface FloatingActionButtonProps {
  icon: LucideIcon
  onClick: () => void
  className?: string
  position?: "bottom-right" | "bottom-left"
}

export function FloatingActionButton({
  icon: Icon,
  onClick,
  className,
  position = "bottom-right",
}: FloatingActionButtonProps) {
  const positionClasses = {
    "bottom-right": "bottom-20 right-4",
    "bottom-left": "bottom-20 left-4",
  }

  return (
    <Button
      onClick={onClick}
      size="icon"
      className={cn("rounded-full h-14 w-14 shadow-lg fixed z-10", positionClasses[position], className)}
    >
      <Icon className="h-8 w-8" style={{height: 26, width: 26}}/>
    </Button>
  )
}

export default FloatingActionButton
