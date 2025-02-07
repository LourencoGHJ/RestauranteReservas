
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Users, Clock, DollarSign, CheckCircle } from "lucide-react";

interface DashboardStatsProps {
  totalReservations: number;
  priorityReservations: number;
  pendingApprovals: number;
  totalRevenue: number;
}

export const DashboardStats = ({
  totalReservations,
  priorityReservations,
  pendingApprovals,
  totalRevenue,
}: DashboardStatsProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
      <Card className="bg-white border-none shadow-sm">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-primary">Total Reservations</CardTitle>
          <Users className="h-4 w-4 text-primary" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-primary/90">{totalReservations}</div>
        </CardContent>
      </Card>
      <Card className="bg-white border-none shadow-sm">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-primary">Priority Reservations</CardTitle>
          <Clock className="h-4 w-4 text-primary" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-primary/90">{priorityReservations}</div>
        </CardContent>
      </Card>
      <Card className="bg-white border-none shadow-sm">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-primary">Pending Approvals</CardTitle>
          <CheckCircle className="h-4 w-4 text-primary" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-primary/90">{pendingApprovals}</div>
        </CardContent>
      </Card>
      <Card className="bg-white border-none shadow-sm">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-primary">Total Revenue</CardTitle>
          <DollarSign className="h-4 w-4 text-primary" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-primary/90">€{totalRevenue}</div>
        </CardContent>
      </Card>
    </div>
  );
};
