import Sidebar, { SidebarItem } from "./Sidebar.jsx";
import HomeOutlinedIcon from '@mui/icons-material/HomeOutlined';
import AssignmentOutlinedIcon from '@mui/icons-material/AssignmentOutlined';
import SetMealIcon from '@mui/icons-material/SetMeal';

export default function KoiFarmManagerSideBar() {
    return (
        <Sidebar>
            <SidebarItem icon={<HomeOutlinedIcon/>} text={"Home"} href={"/home-koi-farm-manager"}/>
            <SidebarItem icon={<SetMealIcon /> } text={"Koi"} href={"/koi-management"}/>
            <SidebarItem icon={<AssignmentOutlinedIcon /> } text={"Order"} href={"/order-list-farm"}/>
        </Sidebar>
    );
}
