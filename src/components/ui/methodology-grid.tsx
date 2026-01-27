"use client";

import { FrostedCard } from "@/components/ui/frosted-card";
import {
  ForkKnife,
  Briefcase,
  HeartHalf,
  CurrencyDollar,
  Mountains,
  PersonSimpleWalk,
} from "@phosphor-icons/react";
import type { ReactNode } from "react";

interface MethodologyItem {
  title: string;
  description: string;
}

interface MethodologyGridProps {
  data: MethodologyItem[];
}

const iconMap: Record<string, ReactNode> = {
  "Dining & Nightlife": <ForkKnife size={24} weight="duotone" />,
  "Career Opportunities": <Briefcase size={24} weight="duotone" />,
  "Dating Scene": <HeartHalf size={24} weight="duotone" />,
  "Cost of Living": <CurrencyDollar size={24} weight="duotone" />,
  "Outdoor Activities": <Mountains size={24} weight="duotone" />,
  "Walkability & Transit": <PersonSimpleWalk size={24} weight="duotone" />,
};

export function MethodologyGrid({ data }: MethodologyGridProps) {
  return (
    <div className="my-8 grid grid-cols-1 md:grid-cols-3 gap-4">
      {data.map((item) => (
        <FrostedCard key={item.title} className="p-6">
          <div className="w-10 h-10 rounded-xl bg-forest/10 flex items-center justify-center mb-4 text-forest">
            {iconMap[item.title]}
          </div>
          <h3 className="theme-heading text-lg text-foreground mb-2">{item.title}</h3>
          <p className="theme-body-sm text-muted">{item.description}</p>
        </FrostedCard>
      ))}
    </div>
  );
}
