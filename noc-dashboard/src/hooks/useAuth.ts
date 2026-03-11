"use client"

import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"

export function useAuth(requiredRole?: string) {

  const router = useRouter()
  const [authorized, setAuthorized] = useState(false)

  useEffect(() => {

    const token = localStorage.getItem("token")
    const role = localStorage.getItem("role")

    if (!token) {
      router.replace("/login")
      return
    }

    if (requiredRole && role !== requiredRole) {
      router.replace("/login")
      return
    }

    setAuthorized(true)

  }, [])

  return authorized
}