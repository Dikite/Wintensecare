const API_URL = process.env.NEXT_PUBLIC_API_URL;
 
export async function api<T>(
  path: string,
  options: RequestInit = {}
): Promise<T> {
  const token =
    typeof window !== "undefined"
      ? localStorage.getItem("token")
      : null;
 
  const res = await fetch(`${ API_URL}${path}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
       
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...options.headers,
    },
  });
 
  // 🔑 IMPORTANT: handle auth errors cleanly
  if (res.status === 401) {
    throw new Error("UNAUTHORIZED");
  }
 
  if (!res.ok) {
    throw new Error("API_ERROR");
  }
 
  return res.json();
}
 
 