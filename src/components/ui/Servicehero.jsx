"use client";

import { MapPinCheckInside, MoveRight, PhoneCall } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Image from "next/image";


export default function ServiceHero() {
  return (
    <section className="w-full py-20 lg:py-20">
      <div className="container mx-auto px-6 md:px-12">
        <div className="grid grid-cols-1 gap-8 items-center md:grid-cols-2">
          {/* Left Content */}
          <div className="flex flex-col gap-6">
            <Badge variant="outline"><MapPinCheckInside /> Chhindwara,Betul, Seoni, Balaghat, Jabalpur, Bhopal, Indore, Nagpur, Pandhurna  </Badge>

            <div className="flex flex-col gap-4">
              <h1 className="text-5xl md:text-7xl max-w-lg tracking-tight font-normal">
                Our Valuation & Advisory Services
              </h1>

              <p className="text-xl leading-relaxed text-muted-foreground max-w-md">
                Delivering accurate and independent valuation services requires expertise and compliance. We simplify complex valuation requirements through structured processes, ensuring clarity, reliability, and timely reporting.
              </p>
            </div>

            <div className="flex gap-4 flex-wrap">
              {/* <Button size="lg" variant="outline" className="gap-3">
                Jump on a call <PhoneCall className="w-4 h-4" />
              </Button> */}

              <Button size="lg" className="gap-3">
                Contact Us <MoveRight className="w-4 h-4" />
              </Button>
            </div>
          </div>

          {/* Right Visual Grid */}
          <div className="hidden md:grid grid-cols-2 gap-6">
            <div className="relative aspect-square rounded-lg overflow-hidden">
              <Image
                src="/images/consulting.jpg"
                alt="Service image 1"
                fill
                className="object-cover"
              />
            </div>

            <div className="relative row-span-2 rounded-lg overflow-hidden">
              <Image
                src="/images/valuelady.jpg"
                alt="Service image 2"
                fill
                className="object-cover"
              />
            </div>

            <div className="relative aspect-square rounded-lg overflow-hidden">
              <Image
                src="/images/law.jpg"
                alt="Service image 3"
                fill
                className="object-cover"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
