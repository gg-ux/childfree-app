import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils/cn";

const buttonVariants = cva(
  [
    "inline-flex items-center justify-center gap-2",
    "font-mono text-[12px] uppercase tracking-wide",
    "rounded-md transition-all duration-300",
    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2",
    "disabled:pointer-events-none disabled:opacity-50",
    "active:scale-[0.95]",
  ].join(" "),
  {
    variants: {
      variant: {
        default: [
          "bg-foreground text-background",
          "hover:scale-[1.03]",
          "focus-visible:ring-foreground",
        ].join(" "),
        secondary: [
          "backdrop-blur-md bg-white/[0.02]",
          "border border-[rgba(0,0,0,0.08)]",
          "hover:bg-white/[0.05] hover:scale-[1.03]",
          "focus-visible:ring-forest",
        ].join(" "),
        ghost: [
          "text-foreground",
          "hover:text-forest",
          "focus-visible:ring-forest",
        ].join(" "),
        accent: [
          "bg-forest text-white",
          "hover:bg-forest-light hover:scale-[1.03]",
          "focus-visible:ring-forest",
        ].join(" "),
      },
      size: {
        default: "h-10 px-5 py-2",
        sm: "h-8 px-4 py-1.5",
        lg: "h-11 px-6 py-2.5",
        icon: "h-10 w-10 p-0",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return (
      <Comp
        className={cn(
          buttonVariants({ variant, size, className }),
          "ease-organic"
        )}
        ref={ref}
        {...props}
      />
    );
  }
);
Button.displayName = "Button";

export { Button, buttonVariants };
