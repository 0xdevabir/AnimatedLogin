"use client";

import { motion, type Variants } from "framer-motion";
import Link from "next/link";
import type { LucideIcon } from "lucide-react";
import { ArrowUpRight } from "lucide-react";
import { SpotlightCard } from "@/components/motion/spotlight-card";

type TourCardProps = {
  index: number;
  icon: LucideIcon;
  title: string;
  desc: string;
  href: string;
  cta?: string;
};

const cardVariants: Variants = {
  hidden: { opacity: 0, y: 20, filter: "blur(8px)" },
  show: (i: number) => ({
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: { delay: 0.2 + i * 0.08, duration: 0.5, ease: [0.22, 1, 0.36, 1] },
  }),
};

export function TourCard({ index, icon: Icon, title, desc, href, cta = "Explore" }: TourCardProps) {
  return (
    <motion.div variants={cardVariants} custom={index}>
      <Link href={href} className="group block h-full">
        <SpotlightCard className="h-full">
          <div className="p-6 h-full flex flex-col">
            <div className="flex items-start justify-between">
              <span className="inline-flex h-10 w-10 items-center justify-center rounded-lg border border-border bg-background/60 text-foreground/80">
                <Icon className="h-4 w-4" />
              </span>
              <span className="text-xs font-mono text-muted-foreground">
                0{index + 1}
              </span>
            </div>
            <h3 className="mt-5 text-lg font-semibold tracking-tight">{title}</h3>
            <p className="mt-1.5 text-sm text-muted-foreground leading-relaxed">{desc}</p>
            <div className="mt-5 flex items-center gap-1.5 text-sm font-medium text-foreground">
              {cta}
              <ArrowUpRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </div>
          </div>
        </SpotlightCard>
      </Link>
    </motion.div>
  );
}
