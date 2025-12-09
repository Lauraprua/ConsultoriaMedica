import { sql } from "drizzle-orm";
import { pgTable, text, varchar, serial, integer, timestamp, jsonb } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Users Table
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  email: text("email").notNull().unique(),
  password: text("password").notNull(),
  name: text("name").notNull(),
  role: text("role").notNull(), // "patient" | "doctor"
  doctorId: integer("doctor_id"), // References doctors.id if role is doctor
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertUserSchema = createInsertSchema(users).omit({
  id: true,
  createdAt: true,
});
export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;

// Doctors Table
export const doctors = pgTable("doctors", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  specialty: text("specialty").notNull(),
  bio: text("bio").notNull(),
  image: text("image").notNull(),
  availableDays: jsonb("available_days").notNull().$type<number[]>(), // Array of numbers: [1,2,3,4,5]
  rating: text("rating").notNull().default("5.0"), // Decimal as string like "4.9"
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertDoctorSchema = createInsertSchema(doctors).omit({
  id: true,
  createdAt: true,
});
export type InsertDoctor = z.infer<typeof insertDoctorSchema>;
export type Doctor = typeof doctors.$inferSelect;

// Appointments Table
export const appointments = pgTable("appointments", {
  id: serial("id").primaryKey(),
  doctorId: integer("doctor_id").notNull().references(() => doctors.id),
  userId: integer("user_id").references(() => users.id),
  patientName: text("patient_name").notNull(),
  date: text("date").notNull(), // YYYY-MM-DD format
  time: text("time").notNull(), // HH:MM format
  status: text("status").notNull().default("confirmed"), // "confirmed" | "completed" | "cancelled"
  type: text("type").notNull(), // "video" | "in-person"
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertAppointmentSchema = createInsertSchema(appointments).omit({
  id: true,
  createdAt: true,
});
export type InsertAppointment = z.infer<typeof insertAppointmentSchema>;
export type Appointment = typeof appointments.$inferSelect;
