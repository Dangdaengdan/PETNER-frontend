import { Heart, Mail, Phone, MapPin, Facebook, Twitter, Instagram } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const Footer = () => {
  return (
    <footer className="bg-foreground text-background">
      <div className="py-4">
        {/* Single row: 3 chunks */}
        <div className="grid grid-cols-1 md:grid-cols-3 items-end gap-6 px-4 sm:px-6">
          {/* 1) Brand + connecting text + socials */}
          <div className="flex-1 min-w-[220px] space-y-2 order-1">
            
            <p className="text-background/80 text-sm leading-relaxed">
              Connecting loving hearts with pets in need. Every adoption creates a beautiful story of hope and love.
            </p>
            <div className="flex space-x-3">
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
          {/* 2) Copyright centered */}
          <div className="text-center self-end order-3 md:order-2">
            <p className="text-background/60 text-sm whitespace-nowrap">© Dangdangdan. All rights reserved.</p>
          </div>

          {/* 3) Contact */}
          <div className="min-w-[220px] md:text-right space-y-1 self-end order-2 md:order-3">
            <h3 className="text-lg font-semibold text-background">Contact</h3>
            <div className="flex items-center md:justify-end justify-start gap-3">
              <span className="text-background/80">(555) 123-PETS</span>
              <Phone className="h-4 w-4 text-primary" />
            </div>
            <div className="flex items-center md:justify-end justify-start gap-3">
              <span className="text-background/80">hello@petner.com</span>
              <Mail className="h-4 w-4 text-primary" />
            </div>
            <div className="flex items-center md:justify-end justify-start gap-3">
              <span className="text-background/80 text-right">123 Adoption Lane, Pet City, PC 12345</span>
              <MapPin className="h-4 w-4 text-primary" />
            </div>
          </div>
        </div>

        {/* Bottom spacing minimal */}
        <div className="pt-2" />
      </div>
    </footer>
  );
};

export default Footer;