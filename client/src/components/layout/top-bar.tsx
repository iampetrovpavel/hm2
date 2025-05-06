import { Link } from "react-router-dom"
import { Gem } from "lucide-react"

export function TopBar() {
  return (
    <div className="sticky top-0 z-20 border-b bg-slate-600">
      <div className="container flex h-14 items-center max-w-5xl mx-auto">
        <Link to="/" className="flex items-center gap-2 font-bold text-xl text-white ml-6 lg:ml-0">
          {/* <Gem className="h-6 w-6" /> */}
          <span>Heavy materials</span>
        </Link>
      </div>
    </div>
  )
}

export default TopBar