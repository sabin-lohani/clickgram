import Image from "next/image";
import Link from "next/link";

export default function Header() {
  return (
    <header className="shadow-sm border-b sticky top-0 bg-white z-30 p-3">
      <div className="flex justify-between items-center max-w-6xl mx-auto">
        <Link href="/" className="hidden lg:inline-flex">
          <Image
            src="/logo-text.png"
            width={96}
            height={96}
            alt="clickgram logo"
          />
        </Link>
        <Link href="/" className="lg:hidden">
          <Image
            src="/logo-img.png"
            width={40}
            height={40}
            alt="clickgram logo"
          />
        </Link>

        <input
          type="search"
          placeholder="Search"
          className="bg-gray-50 text-black border  border gray-200 rounded text-sm w-full py-2 px-4 max-w-[210px]"
        />

        <button className="text-sm font-semibold text-blue-500">Log In</button>
      </div>
    </header>
  );
}
