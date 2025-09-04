import { Moon, Sun, Menu, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useTheme } from "./ThemeProvider"
import { motion } from "framer-motion"
import { ShinyText } from "./ShinyText"

interface HeaderProps {
  isSidebarVisible: boolean
  toggleSidebar: () => void
}

export function Header({ isSidebarVisible, toggleSidebar }: HeaderProps) {
  const { theme, setTheme } = useTheme()

  const toggleTheme = () => {
    setTheme(theme === "light" ? "dark" : "light")
  }

  return (
    <motion.header
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className="h-16 border-b border-border px-6 flex items-center justify-between shadow-[var(--shadow-soft)] z-10"
      style={{
        background: 'linear-gradient(135deg, rgba(60, 45, 90, 0.95), rgba(80, 65, 110, 0.9))',
        backdropFilter: 'blur(10px)'
      }}
    >
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.1 }}
        className="flex items-center gap-3"
      >
        <Button
          variant="ghost"
          size="icon"
          onClick={toggleSidebar}
          className="bg-white/90 hover:bg-white text-gray-700 hover:text-gray-900 rounded-xl hover:scale-105 transition-all duration-200 shadow-md"
        >
          {isSidebarVisible ? (
            <X className="h-5 w-5" />
          ) : (
            <Menu className="h-5 w-5" />
          )}
        </Button>

        <div
          className="relative px-4 py-2 rounded-2xl border-2 border-white/20 hover:border-white/40 hover:scale-110 transition-all duration-300 ease-out cursor-pointer hover:shadow-lg overflow-hidden"
          style={{ backgroundColor: 'rgba(255, 255, 255, 0.15)', backdropFilter: 'blur(10px)' }}
          onClick={() => window.location.href = '/'}
        >
          <span className="relative z-10 text-xl font-bold text-white">
            Sahai
          </span>

          {/* Shimmer overlay for entire div */}
          <motion.div
            className="absolute inset-0 pointer-events-none"
            style={{
              background: `linear-gradient(
                110deg,
                transparent 25%,
                rgba(255, 255, 255, 0.2) 50%,
                transparent 75%
              )`,
              width: "100%",
            }}
            initial={{ x: "-100%" }}
            animate={{ x: "100%" }}
            transition={{
              duration: 2.5,
              ease: "linear",
              repeat: Infinity,
              repeatDelay: 1,
            }}
          />
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.2 }}
      >
        <Button
          variant="ghost"
          size="icon"
          onClick={toggleTheme}
          className="bg-white/90 hover:bg-white text-gray-700 hover:text-gray-900 rounded-xl hover:scale-105 transition-all duration-200 shadow-md"
        >
          {theme === "light" ? (
            <Sun className="h-5 w-5" />
          ) : (
            <Moon className="h-5 w-5" />
          )}
        </Button>
      </motion.div>
    </motion.header>
  )
}
