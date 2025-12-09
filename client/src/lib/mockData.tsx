import React, { createContext, useContext, useState, ReactNode } from "react";
import { addDays, format, startOfToday } from "date-fns";

// Types
export interface Doctor {
  id: string;
  name: string;
  specialty: string;
  image: string;
  bio: string;
  availableDays: number[]; // 0 = Sunday, 1 = Monday, etc.
  rating: number;
}

export interface Appointment {
  id: string;
  doctorId: string;
  patientName: string;
  date: Date; // Keep as date object for easier comparison
  time: string; // "09:00", "10:00"
  status: "confirmed" | "completed" | "cancelled";
  type: "video" | "in-person";
}

export interface User {
  id: string;
  name: string;
  role: "patient" | "doctor";
  doctorId?: string; // If role is doctor
}

// Mock Data
// We will use the generated images here by importing them in the component that uses this context, 
// or just using string placeholders that we swap out. 
// For now, let's use the paths we know exist.

import doc1 from "@assets/generated_images/friendly_female_doctor_portrait.png";
import doc2 from "@assets/generated_images/professional_male_doctor_portrait.png";
import doc3 from "@assets/generated_images/experienced_female_specialist_portrait.png";

const MOCK_DOCTORS: Doctor[] = [
  {
    id: "1",
    name: "Dr. Sarah Wilson",
    specialty: "Cardiologist",
    image: doc1,
    bio: "Expert in cardiovascular health with 10 years of experience.",
    availableDays: [1, 2, 3, 4, 5], // Mon-Fri
    rating: 4.9
  },
  {
    id: "2",
    name: "Dr. Michael Chen",
    specialty: "General Practitioner",
    image: doc2,
    bio: "Family physician dedicated to comprehensive care for all ages.",
    availableDays: [1, 3, 5], // Mon, Wed, Fri
    rating: 4.8
  },
  {
    id: "3",
    name: "Dr. Emily Rodriguez",
    specialty: "Dermatologist",
    image: doc3,
    bio: "Specializing in medical and cosmetic dermatology.",
    availableDays: [2, 4], // Tue, Thu
    rating: 5.0
  }
];

const MOCK_APPOINTMENTS: Appointment[] = [
  {
    id: "a1",
    doctorId: "1",
    patientName: "John Doe",
    date: startOfToday(),
    time: "10:00",
    status: "confirmed",
    type: "video"
  }
];

// Context
interface MedicalContextType {
  doctors: Doctor[];
  appointments: Appointment[];
  currentUser: User | null;
  loginAsDoctor: (doctorId: string) => void;
  loginAsPatient: () => void;
  logout: () => void;
  bookAppointment: (doctorId: string, date: Date, time: string, type: "video" | "in-person") => void;
  checkAvailability: (doctorId: string, date: Date, time: string) => boolean;
  getDoctorAppointments: (doctorId: string) => Appointment[];
}

const MedicalContext = createContext<MedicalContextType | undefined>(undefined);

export function MedicalProvider({ children }: { children: ReactNode }) {
  const [doctors] = useState<Doctor[]>(MOCK_DOCTORS);
  const [appointments, setAppointments] = useState<Appointment[]>(MOCK_APPOINTMENTS);
  const [currentUser, setCurrentUser] = useState<User | null>(null);

  const loginAsDoctor = (doctorId: string) => {
    const doc = doctors.find(d => d.id === doctorId);
    if (doc) {
      setCurrentUser({
        id: "u_doc_" + doctorId,
        name: doc.name,
        role: "doctor",
        doctorId: doc.id
      });
    }
  };

  const loginAsPatient = () => {
    setCurrentUser({
      id: "u_patient_1",
      name: "Alex Patient",
      role: "patient"
    });
  };

  const logout = () => {
    setCurrentUser(null);
  };

  const bookAppointment = (doctorId: string, date: Date, time: string, type: "video" | "in-person") => {
    const newAppointment: Appointment = {
      id: Math.random().toString(36).substr(2, 9),
      doctorId,
      patientName: currentUser?.role === 'patient' ? currentUser.name : "Guest Patient",
      date,
      time,
      status: "confirmed",
      type
    };
    setAppointments(prev => [...prev, newAppointment]);
  };

  const checkAvailability = (doctorId: string, date: Date, time: string) => {
    return !appointments.some(
      app => 
        app.doctorId === doctorId && 
        format(app.date, 'yyyy-MM-dd') === format(date, 'yyyy-MM-dd') && 
        app.time === time
    );
  };

  const getDoctorAppointments = (doctorId: string) => {
    return appointments.filter(app => app.doctorId === doctorId);
  };

  return (
    <MedicalContext.Provider value={{
      doctors,
      appointments,
      currentUser,
      loginAsDoctor,
      loginAsPatient,
      logout,
      bookAppointment,
      checkAvailability,
      getDoctorAppointments
    }}>
      {children}
    </MedicalContext.Provider>
  );
}

export function useMedical() {
  const context = useContext(MedicalContext);
  if (context === undefined) {
    throw new Error("useMedical must be used within a MedicalProvider");
  }
  return context;
}
