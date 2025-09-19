import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Heart, Menu, Search, User } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Link } from "react-router-dom";

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <nav className="bg-background/95 backdrop-blur-sm border-b border-border sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center space-x-2">
            <Heart className="h-8 w-8 text-primary fill-current" />
            <span className="text-2xl font-handwritten font-bold text-primary">
              Petner
            </span>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <a href="#" className="text-foreground hover:text-primary transition-smooth">
              Adopt
            </a>
            <a href="#" className="text-foreground hover:text-primary transition-smooth">
              About
            </a>
            <a href="#" className="text-foreground hover:text-primary transition-smooth">
              Register
            </a>
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
            <Button className="bg-primary hover:bg-primary/90 text-primary-foreground" asChild>
              <Link to="/login">
                <User className="h-5 w-5 mr-2" />
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
              <a href="#" className="text-foreground hover:text-primary transition-smooth py-2">
                Adopt
              </a>
              <a href="#" className="text-foreground hover:text-primary transition-smooth py-2">
                About
              </a>
              <a href="#" className="text-foreground hover:text-primary transition-smooth py-2">
                Register
              </a>
              <Button className="bg-primary hover:bg-primary/90 text-primary-foreground w-full" asChild>
                <Link to="/login">
                  <User className="h-5 w-5 mr-2" />
                  로그인
                </Link>
              </Button>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;