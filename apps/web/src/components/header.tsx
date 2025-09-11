import { Link } from "@tanstack/react-router";

import { ModeToggle } from "./mode-toggle";
import { WalletButton } from "./wallet-button";

export default function Header() {
  const links = [
    { to: "/", label: "Home" },
    { to: "/dashboard", label: "Dashboard" },
    { to: "/flow", label: "Narrative Flow" },
    { to: "/wiki", label: "Characters" },
    { to: "/universes", label: "Universes" },
    { to: "/cinematicuniversecreate", label: "Create Universe" },
  ];

  return (
    <div>
      <div className="flex flex-row items-center justify-between px-2 py-1">
        <nav className="flex gap-4 text-lg">
          {links.map(({ to, label }) => {
            return (
              <Link
                key={to}
                to={to}
              >
                {label}
              </Link>
            );
          })}
        </nav>
        <div className="flex items-center gap-3">
          <ModeToggle />
          <div className="border-l border-gray-200 dark:border-gray-700 pl-3">
            <WalletButton />
          </div>
        </div>
      </div>
      <hr />
    </div>
  );
}
