
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

const NotFoundPage = () => {
  return (
    <div className="container mx-auto px-4 py-16 text-center">
      <div className="text-6xl mb-6">🍽️</div>
      <h1 className="text-4xl font-bold mb-4 text-gray-800">Page Not Found</h1>
      <p className="text-gray-600 mb-8 max-w-md mx-auto">
        Oops! It looks like the page you're looking for has been eaten or doesn't exist.
      </p>
      <Button asChild className="bg-warm-orange hover:bg-orange-600">
        <Link to="/">Return to Home</Link>
      </Button>
    </div>
  );
};

export default NotFoundPage;
