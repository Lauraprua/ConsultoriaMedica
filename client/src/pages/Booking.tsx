import React, { useState, useEffect } from "react";
import { Link, useLocation } from "wouter";
import { format, startOfToday } from "date-fns";
import { DayPicker } from "react-day-picker";
import "react-day-picker/dist/style.css";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { Calendar as CalendarIcon, Clock, Video, MapPin, CheckCircle2, ChevronLeft } from "lucide-react";
import { cn } from "@/lib/utils";
import { useDoctors, useBookAppointment } from "@/lib/api";
import type { Doctor } from "@shared/schema";

import doc1 from "@/assets/generated_images/friendly_female_doctor_portrait.png";
import doc2 from "@/assets/generated_images/professional_male_doctor_portrait.png";
import doc3 from "@/assets/generated_images/experienced_female_specialist_portrait.png";

// Map doctor IDs to images
const doctorImages: Record<number, string> = {
  1: doc1,
  2: doc2,
  3: doc3,
};

// Generate time slots (9am to 5pm)
const TIME_SLOTS = [
  "09:00", "09:30", "10:00", "10:30", "11:00", "11:30",
  "13:00", "13:30", "14:00", "14:30", "15:00", "15:30", "16:00", "16:30"
];

export default function Booking() {
  const [location, setLocation] = useLocation();
  const { data: doctors, isLoading } = useDoctors();
  const bookAppointmentMutation = useBookAppointment();
  const { toast } = useToast();
  
  // State
  const [selectedDoctorId, setSelectedDoctorId] = useState<number | null>(null);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [appointmentType, setAppointmentType] = useState<"video" | "in-person">("video");
  const [step, setStep] = useState(1);
  const [bookedSlots, setBookedSlots] = useState<Set<string>>(new Set());

  // Parse query params
  useEffect(() => {
    const searchParams = new URLSearchParams(window.location.search);
    const doctorParam = searchParams.get("doctor");
    if (doctorParam) {
      setSelectedDoctorId(parseInt(doctorParam));
      setStep(2);
    }
  }, []);

  const selectedDoctor = doctors?.find((d: Doctor) => d.id === selectedDoctorId);

  const handleDateSelect = (date: Date | undefined) => {
    setSelectedDate(date);
    setSelectedTime(null);
    
    // Fetch appointments for this doctor and date to check availability
    if (date && selectedDoctorId) {
      const dateStr = format(date, 'yyyy-MM-dd');
      fetch(`/api/appointments?doctorId=${selectedDoctorId}`)
        .then(res => res.json())
        .then(appointments => {
          const slots = new Set<string>(
            appointments
              .filter((app: any) => app.date === dateStr)
              .map((app: any) => app.time as string)
          );
          setBookedSlots(slots);
        })
        .catch(err => console.error('Error fetching appointments:', err));
    }
  };

  const handleBooking = async () => {
    if (!selectedDoctor || !selectedDate || !selectedTime) return;

    const dateStr = format(selectedDate, 'yyyy-MM-dd');

    try {
      await bookAppointmentMutation.mutateAsync({
        doctorId: selectedDoctor.id,
        patientName: "Guest Patient",
        date: dateStr,
        time: selectedTime,
        status: "confirmed",
        type: appointmentType,
      });

      toast({
        title: "Appointment Confirmed!",
        description: `You are booked with ${selectedDoctor.name} on ${format(selectedDate, 'MMM d')} at ${selectedTime}.`,
      });
      setStep(4);
    } catch (error) {
      toast({
        title: "Booking Failed",
        description: error instanceof Error ? error.message : "Failed to book appointment",
        variant: "destructive",
      });
    }
  };

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-12 max-w-5xl">
        <p className="text-center">Loading doctors...</p>
      </div>
    );
  }

  // Step 1: Doctor Selection
  if (step === 1) {
    return (
      <div className="container mx-auto px-4 py-12 max-w-5xl">
        <h1 className="text-3xl font-bold mb-8" data-testid="text-page-title">Select a Specialist</h1>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {doctors?.map((doctor: Doctor) => (
            <Card 
              key={doctor.id} 
              className="cursor-pointer hover:border-primary transition-all hover:shadow-md" 
              onClick={() => { setSelectedDoctorId(doctor.id); setStep(2); }}
              data-testid={`card-doctor-${doctor.id}`}
            >
              <CardHeader className="flex flex-row items-center gap-4">
                <Avatar className="h-16 w-16">
                  <AvatarImage src={doctorImages[doctor.id]} />
                  <AvatarFallback>{doctor.name[0]}</AvatarFallback>
                </Avatar>
                <div>
                  <CardTitle className="text-lg" data-testid={`text-doctor-name-${doctor.id}`}>{doctor.name}</CardTitle>
                  <CardDescription data-testid={`text-doctor-specialty-${doctor.id}`}>{doctor.specialty}</CardDescription>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground line-clamp-2">{doctor.bio}</p>
                <div className="mt-4 flex gap-2">
                  <span className="text-xs bg-slate-100 px-2 py-1 rounded-md text-slate-600">Video Visit</span>
                  <span className="text-xs bg-slate-100 px-2 py-1 rounded-md text-slate-600">In-Person</span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  // Step 4: Success
  if (step === 4) {
    return (
      <div className="container mx-auto px-4 py-12 max-w-md text-center">
        <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6 text-green-600">
          <CheckCircle2 className="h-10 w-10" />
        </div>
        <h1 className="text-2xl font-bold mb-2" data-testid="text-confirmation-title">Booking Confirmed!</h1>
        <p className="text-muted-foreground mb-8">
          Your appointment has been scheduled successfully. You will receive a confirmation email shortly.
        </p>
        
        <div className="bg-slate-50 p-6 rounded-xl border mb-8 text-left">
          <div className="flex items-center gap-4 mb-4 border-b pb-4">
            <Avatar>
              <AvatarImage src={doctorImages[selectedDoctor?.id || 1]} />
              <AvatarFallback>DR</AvatarFallback>
            </Avatar>
            <div>
              <p className="font-bold text-slate-900" data-testid="text-confirmed-doctor-name">{selectedDoctor?.name}</p>
              <p className="text-sm text-muted-foreground">{selectedDoctor?.specialty}</p>
            </div>
          </div>
          <div className="space-y-3 text-sm">
            <div className="flex items-center gap-3">
              <CalendarIcon className="h-4 w-4 text-primary" />
              <span data-testid="text-confirmed-date">{selectedDate && format(selectedDate, "EEEE, MMMM do, yyyy")}</span>
            </div>
            <div className="flex items-center gap-3">
              <Clock className="h-4 w-4 text-primary" />
              <span data-testid="text-confirmed-time">{selectedTime}</span>
            </div>
            <div className="flex items-center gap-3">
              {appointmentType === 'video' ? <Video className="h-4 w-4 text-primary" /> : <MapPin className="h-4 w-4 text-primary" />}
              <span className="capitalize">{appointmentType} Consultation</span>
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-3">
          <Link href="/">
            <Button className="w-full" data-testid="button-return-home">Return Home</Button>
          </Link>
          {appointmentType === 'video' && (
             <Link href={`/consultation/${Math.floor(Math.random() * 1000)}`}>
               <Button variant="outline" className="w-full" data-testid="button-test-video">Test Video Room</Button>
             </Link>
          )}
        </div>
      </div>
    );
  }

  // Steps 2 & 3: Calendar & Time
  return (
    <div className="container mx-auto px-4 py-8 lg:py-12 max-w-6xl">
      <Button variant="ghost" className="mb-6 pl-0 hover:pl-2 transition-all" onClick={() => setStep(1)} data-testid="button-back">
        <ChevronLeft className="mr-2 h-4 w-4" /> Back to Specialists
      </Button>

      <div className="grid lg:grid-cols-12 gap-8">
        {/* Left: Doctor Info */}
        <div className="lg:col-span-4">
          <Card className="sticky top-24">
            <CardHeader>
              <div className="flex flex-col items-center text-center">
                <Avatar className="h-24 w-24 mb-4">
                  <AvatarImage src={doctorImages[selectedDoctor?.id || 1]} />
                  <AvatarFallback>DR</AvatarFallback>
                </Avatar>
                <CardTitle className="text-xl" data-testid="text-selected-doctor-name">{selectedDoctor?.name}</CardTitle>
                <CardDescription className="text-base">{selectedDoctor?.specialty}</CardDescription>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <h4 className="font-medium text-sm mb-2 text-muted-foreground">About</h4>
                  <p className="text-sm">{selectedDoctor?.bio}</p>
                </div>
                <div className="pt-4 border-t">
                  <h4 className="font-medium text-sm mb-3 text-muted-foreground">Consultation Type</h4>
                  <Tabs value={appointmentType} onValueChange={(v) => setAppointmentType(v as any)} className="w-full">
                    <TabsList className="w-full grid grid-cols-2" data-testid="tabs-appointment-type">
                      <TabsTrigger value="video" data-testid="tab-video">Video</TabsTrigger>
                      <TabsTrigger value="in-person" data-testid="tab-in-person">In-Person</TabsTrigger>
                    </TabsList>
                  </Tabs>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right: Calendar & Time */}
        <div className="lg:col-span-8">
          <Card className="h-full border-0 shadow-none lg:border lg:shadow-sm">
            <CardHeader>
              <CardTitle>Select Availability</CardTitle>
              <CardDescription>Choose a date and time for your appointment</CardDescription>
            </CardHeader>
            <CardContent className="space-y-8">
              {/* Calendar Section */}
              <div className="flex flex-col md:flex-row gap-8">
                <div className="border rounded-xl p-4 bg-white shadow-sm inline-block mx-auto md:mx-0">
                  <style>{`
                    .rdp-day_selected, .rdp-day_selected:focus-visible, .rdp-day_selected:hover {
                      background-color: var(--color-primary);
                    }
                    .rdp-button:hover:not([disabled]):not(.rdp-day_selected) {
                      background-color: var(--color-secondary);
                      color: var(--color-secondary-foreground);
                    }
                  `}</style>
                  <DayPicker
                    mode="single"
                    selected={selectedDate}
                    onSelect={handleDateSelect}
                    disabled={[
                      { before: startOfToday() },
                      (date) => {
                        // Disable days the doctor is not working
                        const dayOfWeek = date.getDay();
                        return !selectedDoctor?.availableDays.includes(dayOfWeek);
                      }
                    ]}
                    modifiersClassNames={{
                      selected: "bg-primary text-white"
                    }}
                  />
                </div>

                {/* Time Slots Section */}
                <div className="flex-1">
                  <h3 className="font-medium mb-4 flex items-center gap-2">
                    <Clock className="h-4 w-4" /> 
                    {selectedDate ? format(selectedDate, "MMMM do") : "Select a date"}
                  </h3>
                  
                  {!selectedDate ? (
                    <div className="h-64 flex items-center justify-center border-2 border-dashed rounded-xl text-muted-foreground bg-slate-50">
                      Select a date to view available times
                    </div>
                  ) : (
                    <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
                      {TIME_SLOTS.map(time => {
                        const isAvailable = !bookedSlots.has(time);
                        
                        return (
                          <Button
                            key={time}
                            variant={selectedTime === time ? "default" : "outline"}
                            className={cn(
                              "h-10 text-sm",
                              selectedTime === time ? "bg-primary text-primary-foreground" : "",
                              !isAvailable && "opacity-50 cursor-not-allowed bg-slate-100 text-slate-400 hover:bg-slate-100"
                            )}
                            disabled={!isAvailable}
                            onClick={() => isAvailable && setSelectedTime(time)}
                            data-testid={`button-time-${time}`}
                          >
                            {time}
                          </Button>
                        );
                      })}
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex justify-end border-t pt-6">
               <Button 
                size="lg" 
                onClick={handleBooking}
                disabled={!selectedDate || !selectedTime || bookAppointmentMutation.isPending}
                className="w-full sm:w-auto"
                data-testid="button-confirm-booking"
               >
                 {bookAppointmentMutation.isPending ? "Booking..." : "Confirm Booking"}
               </Button>
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  );
}
