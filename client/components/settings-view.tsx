"use client"

import React from "react"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  Settings,
  User,
  Bell,
  Shield,
  Palette,
  Database,
  Crown,
  Download,
  Upload,
  Trash2,
  Save,
  Camera,
} from "lucide-react"

export function SettingsView() {
  const [profile, setProfile] = useState({
    name: "Alex Student",
    email: "alex.student@university.edu",
    university: "State University",
    major: "Computer Science",
  })

  const [notifications, setNotifications] = useState({
    studyReminders: true,
    aiInsights: true,
    weeklyReports: false,
    newFeatures: true,
  })

  const [preferences, setPreferences] = useState({
    darkMode: false,
    autoSave: true,
    aiSuggestions: true,
    compactView: false,
  })

  const settingSections = [
    {
      id: "profile",
      title: "Profile",
      icon: User,
      gradient: "from-blue-500 to-cyan-500",
    },
    {
      id: "notifications",
      title: "Notifications",
      icon: Bell,
      gradient: "from-green-500 to-emerald-500",
    },
    {
      id: "privacy",
      title: "Privacy & Security",
      icon: Shield,
      gradient: "from-red-500 to-pink-500",
    },
    {
      id: "appearance",
      title: "Appearance",
      icon: Palette,
      gradient: "from-purple-500 to-indigo-500",
    },
    {
      id: "data",
      title: "Data Management",
      icon: Database,
      gradient: "from-orange-500 to-amber-500",
    },
  ]

  const [activeSection, setActiveSection] = useState("profile")

  const renderProfileSection = () => (
    <div className="space-y-6">
      <div className="flex items-center gap-6">
        <div className="relative">
          <Avatar className="h-24 w-24">
            <AvatarImage src="/placeholder.svg?height=96&width=96" />
            <AvatarFallback className="bg-gradient-to-r from-indigo-500 to-purple-500 text-white text-2xl">
              <User className="h-12 w-12" />
            </AvatarFallback>
          </Avatar>
          <Button size="sm" className="absolute -bottom-2 -right-2 rounded-full w-8 h-8 p-0">
            <Camera className="h-4 w-4" />
          </Button>
        </div>
        <div>
          <h3 className="text-2xl font-bold text-gray-900">{profile.name}</h3>
          <p className="text-gray-600">{profile.email}</p>
          <Badge className="mt-2 bg-gradient-to-r from-amber-100 to-yellow-100 text-amber-700 border-amber-200">
            <Crown className="h-3 w-3 mr-1" />
            Free Plan
          </Badge>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="name">Full Name</Label>
          <Input
            id="name"
            value={profile.name}
            onChange={(e) => setProfile({ ...profile, name: e.target.value })}
            className="mt-1"
          />
        </div>
        <div>
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            value={profile.email}
            onChange={(e) => setProfile({ ...profile, email: e.target.value })}
            className="mt-1"
          />
        </div>
        <div>
          <Label htmlFor="university">University</Label>
          <Input
            id="university"
            value={profile.university}
            onChange={(e) => setProfile({ ...profile, university: e.target.value })}
            className="mt-1"
          />
        </div>
        <div>
          <Label htmlFor="major">Major</Label>
          <Input
            id="major"
            value={profile.major}
            onChange={(e) => setProfile({ ...profile, major: e.target.value })}
            className="mt-1"
          />
        </div>
      </div>

      <Button className="bg-gradient-to-r from-indigo-500 to-purple-500 text-white">
        <Save className="h-4 w-4 mr-2" />
        Save Changes
      </Button>
    </div>
  )

  const renderNotificationsSection = () => (
    <div className="space-y-6">
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <Label className="text-base font-medium">Study Reminders</Label>
            <p className="text-sm text-gray-600">Get reminded to review your notes</p>
          </div>
          <Switch
            checked={notifications.studyReminders}
            onCheckedChange={(checked) => setNotifications({ ...notifications, studyReminders: checked })}
          />
        </div>
        <div className="flex items-center justify-between">
          <div>
            <Label className="text-base font-medium">AI Insights</Label>
            <p className="text-sm text-gray-600">Receive AI-generated study insights</p>
          </div>
          <Switch
            checked={notifications.aiInsights}
            onCheckedChange={(checked) => setNotifications({ ...notifications, aiInsights: checked })}
          />
        </div>
        <div className="flex items-center justify-between">
          <div>
            <Label className="text-base font-medium">Weekly Reports</Label>
            <p className="text-sm text-gray-600">Get weekly progress summaries</p>
          </div>
          <Switch
            checked={notifications.weeklyReports}
            onCheckedChange={(checked) => setNotifications({ ...notifications, weeklyReports: checked })}
          />
        </div>
        <div className="flex items-center justify-between">
          <div>
            <Label className="text-base font-medium">New Features</Label>
            <p className="text-sm text-gray-600">Be notified about new features</p>
          </div>
          <Switch
            checked={notifications.newFeatures}
            onCheckedChange={(checked) => setNotifications({ ...notifications, newFeatures: checked })}
          />
        </div>
      </div>
    </div>
  )

  const renderPrivacySection = () => (
    <div className="space-y-6">
      <div className="bg-red-50 border border-red-200 rounded-lg p-4">
        <h4 className="font-medium text-red-800 mb-2">Data Privacy</h4>
        <p className="text-sm text-red-700">
          Your study data is encrypted and stored securely. We never share your personal information with third parties.
        </p>
      </div>
      <div className="space-y-4">
        <Button variant="outline" className="w-full justify-start bg-transparent">
          <Shield className="h-4 w-4 mr-2" />
          Change Password
        </Button>
        <Button variant="outline" className="w-full justify-start bg-transparent">
          <Download className="h-4 w-4 mr-2" />
          Download My Data
        </Button>
        <Button
          variant="outline"
          className="w-full justify-start text-red-600 hover:text-red-700 hover:bg-red-50 bg-transparent"
        >
          <Trash2 className="h-4 w-4 mr-2" />
          Delete Account
        </Button>
      </div>
    </div>
  )

  const renderAppearanceSection = () => (
    <div className="space-y-6">
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <Label className="text-base font-medium">Dark Mode</Label>
            <p className="text-sm text-gray-600">Switch to dark theme</p>
          </div>
          <Switch
            checked={preferences.darkMode}
            onCheckedChange={(checked) => setPreferences({ ...preferences, darkMode: checked })}
          />
        </div>
        <div className="flex items-center justify-between">
          <div>
            <Label className="text-base font-medium">Compact View</Label>
            <p className="text-sm text-gray-600">Use more compact layouts</p>
          </div>
          <Switch
            checked={preferences.compactView}
            onCheckedChange={(checked) => setPreferences({ ...preferences, compactView: checked })}
          />
        </div>
      </div>
    </div>
  )

  const renderDataSection = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="bg-blue-50 border-blue-200">
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-blue-600">24</div>
            <div className="text-sm text-blue-700">Total Notes</div>
          </CardContent>
        </Card>
        <Card className="bg-green-50 border-green-200">
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-green-600">156</div>
            <div className="text-sm text-green-700">AI Interactions</div>
          </CardContent>
        </Card>
        <Card className="bg-purple-50 border-purple-200">
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-purple-600">2.4 MB</div>
            <div className="text-sm text-purple-700">Storage Used</div>
          </CardContent>
        </Card>
      </div>
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <Label className="text-base font-medium">Auto-Save</Label>
            <p className="text-sm text-gray-600">Automatically save your work</p>
          </div>
          <Switch
            checked={preferences.autoSave}
            onCheckedChange={(checked) => setPreferences({ ...preferences, autoSave: checked })}
          />
        </div>
        <Button variant="outline" className="w-full justify-start bg-transparent">
          <Upload className="h-4 w-4 mr-2" />
          Export All Data
        </Button>
        <Button variant="outline" className="w-full justify-start bg-transparent">
          <Download className="h-4 w-4 mr-2" />
          Import Data
        </Button>
      </div>
    </div>
  )

  const renderContent = () => {
    switch (activeSection) {
      case "profile":
        return renderProfileSection()
      case "notifications":
        return renderNotificationsSection()
      case "privacy":
        return renderPrivacySection()
      case "appearance":
        return renderAppearanceSection()
      case "data":
        return renderDataSection()
      default:
        return renderProfileSection()
    }
  }

  return (
    <div className="p-6 space-y-8 bg-gradient-to-br from-slate-50 to-gray-100 min-h-full">
      {/* Header */}
      <div className="bg-gradient-to-r from-slate-600 via-gray-600 to-slate-700 rounded-2xl p-8 text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-sm">
              <Settings className="h-7 w-7 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold">Settings</h1>
              <p className="text-white/90">Customize your StudyMind experience</p>
            </div>
          </div>
        </div>
        <div className="absolute -top-20 -right-20 w-40 h-40 bg-white/10 rounded-full blur-3xl"></div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Settings Navigation */}
        <div>
          <Card className="border-0 bg-white/80 backdrop-blur-sm">
            <CardContent className="p-4">
              <div className="space-y-2">
                {settingSections.map((section) => (
                  <Button
                    key={section.id}
                    variant={activeSection === section.id ? "default" : "ghost"}
                    className={`w-full justify-start ${
                      activeSection === section.id
                        ? `bg-gradient-to-r ${section.gradient} text-white shadow-lg`
                        : "hover:bg-gray-100 text-gray-700"
                    }`}
                    onClick={() => setActiveSection(section.id)}
                  >
                    <section.icon className="h-4 w-4 mr-3" />
                    {section.title}
                  </Button>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Settings Content */}
        <div className="lg:col-span-3">
          <Card className="border-0 bg-white/80 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                {settingSections.find((s) => s.id === activeSection)?.icon && (
                  <div
                    className={`w-8 h-8 rounded-lg bg-gradient-to-r ${settingSections.find((s) => s.id === activeSection)?.gradient} flex items-center justify-center`}
                  >
                    {React.createElement(settingSections.find((s) => s.id === activeSection)!.icon, {
                      className: "h-4 w-4 text-white",
                    })}
                  </div>
                )}
                {settingSections.find((s) => s.id === activeSection)?.title}
              </CardTitle>
            </CardHeader>
            <CardContent>{renderContent()}</CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
