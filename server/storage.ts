import { eq, and } from "drizzle-orm";
import { db } from "./db";
import { 
  users, 
  doctors, 
  appointments,
  type User,
  type Doctor,
  type Appointment,
  type InsertUser,
  type InsertDoctor,
  type InsertAppointment
} from "@shared/schema";

export interface IStorage {
  // User methods
  getUser(id: number): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  // Doctor methods
  getDoctors(): Promise<Doctor[]>;
  getDoctorById(id: number): Promise<Doctor | undefined>;
  createDoctor(doctor: InsertDoctor): Promise<Doctor>;
  
  // Appointment methods
  getAppointments(doctorId?: number): Promise<Appointment[]>;
  getAppointmentById(id: number): Promise<Appointment | undefined>;
  createAppointment(appointment: InsertAppointment): Promise<Appointment>;
  checkAvailability(doctorId: number, date: string, time: string): Promise<boolean>;
}

export class DatabaseStorage implements IStorage {
  // User methods
  async getUser(id: number): Promise<User | undefined> {
    const result = await db.select().from(users).where(eq(users.id, id)).limit(1);
    return result[0];
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    const result = await db.select().from(users).where(eq(users.email, email)).limit(1);
    return result[0];
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const result = await db.insert(users).values(insertUser).returning();
    return result[0];
  }

  // Doctor methods
  async getDoctors(): Promise<Doctor[]> {
    return await db.select().from(doctors);
  }

  async getDoctorById(id: number): Promise<Doctor | undefined> {
    const result = await db.select().from(doctors).where(eq(doctors.id, id)).limit(1);
    return result[0];
  }

  async createDoctor(insertDoctor: InsertDoctor): Promise<Doctor> {
    const result = await db.insert(doctors).values(insertDoctor).returning();
    return result[0];
  }

  // Appointment methods
  async getAppointments(doctorId?: number): Promise<Appointment[]> {
    if (doctorId !== undefined) {
      return await db.select().from(appointments).where(eq(appointments.doctorId, doctorId));
    }
    return await db.select().from(appointments);
  }

  async getAppointmentById(id: number): Promise<Appointment | undefined> {
    const result = await db.select().from(appointments).where(eq(appointments.id, id)).limit(1);
    return result[0];
  }

  async createAppointment(insertAppointment: InsertAppointment): Promise<Appointment> {
    const result = await db.insert(appointments).values(insertAppointment).returning();
    return result[0];
  }

  async checkAvailability(doctorId: number, date: string, time: string): Promise<boolean> {
    const result = await db
      .select()
      .from(appointments)
      .where(
        and(
          eq(appointments.doctorId, doctorId),
          eq(appointments.date, date),
          eq(appointments.time, time)
        )
      )
      .limit(1);
    
    return result.length === 0;
  }
}

export const storage = new DatabaseStorage();
