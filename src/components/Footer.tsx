import { Heart, Mail, Phone, MapPin, Facebook, Twitter, Instagram } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const Footer = () => {
  return (
    <footer className="bg-foreground text-background">
      <div className="mx-auto px-2 sm:px-4 lg:px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-4">
          {/* Brand */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <Heart className="h-8 w-8 text-primary fill-current" />
              <span className="text-2xl font-handwritten font-bold text-primary">
                Petner
              </span>
            </div>
            <p className="text-background/80">
              Connecting loving hearts with pets in need. 
              Every adoption creates a beautiful story of hope and love.
            </p>
            <div className="flex space-x-4">
              <Button variant="ghost" size="icon" className="text-background/80 hover:text-primary hover:bg-background/10">
                <Facebook className="h-5 w-5" />
              </Button>
              <Button variant="ghost" size="icon" className="text-background/80 hover:text-primary hover:bg-background/10">
                <Twitter className="h-5 w-5" />
              </Button>
              <Button variant="ghost" size="icon" className="text-background/80 hover:text-primary hover:bg-background/10">
                <Instagram className="h-5 w-5" />
              </Button>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-4 text-right">
            <h3 className="text-lg font-semibold text-background">Quick Links</h3>
            <ul className="space-y-2">
              <li><a href="#" className="text-background/80 hover:text-primary transition-smooth">Adopt a Pet</a></li>
              <li><a href="#" className="text-background/80 hover:text-primary transition-smooth">Volunteer</a></li>
              <li><a href="#" className="text-background/80 hover:text-primary transition-smooth">Donate</a></li>
              <li><a href="#" className="text-background/80 hover:text-primary transition-smooth">Success Stories</a></li>
              <li><a href="#" className="text-background/80 hover:text-primary transition-smooth">Pet Care Tips</a></li>
            </ul>
          </div>

          {/* Contact Info */}
          <div className="space-y-4 text-right">
            <h3 className="text-lg font-semibold text-background">Contact</h3>
            <div className="space-y-3">
              <div className="flex items-center justify-end space-x-3">
                <span className="text-background/80">(555) 123-PETS</span>
                <Phone className="h-4 w-4 text-primary" />
              </div>
              <div className="flex items-center justify-end space-x-3">
                <span className="text-background/80">hello@petner.com</span>
                <Mail className="h-4 w-4 text-primary" />
              </div>
              <div className="flex items-center justify-end space-x-3">
                <span className="text-background/80 text-right">123 Adoption Lane<br />Pet City, PC 12345</span>
                <MapPin className="h-4 w-4 text-primary" />
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-background/20 mt-8 pt-8 text-center">
          <p className="text-background/60">
            © 2024 Petner. All rights reserved. Made with ❤️ for pets in need.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;