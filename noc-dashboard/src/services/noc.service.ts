import { apiFetch } from "@/utils/api"

export async function getLivePatients(){
   return apiFetch("/noc/patients/live")
}