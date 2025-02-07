import { useState, useEffect } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { DashboardStats } from "@/components/admin/DashboardStats";
import { ReservationList } from "@/components/admin/ReservationList";
import { StockManagement } from "@/components/admin/StockManagement";
import { LogOut, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { useIsMobile } from "@/hooks/use-mobile";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { format, parse } from "date-fns";

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

const Admin = () => {
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [selectedMonth, setSelectedMonth] = useState<string>(format(new Date(), 'yyyy-MM'));
  const navigate = useNavigate();
  const isMobile = useIsMobile();

  useEffect(() => {
    const storedReservations = localStorage.getItem('reservations');
    if (storedReservations) {
      setReservations(JSON.parse(storedReservations));
    }
  }, []);

  // Filter reservations by selected month
  const filterReservationsByMonth = (reservations: Reservation[]) => {
    const [year, month] = selectedMonth.split('-');
    
    return reservations.filter(reservation => {
      try {
        if (!reservation.time || !/^\d{2}:\d{2}$/.test(reservation.time)) {
          console.warn(`Invalid time format for reservation: ${reservation.id}`);
          return false;
        }

        // Create a date string in a format that date-fns can parse reliably
        const dateString = `${year}-${month.padStart(2, '0')}-01 ${reservation.time}`;
        const date = parse(dateString, 'yyyy-MM-dd HH:mm', new Date());

        if (isNaN(date.getTime())) {
          console.warn(`Invalid date for reservation: ${reservation.id}`);
          return false;
        }

        // Compare year and month only
        return format(date, 'yyyy-MM') === selectedMonth;
      } catch (error) {
        console.warn(`Error processing reservation date: ${error}`);
        return false;
      }
    });
  };

  const handleStatusChange = (id: string, status: "approved" | "rejected") => {
    const updatedReservations = reservations.map(reservation =>
      reservation.id === id ? { ...reservation, status } : reservation
    );
    setReservations(updatedReservations);
    localStorage.setItem('reservations', JSON.stringify(updatedReservations));
  };

  const handleRemoveReservation = (id: string) => {
    if (window.confirm('Are you sure you want to remove this reservation?')) {
      const updatedReservations = reservations.filter(reservation => reservation.id !== id);
      setReservations(updatedReservations);
      localStorage.setItem('reservations', JSON.stringify(updatedReservations));
    }
  };

  const pendingReservations = filterReservationsByMonth(
    reservations.filter((r) => r.status === "pending")
  );
  const approvedReservations = filterReservationsByMonth(
    reservations.filter((r) => r.status === "approved")
  );
  const rejectedReservations = filterReservationsByMonth(
    reservations.filter((r) => r.status === "rejected")
  );

  const stats = {
    totalReservations: reservations.length,
    priorityReservations: reservations.filter((r) => r.isPriority).length,
    pendingApprovals: pendingReservations.length,
    totalRevenue: approvedReservations.reduce((acc, curr) => acc + curr.totalAmount, 0),
  };

  // Generate month options for the last 12 months
  const monthOptions = Array.from({ length: 12 }, (_, i) => {
    const date = new Date();
    date.setMonth(date.getMonth() - i);
    return {
      value: format(date, 'yyyy-MM'),
      label: format(date, 'MMMM yyyy')
    };
  });

  return (
    <div className="min-h-screen bg-accent/30">
      <div className="p-2 md:p-8">
        <div className="max-w-7xl mx-auto space-y-4 md:space-y-6">
          <div className="flex flex-col md:flex-row justify-between items-center bg-white p-4 rounded-lg shadow-sm gap-4">
            <h1 className="text-xl md:text-4xl font-playfair text-primary text-center md:text-left">
              Casa Lisboa Dashboard
            </h1>
            <Button 
              variant="outline" 
              onClick={() => navigate('/')}
              className="flex items-center gap-2 w-full md:w-auto"
            >
              <LogOut className="w-4 h-4" />
              {!isMobile && "Exit Dashboard"}
            </Button>
          </div>

          <DashboardStats {...stats} />

          <div className="bg-white rounded-lg shadow-sm p-3 md:p-6">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-4 md:mb-6 gap-4">
              <div className="flex items-center gap-2 w-full md:w-auto">
                <Calendar className="w-5 h-5 text-primary" />
                <span className="text-sm font-medium text-primary whitespace-nowrap">Filter by Month:</span>
                <Select
                  value={selectedMonth}
                  onValueChange={setSelectedMonth}
                >
                  <SelectTrigger className="w-full md:w-[200px]">
                    <SelectValue placeholder="Select month" />
                  </SelectTrigger>
                  <SelectContent>
                    {monthOptions.map(({ value, label }) => (
                      <SelectItem key={value} value={value}>{label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <Tabs defaultValue="pending" className="space-y-4 md:space-y-6">
              <TabsList className="grid grid-cols-2 md:flex gap-2 p-2 bg-accent/20 rounded-lg w-full">
                {[
                  { value: "pending", label: "Pending", count: pendingReservations.length },
                  { value: "approved", label: "Approved", count: approvedReservations.length },
                  { value: "rejected", label: "Rejected", count: rejectedReservations.length },
                  { value: "stock", label: "Stock", count: null }
                ].map((tab) => (
                  <TabsTrigger
                    key={tab.value}
                    value={tab.value}
                    className="flex-1 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
                  >
                    <div className="flex flex-col md:flex-row items-center gap-1 md:gap-2 py-1">
                      <span className="text-sm md:text-base">{tab.label}</span>
                      {tab.count !== null && (
                        <span className="text-xs md:text-sm bg-primary/10 px-2 py-0.5 rounded-full">
                          {tab.count}
                        </span>
                      )}
                    </div>
                  </TabsTrigger>
                ))}
              </TabsList>

              <div className="mt-4 md:mt-6">
                <TabsContent value="pending">
                  <div className="bg-accent/10 p-3 md:p-6 rounded-lg">
                    <ReservationList
                      reservations={pendingReservations}
                      onStatusChange={handleStatusChange}
                      onRemove={handleRemoveReservation}
                      showActions={true}
                    />
                  </div>
                </TabsContent>

                <TabsContent value="approved">
                  <div className="bg-accent/10 p-3 md:p-6 rounded-lg">
                    <ReservationList
                      reservations={approvedReservations}
                      onStatusChange={handleStatusChange}
                      onRemove={handleRemoveReservation}
                      showActions={false}
                    />
                  </div>
                </TabsContent>

                <TabsContent value="rejected">
                  <div className="bg-accent/10 p-3 md:p-6 rounded-lg">
                    <ReservationList
                      reservations={rejectedReservations}
                      onStatusChange={handleStatusChange}
                      onRemove={handleRemoveReservation}
                      showActions={false}
                    />
                  </div>
                </TabsContent>

                <TabsContent value="stock">
                  <div className="bg-accent/10 p-3 md:p-6 rounded-lg">
                    <StockManagement
                      products={[]}
                      onUpdateStock={() => {}}
                    />
                  </div>
                </TabsContent>
              </div>
            </Tabs>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Admin;
