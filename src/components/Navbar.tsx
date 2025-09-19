import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Heart, Menu, Search, User } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Link } from "react-router-dom";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <TooltipProvider>
      <nav className="bg-background/95 backdrop-blur-sm border-b border-border sticky top-0 z-50">
        <div className="mx-auto px-2 sm:px-4 lg:px-6">
          <div className="flex justify-between items-center h-16">
            {/* Logo and Navigation */}
            <div className="flex items-center space-x-8">
              <div className="flex items-center space-x-2">
                <Heart className="h-8 w-8 text-primary fill-current" />
                <span className="text-2xl font-handwritten font-bold text-primary">
                  Petner
                </span>
              </div>
              
              {/* Desktop Navigation */}
              <div className="hidden md:flex items-center space-x-8">
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Link to="/" className="text-foreground hover:text-primary transition-smooth">
                      Home
                    </Link>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>home</p>
                  </TooltipContent>
                </Tooltip>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Link to="/register" className="text-foreground hover:text-primary transition-smooth">
                      Register
                    </Link>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>유기견 등록하기</p>
                  </TooltipContent>
                </Tooltip>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Link to="/community" className="text-foreground hover:text-primary transition-smooth">
                      Community
                    </Link>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>게시판</p>
                  </TooltipContent>
                </Tooltip>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <a href="#" className="text-foreground hover:text-primary transition-smooth">
                      About
                    </a>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>소개</p>
                  </TooltipContent>
                </Tooltip>
              </div>
            </div>

          {/* Search and Actions */}
          <div className="hidden md:flex items-center space-x-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search pets..."
                className="pl-10 w-64 bg-background border-border"
              />
            </div>
            <Button variant="outline" asChild>
              <Link to="/profile">
                <User className="h-5 w-5 mr-2" />
                내 정보
              </Link>
            </Button>
            <Button className="bg-primary hover:bg-primary/90 text-primary-foreground" asChild>
              <Link to="/login">
                로그인
              </Link>
            </Button>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              <Menu className="h-6 w-6" />
            </Button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden py-4 border-t border-border">
            <div className="flex flex-col space-y-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search pets..."
                  className="pl-10 bg-background border-border"
                />
              </div>
              <Link to="/" className="text-foreground hover:text-primary transition-smooth py-2">
                Home
              </Link>
              <Link to="/register" className="text-foreground hover:text-primary transition-smooth py-2">
                Register
              </Link>
              <Link to="/community" className="text-foreground hover:text-primary transition-smooth py-2">
                Community
              </Link>
              <a href="#" className="text-foreground hover:text-primary transition-smooth py-2">
                About
              </a>
              <Button variant="outline" className="w-full" asChild>
                <Link to="/profile">
                  <User className="h-5 w-5 mr-2" />
                  내 정보
                </Link>
              </Button>
              <Button className="bg-primary hover:bg-primary/90 text-primary-foreground w-full" asChild>
                <Link to="/login">
                  로그인
                </Link>
              </Button>
            </div>
          </div>
        )}
        </div>
      </nav>
    </TooltipProvider>
  );
};

export default Navbar;