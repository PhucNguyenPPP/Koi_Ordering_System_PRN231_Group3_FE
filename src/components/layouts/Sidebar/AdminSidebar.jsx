import Sidebar, { SidebarItem } from "./Sidebar.jsx";
import HomeOutlinedIcon from "@mui/icons-material/HomeOutlined";
import AirplaneTicketOutlinedIcon from "@mui/icons-material/AirplaneTicketOutlined";

export default function AdminSideBar() {
  return (
    <Sidebar>
      <SidebarItem
        icon={<HomeOutlinedIcon />}
        text={"Home"}
        href={"/home-admin"}
      />
      <SidebarItem
        icon={<AirplaneTicketOutlinedIcon />}
        text={"Flight"}
        href={"/flight-management"}
      />
    </Sidebar>
  );
}
