import { Link, useNavigate } from 'react-router-dom';
import { auth } from '../firebase';

function Navbar({ user }) {
  const navigate = useNavigate();

  const handleSignOut = async () => {
    try {
      await auth.signOut();
      navigate('/login');
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  return (
    <nav className="bg-white shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <Link to="/" className="flex items-center">
            <h1 className="text-xl font-bold text-gray-900">Todo App</h1>
          </Link>
          
          {user ? (
            <div className="flex items-center gap-4">
              <Link
                to="/account"
                className="flex items-center gap-2 text-gray-600 hover:text-gray-900"
              >
                <img
                  src={user.photoURL || "https://api.dicebear.com/7.x/avataaars/svg?seed=default"}
                  alt="Profile"
                  className="w-8 h-8 rounded-full"
                />
                <span>{user.displayName || user.email}</span>
              </Link>
              <button
                onClick={handleSignOut}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
              >
                Sign Out
              </button>
            </div>
          ) : (
            <Link
              to="/login"
              className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Login
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
}

export default Navbar;