"use client"

import { useEffect, useState } from "react"
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/app-sidebar"
import { TopHeader } from "@/components/top-header"
import { MainContent } from "@/components/main-content"
import { StudyVault } from "@/components/study-vault"
import { DashboardView } from "@/components/dashboard-view"
import { ArcCIMode } from "@/components/arcci-mode"
import { AskAIView } from "@/components/ask-ai-view"
import { SettingsView } from "@/components/settings-view"
import type { Note } from "@/types/note"

export default function HomePage() {
  const [notes, setNotes] = useState<Note[]>([])
  const [activeNote, setActiveNote] = useState<Note | null>(null)
  const [currentView, setCurrentView] = useState<string>("dashboard")
  const [darkMode, setDarkMode] = useState(false)
  const [globalSearchQuery, setGlobalSearchQuery] = useState("")

  useEffect(() => {
    const fetchNotes = async () => {
      const baseUrl = process.env.NEXT_PUBLIC_BACKEND_URL?.trim() || ""
      const url = baseUrl ? `${baseUrl.replace(/\/$/, "")}/notes` : "/api/notes"

      try {
        const res = await fetch(url, { cache: "no-store" })
        if (!res.ok) throw new Error(`Request failed (${res.status}) – ${res.statusText}`)

        const contentType = res.headers.get("content-type") || ""
        if (!contentType.includes("application/json")) {
          const text = await res.text()
          throw new Error(`Expected JSON but got "${contentType}". First 200 chars:\n${text.slice(0, 200)}`)
        }

        const data = await res.json()
        const mappedNotes: Note[] = (Array.isArray(data) ? data : []).map((n: any) => ({
          ...n,
          id: n._id || n.id || Date.now().toString(),
        }))

        setNotes(mappedNotes)
      } catch (err) {
        console.error("Failed to fetch notes from", url, err)
      }
    }

    fetchNotes()
  }, [])

  const addNote = async (note: Note) => {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/notes`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
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
    setCurrentView("notes")
  }

  const handleViewChange = (view: string) => {
    setCurrentView(view)
    if (view !== "notes") {
      setActiveNote(null)
    }
  }

  const renderMainContent = () => {
    switch (currentView) {
      case "dashboard":
        return <DashboardView notes={notes} onViewChange={handleViewChange} />
      case "notes":
        return (
          <MainContent
            activeNote={activeNote}
            onAddNote={addNote}
            onSetActiveNote={setActiveNote}
            onSetNotes={setNotes}
          />
        )
      case "vault":
        return <StudyVault />
      case "arcci":
        return <ArcCIMode />
      case "ask-ai":
        return <AskAIView />
      case "settings":
        return <SettingsView />
      default:
        return <DashboardView notes={notes} onViewChange={handleViewChange} />
    }
  }

  return (
    <div className={darkMode ? "dark" : ""}>
      <SidebarProvider defaultOpen={true}>
        <div className="flex min-h-screen w-full bg-gradient-to-br from-slate-50 to-gray-100">
          <AppSidebar
            notes={notes}
            activeNote={activeNote}
            onSelectNote={selectNote}
            onDeleteNote={deleteNote}
            currentView={currentView}
            onViewChange={handleViewChange}
          />
          <SidebarInset className="flex-1 flex flex-col">
            <TopHeader
              currentView={currentView}
              darkMode={darkMode}
              onToggleDarkMode={() => setDarkMode(!darkMode)}
              searchQuery={globalSearchQuery}
              onSearchChange={setGlobalSearchQuery}
            />
            <main className="flex-1 overflow-auto">{renderMainContent()}</main>
          </SidebarInset>
        </div>
      </SidebarProvider>
    </div>
  )
}
