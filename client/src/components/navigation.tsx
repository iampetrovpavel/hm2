import { Link, useLocation } from "react-router-dom"
import { FileText, FileCheck, Package, MessageSquare } from "lucide-react"
import { cn } from "@/lib/utils"

export function Navigation() {
  const location = useLocation()
  const pathname = location.pathname

  const navItems = [
    {
      name: "Chat",
      href: "/chat",
      icon: MessageSquare,
    },
    // {
    //   name: "Requests",
    //   href: "/requests",
    //   icon: FileText,
    // },
    // {
    //   name: "Quotes",
    //   href: "/quotes",
    //   icon: FileCheck,
    // },
    // {
    //   name: "Orders",
    //   href: "/orders",
    //   icon: Package,
    // },
  ]

  return (
    <div className="fixed bottom-0 left-0 right-0 border-t bg-background z-10">
      <nav className="flex justify-around max-w-3xl mx-auto">
        {navItems.map((item) => {
          const isActive = pathname.startsWith(item.href)
          return (
            <Link
              key={item.href}
              to={item.href}
              className={cn(
                "flex flex-col items-center py-3 px-4 text-sm",
                isActive ? "text-primary font-medium" : "text-muted-foreground",
              )}
            >
              <item.icon className="h-5 w-5 mb-1" />
              <span>{item.name}</span>
            </Link>
          )
        })}
      </nav>
    </div>
  )
}

export default Navigation
