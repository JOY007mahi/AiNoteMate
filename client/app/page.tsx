"use client"

import { useState } from "react"
import { SidebarProvider } from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/app-sidebar"
import { MainContent } from "@/components/main-content"
import type { Note } from "@/types/note"
import { summarizeNotes, askAI, uploadPDF } from "@/lib/api";

export default function HomePage() {
  const [notes, setNotes] = useState<Note[]>([])
  const [activeNote, setActiveNote] = useState<Note | null>(null)

  const addNote = (note: Note) => {
    setNotes((prev) => [note, ...prev])
    setActiveNote(note)
  }

  const deleteNote = (id: string) => {
    setNotes((prev) => prev.filter((note) => note.id !== id))
    if (activeNote?.id === id) {
      setActiveNote(null)
    }
  }

  const selectNote = (note: Note) => {
    setActiveNote(note)
  }

  return (
    <SidebarProvider defaultOpen={true}>
      <div className="flex min-h-screen w-full">
        <AppSidebar notes={notes} activeNote={activeNote} onSelectNote={selectNote} onDeleteNote={deleteNote} />
       <MainContent
  activeNote={activeNote}
  onAddNote={(note) => {
    setNotes((prev) => [...prev, note]);
    setActiveNote(note);
  }}
  onSetActiveNote={setActiveNote}  // <-- THIS LINE is important
/>

      </div>
    </SidebarProvider>
  )
}
