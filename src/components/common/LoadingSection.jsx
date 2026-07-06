import React from "react";
import { Loader2 } from "lucide-react";

const LoadingSection = ({ size = 32, className = "text-[#b026ff]", containerClassName = "py-20" }) => {
 return (
 <div className={`flex justify-center items-center w-full ${containerClassName}`}>
 <Loader2 className={`animate-spin ${className}`} size={size} />
 </div>
 );
};

export default LoadingSection;
