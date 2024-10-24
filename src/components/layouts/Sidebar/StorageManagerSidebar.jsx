import Sidebar, { SidebarItem } from "./Sidebar.jsx";
import HomeOutlinedIcon from '@mui/icons-material/HomeOutlined';
import AssignmentOutlinedIcon from '@mui/icons-material/AssignmentOutlined';
import PeopleAltOutlinedIcon from '@mui/icons-material/PeopleAltOutlined';

export default function StorageManagerSideBar() {
    return (
        <Sidebar>
            <SidebarItem icon={<HomeOutlinedIcon/>} text={"Home"} href={"/home-storage-manager"}/>
            <SidebarItem icon={<AssignmentOutlinedIcon />} text={"Order"} href={"/order-list-storage"}/>
            <SidebarItem icon={<PeopleAltOutlinedIcon /> } text={"Shipper"} href={"/shipper-management "}/>
        </Sidebar>
    );
}
