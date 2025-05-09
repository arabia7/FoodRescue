
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useFood } from "@/contexts/FoodContext";
import { useAuth } from "@/contexts/AuthContext";
import FoodItemCard from "@/components/FoodItemCard";

const PurchasesPage = () => {
  const { soldItems } = useFood();
  const { user, isCustomer } = useAuth();
  const navigate = useNavigate();
  
  useEffect(() => {
    if (!user || !isCustomer()) {
      navigate("/login");
    }
  }, [user, isCustomer, navigate]);

  const myPurchases = soldItems;

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-gray-800 mb-2">My Purchases</h1>
      <p className="text-gray-600 mb-8">
        View all the food items you've purchased
      </p>

      {myPurchases.length === 0 ? (
        <div className="text-center py-12 bg-gray-50 rounded-lg">
          <div className="text-4xl mb-4">🛒</div>
          <h2 className="text-xl font-semibold text-gray-700 mb-2">No purchases yet</h2>
          <p className="text-gray-500 mb-4">You haven't purchased any food items yet</p>
          <button
            onClick={() => navigate("/")}
            className="text-fresh-green hover:text-green-700 font-medium underline"
          >
            Browse available items
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {myPurchases.map((item) => (
            <FoodItemCard key={item.id} item={item} />
          ))}
        </div>
      )}
    </div>
  );
};

export default PurchasesPage;
