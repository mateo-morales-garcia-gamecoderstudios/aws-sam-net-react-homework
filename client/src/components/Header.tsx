import { useAuth } from '@/lib/auth';
import { Link } from '@tanstack/react-router';

export default function Header() {

  return (
    <header className="p-1 flex items-center justify-between flex-row bg-gray-800 text-white shadow-lg">
      <h1 className="text-xl font-semibold">
        Rewards
      </h1>
      <LoginLogoutButton />
    </header>
  );
}

function LoginLogoutButton() {
  const { isAuthenticated, logout } = useAuth()

  if (isAuthenticated) {
    return <button
      onClick={logout}
      className="p-2 hover:bg-gray-700 rounded-lg transition-colors"
      aria-label="Logout"
    >
      <h1 className="text-xs font-semibold">
        Logout
      </h1>
    </button>
  }
  return <button
    className="p-2 hover:bg-gray-700 rounded-lg transition-colors"
    aria-label="Login"
  >
    <Link to="/login">
      <h1 className="text-xs font-semibold">
        Login
      </h1>
    </Link>
  </button>
}

