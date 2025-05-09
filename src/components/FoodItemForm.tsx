
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Switch } from "@/components/ui/switch";
import { FoodItem } from "@/contexts/FoodContext";
import { useAuth } from "@/contexts/AuthContext";
import { Percent } from "lucide-react";

interface FoodItemFormProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (item: Omit<FoodItem, "id" | "createdAt" | "sold">) => void;
  initialData?: FoodItem;
  isEdit?: boolean;
}

const FoodItemForm = ({
  open,
  onClose,
  onSubmit,
  initialData,
  isEdit = false,
}: FoodItemFormProps) => {
  const { isAdmin } = useAuth();
  
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    imageUrl: "",
    hasDiscount: false,
    originalPrice: "",
    discountPercentage: "",
  });

  useEffect(() => {
    if (initialData) {
      setFormData({
        name: initialData.name,
        description: initialData.description,
        price: initialData.price.toString(),
        imageUrl: initialData.imageUrl,
        hasDiscount: !!initialData.discountPercentage,
        originalPrice: initialData.originalPrice?.toString() || initialData.price.toString(),
        discountPercentage: initialData.discountPercentage?.toString() || "",
      });
    } else {
      setFormData({
        name: "",
        description: "",
        price: "",
        imageUrl: "",
        hasDiscount: false,
        originalPrice: "",
        discountPercentage: "",
      });
    }
  }, [initialData, open]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const toggleDiscount = () => {
    setFormData((prev) => {
      // If enabling discount, set originalPrice to current price if empty
      if (!prev.hasDiscount && !prev.originalPrice) {
        return { ...prev, hasDiscount: !prev.hasDiscount, originalPrice: prev.price };
      }
      return { ...prev, hasDiscount: !prev.hasDiscount };
    });
  };

  const calculateDiscountedPrice = () => {
    if (!formData.hasDiscount || !formData.originalPrice || !formData.discountPercentage) {
      return "";
    }
    
    const original = parseFloat(formData.originalPrice);
    const discount = parseFloat(formData.discountPercentage);
    
    if (isNaN(original) || isNaN(discount)) {
      return "";
    }
    
    const discounted = original * (1 - discount / 100);
    return discounted.toFixed(2);
  };

  // Update price when discount changes
  useEffect(() => {
    if (formData.hasDiscount) {
      const discountedPrice = calculateDiscountedPrice();
      if (discountedPrice) {
        setFormData(prev => ({ ...prev, price: discountedPrice }));
      }
    }
  }, [formData.originalPrice, formData.discountPercentage, formData.hasDiscount]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Simple validation
    if (!formData.name || !formData.description || !formData.price) {
      return;
    }
    
    const submissionData: any = {
      name: formData.name,
      description: formData.description,
      price: parseFloat(formData.price),
      imageUrl: formData.imageUrl || "https://images.unsplash.com/photo-1546069901-ba9599a7e63c",
    };
    
    // Add discount info if applicable
    if (formData.hasDiscount && formData.originalPrice && formData.discountPercentage) {
      submissionData.originalPrice = parseFloat(formData.originalPrice);
      submissionData.discountPercentage = parseFloat(formData.discountPercentage);
    }
    
    onSubmit(submissionData);
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>
            {isEdit ? "Edit Food Item" : "Add New Food Item"}
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <label htmlFor="name" className="text-sm font-medium">
              Food Name
            </label>
            <Input
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="E.g., Pasta Primavera"
              required
            />
          </div>
          
          <div className="space-y-2">
            <label htmlFor="description" className="text-sm font-medium">
              Description
            </label>
            <Textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Describe the food, condition, and quantity"
              rows={3}
              required
            />
          </div>
          
          {isAdmin() && (
            <div className="flex items-center space-x-2 my-4">
              <Switch
                id="hasDiscount"
                checked={formData.hasDiscount}
                onCheckedChange={toggleDiscount}
              />
              <label htmlFor="hasDiscount" className="text-sm font-medium cursor-pointer flex items-center">
                <Percent size={16} className="mr-1 text-warm-orange" />
                Apply Discount
              </label>
            </div>
          )}
          
          {!formData.hasDiscount ? (
            <div className="space-y-2">
              <label htmlFor="price" className="text-sm font-medium">
                Price ($)
              </label>
              <Input
                id="price"
                name="price"
                type="number"
                step="0.01"
                min="0"
                value={formData.price}
                onChange={handleChange}
                placeholder="0.00"
                required
              />
            </div>
          ) : (
            <div className="space-y-4">
              <div className="space-y-2">
                <label htmlFor="originalPrice" className="text-sm font-medium">
                  Original Price ($)
                </label>
                <Input
                  id="originalPrice"
                  name="originalPrice"
                  type="number"
                  step="0.01"
                  min="0"
                  value={formData.originalPrice}
                  onChange={handleChange}
                  placeholder="0.00"
                  required
                />
              </div>
              
              <div className="space-y-2">
                <label htmlFor="discountPercentage" className="text-sm font-medium">
                  Discount (%)
                </label>
                <Input
                  id="discountPercentage"
                  name="discountPercentage"
                  type="number"
                  min="0"
                  max="100"
                  value={formData.discountPercentage}
                  onChange={handleChange}
                  placeholder="E.g., 20"
                  required
                />
              </div>
              
              <div className="space-y-2">
                <label htmlFor="finalPrice" className="text-sm font-medium">
                  Final Price ($)
                </label>
                <Input
                  id="finalPrice"
                  value={formData.price}
                  readOnly
                  className="bg-gray-50"
                />
                <p className="text-xs text-gray-500">
                  Automatically calculated based on discount percentage
                </p>
              </div>
            </div>
          )}
          
          <div className="space-y-2">
            <label htmlFor="imageUrl" className="text-sm font-medium">
              Image URL (optional)
            </label>
            <Input
              id="imageUrl"
              name="imageUrl"
              value={formData.imageUrl}
              onChange={handleChange}
              placeholder="https://example.com/image.jpg"
            />
          </div>
          
          <div className="flex justify-end space-x-4 pt-4">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" className="bg-warm-orange hover:bg-orange-600">
              {isEdit ? "Update" : "Add"} Item
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default FoodItemForm;
