export const API_BASE_URL = "http://localhost:4000"

export async function apiFetch(
  url: string,
  options: RequestInit = {}
) {

  const token = localStorage.getItem("token")

  const res = await fetch(API_BASE_URL + url, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      Authorization: token ? `Bearer ${token}` : "",
      ...(options.headers || {})
    }
  })

  if (!res.ok) {
    throw new Error("API request failed")
  }

  return res.json()
}