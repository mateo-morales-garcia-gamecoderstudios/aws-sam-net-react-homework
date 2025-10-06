import { Link } from '@tanstack/react-router';
import { useState } from 'react';

export default function Header() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <header className="p-1 flex items-center justify-between flex-row bg-gray-800 text-white shadow-lg">
      <h1 className="text-xl font-semibold">
        Rewards
      </h1>
      <button
        onClick={() => setIsOpen(true)}
        className="p-2 hover:bg-gray-700 rounded-lg transition-colors"
        aria-label="Login"
      >
        <Link to="/login">
          <h1 className="text-xs font-semibold">
            Login
          </h1>
        </Link>
      </button>
    </header>
  );
}
