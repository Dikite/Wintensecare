import { api } from "./api";
 
/* ================= TYPES ================= */
 
export interface Device {
  id: string;
  name: string;
  type: string;
  createdAt: string;
}
 
/* ================= API CALLS ================= */
 
// GET /devices
export const getDevices = () => {
  return api<Device[]>("/devices");
};
 
// POST /devices
export const addDevice = (data: {
  name: string;
  type: string;
}) => {
  return api<{ id: string }>("/devices", {
    method: "POST",
    body: JSON.stringify(data),
  });
};
 

export async function deleteDevice(id: string) {
  return api(`/devices/${id}`, {
    method: "DELETE",
  });
}
 