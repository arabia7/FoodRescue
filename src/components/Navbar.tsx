
import { Link } from "react-router-dom";
import { ShoppingCart, LogIn, LogOut, User, HomeIcon, UserPlus } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";

const Navbar = () => {
  const { user, logout, isAdmin, isCustomer } = useAuth();

  return (
    <nav className="bg-white shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex items-center">
              <div className="bg-warm-orange p-2 rounded-full">
                <ShoppingCart size={24} className="text-white" />
              </div>
              <span className="ml-2 text-xl font-bold text-gray-800">Food Rescue</span>
            </Link>
          </div>
          
          <div className="flex items-center space-x-4">
            <Link to="/" className="text-gray-600 hover:text-warm-orange flex items-center">
              <HomeIcon size={18} className="mr-1" />
              <span>Home</span>
            </Link>
            
            {user ? (
              <>
                {isAdmin() && (
                  <Link to="/admin" className="text-gray-600 hover:text-warm-orange">
                    Admin Panel
                  </Link>
                )}
                
                {isCustomer() && (
                  <Link to="/purchases" className="text-gray-600 hover:text-warm-orange">
                    My Purchases
                  </Link>
                )}
                
                <div className="flex items-center">
                  <User size={18} className="mr-1 text-fresh-green" />
                  <span className="text-sm font-medium text-gray-700">{user.username}</span>
                </div>
                
                <button 
                  onClick={logout}
                  className="flex items-center text-gray-600 hover:text-red-500"
                >
                  <LogOut size={18} className="mr-1" />
                  <span>Logout</span>
                </button>
              </>
            ) : (
              <>
                <Link to="/login" className="flex items-center text-gray-600 hover:text-warm-orange">
                  <LogIn size={18} className="mr-1" />
                  <span>Login</span>
                </Link>
                <Link to="/signup" className="flex items-center text-gray-600 hover:text-warm-orange">
                  <UserPlus size={18} className="mr-1" />
                  <span>Sign Up</span>
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
