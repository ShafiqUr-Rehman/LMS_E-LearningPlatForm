import { useState } from "react";
import DashboardWidgets from "../../components/Admin/Widgets/DashboardWidgets";
import DashboardHeader from "./DashboardHeader";

type Props = {
  isDashboard?: boolean;
};

const AdminDashboardHero = ({ isDashboard }: Props) => {
  const [open, setOpen] = useState(false);

  return (
    <div className="admin-dashboard-hero">
      {/* Sticky Header */}
      <div className="sticky top-0 z-50 bg-white shadow-md">
        <DashboardHeader open={open} setOpen={setOpen} />
      </div>

      {/* Dashboard Widgets */}
      {isDashboard && (
        <div className="dashboard-widgets-container">
          <DashboardWidgets open={open} />
        </div>
      )}
    </div>
  );
};

export default AdminDashboardHero;
