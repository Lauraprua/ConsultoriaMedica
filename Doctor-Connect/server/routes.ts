import type { Express } from "express";
import { type Server } from "http";
import { storage } from "./storage";
import { insertAppointmentSchema } from "@shared/schema";

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {
  
  // Get all doctors
  app.get("/api/doctors", async (_req, res) => {
    try {
      const doctors = await storage.getDoctors();
      res.json(doctors);
    } catch (error) {
      console.error("Error fetching doctors:", error);
      res.status(500).json({ message: "Failed to fetch doctors" });
    }
  });

  // Get doctor by ID
  app.get("/api/doctors/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid doctor ID" });
      }
      
      const doctor = await storage.getDoctorById(id);
      if (!doctor) {
        return res.status(404).json({ message: "Doctor not found" });
      }
      
      res.json(doctor);
    } catch (error) {
      console.error("Error fetching doctor:", error);
      res.status(500).json({ message: "Failed to fetch doctor" });
    }
  });

  // Get appointments (optionally filtered by doctorId)
  app.get("/api/appointments", async (req, res) => {
    try {
      const doctorId = req.query.doctorId ? parseInt(req.query.doctorId as string) : undefined;
      
      if (req.query.doctorId && isNaN(doctorId!)) {
        return res.status(400).json({ message: "Invalid doctor ID" });
      }
      
      const appointments = await storage.getAppointments(doctorId);
      res.json(appointments);
    } catch (error) {
      console.error("Error fetching appointments:", error);
      res.status(500).json({ message: "Failed to fetch appointments" });
    }
  });

  // Check appointment availability
  app.get("/api/appointments/availability", async (req, res) => {
    try {
      const { doctorId, date, time } = req.query;
      
      if (!doctorId || !date || !time) {
        return res.status(400).json({ 
          message: "Missing required parameters: doctorId, date, time" 
        });
      }
      
      const doctorIdNum = parseInt(doctorId as string);
      if (isNaN(doctorIdNum)) {
        return res.status(400).json({ message: "Invalid doctor ID" });
      }
      
      const isAvailable = await storage.checkAvailability(
        doctorIdNum,
        date as string,
        time as string
      );
      
      res.json({ available: isAvailable });
    } catch (error) {
      console.error("Error checking availability:", error);
      res.status(500).json({ message: "Failed to check availability" });
    }
  });

  // Create appointment
  app.post("/api/appointments", async (req, res) => {
    try {
      const validatedData = insertAppointmentSchema.parse(req.body);
      
      // Check availability before booking
      const isAvailable = await storage.checkAvailability(
        validatedData.doctorId,
        validatedData.date,
        validatedData.time
      );
      
      if (!isAvailable) {
        return res.status(409).json({ 
          message: "This time slot is no longer available" 
        });
      }
      
      const appointment = await storage.createAppointment(validatedData);
      res.status(201).json(appointment);
    } catch (error) {
      console.error("Error creating appointment:", error);
      if (error instanceof Error && error.name === "ZodError") {
        return res.status(400).json({ message: "Invalid appointment data" });
      }
      res.status(500).json({ message: "Failed to create appointment" });
    }
  });

  return httpServer;
}
