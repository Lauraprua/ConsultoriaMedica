import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { MedicalProvider } from "@/lib/mockData";
import { Navbar } from "@/components/layout/Navbar";
import NotFound from "@/pages/not-found";

// Pages
import Home from "@/pages/Home";
import Booking from "@/pages/Booking";
import DoctorDashboard from "@/pages/DoctorDashboard";
import Consultation from "@/pages/Consultation";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/book" component={Booking} />
      <Route path="/doctor-dashboard" component={DoctorDashboard} />
      <Route path="/consultation/:id" component={Consultation} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <MedicalProvider>
            <div className="min-h-screen bg-background font-sans antialiased">
                <Navbar />
                <main>
                    <Router />
                </main>
                <Toaster />
            </div>
        </MedicalProvider>
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
