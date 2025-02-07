import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";
import { X } from "lucide-react";
import { generateTimeSlots } from "@/utils/timeSlots";

interface ReservationModalProps {
  onClose: () => void;
}

type Step = 1 | 2;

interface CustomerInfo {
  name: string;
  phone: string;
  email: string;
}

interface ReservationDetails {
  participants: number;
  customParticipants?: number;
  selectedTime: string;
  selectedDishes: {
    id: string;
    name: string;
    quantity: number;
    price: number;
  }[];
}

const MENU_ITEMS = [
  { id: "1", name: "Francesinha", price: 15 },
  { id: "2", name: "Turkey", price: 20 },
  { id: "3", name: "Special Steak", price: 25 },
];

export const ReservationModal = ({ onClose }: ReservationModalProps) => {
  const [step, setStep] = useState<Step>(1);
  const [customerInfo, setCustomerInfo] = useState<CustomerInfo>({
    name: "",
    phone: "",
    email: "",
  });
  const [reservationDetails, setReservationDetails] = useState<ReservationDetails>({
    participants: 1,
    selectedTime: "12:00",
    selectedDishes: [],
  });
  const { toast } = useToast();
  const timeSlots = generateTimeSlots();

  const handleCustomerInfoSubmit = () => {
    if (!customerInfo.name || !customerInfo.phone || !customerInfo.email) {
      toast({
        title: "Error",
        description: "Please fill in all fields",
        variant: "destructive",
      });
      return;
    }
    setStep(2);
  };

  const handleReservationSubmit = () => {
    if (!reservationDetails.participants || !reservationDetails.selectedTime) {
      toast({
        title: "Error",
        description: "Please select number of participants and time",
        variant: "destructive",
      });
      return;
    }

    const totalAmount = reservationDetails.selectedDishes.reduce(
      (sum, dish) => sum + dish.quantity * dish.price,
      0
    );

    // Create the reservation object
    const newReservation = {
      id: Date.now().toString(),
      customerName: customerInfo.name,
      phone: customerInfo.phone,
      email: customerInfo.email,
      time: reservationDetails.selectedTime,
      participants: reservationDetails.customParticipants || reservationDetails.participants,
      dishes: reservationDetails.selectedDishes,
      status: "pending",
      isPriority: false,
      totalAmount: totalAmount,
    };

    // Get existing reservations from localStorage
    const existingReservations = JSON.parse(localStorage.getItem('reservations') || '[]');
    
    // Add new reservation to the list
    const updatedReservations = [newReservation, ...existingReservations];
    
    // Save to localStorage
    localStorage.setItem('reservations', JSON.stringify(updatedReservations));

    // Show success message
    toast({
      title: "Success!",
      description: "Your reservation has been submitted for approval",
    });
    
    onClose();
  };

  const renderStep1 = () => (
    <div className="space-y-4">
      <h2 className="text-2xl font-playfair mb-6">Personal Information</h2>
      <div>
        <Label htmlFor="name">Name</Label>
        <Input
          id="name"
          value={customerInfo.name}
          onChange={(e) => setCustomerInfo({ ...customerInfo, name: e.target.value })}
        />
      </div>
      <div>
        <Label htmlFor="phone">Phone</Label>
        <Input
          id="phone"
          value={customerInfo.phone}
          onChange={(e) => setCustomerInfo({ ...customerInfo, phone: e.target.value })}
        />
      </div>
      <div>
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          type="email"
          value={customerInfo.email}
          onChange={(e) => setCustomerInfo({ ...customerInfo, email: e.target.value })}
        />
      </div>
      <Button onClick={handleCustomerInfoSubmit} className="w-full">Next</Button>
    </div>
  );

  const renderStep2 = () => (
    <div className="space-y-4">
      <h2 className="text-2xl font-playfair mb-6">Reservation Details</h2>
      
      <div>
        <Label htmlFor="time">Select Time</Label>
        <select
          id="time"
          className="w-full p-2 border rounded"
          value={reservationDetails.selectedTime}
          onChange={(e) => setReservationDetails({
            ...reservationDetails,
            selectedTime: e.target.value,
          })}
        >
          {timeSlots.map((time) => (
            <option key={time} value={time}>
              {time}
            </option>
          ))}
        </select>
      </div>

      <div>
        <Label htmlFor="participants">Number of Participants</Label>
        <select
          id="participants"
          className="w-full p-2 border rounded"
          value={reservationDetails.participants}
          onChange={(e) => {
            const value = e.target.value;
            if (value === "custom") {
              setReservationDetails({
                ...reservationDetails,
                participants: 0,
              });
            } else {
              setReservationDetails({
                ...reservationDetails,
                participants: parseInt(value),
              });
            }
          }}
        >
          {[...Array(16)].map((_, i) => (
            <option key={i + 1} value={i + 1}>
              {i + 1}
            </option>
          ))}
          <option value="custom">Custom</option>
        </select>
      </div>
      
      {reservationDetails.participants === 0 && (
        <div>
          <Label htmlFor="customParticipants">Custom Number</Label>
          <Input
            id="customParticipants"
            type="number"
            min="17"
            value={reservationDetails.customParticipants || ""}
            onChange={(e) => setReservationDetails({
              ...reservationDetails,
              customParticipants: parseInt(e.target.value),
            })}
          />
        </div>
      )}

      <div className="space-y-4">
        <h3 className="text-xl">Pre-order Dishes (Optional)</h3>
        {MENU_ITEMS.map((item) => (
          <div key={item.id} className="flex items-center justify-between">
            <span>{item.name} - €{item.price}</span>
            <Input
              type="number"
              min="0"
              className="w-20"
              value={reservationDetails.selectedDishes.find(d => d.id === item.id)?.quantity || 0}
              onChange={(e) => {
                const quantity = parseInt(e.target.value);
                setReservationDetails({
                  ...reservationDetails,
                  selectedDishes: [
                    ...reservationDetails.selectedDishes.filter(d => d.id !== item.id),
                    ...(quantity > 0 ? [{
                      id: item.id,
                      name: item.name,
                      quantity,
                      price: item.price,
                    }] : []),
                  ],
                });
              }}
            />
          </div>
        ))}
      </div>

      <Button onClick={handleReservationSubmit} className="w-full">Complete Reservation</Button>
    </div>
  );

  return (
    <>
      <div className="modal-overlay" onClick={onClose} />
      <div className="modal-content">
        <Button
          variant="ghost"
          size="icon"
          className="absolute right-4 top-4"
          onClick={onClose}
        >
          <X className="h-4 w-4" />
        </Button>
        
        {step === 1 && renderStep1()}
        {step === 2 && renderStep2()}
      </div>
    </>
  );
};