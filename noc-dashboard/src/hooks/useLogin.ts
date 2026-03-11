"use client"

import { useRouter } from "next/navigation"
import { loginUser } from "@/services/auth.services";

export function useLogin() {

  const router = useRouter()

  const login = async (email: string, password: string) => {

  const data = await loginUser({
  email,
  password
})

localStorage.setItem("token", data.accessToken)
localStorage.setItem("role", data.user.role)

if(data.user.role === "NOC_OPERATOR"){
   router.push("/noc/dashboard")
}else{
   router.push("/dashboard")
}
  }

  return { login }
}