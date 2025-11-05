"use client"

import { motion } from "framer-motion"
import { Home, ShoppingBag, Package, Settings, BarChart3, Users } from "lucide-react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

const menuItems = [
  { icon: Home, label: "Dashboard", href: "/admin/dashboard" },
  { icon: ShoppingBag, label: "Đơn hàng", href: "/admin/orders" },
  { icon: Package, label: "Menu", href: "/admin/menu" },
  { icon: Users, label: "Người dùng", href: "/admin/users" },
  { icon: BarChart3, label: "Thống kê", href: "/admin/analytics" },
  { icon: Settings, label: "Cài đặt", href: "/admin/settings" },
]

export function AdminSidebar() {
  const pathname = usePathname()

  return (
    <motion.aside
      initial={{ x: -50, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      className="w-20 lg:w-64 bg-[#F7EFE5] dark:bg-[#45301f] border-r border-[#E4D9C9] dark:border-[#7B5433] min-h-screen flex-shrink-0"
    >
      <div className="p-3 lg:p-6">
        {/* Logo - Mobile: chỉ icon, Desktop: full */}
        <div className="flex items-center justify-center lg:justify-start gap-3 mb-6 lg:mb-8">
          <img src="/favicon.png" alt="ALo Coffee" className="w-10 h-10 rounded-xl shadow-md" />
          <div className="hidden lg:block">
            <h2 className="text-[#3A2C20] dark:text-[#FFF6E8] font-bold text-lg" style={{ fontFamily: 'Playfair Display, serif' }}>ALo Coffee</h2>
            <p className="text-[#B26A36] dark:text-[#DDB97A] text-xs">Admin Portal</p>
          </div>
        </div>

        {/* Navigation */}
        <nav className="space-y-2">
          <TooltipProvider delayDuration={0}>
            {menuItems.map((item) => {
              const isActive = pathname === item.href || (item.href === "/admin/dashboard" && pathname === "/admin")
              const Icon = item.icon
              
              return (
                <Tooltip key={item.href}>
                  <TooltipTrigger asChild>
                    <Link href={item.href}>
                      <motion.div
                        whileHover={{ x: 4 }}
                        transition={{ duration: 0.2, ease: "easeInOut" }}
                        className={`flex items-center justify-center lg:justify-start gap-3 px-3 lg:px-4 py-3 rounded-xl transition-all duration-300 ${
                          isActive
                            ? "bg-[#E3D2BC] dark:bg-[#4C2F1B] border-l-4 border-[#B26A36] dark:border-[#DDB97A] text-[#3A2C20] dark:text-[#FFF6E8] font-semibold shadow-sm"
                            : "text-[#5A4640] dark:text-[#C4B5A8] hover:bg-[#EDE3D4] dark:hover:bg-[#3B2418]"
                        }`}
                      >
                        <Icon className={`w-5 h-5 flex-shrink-0 ${isActive ? 'opacity-100' : 'opacity-80'}`} />
                        <span className="hidden lg:block font-medium">{item.label}</span>
                      </motion.div>
                    </Link>
                  </TooltipTrigger>
                  <TooltipContent side="right" className="lg:hidden">
                    <p>{item.label}</p>
                  </TooltipContent>
                </Tooltip>
              )
            })}
          </TooltipProvider>
        </nav>
      </div>
    </motion.aside>
  )
}
