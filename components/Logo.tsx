import Link from "next/link";

export default function Logo() {
  return (
    <Link href="/" className="flex items-center group">
      {/* Text Logo */}
      <div className="flex flex-col leading-tight">
        <span className="text-xl md:text-2xl font-bold">
          <span className="text-primary" style={{ fontWeight: 700 }}>Digi</span>
          <span className="text-secondary" style={{ fontWeight: 600, opacity: 0.85 }}>store1</span>
        </span>
        <span className="text-[10px] md:text-[11px] text-gray-500 mt-0.5 tracking-wide hidden sm:block">
          Premium Digital Products, Instantly
        </span>
      </div>
    </Link>
  );
}

