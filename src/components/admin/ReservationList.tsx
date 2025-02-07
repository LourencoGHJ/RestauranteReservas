import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Clock, Users, DollarSign, CheckCircle, XCircle, Trash2 } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";

interface Reservation {
  id: string;
  customerName: string;
  phone: string;
  email: string;
  time: string;
  participants: number;
  dishes: {
    name: string;
    quantity: number;
    price: number;
  }[];
  status: "pending" | "approved" | "rejected";
  isPriority: boolean;
  totalAmount: number;
}

interface ReservationListProps {
  reservations: Reservation[];
  onStatusChange: (id: string, status: "approved" | "rejected") => void;
  onRemove: (id: string) => void;
  showActions: boolean;
}

const RESTAURANT_INFO = {
  name: "Gourmet Haven",
  address: "123 Culinary Street, Porto, Portugal",
  phone: "+351 123 456 789",
  email: "contact@gourmethaven.com",
  location: {
    lat: 41.1579,
    lng: -8.6291
  },
  googleMapsUrl: "https://goo.gl/maps/your-restaurant-location"
};

export const ReservationList = ({ 
  reservations, 
  onStatusChange, 
  onRemove,
  showActions 
}: ReservationListProps) => {
  const { toast } = useToast();
  const isMobile = useIsMobile();

  const sendEmailNotification = async (reservation: Reservation, status: "approved" | "rejected") => {
    const subject = status === "approved" 
      ? `Reservation Confirmed - ${RESTAURANT_INFO.name}`
      : `Reservation Update - ${RESTAURANT_INFO.name}`;

    const dishesHtml = reservation.dishes.map(dish => 
      `<li>${dish.name} x${dish.quantity} - €${dish.quantity * dish.price}</li>`
    ).join('');

    const emailContent = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <h2 style="color: #1a1a1a;">${status === "approved" ? "Reservation Confirmed!" : "Reservation Status Update"}</h2>
        
        <p>Dear ${reservation.customerName},</p>
        
        <p>Your reservation at ${RESTAURANT_INFO.name} has been ${status}.</p>
        
        <div style="background-color: #f8f8f8; padding: 15px; border-radius: 8px; margin: 20px 0;">
          <h3 style="margin-top: 0;">Reservation Details:</h3>
          <ul style="list-style: none; padding: 0;">
            <li>Date & Time: ${reservation.time}</li>
            <li>Number of Guests: ${reservation.participants}</li>
            <li>Total Amount: €${reservation.totalAmount}</li>
          </ul>
          
          ${reservation.dishes.length > 0 ? `
            <h4>Pre-ordered Dishes:</h4>
            <ul>
              ${dishesHtml}
            </ul>
          ` : ''}
        </div>
        
        <div style="background-color: #f8f8f8; padding: 15px; border-radius: 8px; margin: 20px 0;">
          <h3 style="margin-top: 0;">Restaurant Location & Contact:</h3>
          <p>${RESTAURANT_INFO.address}</p>
          <p>Phone: ${RESTAURANT_INFO.phone}</p>
          <p>Email: ${RESTAURANT_INFO.email}</p>
          <a href="${RESTAURANT_INFO.googleMapsUrl}" style="display: inline-block; background-color: #4285f4; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; margin-top: 10px;">View on Google Maps</a>
        </div>
        
        ${status === "approved" ? `
          <p>We look forward to serving you!</p>
        ` : `
          <p>We apologize for any inconvenience. Please feel free to contact us for any questions or to make a new reservation.</p>
        `}
        
        <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #eee;">
          <p style="color: #666;">Best regards,<br>The ${RESTAURANT_INFO.name} Team</p>
        </div>
      </div>
    `;

    // In a real application, you would use an email service here
    // For demonstration, we'll simulate sending an email
    console.log('Sending email to:', reservation.email);
    console.log('Email content:', emailContent);

    // Show toast notification
    toast({
      title: `Email Sent`,
      description: `Notification email sent to ${reservation.email}`,
    });
  };

  const handleStatusChange = async (id: string, status: "approved" | "rejected") => {
    onStatusChange(id, status);
    
    const reservation = reservations.find(r => r.id === id);
    if (reservation) {
      await sendEmailNotification(reservation, status);
    }
  };

  return (
    <div className="space-y-3 md:space-y-4">
      {reservations.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          No reservations found in this category
        </div>
      ) : (
        reservations.map((reservation) => (
          <div
            key={reservation.id}
            className="bg-white rounded-lg shadow-sm p-3 md:p-4 hover:shadow-md transition-shadow"
          >
            <div className="flex flex-col gap-3">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-2 md:gap-4">
                <div className="flex flex-wrap items-center gap-2">
                  <h3 className="text-base md:text-lg font-semibold">{reservation.customerName}</h3>
                  {reservation.isPriority && (
                    <Badge variant="secondary" className="bg-red-100 text-red-800">
                      Priority
                    </Badge>
                  )}
                  <Badge
                    variant={
                      reservation.status === "pending"
                        ? "outline"
                        : reservation.status === "approved"
                        ? "default"
                        : "destructive"
                    }
                  >
                    {reservation.status.charAt(0).toUpperCase() + reservation.status.slice(1)}
                  </Badge>
                </div>
                
                {showActions && (
                  <div className="flex flex-wrap gap-2">
                    <Button
                      onClick={() => handleStatusChange(reservation.id, "approved")}
                      className="bg-green-600 hover:bg-green-700 flex-1 md:flex-none h-8 md:h-9 px-2 md:px-4"
                      size="sm"
                    >
                      <CheckCircle className="w-4 h-4 md:mr-2" />
                      {!isMobile && "Approve"}
                    </Button>
                    <Button
                      onClick={() => handleStatusChange(reservation.id, "rejected")}
                      variant="destructive"
                      className="flex-1 md:flex-none h-8 md:h-9 px-2 md:px-4"
                      size="sm"
                    >
                      <XCircle className="w-4 h-4 md:mr-2" />
                      {!isMobile && "Reject"}
                    </Button>
                    <Button
                      onClick={() => onRemove(reservation.id)}
                      variant="outline"
                      className="text-red-600 hover:text-red-700 flex-1 md:flex-none h-8 md:h-9 px-2 md:px-4"
                      size="sm"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4 text-sm">
                <div className="space-y-2">
                  <div className="flex items-center text-gray-600">
                    <Clock className="w-4 h-4 mr-2" />
                    <span>Time: {reservation.time}</span>
                  </div>
                  <div className="flex items-center text-gray-600">
                    <Users className="w-4 h-4 mr-2" />
                    <span>Participants: {reservation.participants}</span>
                  </div>
                  <div className="flex items-center text-gray-600">
                    <DollarSign className="w-4 h-4 mr-2" />
                    <span>Total Amount: €{reservation.totalAmount}</span>
                  </div>
                </div>

                <div className="space-y-3">
                  <div>
                    <h4 className="font-medium mb-1">Contact Information</h4>
                    <div className="space-y-1 text-gray-600">
                      <p>Phone: {reservation.phone}</p>
                      <p>Email: {reservation.email}</p>
                    </div>
                  </div>
                  
                  {reservation.dishes.length > 0 && (
                    <div>
                      <h4 className="font-medium mb-1">Pre-ordered Dishes</h4>
                      <div className="space-y-1">
                        {reservation.dishes.map((dish, index) => (
                          <p key={index} className="text-gray-600">
                            {dish.name} x{dish.quantity} - €{dish.quantity * dish.price}
                          </p>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        ))
      )}
    </div>
  );
};
