import Sidebar, { SidebarItem } from "./Sidebar.jsx";
import HomeOutlinedIcon from '@mui/icons-material/HomeOutlined';
import AssignmentOutlinedIcon from '@mui/icons-material/AssignmentOutlined';

export default function StorageManagerSideBar() {
    return (
        <Sidebar>
            <SidebarItem icon={<HomeOutlinedIcon/>} text={"Home"} href={"/home-storage-manager"}/>
            <SidebarItem icon={<AssignmentOutlinedIcon />} text={"Order"} href={"/order-list-storage"}/>
        </Sidebar>
    );
}
