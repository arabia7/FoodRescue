
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useFood } from "@/contexts/FoodContext";
import { useAuth } from "@/contexts/AuthContext";
import FoodItemCard from "@/components/FoodItemCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";

const HomePage = () => {
  const { availableItems, purchaseFoodItem } = useFood();
  const { user, isCustomer } = useAuth();
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  
  const handlePurchase = (id: string) => {
    if (!user) {
      navigate("/login");
      return;
    }
    
    purchaseFoodItem(id);
  };
  
  const filteredItems = availableItems.filter((item) => 
    item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Available Food Items</h1>
          <p className="text-gray-600 mt-1">
            Browse and purchase leftover food at discounted prices
          </p>
        </div>
        
        <div className="relative w-full md:w-auto md:min-w-[300px]">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
          <Input
            type="text"
            placeholder="Search food items..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>
      
      {filteredItems.length === 0 ? (
        <div className="text-center py-12">
          <div className="text-4xl mb-4">🍽️</div>
          <h2 className="text-2xl font-semibold text-gray-700 mb-2">No food items available</h2>
          <p className="text-gray-500 mb-6">Check back later or try a different search term</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredItems.map((item) => (
            <FoodItemCard
              key={item.id}
              item={item}
              onPurchase={isCustomer() ? handlePurchase : undefined}
            />
          ))}
        </div>
      )}
      
      {!user && (
        <div className="mt-12 bg-soft-yellow/30 rounded-lg p-6 text-center">
          <h3 className="text-xl font-semibold mb-2">Want to buy delicious food at a discount?</h3>
          <p className="mb-4">Log in to purchase available food items</p>
          <Button onClick={() => navigate("/login")} className="bg-warm-orange hover:bg-orange-600">
            Log In Now
          </Button>
        </div>
      )}
    </div>
  );
};

export default HomePage;
