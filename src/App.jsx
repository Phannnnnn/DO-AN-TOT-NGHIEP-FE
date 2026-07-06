import { Outlet } from "react-router-dom";
import { TooltipProvider } from "./components/ui/tooltip";

function App() {
 return (
 <TooltipProvider>
 <Outlet />
 </TooltipProvider>
 );
}

export default App;
