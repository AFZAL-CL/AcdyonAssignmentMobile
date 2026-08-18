import Link from 'next/link';

export default function Navbar() {
  return (
    <nav id="global-nav" className="fixed top-0 left-0 w-full z-50 px-8 py-6 flex justify-between items-center text-sm font-medium tracking-wide opacity-0">
      <div className="flex-1">
        <Link href="/" className="text-foreground hover:opacity-70 transition-opacity">
          SONA
        </Link>
      </div>
      
      <div className="flex gap-8 justify-center flex-1">
        <Link href="#" className="text-foreground hover:opacity-70 transition-opacity">PRODUCT</Link>
        <Link href="#" className="text-foreground hover:opacity-70 transition-opacity">TECHNOLOGY</Link>
        <Link href="#" className="text-foreground hover:opacity-70 transition-opacity">SOUND</Link>
        <Link href="#" className="text-foreground hover:opacity-70 transition-opacity">ABOUT</Link>
      </div>
      
      <div className="flex-1 flex justify-end">
        <Link href="#" className="text-foreground hover:opacity-70 transition-opacity flex items-center gap-1">
          EXPLORE <span>&rarr;</span>
        </Link>
      </div>
    </nav>
  );
}
