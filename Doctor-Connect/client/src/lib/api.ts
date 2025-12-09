import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import type { Doctor, Appointment, InsertAppointment } from "@shared/schema";

const API_BASE = "/api";

// Doctor API hooks
export function useDoctors() {
  return useQuery<Doctor[]>({
    queryKey: ["doctors"],
    queryFn: async () => {
      const response = await fetch(`${API_BASE}/doctors`);
      if (!response.ok) throw new Error("Failed to fetch doctors");
      return response.json();
    },
  });
}

export function useDoctor(id: number) {
  return useQuery<Doctor>({
    queryKey: ["doctors", id],
    queryFn: async () => {
      const response = await fetch(`${API_BASE}/doctors/${id}`);
      if (!response.ok) throw new Error("Failed to fetch doctor");
      return response.json();
    },
    enabled: !!id,
  });
}

// Appointment API hooks
export function useAppointments(doctorId?: number) {
  return useQuery<Appointment[]>({
    queryKey: ["appointments", doctorId],
    queryFn: async () => {
      const url = doctorId
        ? `${API_BASE}/appointments?doctorId=${doctorId}`
        : `${API_BASE}/appointments`;
      const response = await fetch(url);
      if (!response.ok) throw new Error("Failed to fetch appointments");
      return response.json();
    },
  });
}

export function useCheckAvailability() {
  return useMutation<
    { available: boolean },
    Error,
    { doctorId: number; date: string; time: string }
  >({
    mutationFn: async ({ doctorId, date, time }) => {
      const params = new URLSearchParams({ 
        doctorId: doctorId.toString(), 
        date, 
        time 
      });
      const response = await fetch(`${API_BASE}/appointments/availability?${params}`);
      if (!response.ok) throw new Error("Failed to check availability");
      return response.json();
    },
  });
}

export function useBookAppointment() {
  const queryClient = useQueryClient();
  
  return useMutation<Appointment, Error, InsertAppointment>({
    mutationFn: async (appointmentData) => {
      const response = await fetch(`${API_BASE}/appointments`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(appointmentData),
      });
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Failed to book appointment");
      }
      return response.json();
    },
    onSuccess: () => {
      // Invalidate appointments cache to refetch
      queryClient.invalidateQueries({ queryKey: ["appointments"] });
    },
  });
}
