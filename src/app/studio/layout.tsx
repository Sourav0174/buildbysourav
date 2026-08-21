import * as React from "react"
import Link from "next/link"
import { logout } from "@/core/actions/auth"
import { Button } from "@/components/ui/button"
import { 
  LayoutDashboard, 
  Package, 
  MessageSquare, 
  Settings, 
  LogOut 
} from "lucide-react"

const sidebarLinks = [
  { href: "/studio", label: "Dashboard", icon: LayoutDashboard },
  { href: "/studio/products", label: "Products", icon: Package },
  { href: "/studio/messages", label: "Messages", icon: MessageSquare },
  { href: "/studio/settings", label: "Settings", icon: Settings },
]

export default function StudioLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen bg-[#050505] text-white selection:bg-white/20">
      {/* Sidebar */}
      <aside className="w-64 border-r border-white/10 flex flex-col">
        <div className="p-6 border-b border-white/10">
          <Link href="/studio" className="flex items-center gap-3">
            <div className="h-6 w-6 bg-white" />
            <span className="font-bold tracking-tight text-lg">Studio</span>
          </Link>
        </div>
        
        <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
          {sidebarLinks.map((link) => (
            <Link 
              key={link.href} 
              href={link.href}
              className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-white/60 hover:text-white hover:bg-white/5 transition-colors"
            >
              <link.icon className="h-4 w-4" />
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="p-4 border-t border-white/10">
          <form action={logout}>
            <Button variant="ghost" className="w-full justify-start gap-3 text-white/60 hover:text-white hover:bg-white/5" type="submit">
              <LogOut className="h-4 w-4" />
              Logout
            </Button>
          </form>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto">
        <div className="max-w-6xl mx-auto p-8 md:p-12">
          {children}
        </div>
      </main>
    </div>
  )
}
