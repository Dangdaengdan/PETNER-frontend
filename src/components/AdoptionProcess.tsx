import { Card, CardContent } from "@/components/ui/card";
import { Search, Heart, Home, Sparkles } from "lucide-react";

const steps = [
  {
    icon: Search,
    title: "Browse & Search",
    description: "Explore our database of available pets and find the perfect match for your lifestyle.",
    color: "text-primary",
  },
  {
    icon: Heart,
    title: "Meet & Connect",
    description: "Schedule a meet-and-greet to get to know your potential new family member.",
    color: "text-accent",
  },
  {
    icon: Home,
    title: "Apply to Adopt",
    description: "Complete our simple adoption application and home check process.",
    color: "text-primary",
  },
  {
    icon: Sparkles,
    title: "Welcome Home",
    description: "Take your new companion home and begin your beautiful journey together.",
    color: "text-accent",
  },
];

const AdoptionProcess = () => {
  return (
    <section className="py-16 bg-background">
      <div className="mx-auto px-2 sm:px-4 lg:px-6">
        <div className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">
            Simple
            <span className="text-primary font-handwritten"> Adoption Process</span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            We've made adopting a pet as easy as possible. Follow these four simple steps 
            to bring home your new best friend.
          </p>
        </div>

        <div className="relative">
          <div className="hidden lg:block absolute top-20 left-0 right-0 h-0.5 bg-border z-0"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 relative z-10">
            {steps.map((step, index) => {
              const IconComponent = step.icon;
              return (
                <Card key={index} className="text-center border-border hover:shadow-warm transition-smooth group bg-background">
                  <CardContent className="p-6">
                    <div className="relative mb-6">
                      <div className="w-16 h-16 mx-auto bg-secondary rounded-full flex items-center justify-center group-hover:scale-110 transition-smooth border-4 border-background">
                        <IconComponent className={`h-8 w-8 ${step.color}`} />
                      </div>
                    </div>
                  
                  <h3 className="text-xl font-semibold text-foreground mb-3 group-hover:text-primary transition-smooth">
                    {step.title}
                  </h3>
                  
                  <p className="text-muted-foreground">
                    {step.description}
                  </p>
                </CardContent>
              </Card>
            );
          })}
          </div>
        </div>
      </div>
    </section>
  );
};

export default AdoptionProcess;