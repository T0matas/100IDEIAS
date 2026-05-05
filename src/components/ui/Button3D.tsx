import { cn } from "@/lib/utils"

interface Button3DProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  color?: "primary" | "gray" | "white";
}

export function Button3D({ children, className, color = "primary", ...props }: Button3DProps) {
  return (
    <button
      onMouseUp={(e) => e.currentTarget.blur()}
      onTouchEnd={(e) => e.currentTarget.blur()}
      className={cn(
        "relative inline-flex items-center justify-center font-bold transition-all duration-150 rounded-xl outline-none focus:ring-0 active:translate-y-[4px]",
        color === "primary" && "bg-primary text-white shadow-[0_4px_0_rgb(109,40,217)] hover:shadow-[0_2px_0_rgb(109,40,217)] hover:translate-y-[1px] active:shadow-[0_0px_0_rgb(109,40,217)]",
        color === "gray" && "bg-[#2A2A2A] border border-white/5 shadow-[0_4px_0_rgb(26,26,26)] hover:shadow-[0_2px_0_rgb(26,26,26)] hover:translate-y-[1px] active:shadow-[0_0px_0_rgb(26,26,26)] text-gray-300",
        color === "white" && "bg-white text-black shadow-[0_4px_0_rgb(204,204,204)] hover:shadow-[0_2px_0_rgb(204,204,204)] hover:translate-y-[1px] active:shadow-[0_0px_0_rgb(204,204,204)]",
        className
      )}
      {...props}
    >
      {children}
    </button>
  )
}
