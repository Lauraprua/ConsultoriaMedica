import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Stethoscope } from "lucide-react";

export function Navbar() {
  const [location] = useLocation();

  const isActive = (path: string) => location === path;

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-white/80 backdrop-blur-md">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <Link href="/" className="flex items-center gap-2 font-bold text-xl text-primary tracking-tight">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
            <Stethoscope className="h-5 w-5" />
          </div>
          MediConnect
        </Link>

        <nav className="hidden md:flex gap-6">
          <Link href="/" className={`text-sm font-medium transition-colors hover:text-primary ${isActive("/") ? "text-primary" : "text-muted-foreground"}`}>
            Home
          </Link>
          <Link href="/book" className={`text-sm font-medium transition-colors hover:text-primary ${isActive("/book") ? "text-primary" : "text-muted-foreground"}`}>
            Find Doctors
          </Link>
          <Link href="/doctor-dashboard" className={`text-sm font-medium transition-colors hover:text-primary ${isActive("/doctor-dashboard") ? "text-primary" : "text-muted-foreground"}`}>
            Dashboard
          </Link>
        </nav>

        <div className="flex items-center gap-4">
          <Link href="/book">
            <Button>Book Appointment</Button>
          </Link>
        </div>
      </div>
    </header>
  );
}
