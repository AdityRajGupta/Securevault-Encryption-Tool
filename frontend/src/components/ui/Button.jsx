import React from "react";
import { motion } from "framer-motion";
import { cn } from "../../lib/utils";

const Button = React.forwardRef(
  ({ className, variant = "default", size = "default", children, ...props }, ref) => {
    const variants = {
      default: "bg-primary text-primary-foreground hover:bg-primary/90",
      secondary: "bg-secondary text-secondary-foreground hover:bg-secondary/80",
      outline: "border border-input bg-transparent hover:bg-accent hover:text-accent-foreground",
      ghost: "hover:bg-accent hover:text-accent-foreground",
    };

    const sizes = {
      default: "h-10 px-4 py-2",
      sm: "h-9 px-3 text-sm",
      lg: "h-11 px-8 text-base",
      icon: "h-10 w-10",
    };

    return (
      <motion.button
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        ref={ref}
        className={cn(
          "inline-flex items-center justify-center gap-2 rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50",
          variants[variant],
          sizes[size],
          className
        )}
        {...props}
      >
        {children}
      </motion.button>
    );
  }
);

Button.displayName = "Button";

export default Button;
