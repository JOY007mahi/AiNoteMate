"use client"

import { useState } from "react"
import {
  BookOpen,
  Library,
  Brain,
  MessageCircleQuestion,
  Settings,
  FileText,
  Trash2,
  Search,
  X,
  Home,
  User,
  MoreVertical,
  Pencil,
} from "lucide-react"
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarMenuAction,
  SidebarFooter,
} from "@/components/ui/sidebar"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from "@/components/ui/dropdown-menu"
import { EditNoteModal } from "@/components/edit-note-modal"
import type { Note } from "@/types/note"

interface AppSidebarProps {
  notes: Note[]
  activeNote: Note | null
  onSelectNote: (note: Note) => void
  onDeleteNote: (id: string) => void
  currentView: string
  onViewChange: (view: string) => void
}

const navigationItems = [
  {
    id: "dashboard",
    title: "Dashboard",
    icon: Home,
    gradient: "from-blue-500 to-cyan-500",
  },
  {
    id: "notes",
    title: "Notes",
    icon: BookOpen,
    gradient: "from-indigo-500 to-purple-500",
  },
  {
    id: "vault",
    title: "Study Vault",
    icon: Library,
    gradient: "from-orange-500 to-amber-500",
  },
  {
    id: "arcci",
    title: "ArcCI Mode",
    icon: Brain,
    gradient: "from-emerald-500 to-teal-500",
  },
  {
    id: "ask-ai",
    title: "Ask AI",
    icon: MessageCircleQuestion,
    gradient: "from-rose-500 to-pink-500",
  },
  {
    id: "settings",
    title: "Settings",
    icon: Settings,
    gradient: "from-slate-500 to-gray-500",
  },
]

