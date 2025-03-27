
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AppProvider } from "./context/AppContext";

// Pages
import Dashboard from "./pages/Dashboard";
import Groups from "./pages/Groups";
import AddGroup from "./pages/AddGroup";
import EditGroup from "./pages/EditGroup";
import Pilgrims from "./pages/Pilgrims";
import AddPilgrim from "./pages/AddPilgrim";
import EditPilgrim from "./pages/EditPilgrim";
import GroupPilgrims from "./pages/GroupPilgrims";
import PilgrimsWithoutVisa from "./pages/PilgrimsWithoutVisa";
import GroupPilgrimsWithoutVisa from "./pages/GroupPilgrimsWithoutVisa";
import TravelInformation from "./pages/TravelInformation";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <AppProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/groups" element={<Groups />} />
            <Route path="/groups/new" element={<AddGroup />} />
            <Route path="/groups/:id" element={<EditGroup />} />
            <Route path="/group-pilgrims/:id" element={<GroupPilgrims />} />
            <Route path="/pilgrims" element={<Pilgrims />} />
            <Route path="/pilgrims/new" element={<AddPilgrim />} />
            <Route path="/pilgrims/:id" element={<EditPilgrim />} />
            <Route path="/pilgrims-without-visa" element={<PilgrimsWithoutVisa />} />
            <Route path="/pilgrims-without-visa/:id" element={<GroupPilgrimsWithoutVisa />} />
            <Route path="/travel-information" element={<TravelInformation />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </AppProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
