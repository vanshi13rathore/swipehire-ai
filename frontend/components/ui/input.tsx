import * as React from "react";
import { cn } from "@/lib/utils";
import { Eye, EyeOff, X, Loader2, CheckCircle2, AlertCircle } from "lucide-react";

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  helperText?: string;
  error?: string;
  fullWidth?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  loading?: boolean;
  success?: boolean;
  onClear?: () => void;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  (
    {
      className,
      type = "text",
      label,
      helperText,
      error,
      fullWidth = true,
      leftIcon,
      rightIcon,
      loading,
      success,
      onClear,
      disabled,
      required,
      id,
      ...props
    },
    ref
  ) => {
    const [showPassword, setShowPassword] = React.useState(false);
    const generatedId = React.useId();
    const inputId = id || generatedId;

    const isPassword = type === "password";
    const inputType = isPassword ? (showPassword ? "text" : "password") : type;
    const isSearch = type === "search";

    const baseInputStyles =
      "flex h-10 w-full rounded-md border bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 transition-colors";

    const errorStyles = error ? "border-destructive focus-visible:ring-destructive" : "border-input";
    const successStyles = success && !error ? "border-success focus-visible:ring-success" : "";
    
    const paddingLeft = leftIcon ? "pl-10" : "";
    const paddingRight =
      rightIcon || isPassword || (isSearch && onClear) || loading || (success && !rightIcon) || (error && !rightIcon)
        ? "pr-10"
        : "";

    return (
      <div className={cn("flex flex-col gap-1.5", fullWidth ? "w-full" : "")}>
        {label && (
          <label
            htmlFor={inputId}
            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
          >
            {label}
            {required && <span className="text-destructive ml-1">*</span>}
          </label>
        )}
        <div className="relative">
          {leftIcon && (
            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none flex items-center justify-center">
              {leftIcon}
            </div>
          )}
          <input
            id={inputId}
            type={inputType}
            className={cn(baseInputStyles, errorStyles, successStyles, paddingLeft, paddingRight, className)}
            disabled={disabled || loading}
            required={required}
            ref={ref}
            {...props}
          />
          
          <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-1">
            {loading && <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />}
            
            {!loading && error && !rightIcon && !isPassword && !isSearch && (
              <AlertCircle className="h-4 w-4 text-destructive" />
            )}
            
            {!loading && !error && success && !rightIcon && !isPassword && !isSearch && (
              <CheckCircle2 className="h-4 w-4 text-success" />
            )}
            
            {isSearch && onClear && !loading && !disabled && props.value && (
              <button
                type="button"
                onClick={onClear}
                className="text-muted-foreground hover:text-foreground focus:outline-none focus:ring-2 focus:ring-ring rounded-sm"
                aria-label="Clear search"
              >
                <X className="h-4 w-4" />
              </button>
            )}

            {isPassword && !loading && !disabled && (
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="text-muted-foreground hover:text-foreground focus:outline-none focus:ring-2 focus:ring-ring rounded-sm"
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            )}

            {!loading && rightIcon && !isPassword && !(isSearch && onClear) && (
              <div className="text-muted-foreground pointer-events-none flex items-center justify-center">
                {rightIcon}
              </div>
            )}
          </div>
        </div>
        
        {helperText && !error && (
          <p className="text-[0.8rem] text-muted-foreground">{helperText}</p>
        )}
        {error && (
          <p className="text-[0.8rem] font-medium text-destructive">{error}</p>
        )}
      </div>
    );
  }
);
Input.displayName = "Input";

export { Input };
