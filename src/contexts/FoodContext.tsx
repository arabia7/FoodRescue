
import { createContext, useContext, useState, ReactNode, useEffect } from "react";
import { toast } from "sonner";

export type FoodItem = {
  id: string;
  name: string;
  description: string;
  price: number;
  originalPrice?: number;
  discountPercentage?: number;
  imageUrl: string;
  createdAt: string;
  soldAt?: string;
  sold: boolean;
};

type FoodContextType = {
  foodItems: FoodItem[];
  addFoodItem: (item: Omit<FoodItem, "id" | "createdAt" | "sold">) => void;
  updateFoodItem: (id: string, item: Partial<FoodItem>) => void;
  deleteFoodItem: (id: string) => void;
  purchaseFoodItem: (id: string) => void;
  availableItems: FoodItem[];
  soldItems: FoodItem[];
};

const FoodContext = createContext<FoodContextType | undefined>(undefined);

// Mock initial food items
const initialFoodItems: FoodItem[] = [
  {
    id: "1",
    name: "Pasta Primavera",
    description: "Leftover pasta with fresh vegetables, only made today",
    price: 4.99,
    imageUrl: "https://images.unsplash.com/photo-1473093295043-cdd812d0e601",
    createdAt: new Date().toISOString(),
    sold: false,
  },
  {
    id: "2",
    name: "Chocolate Cake Slices",
    description: "3 slices of chocolate cake, perfect condition",
    price: 3.50,
    originalPrice: 5.00,
    discountPercentage: 30,
    imageUrl: "https://images.unsplash.com/photo-1578985545062-69928b1d9587",
    createdAt: new Date().toISOString(),
    sold: false,
  },
  {
    id: "3",
    name: "Vegetable Curry",
    description: "Homemade vegetable curry, enough for 2 people",
    price: 6.75,
    imageUrl: "https://images.unsplash.com/photo-1505253758473-96b7015fcd40",
    createdAt: new Date().toISOString(),
    sold: false,
  },
];

export const FoodProvider = ({ children }: { children: ReactNode }) => {
  const [foodItems, setFoodItems] = useState<FoodItem[]>(() => {
    const savedItems = localStorage.getItem("foodItems");
    return savedItems ? JSON.parse(savedItems) : initialFoodItems;
  });

  useEffect(() => {
    localStorage.setItem("foodItems", JSON.stringify(foodItems));
  }, [foodItems]);

  const addFoodItem = (item: Omit<FoodItem, "id" | "createdAt" | "sold">) => {
    const newItem: FoodItem = {
      ...item,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
      sold: false,
    };
    
    // If there's a discount, calculate the final price
    if (item.originalPrice && item.discountPercentage) {
      newItem.price = Number((item.originalPrice * (1 - item.discountPercentage / 100)).toFixed(2));
    }
    
    setFoodItems((prev) => [...prev, newItem]);
    toast.success(`${item.name} added successfully`);
  };

  const updateFoodItem = (id: string, item: Partial<FoodItem>) => {
    setFoodItems((prev) =>
      prev.map((foodItem) => {
        if (foodItem.id === id) {
          const updatedItem = { ...foodItem, ...item };
          
          // Recalculate price if discount-related fields are changed
          if (item.originalPrice !== undefined || item.discountPercentage !== undefined) {
            const originalPrice = item.originalPrice !== undefined ? item.originalPrice : foodItem.originalPrice;
            const discountPercentage = item.discountPercentage !== undefined ? item.discountPercentage : foodItem.discountPercentage;
            
            if (originalPrice && discountPercentage) {
              updatedItem.price = Number((originalPrice * (1 - discountPercentage / 100)).toFixed(2));
            }
          }
          
          return updatedItem;
        }
        return foodItem;
      })
    );
    toast.success("Item updated successfully");
  };

  const deleteFoodItem = (id: string) => {
    setFoodItems((prev) => prev.filter((item) => item.id !== id));
    toast.success("Item removed successfully");
  };

  const purchaseFoodItem = (id: string) => {
    setFoodItems((prev) =>
      prev.map((item) =>
        item.id === id
          ? { ...item, sold: true, soldAt: new Date().toISOString() }
          : item
      )
    );
    toast.success("Purchase successful! Enjoy your food!");
  };

  const availableItems = foodItems.filter((item) => !item.sold);
  const soldItems = foodItems.filter((item) => item.sold);

  return (
    <FoodContext.Provider
      value={{
        foodItems,
        addFoodItem,
        updateFoodItem,
        deleteFoodItem,
        purchaseFoodItem,
        availableItems,
        soldItems,
      }}
    >
      {children}
    </FoodContext.Provider>
  );
};

export const useFood = () => {
  const context = useContext(FoodContext);
  if (context === undefined) {
    throw new Error("useFood must be used within a FoodProvider");
  }
  return context;
};
