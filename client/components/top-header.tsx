"use client"

import { useState } from "react"
import { Search, Moon, Sun, Bell, Settings, User, LogOut, Crown } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Badge } from "@/components/ui/badge"

interface TopHeaderProps {
  currentView: string
  darkMode: boolean
  onToggleDarkMode: () => void
  searchQuery: string
  onSearchChange: (query: string) => void
}

const viewTitles = {
  dashboard: "📊 Dashboard",
  notes: "📘 Notes",
  vault: "📚 Study Vault",
  arcci: "🧠 ArcCI Mode",
  "ask-ai": "❓ Ask AI",
  settings: "⚙️ Settings",
}

export function TopHeader({ currentView, darkMode, onToggleDarkMode, searchQuery, onSearchChange }: TopHeaderProps) {
  const [notifications] = useState(3)

  return (
    <header className="h-16 bg-white/80 backdrop-blur-xl border-b border-gray-200 flex items-center justify-between px-6 sticky top-0 z-50 shadow-sm">
      {/* Left Section - Title */}
      <div className="flex items-center gap-4">
        <h1 className="text-2xl font-bold bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
          {viewTitles[currentView as keyof typeof viewTitles] || "StudyMind AI"}
        </h1>
      </div>

      {/* Center Section - Search */}
      <div className="flex-1 max-w-md mx-8">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Search everything..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="pl-10 bg-gray-50/80 border-gray-200 focus:bg-white focus:border-indigo-300 focus:ring-indigo-200 transition-all duration-200"
          />
        </div>
      </div>

      {/* Right Section - Actions & Profile */}
      <div className="flex items-center gap-3">
        {/* Dark Mode Toggle */}
        <Button
          variant="ghost"
          size="sm"
          onClick={onToggleDarkMode}
          className="relative p-2 hover:bg-gray-100 transition-colors duration-200"
        >
          {darkMode ? <Sun className="h-5 w-5 text-amber-500" /> : <Moon className="h-5 w-5 text-indigo-600" />}
        </Button>

        {/* Notifications */}
        <Button variant="ghost" size="sm" className="relative p-2 hover:bg-gray-100">
          <Bell className="h-5 w-5 text-gray-600" />
          {notifications > 0 && (
            <Badge className="absolute -top-1 -right-1 h-5 w-5 p-0 flex items-center justify-center bg-red-500 text-white text-xs">
              {notifications}
            </Badge>
          )}
        </Button>

        {/* Profile Dropdown */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              className="relative h-10 w-10 rounded-full hover:ring-2 hover:ring-indigo-200 transition-all duration-200"
            >
              <Avatar className="h-10 w-10">
                <AvatarImage src="/placeholder.svg?height=40&width=40" alt="Profile" />
                <AvatarFallback className="bg-gradient-to-r from-indigo-500 to-purple-500 text-white">
                  <User className="h-5 w-5" />
                </AvatarFallback>
              </Avatar>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-64 p-2" align="end" forceMount>
            <DropdownMenuLabel className="font-normal">
              <div className="flex flex-col space-y-2">
                <div className="flex items-center gap-2">
                  <p className="text-sm font-medium leading-none">Alex Student</p>
                  <Badge
                    variant="secondary"
                    className="text-xs bg-gradient-to-r from-amber-100 to-yellow-100 text-amber-700 border-amber-200"
                  >
                    <Crown className="h-3 w-3 mr-1" />
                    Free
                  </Badge>
                </div>
                <p className="text-xs leading-none text-muted-foreground">alex.student@university.edu</p>
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <div className="flex-1 bg-gray-200 rounded-full h-1.5">
                    <div className="bg-gradient-to-r from-indigo-500 to-purple-500 h-1.5 rounded-full w-3/4"></div>
                  </div>
                  <span>75% used</span>
                </div>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="cursor-pointer hover:bg-indigo-50">
              <User className="mr-2 h-4 w-4" />
              <span>Profile</span>
            </DropdownMenuItem>
            <DropdownMenuItem className="cursor-pointer hover:bg-indigo-50">
              <Settings className="mr-2 h-4 w-4" />
              <span>Settings</span>
            </DropdownMenuItem>
            <DropdownMenuItem className="cursor-pointer hover:bg-amber-50 text-amber-700">
              <Crown className="mr-2 h-4 w-4" />
              <span>Upgrade to Pro</span>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="cursor-pointer hover:bg-red-50 text-red-600">
              <LogOut className="mr-2 h-4 w-4" />
              <span>Log out</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  )
}
