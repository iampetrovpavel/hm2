import type { ReactNode } from "react"
import { Navigation } from "@/components/navigation"
import { TopBar } from "@/components/layout/top-bar"

interface PageContainerProps {
  children: ReactNode
  title: string
  showBackButton?: boolean
  action?: ReactNode
}

export function PageContainer({ children, title, showBackButton = false, action }: PageContainerProps) {
  return (
    <div className="flex flex-col min-h-screen">
      <header style={{top: 57}} className="sticky z-10 border-b border-slate-300 shadow-md bg-background px-6 ">
        <div className="container flex h-14 items-center justify-between max-w-5xl mx-auto">
          <h1 className="text-xl font-semibold">{title}</h1>
          {action && <div>{action}</div>}
        </div>
      </header>
      <main className="px-2 lg:px-0 container pb-30 max-w-5xl mx-auto grow flex flex-col">{children}</main>
    </div>
  )
}

export default PageContainer
