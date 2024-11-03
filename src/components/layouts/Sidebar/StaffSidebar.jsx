import Sidebar, { SidebarItem } from "./Sidebar.jsx";
import HomeOutlinedIcon from '@mui/icons-material/HomeOutlined';
import AssignmentOutlinedIcon from '@mui/icons-material/AssignmentOutlined';

export default function StaffSidebar() {
    return (
        <Sidebar>
            <SidebarItem icon={<HomeOutlinedIcon/>} text={"Home"} href={"/home-staff"}/>
            <SidebarItem icon={<AssignmentOutlinedIcon />} text={"Order"} href={"/refund-order-list"}/>
        </Sidebar>
    );
}