export function AppSidebar({
  notes,
  activeNote,
  onSelectNote,
  onDeleteNote,
  currentView,
  onViewChange,
}: AppSidebarProps) {
  const [searchQuery, setSearchQuery] = useState("")
  const [editNote, setEditNote] = useState<Note | null>(null)
  const [showEditModal, setShowEditModal] = useState(false)

  const filteredNotes = notes.filter((note) => {
    if (!searchQuery.trim()) return true
    const query = searchQuery.toLowerCase()
    return (
      note.title.toLowerCase().includes(query) ||
      note.summary.toLowerCase().includes(query) ||
      note.content.toLowerCase().includes(query)
    )
  })

  const handleDelete = async (id: string) => {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/notes/${id}`, {
        method: "DELETE",
      })
      if (!res.ok) throw new Error("Failed to delete note from DB")
      onDeleteNote(id)
    } catch (err) {
      console.error("Deletion error:", err)
      alert("Failed to delete note")
    }
  }

 const handleSaveUpdatedNote = (updated: Note) => {
  // ✅ Update the note in your database and in UI
  fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/notes/${updated.id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(updated),
  })
    .then((res) => {
      if (!res.ok) throw new Error("Failed to update note")
      onSelectNote(updated)
      setShowEditModal(false)
    })
    .catch((err) => {
      console.error("Update error:", err)
      alert("Failed to update note")
    })
}


  return (
    <Sidebar className="border-r-0 bg-gradient-to-b from-slate-50 to-gray-100 shadow-xl">
      <SidebarHeader className="p-6 bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 text-white">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-sm">
            <Brain className="h-6 w-6 text-white" />
          </div>
          <div>
            <h1 className="text-xl font-bold">StudyMind AI</h1>
            <p className="text-white/80 text-sm">Academic Excellence</p>
          </div>
        </div>
      </SidebarHeader>

      <SidebarContent className="px-4 py-6">
        <SidebarGroup>
          <SidebarGroupLabel className="text-gray-600 font-semibold mb-3">Navigation</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu className="space-y-2">
              {navigationItems.map((item) => (
                <SidebarMenuItem key={item.id}>
                  <SidebarMenuButton
                    onClick={() => onViewChange(item.id)}
                    isActive={currentView === item.id}
                    className={`group relative overflow-hidden transition-all duration-300 ${
                      currentView === item.id
                        ? `bg-gradient-to-r ${item.gradient} text-white shadow-lg scale-105`
                        : "hover:bg-gray-100 text-gray-700 hover:scale-102"
                    }`}
                  >
                    <div className="flex items-center gap-3 relative z-10">
                      <item.icon className="h-5 w-5" />
                      <span className="font-medium">{item.title}</span>
                    </div>
                    {currentView === item.id && <div className="absolute inset-0 bg-white/10 animate-pulse"></div>}
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {currentView === "notes" && (
          <SidebarGroup className="mt-6">
            <SidebarGroupLabel className="flex items-center justify-between text-indigo-700 font-semibold mb-3">
              <span>Recent Notes</span>
              <span className="text-xs bg-indigo-100 text-indigo-600 px-2 py-1 rounded-full">
                {searchQuery
                  ? `${filteredNotes.length}/${notes.length}`
                  : `${notes.length} ${notes.length === 1 ? "note" : "notes"}`}
              </span>
            </SidebarGroupLabel>

            <SidebarGroupContent>
              <div className="mb-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search notes..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-10 py-2 text-sm bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-300 focus:border-transparent placeholder-gray-400"
                  />
                  {searchQuery && (
                    <button
                      onClick={() => setSearchQuery("")}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  )}
                </div>
              </div>

              <SidebarMenu className="space-y-1">
                {notes.length === 0 ? (
                  <div className="p-4 text-center text-sm text-gray-500 bg-gray-50 rounded-lg">
                    No notes yet. Create your first note! 📝
                  </div>
                ) : filteredNotes.length === 0 ? (
                  <div className="p-4 text-center text-sm text-gray-500 bg-gray-50 rounded-lg">
                    No notes found matching "{searchQuery}" 🔍
                  </div>
                ) : (
                  filteredNotes.slice(0, 5).map((note) => (
                    <SidebarMenuItem key={note.id}>
                      <SidebarMenuButton
                        onClick={() => onSelectNote(note)}
                        isActive={activeNote?.id === note.id}
                        className={`flex-1 justify-start transition-all duration-200 ${
                          activeNote?.id === note.id
                            ? "bg-gradient-to-r from-indigo-500 to-purple-500 text-white shadow-md"
                            : "hover:bg-gray-100 text-gray-700"
                        }`}
                      >
                        <FileText className="h-4 w-4" />
                        <div className="flex-1 min-w-0">
                          <div className="truncate font-medium text-sm">{note.title}</div>
                          <div className={`text-xs ${activeNote?.id === note.id ? "text-white/80" : "text-gray-500"}`}>
                            {new Date(note.createdAt).toLocaleDateString()}
                          </div>
                        </div>
                      </SidebarMenuButton>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <SidebarMenuAction className="hover:bg-gray-100">
                            <MoreVertical className="h-4 w-4 text-gray-500" />
                          </SidebarMenuAction>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" side="right">
                          <DropdownMenuItem onClick={() => {
                            setEditNote(note)
                            setShowEditModal(true)
                          }}>
                            <Pencil className="h-4 w-4 mr-2" /> Edit
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleDelete(note.id)}>
                            <Trash2 className="h-4 w-4 mr-2 text-red-500" /> Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </SidebarMenuItem>
                  ))
                )}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        )}
      </SidebarContent>

      <SidebarFooter className="p-4 border-t border-gray-200">
        <div className="flex items-center gap-3 p-3 bg-gradient-to-r from-gray-50 to-gray-100 rounded-lg">
          <Avatar className="h-8 w-8">
            <AvatarImage src="/placeholder.svg?height=32&width=32" />
            <AvatarFallback className="bg-gradient-to-r from-indigo-500 to-purple-500 text-white text-sm">
              <User className="h-4 w-4" />
            </AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-gray-900 truncate">Student</p>
            <p className="text-xs text-gray-500 truncate">Free Plan</p>
          </div>
        </div>
      </SidebarFooter>

      <EditNoteModal
        open={showEditModal}
        note={editNote}
        onClose={() => setShowEditModal(false)}
        onSave={handleSaveUpdatedNote}
      />
    </Sidebar>
  )
}