"use client"

import React, { useEffect, useRef, useState } from "react"
import axios from "axios"
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
  const fileInputRef = useRef<HTMLInputElement>(null)

  const [avatarPreview, setAvatarPreview] = useState<string | null>(null)
  const [avatarFile, setAvatarFile] = useState<File | null>(null)

  const [profile, setProfile] = useState<{
    name: string
    email: string
    university: string
    major: string
    avatarUrl?: string
  }>({
    name: "",
    email: "",
    university: "",
    major: "",
    avatarUrl: "",
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
    { id: "profile", title: "Profile", icon: User, gradient: "from-blue-500 to-cyan-500" },
    { id: "notifications", title: "Notifications", icon: Bell, gradient: "from-green-500 to-emerald-500" },
    { id: "privacy", title: "Privacy & Security", icon: Shield, gradient: "from-red-500 to-pink-500" },
    { id: "appearance", title: "Appearance", icon: Palette, gradient: "from-purple-500 to-indigo-500" },
    { id: "data", title: "Data Management", icon: Database, gradient: "from-orange-500 to-amber-500" },
  ]

  const [activeSection, setActiveSection] = useState("profile")

 useEffect(() => {
  async function fetchProfile() {
    try {
      const email = "alex.student@university.edu" // replace with real logic
      const res = await axios.get<{
        name: string
        email: string
        university: string
        major: string
        avatarUrl?: string
      }>(`http://localhost:5000/api/profile/${email}`)

      setProfile(res.data) // ✅ No TS error now
    } catch (err) {
      console.error("❌ Failed to load profile", err)
    }
  }

  fetchProfile()
}, [])


  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setAvatarFile(file)
      const reader = new FileReader()
      reader.onloadend = () => setAvatarPreview(reader.result as string)
      reader.readAsDataURL(file)
    }
  }

  const handleProfileSubmit = async () => {
    const formData = new FormData()
    formData.append("name", profile.name)
    formData.append("email", profile.email)
    formData.append("university", profile.university)
    formData.append("major", profile.major)
    if (avatarFile) formData.append("avatar", avatarFile)

    try {
      const res = await fetch("http://localhost:5000/api/profile/update", {
        method: "POST",
        body: formData,
      })
      const data = await res.json()
      if (data.profile?.avatarUrl) {
        setProfile((prev) => ({ ...prev, avatarUrl: data.profile.avatarUrl }))
      }
      alert("✅ Profile updated successfully")
    } catch (err) {
      console.error(err)
      alert("❌ Failed to update profile")
    }
  }

  const renderProfileSection = () => (
    <div className="space-y-6">
      <div className="flex items-center gap-6">
        <div className="relative">
          <Avatar className="h-24 w-24">
            <AvatarImage src={avatarPreview || profile.avatarUrl || "/placeholder.svg"} />
            <AvatarFallback>{profile.name?.[0] || "?"}</AvatarFallback>
          </Avatar>
          <Button
            size="sm"
            onClick={() => fileInputRef.current?.click()}
            className="absolute -bottom-2 -right-2 rounded-full w-8 h-8 p-0"
          >
            <Camera className="h-4 w-4" />
          </Button>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleAvatarChange}
          />
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
        {["name", "email", "university", "major"].map((field) => (
          <div key={field}>
            <Label htmlFor={field}>{field.charAt(0).toUpperCase() + field.slice(1)}</Label>
            <Input
              id={field}
              type={field === "email" ? "email" : "text"}
              value={(profile as Record<string, string>)[field]}
              onChange={(e) => setProfile((prev) => ({ ...prev, [field]: e.target.value }))}
              className="mt-1"
            />
          </div>
        ))}
      </div>

      <Button onClick={handleProfileSubmit} className="bg-gradient-to-r from-indigo-500 to-purple-500 text-white">
        <Save className="h-4 w-4 mr-2" />
        Save Changes
      </Button>
    </div>
  )

  const renderNotificationsSection = () => (
    <div className="space-y-6">
      {Object.entries(notifications).map(([key, value]) => (
        <div key={key} className="flex items-center justify-between">
          <div>
            <Label className="text-base font-medium">{key.replace(/([A-Z])/g, " $1")}</Label>
            <p className="text-sm text-gray-600">Toggle {key}</p>
          </div>
          <Switch checked={value} onCheckedChange={(checked) => setNotifications({ ...notifications, [key]: checked })} />
        </div>
      ))}
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
        <Button variant="outline" className="w-full justify-start text-red-600 hover:text-red-700 hover:bg-red-50 bg-transparent">
          <Trash2 className="h-4 w-4 mr-2" />
          Delete Account
        </Button>
      </div>
    </div>
  )

  const renderAppearanceSection = () => (
    <div className="space-y-6">
      {["darkMode", "compactView"].map((key) => (
        <div key={key} className="flex items-center justify-between">
          <div>
            <Label className="text-base font-medium">{key.replace(/([A-Z])/g, " $1")}</Label>
            <p className="text-sm text-gray-600">Toggle {key}</p>
          </div>
          <Switch checked={(preferences as any)[key]} onCheckedChange={(checked) => setPreferences({ ...preferences, [key]: checked })} />
        </div>
      ))}
    </div>
  )

  const renderDataSection = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {[
          { label: "Total Notes", value: "24", bg: "bg-blue-50", border: "border-blue-200", text: "text-blue-600" },
          { label: "AI Interactions", value: "156", bg: "bg-green-50", border: "border-green-200", text: "text-green-600" },
          { label: "Storage Used", value: "2.4 MB", bg: "bg-purple-50", border: "border-purple-200", text: "text-purple-600" },
        ].map(({ label, value, bg, border, text }) => (
          <Card key={label} className={`${bg} ${border}`}>
            <CardContent className="p-4 text-center">
              <div className={`text-2xl font-bold ${text}`}>{value}</div>
              <div className="text-sm">{label}</div>
            </CardContent>
          </Card>
        ))}
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
        <div>
          <Card className="border-0 bg-white/80 backdrop-blur-sm">
            <CardContent className="p-4 space-y-2">
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
            </CardContent>
          </Card>
        </div>

        <div className="lg:col-span-3">
          <Card className="border-0 bg-white/80 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                {settingSections.find((s) => s.id === activeSection)?.icon && (
                  <div
                    className={`w-8 h-8 rounded-lg bg-gradient-to-r ${
                      settingSections.find((s) => s.id === activeSection)?.gradient
                    } flex items-center justify-center`}
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
