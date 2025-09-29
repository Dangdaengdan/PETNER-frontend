import { Card, CardContent } from "@/components/ui/card";
import { Search, Heart, Home, Sparkles } from "lucide-react";

const steps = [
  {
    icon: Search,
    title: "Browse & Search",
    description: "입양 대기 중인 반려동물 목록을 살펴보고, 당신의 생활방식에 딱 맞는 친구를 찾아보세요.",
  },
  {
    icon: Heart,
    title: "Meet & Connect",
    description: "만남 예약을 통해 새로운 가족 후보를 직접 만나보세요.",
  },
  {
    icon: Home,
    title: "Apply to Adopt",
    description: "간단한 입양 신청서와 가정 환경 확인 절차를 완료하세요.",
  },
  {
    icon: Sparkles,
    title: "Welcome Home",
    description: "새 친구와 함께 집으로 돌아가, 이제 두 분의 아름다운 여정을 시작하세요.",
  },
];

const AdoptionProcess = () => {
  return (
    <section className="py-16 bg-background">
      <div className="mx-auto px-8 sm:px-16 md:px-24 lg:px-48">
        <div className="text-center mb-12">
          <h2 className="section-heading">
            단순화된
            <span className="text-primary"> 입양 절차</span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            펫너에서 네 가지 간단한 단계를 거쳐 새로운 반려 친구를 만날 수 있습니다.
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
                        <IconComponent className="h-8 w-8 text-primary group-hover:text-orange-700" />
                      </div>
                    </div>
                  
                  <h3 className="text-xl font-semibold text-foreground mb-3 group-hover:text-orange-700 transition-smooth">
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