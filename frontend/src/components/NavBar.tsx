import { Link, useLocation } from "react-router-dom";

export function NavBar(): JSX.Element {
  const { pathname } = useLocation();

  const linkClass = (path: string) =>
    `rounded-md px-3 py-2 text-sm font-medium transition-colors whitespace-nowrap ${
      pathname === path ? "bg-white/20 text-white" : "text-white/80 hover:bg-white/10 hover:text-white"
    }`;

  return (
    <nav className="flex flex-wrap items-center justify-end gap-2 md:gap-3">
      <Link to="/" className={linkClass("/")}>Simulator</Link>
      <Link to="/drivers" className={linkClass("/drivers")}>Drivers</Link>
      <Link to="/customers" className={linkClass("/customers")}>Customers</Link>
      <Link to="/rides" className={linkClass("/rides")}>Rides</Link>
    </nav>
  );
}

export default NavBar;
