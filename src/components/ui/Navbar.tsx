import Link from 'next/link';

export default function Navbar() {
  return (
    <nav id="global-nav" className="fixed top-0 left-0 w-full z-50 px-6 md:px-8 py-6 flex justify-between items-center text-sm font-medium tracking-wide opacity-0 overflow-x-hidden">
      <div className="flex-1">
        <Link href="/" className="text-foreground hover:opacity-70 transition-opacity">
          SONA
        </Link>
      </div>
      
      {/* Desktop Links */}
      <div className="hidden md:flex gap-8 justify-center flex-1">
        <Link href="#" className="text-foreground hover:opacity-70 transition-opacity">PRODUCT</Link>
        <Link href="#" className="text-foreground hover:opacity-70 transition-opacity">TECHNOLOGY</Link>
        <Link href="#" className="text-foreground hover:opacity-70 transition-opacity">SOUND</Link>
        <Link href="#" className="text-foreground hover:opacity-70 transition-opacity">ABOUT</Link>
      </div>
      
      {/* Desktop Explore */}
      <div className="hidden md:flex flex-1 justify-end">
        <Link href="#" className="text-foreground hover:opacity-70 transition-opacity flex items-center gap-1">
          EXPLORE <span>&rarr;</span>
        </Link>
      </div>

      {/* Mobile Menu */}
      <div className="flex md:hidden justify-end flex-1">
        <button className="text-foreground hover:opacity-70 transition-opacity font-bold">
          MENU
        </button>
      </div>
    </nav>
  );
}
