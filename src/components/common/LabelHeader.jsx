import { useLocation } from "react-router-dom";
import { MENU_GROUPS } from "@/constants/navigation";

const LabelHeader = () => {
 const location = useLocation();
 const allItems = MENU_GROUPS.flatMap((group) => group.items);
 const currentPage = allItems.find((item) => item.path === location.pathname);
 const labelHeader = currentPage ? currentPage.label : "Tổng quan";

 return <h2 className="font-bold">{labelHeader}</h2>;
};

export default LabelHeader;
