import Link from "next/link";

export default function Logo() {
  return (
    <Link href="/" className="flex items-center group">
      {/* Text Logo */}
      <div className="flex flex-col leading-tight">
        <span className="text-xl md:text-2xl font-bold">
          <span className="text-gray-900" style={{ fontWeight: 700 }}>Digi</span>
          <span className="text-gray-800" style={{ fontWeight: 700 }}>store</span>
          <span className="text-[#ff6f61]" style={{ fontWeight: 700 }}>1</span>
        </span>
        <span className="text-[10px] md:text-[11px] text-gray-600 mt-0.5 tracking-wide hidden sm:block">
          Premium Digital Products, Instantly
        </span>
      </div>
    </Link>
  );
}

