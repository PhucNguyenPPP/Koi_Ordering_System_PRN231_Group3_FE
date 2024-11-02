import Sidebar, { SidebarItem } from "./Sidebar.jsx";
import HomeOutlinedIcon from '@mui/icons-material/HomeOutlined';
import AssignmentOutlinedIcon from '@mui/icons-material/AssignmentOutlined';
import SetMealIcon from '@mui/icons-material/SetMeal';
import PolicyOutlinedIcon from '@mui/icons-material/PolicyOutlined';

export default function KoiFarmManagerSideBar() {
    return (
        <Sidebar>
            <SidebarItem icon={<HomeOutlinedIcon/>} text={"Home"} href={"/home-koi-farm-manager"}/>
            <SidebarItem icon={<SetMealIcon /> } text={"Koi"} href={"/koi-management"}/>
            <SidebarItem icon={<AssignmentOutlinedIcon /> } text={"Order"} href={"/order-list-farm"}/>
            <SidebarItem icon={<PolicyOutlinedIcon /> } text={"Policy"} href={"/policy-management"}/>
        </Sidebar>
    );
}
