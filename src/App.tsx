import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import PetDetail from "./pages/PetDetail";
import Community from "./pages/Community";
import PostDetail from "./pages/PostDetail";
import MyProfile from "./pages/MyProfile";
import RegisterPet from "./pages/RegisterPet";
import About from "./pages/About";
import NotFound from "./pages/NotFound";
import Pets from "./pages/Pets";
import ChatButton from "./components/ChatButton";
import PostCreate from "./pages/PostCreate";
import KakaoCallback from "./pages/KakaoCallback";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/pet/:id" element={<PetDetail />} />
          <Route path="/community" element={<Community />} />
          <Route path="/community/new" element={<PostCreate />} />
          <Route path="/post/:id" element={<PostDetail />} />
          <Route path="/profile" element={<MyProfile />} />
          <Route path="/register" element={<RegisterPet />} />
          <Route path="/about" element={<About />} />
          <Route path="/pets" element={<Pets />} />
          <Route path="/auth/kakao/callback" element={<KakaoCallback />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
        <ChatButton />
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
