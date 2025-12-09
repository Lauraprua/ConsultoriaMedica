import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { ArrowRight, Calendar, Video, Shield, Star, Clock } from "lucide-react";
import heroImage from "@assets/generated_images/modern_clean_medical_office_reception_with_soft_lighting.png";
import { useDoctors } from "@/lib/api";
import doc1 from "@/assets/generated_images/friendly_female_doctor_portrait.png";
import doc2 from "@/assets/generated_images/professional_male_doctor_portrait.png";
import doc3 from "@/assets/generated_images/experienced_female_specialist_portrait.png";

const doctorImages: Record<number, string> = {
  1: doc1,
  2: doc2,
  3: doc3,
};

export default function Home() {
  const { data: doctors, isLoading } = useDoctors();

  return (
    <div className="flex min-h-screen flex-col">
      {/* Hero Section */}
      <section className="relative overflow-hidden pt-16 pb-32 lg:pt-32">
        <div className="container mx-auto px-4">
          <div className="grid gap-12 lg:grid-cols-2 lg:gap-8 items-center">
            <div className="max-w-2xl animate-in-up" style={{ animationDelay: "0.1s" }}>
              <h1 className="text-4xl font-extrabold tracking-tight sm:text-6xl mb-6 text-slate-900">
                Healthcare Reimagined. <br />
                <span className="text-primary">Online & In-Person.</span>
              </h1>
              <p className="text-lg text-muted-foreground mb-8 leading-relaxed">
                Connect with top-rated medical professionals for secure online consultations or in-person visits. 
                Skip the waiting room and get the care you need, when you need it.
              </p>
              <div className="flex gap-4">
                <Link href="/book">
                  <Button size="lg" className="h-12 px-8 text-base">
                    Book Appointment <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
                <Button variant="outline" size="lg" className="h-12 px-8 text-base">
                  Learn More
                </Button>
              </div>
              
              <div className="mt-10 flex items-center gap-4 text-sm text-muted-foreground">
                <div className="flex -space-x-2">
                  {[1,2,3,4].map(i => (
                    <div key={i} className="h-8 w-8 rounded-full border-2 border-white bg-slate-200" />
                  ))}
                </div>
                <p>Trusted by 10,000+ patients</p>
              </div>
            </div>
            
            <div className="relative animate-in-up" style={{ animationDelay: "0.3s" }}>
              <div className="relative rounded-2xl overflow-hidden shadow-2xl ring-1 ring-slate-900/10">
                <img 
                  src={heroImage} 
                  alt="Modern Medical Office" 
                  className="w-full h-auto object-cover aspect-[4/3]"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent pointer-events-none" />
              </div>
              
              {/* Floating Badge */}
              <div className="absolute -bottom-6 -left-6 bg-white p-4 rounded-xl shadow-xl border border-slate-100 flex items-center gap-3 animate-bounce" style={{ animationDuration: "3s" }}>
                <div className="h-10 w-10 rounded-full bg-green-100 flex items-center justify-center text-green-600">
                  <Video className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground font-medium">Next Available</p>
                  <p className="font-bold text-slate-900">In 15 mins</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="bg-slate-50 py-24">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-3xl font-bold mb-4">Why Choose MediConnect?</h2>
            <p className="text-muted-foreground">We make healthcare accessible, secure, and convenient for everyone.</p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            <FeatureCard 
              icon={<Calendar className="h-6 w-6 text-primary" />}
              title="Easy Scheduling"
              description="Book appointments 24/7 with our real-time availability calendar."
            />
            <FeatureCard 
              icon={<Video className="h-6 w-6 text-primary" />}
              title="HD Video Consultations"
              description="Secure, high-quality video calls with your doctor from home."
            />
            <FeatureCard 
              icon={<Shield className="h-6 w-6 text-primary" />}
              title="Secure & Private"
              description="Your health data is encrypted and protected with bank-level security."
            />
          </div>
        </div>
      </section>

      {/* Featured Doctors */}
      <section className="py-24">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-end mb-12">
            <div>
              <h2 className="text-3xl font-bold mb-4">Top Rated Specialists</h2>
              <p className="text-muted-foreground">Book directly with our most trusted professionals.</p>
            </div>
            <Link href="/book">
              <Button variant="ghost" className="hidden md:flex">View all doctors <ArrowRight className="ml-2 h-4 w-4" /></Button>
            </Link>
          </div>

          {isLoading ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground">Loading doctors...</p>
            </div>
          ) : (
            <div className="grid md:grid-cols-3 gap-8">
              {doctors?.map(doctor => (
                <div key={doctor.id} className="group relative rounded-2xl border bg-white p-2 transition-all hover:shadow-lg">
                  <div className="aspect-square overflow-hidden rounded-xl bg-slate-100 mb-4">
                    <img src={doctorImages[doctor.id]} alt={doctor.name} className="h-full w-full object-cover transition-transform group-hover:scale-105" />
                  </div>
                  <div className="px-2 pb-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80">
                        {doctor.specialty}
                      </span>
                      <div className="flex items-center text-amber-500 text-sm font-medium">
                        <Star className="h-3 w-3 fill-current mr-1" />
                        {doctor.rating}
                      </div>
                    </div>
                    <h3 className="text-lg font-bold text-slate-900 mb-1">{doctor.name}</h3>
                    <p className="text-sm text-muted-foreground line-clamp-2 mb-4">{doctor.bio}</p>
                    
                    <Link href={`/book?doctor=${doctor.id}`}>
                      <Button className="w-full" variant="outline">Book Appointment</Button>
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}

function FeatureCard({ icon, title, description }: { icon: React.ReactNode, title: string, description: string }) {
  return (
    <div className="bg-white p-8 rounded-2xl border shadow-sm hover:shadow-md transition-shadow">
      <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center mb-6">
        {icon}
      </div>
      <h3 className="text-xl font-bold mb-3">{title}</h3>
      <p className="text-muted-foreground leading-relaxed">{description}</p>
    </div>
  );
}
