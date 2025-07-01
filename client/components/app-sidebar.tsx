"use client"

import { FileText, Trash2, Search, X } from "lucide-react"
import { useState } from "react"
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
} from "@/components/ui/sidebar"
import type { Note } from "@/types/note"

interface AppSidebarProps {
  notes: Note[]
  activeNote: Note | null
  onSelectNote: (note: Note) => void
  onDeleteNote: (id: string) => void
}

export function AppSidebar({ notes, activeNote, onSelectNote, onDeleteNote }: AppSidebarProps) {
  const [searchQuery, setSearchQuery] = useState("")

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

      if (!res.ok) {
        throw new Error("Failed to delete note from DB")
      }

      onDeleteNote(id)
    } catch (err) {
      console.error("Deletion error:", err)
      alert("Failed to delete note")
    }
  }

  return (
    <Sidebar className="border-r border-purple-200 bg-gradient-to-b from-indigo-50 to-purple-100">
      <SidebarHeader className="p-4 bg-gradient-to-r from-indigo-600 to-purple-600 text-white">
        <div className="flex items-center gap-2">
          <FileText className="h-6 w-6" />
          <h1 className="text-lg font-semibold">AI Notes</h1>
        </div>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel className="flex items-center justify-between text-indigo-700 font-semibold">
            <span>Saved Notes</span>
            <span className="text-xs bg-indigo-100 text-indigo-600 px-2 py-1 rounded-full">
              {searchQuery
                ? `${filteredNotes.length}/${notes.length}`
                : `${notes.length} ${notes.length === 1 ? "note" : "notes"}`}
            </span>
          </SidebarGroupLabel>

          <SidebarGroupContent>
            {/* Search Bar */}
            <div className="px-2 pb-2">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-indigo-400" />
                <input
                  type="text"
                  placeholder="Search notes..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-10 py-2 text-sm bg-white/70 border border-indigo-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-300 focus:border-transparent placeholder-indigo-400"
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery("")}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-indigo-400 hover:text-indigo-600"
                  >
                    <X className="h-4 w-4" />
                  </button>
                )}
              </div>
            </div>

            <SidebarMenu>
              {notes.length === 0 ? (
                <div className="p-4 text-center text-sm text-indigo-600 bg-white/50 rounded-lg mx-2">
                  No notes yet. Upload a PDF or add text to get started! 🚀
                </div>
              ) : filteredNotes.length === 0 ? (
                <div className="p-4 text-center text-sm text-indigo-600 bg-white/50 rounded-lg mx-2">
                  No notes found matching "{searchQuery}" 🔍
                </div>
              ) : (
                filteredNotes.map((note) => (
                  <SidebarMenuItem key={note.id}>
                    <SidebarMenuButton
                      onClick={() => onSelectNote(note)}
                      isActive={activeNote?.id === note.id}
                      className={`flex-1 justify-start transition-all duration-200 ${
                        activeNote?.id === note.id
                          ? "bg-gradient-to-r from-indigo-500 to-purple-500 text-white shadow-lg"
                          : "hover:bg-white/70 text-indigo-700"
                      }`}
                    >
                      <FileText className="h-4 w-4" />
                      <div className="flex-1 min-w-0">
                        <div className="truncate font-medium">{note.title}</div>
                        <div
                          className={`text-xs ${
                            activeNote?.id === note.id ? "text-white/80" : "text-indigo-500"
                          }`}
                        >
                          {new Date(note.createdAt).toLocaleDateString()}
                        </div>
                      </div>
                    </SidebarMenuButton>
                    <SidebarMenuAction
                      onClick={() => handleDelete(note.id)}
                      className="text-red-500 hover:text-red-600 hover:bg-red-50"
                    >
                      <Trash2 className="h-4 w-4" />
                    </SidebarMenuAction>
                  </SidebarMenuItem>
                ))
              )}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  )
}
