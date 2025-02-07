
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { AdminLogin } from "@/components/AdminLogin";
import { ReservationModal } from "@/components/ReservationModal";

const Index = () => {
  const [showReservation, setShowReservation] = useState(false);
  const [showAdminLogin, setShowAdminLogin] = useState(false);

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative h-screen">
        <div className="absolute inset-0 bg-[url('/restaurant-bg.jpg')] bg-cover bg-center">
          <div className="absolute inset-0 bg-gradient-to-b from-black/70 to-black/50" />
        </div>
        <div className="relative container mx-auto h-full flex flex-col items-center justify-center text-white">
          <h1 className="text-7xl mb-6 font-playfair font-bold">Casa Lisboa</h1>
          <p className="text-2xl mb-12 font-lato italic">Authentic Portuguese Cuisine</p>
          <Button 
            onClick={() => setShowReservation(true)}
            className="bg-primary hover:bg-primary/90 text-primary-foreground text-lg px-8 py-6"
          >
            Reserve Your Table
          </Button>
        </div>
      </section>

      {/* About Section */}
      <section className="py-24 bg-accent">
        <div className="container mx-auto px-4">
          <h2 className="text-5xl text-center mb-12 text-primary font-playfair">Our Story</h2>
          <div className="max-w-3xl mx-auto">
            <p className="text-xl text-center leading-relaxed font-lato text-primary/90">
              Nestled in the heart of the city, Casa Lisboa brings the authentic flavors of Portugal 
              to your table. Our chefs combine traditional recipes with modern culinary techniques, 
              creating an unforgettable dining experience that celebrates Portuguese heritage.
            </p>
          </div>
        </div>
      </section>

      {/* Admin Login Button */}
      <div className="fixed top-4 right-4">
        <Button
          variant="outline"
          onClick={() => setShowAdminLogin(true)}
          className="bg-transparent border-white text-white hover:bg-white/10"
        >
          Admin Login
        </Button>
      </div>

      {/* Modals */}
      {showReservation && (
        <ReservationModal onClose={() => setShowReservation(false)} />
      )}
      
      {showAdminLogin && (
        <AdminLogin onClose={() => setShowAdminLogin(false)} />
      )}
    </div>
  );
};

export default Index;
