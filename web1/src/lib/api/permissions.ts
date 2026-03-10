const BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";
 
function getToken() {
  return localStorage.getItem("token");
}
 
// GET permissions
export async function fetchPermissions() {
  const res = await fetch(`${BASE}/api/permissions`, {
    headers: {
      Authorization: `Bearer ${getToken()}`,
    },
  });
 
  if (!res.ok) throw new Error("Failed to fetch permissions");
  return res.json();
}
 
 
// UPDATE permissions
export async function updatePermissions(payload: any) {
  const res = await fetch(`${BASE}/api/permissions`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${getToken()}`,
    },
    body: JSON.stringify(payload),
  });
 
  if (!res.ok) throw new Error("Failed to update permissions");
  return res.json();
}
 
 