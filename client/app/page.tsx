"use client"

import { useEffect, useState } from "react"
import { SidebarProvider } from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/app-sidebar"
import { MainContent } from "@/components/main-content"
import type { Note } from "@/types/note"

export default function HomePage() {
  const [notes, setNotes] = useState<Note[]>([])
  const [activeNote, setActiveNote] = useState<Note | null>(null)

  useEffect(() => {
    const fetchNotes = async () => {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/notes`)
        const data = await res.json()

        const mappedNotes: Note[] = data.map((n: any) => ({
          ...n,
          id: n._id || n.id || Date.now().toString(), // ensure .id is present
        }))

        setNotes(mappedNotes)
      } catch (err) {
        console.error("Failed to fetch notes", err)
      }
    }

    fetchNotes()
  }, [])

  const addNote = async (note: Note) => {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/notes`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(note),
      })

      const savedNoteRaw = await res.json()

      const savedNote: Note = {
        ...savedNoteRaw,
        id: savedNoteRaw._id || savedNoteRaw.id || Date.now().toString(),
      }

      setNotes((prev) => [savedNote, ...prev])
      setActiveNote(savedNote)
    } catch (err) {
      console.error("Failed to save note", err)
    }
  }

  const deleteNote = async (id: string) => {
    try {
      await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/notes/${id}`, {
        method: "DELETE",
      })

      setNotes((prev) => prev.filter((note) => note.id !== id))
      if (activeNote?.id === id) {
        setActiveNote(null)
      }
    } catch (err) {
      console.error("Failed to delete note", err)
    }
  }

  const selectNote = (note: Note) => {
    setActiveNote(note)
  }

  return (
    <SidebarProvider defaultOpen={true}>
      <div className="flex min-h-screen w-full">
        <AppSidebar
          notes={notes}
          activeNote={activeNote}
          onSelectNote={selectNote}
          onDeleteNote={deleteNote}
        />
        <MainContent
          activeNote={activeNote}
          onAddNote={addNote}
          onSetActiveNote={setActiveNote}
          onSetNotes={setNotes}
        />
      </div>
    </SidebarProvider>
  )
}
