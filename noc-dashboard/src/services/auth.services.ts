import { LoginRequest, LoginResponse } from "@/types/auth.types"
import { apiFetch } from "@/utils/api"

export async function loginUser(
  data: LoginRequest
): Promise<LoginResponse> {

  return apiFetch("/auth/login", {
    method: "POST",
    body: JSON.stringify({
      identifier: data.email,
      password: data.password
    })
  })
}