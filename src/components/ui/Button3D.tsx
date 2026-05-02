import { cn } from "@/lib/utils"

interface Button3DProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  color?: "primary" | "gray" | "white";
}

export function Button3D({ children, className, color = "primary", ...props }: Button3DProps) {
  return (
    <button
      className={cn(
        "relative inline-flex items-center justify-center font-bold transition-all duration-150 rounded-xl",
        color === "primary" && "bg-primary text-white shadow-[0_6px_0_rgb(109,40,217)] hover:shadow-[0_4px_0_rgb(109,40,217)] hover:translate-y-[2px] active:shadow-[0_0px_0_rgb(109,40,217)] active:translate-y-[6px]",
        color === "gray" && "bg-[#2A2A2A] border border-white/5 shadow-[0_6px_0_rgb(26,26,26)] hover:shadow-[0_4px_0_rgb(26,26,26)] hover:translate-y-[2px] active:shadow-[0_0px_0_rgb(26,26,26)] active:translate-y-[6px] text-gray-300",
        color === "white" && "bg-white text-black shadow-[0_6px_0_rgb(204,204,204)] hover:shadow-[0_4px_0_rgb(204,204,204)] hover:translate-y-[2px] active:shadow-[0_0px_0_rgb(204,204,204)] active:translate-y-[6px]",
        className
      )}
      {...props}
    >
      {children}
    </button>
  )
}
