"use client"

import { FileText, Trash2 } from "lucide-react"
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
              {notes.length} {notes.length === 1 ? "note" : "notes"}
            </span>
          </SidebarGroupLabel>

          <SidebarGroupContent>
            <SidebarMenu>
              {notes.length === 0 ? (
                <div className="p-4 text-center text-sm text-indigo-600 bg-white/50 rounded-lg mx-2">
                  No notes yet. Upload a PDF or add text to get started! 🚀
                </div>
              ) : (
                notes.map((note) => (
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
                        <div className={`text-xs ${activeNote?.id === note.id ? "text-white/80" : "text-indigo-500"}`}>
                          {new Date(note.createdAt).toLocaleDateString()}
                        </div>
                      </div>
                    </SidebarMenuButton>
                    <SidebarMenuAction
                      onClick={() => onDeleteNote(note.id)}
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
