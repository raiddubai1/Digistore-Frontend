import Link from "next/link";

interface LogoProps {
  variant?: "light" | "dark";
}

export default function Logo({ variant = "light" }: LogoProps) {
  const isDark = variant === "dark";

  return (
    <Link href="/" className="flex items-center group">
      {/* Text Logo */}
      <div className="flex flex-col leading-tight">
        <span className="text-xl md:text-2xl font-bold">
          <span className={isDark ? "text-white" : "text-gray-900"} style={{ fontWeight: 700 }}>Digi</span>
          <span className={isDark ? "text-gray-200" : "text-gray-800"} style={{ fontWeight: 700 }}>store</span>
          <span className="text-[#ff6f61]" style={{ fontWeight: 700 }}>1</span>
        </span>
        <span className={`text-[10px] md:text-[11px] mt-0.5 tracking-wide hidden sm:block ${isDark ? "text-gray-400" : "text-gray-600"}`}>
          Premium Digital Products, Instantly
        </span>
      </div>
    </Link>
  );
}

