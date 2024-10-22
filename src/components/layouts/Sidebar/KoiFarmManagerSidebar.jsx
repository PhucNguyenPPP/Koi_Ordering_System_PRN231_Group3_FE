import Sidebar, { SidebarItem } from "./Sidebar.jsx";
import HomeOutlinedIcon from '@mui/icons-material/HomeOutlined';
import PersonOutlineOutlinedIcon from '@mui/icons-material/PersonOutlineOutlined';
import SetMealIcon from '@mui/icons-material/SetMeal';

export default function KoiFarmManagerSideBar() {
    return (
        <Sidebar>
            <SidebarItem icon={<HomeOutlinedIcon/>} text={"Home"} href={"/home-koi-farm-manager"}/>
            <SidebarItem icon={<SetMealIcon /> } text={"Koi Management"} href={"/koi-management"}/>
            <SidebarItem icon={<SetMealIcon /> } text={"Order Management"} href={"/order-list-farm"}/>
        </Sidebar>
    );
}
