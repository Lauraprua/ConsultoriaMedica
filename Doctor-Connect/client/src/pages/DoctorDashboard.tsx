import { Link, useLocation } from "wouter";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Calendar, Clock, Video, User, Settings } from "lucide-react";
import { format, parseISO } from "date-fns";
import { useState } from "react";
import { useAppointments, useDoctors } from "@/lib/api";
import type { Appointment } from "@shared/schema";

export default function DoctorDashboard() {
  const [_, setLocation] = useLocation();
  
  // For demo, let's use doctor ID 1 (Dr. Sarah Wilson)
  // In a real app, this would come from authentication
  const [currentDoctorId] = useState(1);
  
  const { data: doctors } = useDoctors();
  const { data: appointments, isLoading } = useAppointments(currentDoctorId);
  
  const currentDoctor = doctors?.find(d => d.id === currentDoctorId);

  if (!currentDoctor) {
    return (
      <div className="container mx-auto px-4 py-8">
        <p className="text-center">Loading...</p>
      </div>
    );
  }

  const upcomingAppointments = appointments
    ?.filter((a: Appointment) => a.status !== 'cancelled')
    .sort((a: Appointment, b: Appointment) => {
      const dateA = new Date(`${a.date}T${a.time}`);
      const dateB = new Date(`${b.date}T${b.time}`);
      return dateA.getTime() - dateB.getTime();
    }) || [];

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold" data-testid="text-dashboard-title">Doctor Dashboard</h1>
          <p className="text-muted-foreground">Welcome back, {currentDoctor.name}</p>
        </div>
        <div className="flex gap-2">
            <Button variant="outline" size="sm" data-testid="button-settings">
                <Settings className="mr-2 h-4 w-4" /> Availability Settings
            </Button>
        </div>
      </div>

      <div className="grid md:grid-cols-3 gap-8">
        {/* Stats */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Upcoming Appointments</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold" data-testid="text-upcoming-count">{upcomingAppointments.length}</div>
            <p className="text-xs text-muted-foreground">Scheduled appointments</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Today's Schedule</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {upcomingAppointments.filter((a: Appointment) => a.date === format(new Date(), 'yyyy-MM-dd')).length}
            </div>
            <p className="text-xs text-muted-foreground">Appointments today</p>
          </CardContent>
        </Card>
        <Card>
            <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">Patient Satisfaction</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="text-2xl font-bold" data-testid="text-rating">{currentDoctor.rating}/5.0</div>
                <p className="text-xs text-muted-foreground">Your current rating</p>
            </CardContent>
        </Card>

        {/* Appointment List */}
        <Card className="md:col-span-3">
          <CardHeader>
            <CardTitle>Upcoming Appointments</CardTitle>
            <CardDescription>Manage your patient schedule</CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading ? (
                <div className="text-center py-12 text-muted-foreground">
                    Loading appointments...
                </div>
            ) : upcomingAppointments.length === 0 ? (
                <div className="text-center py-12 text-muted-foreground">
                    No upcoming appointments.
                </div>
            ) : (
                <div className="space-y-4">
                {upcomingAppointments.map((app: Appointment) => (
                    <div 
                      key={app.id} 
                      className="flex flex-col sm:flex-row sm:items-center justify-between p-4 border rounded-lg bg-slate-50/50 hover:bg-slate-50 transition-colors"
                      data-testid={`card-appointment-${app.id}`}
                    >
                        <div className="flex items-center gap-4 mb-4 sm:mb-0">
                            <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold">
                                {app.patientName[0]}
                            </div>
                            <div>
                                <h4 className="font-semibold" data-testid={`text-patient-name-${app.id}`}>{app.patientName}</h4>
                                <div className="flex items-center gap-3 text-sm text-muted-foreground mt-1">
                                    <span className="flex items-center gap-1"><Calendar className="h-3 w-3" /> {format(parseISO(app.date), "MMM d, yyyy")}</span>
                                    <span className="flex items-center gap-1"><Clock className="h-3 w-3" /> {app.time}</span>
                                    <span className="flex items-center gap-1">
                                        {app.type === 'video' ? <Video className="h-3 w-3" /> : <User className="h-3 w-3" />}
                                        {app.type === 'video' ? "Video Call" : "In-Person"}
                                    </span>
                                </div>
                            </div>
                        </div>
                        <div className="flex items-center gap-2">
                            {app.type === 'video' && (
                                <Link href={`/consultation/${app.id}`}>
                                    <Button size="sm" className="w-full sm:w-auto" data-testid={`button-join-call-${app.id}`}>
                                        <Video className="mr-2 h-3 w-3" /> Join Call
                                    </Button>
                                </Link>
                            )}
                            <Button size="sm" variant="outline" className="w-full sm:w-auto" data-testid={`button-view-details-${app.id}`}>View Details</Button>
                        </div>
                    </div>
                ))}
                </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
