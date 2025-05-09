
import { useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import LoginForm from "@/components/LoginForm";
import { UserPlus } from "lucide-react";

const LoginPage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  
  useEffect(() => {
    if (user) {
      navigate("/");
    }
  }, [user, navigate]);

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-md mx-auto">
        <h1 className="text-3xl font-bold text-center mb-8 text-gray-800">
          Welcome to Food Rescue
        </h1>
        <LoginForm />
        
        <div className="text-center mt-6">
          <p className="text-sm text-gray-500">
            Don't have an account yet?{" "}
            <Link to="/signup" className="text-warm-orange hover:underline inline-flex items-center">
              <UserPlus size={16} className="mr-1" /> Sign Up
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
