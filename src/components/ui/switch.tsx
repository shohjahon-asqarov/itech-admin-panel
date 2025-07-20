import * as React from "react";
import { cn } from "@/lib/utils";

export interface SwitchProps extends React.InputHTMLAttributes<HTMLInputElement> { }

export const Switch = React.forwardRef<HTMLInputElement, SwitchProps>(
    ({ className, ...props }, ref) => (
        <label className="relative inline-flex items-center cursor-pointer select-none">
            <input
                type="checkbox"
                ref={ref}
                className={cn(
                    "sr-only peer",
                    className
                )}
                {...props}
            />
            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-blue-500 rounded-full peer peer-checked:bg-blue-600 transition-all duration-200"></div>
            <div className="absolute left-1 top-1 bg-white w-4 h-4 rounded-full shadow-md transform peer-checked:translate-x-5 transition-all duration-200"></div>
        </label>
    )
);
Switch.displayName = "Switch";

export default Switch; 