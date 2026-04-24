import { Outlet } from "react-router-dom";
import { TooltipProvider } from "./components/ui/tooltip";
import { ToastContainer } from "react-toastify";

function App() {
  return (
    <TooltipProvider>
      <ToastContainer />
      <Outlet />
    </TooltipProvider>
  );
}

export default App;
