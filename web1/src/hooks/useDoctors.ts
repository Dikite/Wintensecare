"use client";

import { useEffect, useMemo, useState } from "react";
import { api } from "@/lib/api/api";

export type Doctor = {
  id: string;
  userId: string;
  doctorId: string;
  doctorName: string;
  access: "FULL" | "LIMITED";
  status: "ACTIVE" | "REVOKED";
  createdAt: string;
};

export function useDoctors() {
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [loading, setLoading] = useState(true);

const [history, setHistory] = useState<Doctor[]>([]);
const [loadingHistory, setLoadingHistory] = useState(false);

  const fetchDoctors = async () => {
    setLoading(true);
const res = await api<any>("/user/doctors");

const list = Array.isArray(res)
  ? res
  : Array.isArray((res as any)?.data)
  ? (res as any).data
  : [];


    setDoctors(list);
    setLoading(false);
  };

 useEffect(() => {
  fetchDoctors();
}, []);



  // ✅ visible doctor logic HERE (not in page.tsx)
  const activeDoctors = useMemo(() => {
  return doctors.filter(d => d.status === "ACTIVE");
}, [doctors]);

const visibleDoctor = useMemo(() => {
  if (!activeDoctors.length) return null;

  return [...activeDoctors].sort(
    (a, b) =>
      new Date(b.createdAt).getTime() -
      new Date(a.createdAt).getTime()
  )[0];
}, [activeDoctors]);


 const changeAccess: (
  id: string,
  access: "FULL" | "LIMITED"
) => Promise<void> = async (id, access) => {
  await api(`/user/doctors/${id}`, {
    method: "PATCH",
    body: JSON.stringify({ access }),
  });
  await fetchDoctors();
};

const removeDoctor: (id: string) => Promise<void> = async (id) => {
  await api(`/user/doctors/${id}`, {
    method: "DELETE",
    body: JSON.stringify({ status: "REVOKED" }),
  });
  await fetchDoctors();
};


  const addDoctor = async (payload: {
    userId: string;
    doctorId: string;
    doctorName: string;
  }) => {
    await api("/user/doctors", {
      method: "POST",
      body: JSON.stringify({
        id: payload.userId,
        doctorId: payload.doctorId,
        doctorName: payload.doctorName,
        access: "FULL",
      }),
    });
    fetchDoctors();
  };

const fetchHistory = async () => {
  setLoadingHistory(true);
  const res = await api<any>("/user/doctors/history");

  const list = Array.isArray(res)
    ? res
    : Array.isArray(res?.data)
    ? res.data
    : [];

  setHistory(list);
  setLoadingHistory(false);
};

const grantAccess = async (id: string) => {
  await api(`/user/doctors/${id}/restore`, {
    method: "PATCH",
  });

  await fetchDoctors();   // refresh active list
  await fetchHistory();   // refresh history
};

const deletePermanent = async (id: string) => {
  await api(`/user/doctors/${id}/permanent`, {
    method: "DELETE",
  });

  await fetchHistory();   // remove from history list
};


  return {
  doctors,
  history,
  loading,
  loadingHistory,
  fetchHistory,
  changeAccess,
  removeDoctor,
  grantAccess,
  deletePermanent,  
  addDoctor,
  };
}
