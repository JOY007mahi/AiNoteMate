"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import {
  BookOpen,
  Library,
  Brain,
  MessageCircleQuestion,
  TrendingUp,
  Clock,
  Target,
  Award,
  FileText,
  Zap,
  Calendar,
  BarChart3,
} from "lucide-react"
import type { Note } from "@/types/note"

interface DashboardViewProps {
  notes: Note[]
  onViewChange: (view: string) => void
}

export function DashboardView({ notes, onViewChange }: DashboardViewProps) {
  const totalNotes = notes.length
  const thisWeekNotes = notes.filter((note) => {
    const noteDate = new Date(note.createdAt)
    const weekAgo = new Date()
    weekAgo.setDate(weekAgo.getDate() - 7)
    return noteDate >= weekAgo
  }).length

  const quickActions = [
    {
      title: "Create Note",
      description: "Start a new study session",
      icon: BookOpen,
      gradient: "from-indigo-500 to-purple-500",
      action: () => onViewChange("notes"),
    },
    {
      title: "Upload Material",
      description: "Add to study vault",
      icon: Library,
      gradient: "from-orange-500 to-amber-500",
      action: () => onViewChange("vault"),
    },
    {
      title: "ArcCI Session",
      description: "Reverse learning mode",
      icon: Brain,
      gradient: "from-emerald-500 to-teal-500",
      action: () => onViewChange("arcci"),
    },
    {
      title: "Ask AI",
      description: "Get instant answers",
      icon: MessageCircleQuestion,
      gradient: "from-rose-500 to-pink-500",
      action: () => onViewChange("ask-ai"),
    },
  ]

  const stats = [
    {
      title: "Total Notes",
      value: totalNotes,
      change: `+${thisWeekNotes} this week`,
      icon: FileText,
      gradient: "from-blue-500 to-cyan-500",
    },
    {
      title: "Study Streak",
      value: "12 days",
      change: "+2 from last week",
      icon: Zap,
      gradient: "from-amber-500 to-orange-500",
    },
    {
      title: "AI Interactions",
      value: "47",
      change: "+15 this week",
      icon: Brain,
      gradient: "from-purple-500 to-pink-500",
    },
    {
      title: "Study Score",
      value: "85%",
      change: "+5% improvement",
      icon: Award,
      gradient: "from-emerald-500 to-teal-500",
    },
  ]

  return (
    <div className="p-6 space-y-8 bg-gradient-to-br from-slate-50 to-gray-100 min-h-full">
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 rounded-2xl p-8 text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="relative z-10">
          <h1 className="text-3xl font-bold mb-2">Welcome back, Alex! 👋</h1>
          <p className="text-white/90 text-lg mb-6">Ready to continue your learning journey?</p>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 bg-white/20 rounded-lg px-4 py-2 backdrop-blur-sm">
              <Calendar className="h-5 w-5" />
              <span className="font-medium">
                {new Date().toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" })}
              </span>
            </div>
            <div className="flex items-center gap-2 bg-white/20 rounded-lg px-4 py-2 backdrop-blur-sm">
              <Target className="h-5 w-5" />
              <span className="font-medium">Daily Goal: 3/5 notes</span>
            </div>
          </div>
        </div>
        <div className="absolute -top-20 -right-20 w-40 h-40 bg-white/10 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-20 -left-20 w-40 h-40 bg-white/10 rounded-full blur-3xl"></div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <Card
            key={index}
            className="group hover:shadow-lg transition-all duration-300 hover:scale-105 border-0 bg-white/80 backdrop-blur-sm"
          >
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div
                  className={`w-12 h-12 rounded-xl bg-gradient-to-r ${stat.gradient} flex items-center justify-center shadow-lg`}
                >
                  <stat.icon className="h-6 w-6 text-white" />
                </div>
                <TrendingUp className="h-4 w-4 text-green-500" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900 mb-1">{stat.value}</p>
                <p className="text-sm font-medium text-gray-600 mb-1">{stat.title}</p>
                <p className="text-xs text-green-600 font-medium">{stat.change}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Quick Actions */}
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {quickActions.map((action, index) => (
            <Card
              key={index}
              className="group hover:shadow-xl transition-all duration-300 hover:scale-105 cursor-pointer border-0 bg-white/80 backdrop-blur-sm overflow-hidden"
            >
              <CardContent className="p-6" onClick={action.action}>
                <div
                  className={`w-16 h-16 rounded-2xl bg-gradient-to-r ${action.gradient} flex items-center justify-center shadow-lg mb-4 group-hover:scale-110 transition-transform duration-300`}
                >
                  <action.icon className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">{action.title}</h3>
                <p className="text-sm text-gray-600">{action.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Recent Activity & Progress */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Recent Notes */}
        <Card className="border-0 bg-white/80 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-gray-900">
              <Clock className="h-5 w-5 text-indigo-600" />
              Recent Notes
            </CardTitle>
          </CardHeader>
          <CardContent>
            {notes.length === 0 ? (
              <div className="text-center py-8">
                <FileText className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500 mb-4">No notes yet</p>
                <Button
                  onClick={() => onViewChange("notes")}
                  className="bg-gradient-to-r from-indigo-500 to-purple-500 text-white"
                >
                  Create Your First Note
                </Button>
              </div>
            ) : (
              <div className="space-y-3">
                {notes.slice(0, 5).map((note) => (
                  <div
                    key={note.id}
                    className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors duration-200"
                  >
                    <div className="w-10 h-10 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-lg flex items-center justify-center">
                      <FileText className="h-5 w-5 text-white" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-gray-900 truncate">{note.title}</p>
                      <p className="text-sm text-gray-500">{new Date(note.createdAt).toLocaleDateString()}</p>
                    </div>
                  </div>
                ))}
                <Button variant="outline" onClick={() => onViewChange("notes")} className="w-full mt-4">
                  View All Notes
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Study Progress */}
        <Card className="border-0 bg-white/80 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-gray-900">
              <BarChart3 className="h-5 w-5 text-emerald-600" />
              Study Progress
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-medium text-gray-700">Daily Goal</span>
                <span className="text-sm text-gray-500">3/5 notes</span>
              </div>
              <Progress value={60} className="h-2" />
            </div>
            <div>
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-medium text-gray-700">Weekly Target</span>
                <span className="text-sm text-gray-500">12/20 notes</span>
              </div>
              <Progress value={60} className="h-2" />
            </div>
            <div>
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-medium text-gray-700">Study Streak</span>
                <span className="text-sm text-gray-500">12 days</span>
              </div>
              <Progress value={85} className="h-2" />
            </div>
            <div className="pt-4 border-t border-gray-200">
              <p className="text-sm text-gray-600 mb-3">🎯 You're doing great! Keep up the momentum.</p>
              <Button className="w-full bg-gradient-to-r from-emerald-500 to-teal-500 text-white">
                View Detailed Analytics
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
