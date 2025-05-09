
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FoodItem } from "@/contexts/FoodContext";
import { useAuth } from "@/contexts/AuthContext";
import { formatDistanceToNow } from "date-fns";
import { Edit, Trash2, ShoppingCart, Percent } from "lucide-react";

interface FoodItemCardProps {
  item: FoodItem;
  onPurchase?: (id: string) => void;
  onEdit?: (item: FoodItem) => void;
  onDelete?: (id: string) => void;
}

const FoodItemCard = ({ item, onPurchase, onEdit, onDelete }: FoodItemCardProps) => {
  const { isAdmin, isCustomer, user } = useAuth();
  const canPurchase = isCustomer() && !item.sold && onPurchase;
  const canEdit = isAdmin() && !item.sold && onEdit;
  const canDelete = isAdmin() && onDelete;
  const hasDiscount = !!item.discountPercentage && !!item.originalPrice;

 
  // const formatPrice = (price: number) => {
  //   return `${price.toFixed(2)} ﷼`;
  // };
  const formatPrice = (price: number) => {
    return (
      <span className="text-green-600">
        <span className="icon-saudi_riyal">&#xea;</span> {price.toFixed(2)}
      </span>
    );
  };
  
  const formattedPrice = formatPrice(item.price);
  const formattedOriginalPrice = item.originalPrice ? formatPrice(item.originalPrice) : null;

  const timeAgo = formatDistanceToNow(new Date(item.createdAt), { addSuffix: true });

  return (
    <Card className="overflow-hidden h-full flex flex-col">
      <div className="h-48 overflow-hidden relative">
        <img
          src={item.imageUrl || "https://images.unsplash.com/photo-1546069901-ba9599a7e63c"}
          alt={item.name}
          className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
        />
        {hasDiscount && !item.sold && (
          <div className="absolute top-0 right-0 bg-red-500 text-white px-3 py-1 rounded-bl-lg flex items-center">
            <Percent size={14} className="mr-1" />
            {item.discountPercentage}% OFF
          </div>
        )}
      </div>
      <CardHeader className="p-4">
        <div className="flex justify-between items-start">
          <CardTitle className="text-lg">{item.name}</CardTitle>
          <div>
            {hasDiscount && (
              <div className="text-sm line-through text-gray-500 text-right">
                {formattedOriginalPrice}
              </div>
            )}
            <div className={`text-lg font-bold ${hasDiscount ? 'text-red-500' : 'text-warm-orange'}`}>
              {formattedPrice}
            </div>
          </div>
        </div>
        {item.sold && (
          <div className="inline-block bg-red-100 text-red-800 text-xs px-2 py-1 rounded-full font-medium">
            Sold
          </div>
        )}
        <CardDescription className="text-xs text-gray-500">
          Posted {timeAgo}
        </CardDescription>
      </CardHeader>
      <CardContent className="p-4 pt-0 flex-grow">
        <p className="text-sm text-gray-700">{item.description}</p>
        {item.soldAt && (
          <p className="text-xs text-gray-500 mt-2">
            Purchased {formatDistanceToNow(new Date(item.soldAt), { addSuffix: true })}
          </p>
        )}
      </CardContent>
      <CardFooter className="p-4 pt-0 flex justify-end gap-2">
        {canPurchase && (
          <Button 
            className="bg-fresh-green hover:bg-green-600 text-white" 
            size="sm"
            onClick={() => onPurchase(item.id)}
          >
            <ShoppingCart size={16} className="mr-1" /> 
            Buy Now
          </Button>
        )}
        {canEdit && (
          <Button variant="outline" size="sm" onClick={() => onEdit(item)}>
            <Edit size={16} className="mr-1" /> Edit
          </Button>
        )}
        {canDelete && (
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => onDelete(item.id)} 
            className="text-red-500 border-red-200 hover:bg-red-50"
          >
            <Trash2 size={16} className="mr-1" /> Delete
          </Button>
        )}
      </CardFooter>
    </Card>
  );
};

export default FoodItemCard;
