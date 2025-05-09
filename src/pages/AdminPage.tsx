
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useFood, FoodItem } from "@/contexts/FoodContext";
import { useAuth } from "@/contexts/AuthContext";
import FoodItemCard from "@/components/FoodItemCard";
import FoodItemForm from "@/components/FoodItemForm";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Plus } from "lucide-react";
import { useEffect } from "react";

const AdminPage = () => {
  const { foodItems, availableItems, soldItems, addFoodItem, updateFoodItem, deleteFoodItem } = useFood();
  const { user, isAdmin } = useAuth();
  const navigate = useNavigate();
  
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<FoodItem | undefined>(undefined);
  
  useEffect(() => {
    if (!user || !isAdmin()) {
      navigate("/login");
    }
  }, [user, isAdmin, navigate]);

  const handleAddClick = () => {
    setEditingItem(undefined);
    setIsFormOpen(true);
  };

  const handleEditClick = (item: FoodItem) => {
    setEditingItem(item);
    setIsFormOpen(true);
  };

  const handleFormSubmit = (formData: Omit<FoodItem, "id" | "createdAt" | "sold">) => {
    if (editingItem) {
      updateFoodItem(editingItem.id, formData);
    } else {
      addFoodItem(formData);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Admin Panel</h1>
          <p className="text-gray-600 mt-1">
            Manage your food item listings
          </p>
        </div>
        
        <Button onClick={handleAddClick} className="bg-warm-orange hover:bg-orange-600">
          <Plus size={18} className="mr-1" /> Add New Item
        </Button>
      </div>
      
      <Tabs defaultValue="available" className="w-full">
        <TabsList className="mb-6">
          <TabsTrigger value="available">Available ({availableItems.length})</TabsTrigger>
          <TabsTrigger value="sold">Sold ({soldItems.length})</TabsTrigger>
        </TabsList>
        
        <TabsContent value="available">
          {availableItems.length === 0 ? (
            <div className="text-center py-12 bg-gray-50 rounded-lg">
              <div className="text-4xl mb-4">🍽️</div>
              <h2 className="text-xl font-semibold text-gray-700 mb-2">No available items</h2>
              <p className="text-gray-500 mb-6">Add some food items to start selling</p>
              <Button onClick={handleAddClick} className="bg-warm-orange hover:bg-orange-600">
                <Plus size={18} className="mr-1" /> Add First Item
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {availableItems.map((item) => (
                <FoodItemCard
                  key={item.id}
                  item={item}
                  onEdit={handleEditClick}
                  onDelete={deleteFoodItem}
                />
              ))}
            </div>
          )}
        </TabsContent>
        
        <TabsContent value="sold">
          {soldItems.length === 0 ? (
            <div className="text-center py-12 bg-gray-50 rounded-lg">
              <h2 className="text-xl font-semibold text-gray-700 mb-2">No sold items yet</h2>
              <p className="text-gray-500">Items will appear here once they've been sold</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {soldItems.map((item) => (
                <FoodItemCard
                  key={item.id}
                  item={item}
                  onDelete={deleteFoodItem}
                />
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>
      
      <FoodItemForm
        open={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        onSubmit={handleFormSubmit}
        initialData={editingItem}
        isEdit={!!editingItem}
      />
    </div>
  );
};

export default AdminPage;
