import { useEffect, useState } from "react"
import axios from "axios"

type Profile = {
  name: string
  email: string
  avatarUrl?: string
  plan?: string
}

export function useProfile(email: string) {
  const [profile, setProfile] = useState<Profile | null>(null)

  useEffect(() => {
    async function fetchProfile() {
      try {
        const res = await axios.get<Profile>(`http://localhost:5000/api/profile/${email}`)
        setProfile(res.data)
      } catch (err) {
        console.error("❌ Failed to load profile", err)
      }
    }

    fetchProfile()
  }, [email])

  return profile
}
