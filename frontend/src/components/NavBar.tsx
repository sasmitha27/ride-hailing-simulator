import { Link, useLocation } from "react-router-dom";

export function NavBar(): JSX.Element {
  const { pathname } = useLocation();

  const linkClass = (path: string) =>
    `rounded-md px-3 py-2 text-sm font-medium transition-colors ${
      pathname === path ? "bg-white/20 text-white" : "text-white/80 hover:bg-white/10 hover:text-white"
    }`;

  return (
    <div className="flex items-center gap-6">
      <div className="flex items-baseline gap-3">
        <div className="rounded-full bg-white p-2 text-sea font-extrabold text-xl shadow-sm">H</div>
        <div className="text-white text-lg font-bold">hailrider</div>
      </div>

      <nav className="hidden md:flex items-center gap-3">
        <Link to="/" className={linkClass("/")}>Simulator</Link>
        <Link to="/drivers" className={linkClass("/drivers")}>Drivers</Link>
      </nav>
    </div>
  );
}

export default NavBar;
