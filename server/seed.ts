import { storage } from "./storage";

async function seed() {
  console.log("Starting database seed...");

  try {
    // Check if doctors already exist
    const existingDoctors = await storage.getDoctors();
    if (existingDoctors.length > 0) {
      console.log(`Database already has ${existingDoctors.length} doctors. Skipping seed.`);
      return;
    }

    // Seed doctors with generated image paths
    const doctors = [
      {
        name: "Dr. Sarah Wilson",
        specialty: "Cardiologist",
        bio: "Expert in cardiovascular health with 10 years of experience.",
        image: "/src/assets/generated_images/friendly_female_doctor_portrait.png",
        availableDays: [1, 2, 3, 4, 5],
        rating: "4.9"
      },
      {
        name: "Dr. Michael Chen",
        specialty: "General Practitioner",
        bio: "Family physician dedicated to comprehensive care for all ages.",
        image: "/src/assets/generated_images/professional_male_doctor_portrait.png",
        availableDays: [1, 3, 5],
        rating: "4.8"
      },
      {
        name: "Dr. Emily Rodriguez",
        specialty: "Dermatologist",
        bio: "Specializing in medical and cosmetic dermatology.",
        image: "/src/assets/generated_images/experienced_female_specialist_portrait.png",
        availableDays: [2, 4],
        rating: "5.0"
      }
    ];

    for (const doctor of doctors) {
      await storage.createDoctor(doctor);
      console.log(`✓ Created doctor: ${doctor.name}`);
    }

    console.log("Database seed completed successfully!");
  } catch (error) {
    console.error("Error seeding database:", error);
    process.exit(1);
  }
}

seed();
