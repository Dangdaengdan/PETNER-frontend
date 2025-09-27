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
import PostEdit from "./pages/PostEdit";
import KakaoCallback from "./pages/KakaoCallback";
import AuthGuard from "./components/AuthGuard";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter
        future={{
          v7_startTransition: true,
          v7_relativeSplatPath: true,
        }}
      >
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/auth/kakao/callback" element={<KakaoCallback />} />
          <Route path="/about" element={<About />} />
          <Route path="/pet/:id" element={<AuthGuard><PetDetail /></AuthGuard>} />
          <Route path="/community" element={<AuthGuard><Community /></AuthGuard>} />
          <Route path="/community/new" element={<AuthGuard><PostCreate /></AuthGuard>} />
          <Route path="/community/edit/:id" element={<AuthGuard><PostEdit /></AuthGuard>} />
          <Route path="/post/:id" element={<AuthGuard><PostDetail /></AuthGuard>} />
          <Route path="/profile" element={<AuthGuard><MyProfile /></AuthGuard>} />
          <Route path="/register" element={<AuthGuard><RegisterPet /></AuthGuard>} />
          <Route path="/pets" element={<AuthGuard><Pets /></AuthGuard>} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
        <ChatButton />
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
