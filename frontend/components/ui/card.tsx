"use client";

import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";
import { Loader2 } from "lucide-react";

const CardContext = React.createContext<{ size: "sm" | "md" | "lg" }>({ size: "md" });

const cardVariants = cva(
  "relative rounded-xl transition-all duration-200 overflow-hidden flex flex-col",
  {
    variants: {
      variant: {
        default: "bg-card text-card-foreground shadow-sm border border-border",
        elevated: "bg-card text-card-foreground shadow-md hover:shadow-lg hover:shadow-primary/5 border border-border",
        outlined: "border-2 border-border bg-transparent text-card-foreground",
        glass: "backdrop-blur-xl bg-card/60 border border-border/50 text-card-foreground shadow-sm",
        gradient: "bg-gradient-to-br from-primary/10 via-card to-background border border-primary/20 text-card-foreground",
      },
      size: {
        sm: "",
        md: "",
        lg: "",
      },
      clickable: {
        true: "cursor-pointer hover:-translate-y-1 hover:shadow-md active:translate-y-0",
        false: "",
      },
      loading: {
        true: "pointer-events-none",
        false: "",
      }
    },
    defaultVariants: {
      variant: "default",
      size: "md",
      clickable: false,
      loading: false,
    },
  }
);

export interface CardProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof cardVariants> {
  as?: React.ElementType;
}

const Card = React.forwardRef<HTMLDivElement, CardProps>(
  ({ className, variant, size, clickable, loading, as: Component = "div", children, ...props }, ref) => {
    const resolvedSize = (size as "sm" | "md" | "lg") || "md";
    return (
      <CardContext.Provider value={{ size: resolvedSize }}>
        <Component
          ref={ref}
          className={cn(cardVariants({ variant, size, clickable, loading, className }))}
          {...props}
        >
          {loading && (
            <div className="absolute inset-0 z-50 flex items-center justify-center bg-background/50 backdrop-blur-sm">
              <Loader2 className="w-8 h-8 animate-spin text-primary" />
            </div>
          )}
          {children}
        </Component>
      </CardContext.Provider>
    );
  }
);
Card.displayName = "Card";

const CardHeader = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => {
    const { size } = React.useContext(CardContext);
    const padding = size === "sm" ? "p-4" : size === "lg" ? "p-8" : "p-6";
    return <div ref={ref} className={cn("flex flex-col space-y-1.5", padding, className)} {...props} />;
  }
);
CardHeader.displayName = "CardHeader";

const CardTitle = React.forwardRef<HTMLParagraphElement, React.HTMLAttributes<HTMLHeadingElement>>(
  ({ className, ...props }, ref) => (
    <h3 ref={ref} className={cn("font-semibold leading-none tracking-tight", className)} {...props} />
  )
);
CardTitle.displayName = "CardTitle";

const CardSubtitle = React.forwardRef<HTMLParagraphElement, React.HTMLAttributes<HTMLHeadingElement>>(
  ({ className, ...props }, ref) => (
    <h4 ref={ref} className={cn("text-sm font-medium text-muted-foreground", className)} {...props} />
  )
);
CardSubtitle.displayName = "CardSubtitle";

const CardDescription = React.forwardRef<HTMLParagraphElement, React.HTMLAttributes<HTMLParagraphElement>>(
  ({ className, ...props }, ref) => (
    <p ref={ref} className={cn("text-sm text-muted-foreground", className)} {...props} />
  )
);
CardDescription.displayName = "CardDescription";

const CardContent = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => {
    const { size } = React.useContext(CardContext);
    const padding = size === "sm" ? "p-4 pt-0" : size === "lg" ? "p-8 pt-0" : "p-6 pt-0";
    return <div ref={ref} className={cn(padding, className)} {...props} />;
  }
);
CardContent.displayName = "CardContent";

const CardFooter = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => {
    const { size } = React.useContext(CardContext);
    const padding = size === "sm" ? "p-4 pt-0" : size === "lg" ? "p-8 pt-0" : "p-6 pt-0";
    return <div ref={ref} className={cn("flex items-center mt-auto", padding, className)} {...props} />;
  }
);
CardFooter.displayName = "CardFooter";

const CardBadge = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => {
    const { size } = React.useContext(CardContext);
    const position = size === "sm" ? "top-4 right-4" : size === "lg" ? "top-8 right-8" : "top-6 right-6";
    return (
      <div 
        ref={ref} 
        className={cn("absolute inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 bg-primary text-primary-foreground border-transparent z-10", position, className)} 
        {...props} 
      />
    );
  }
);
CardBadge.displayName = "CardBadge";

export {
  Card,
  CardHeader,
  CardTitle,
  CardSubtitle,
  CardDescription,
  CardContent,
  CardFooter,
  CardBadge
};
