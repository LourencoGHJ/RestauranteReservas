import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { Package, Plus, Minus } from "lucide-react";

interface Product {
  id: string;
  name: string;
  quantity: number;
  price: number;
}

interface StockManagementProps {
  products: Product[];
  onUpdateStock: (productId: string, action: "add" | "remove") => void;
}

export const StockManagement = ({ products, onUpdateStock }: StockManagementProps) => {
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState("");

  const filteredProducts = products.filter((product) =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleStockUpdate = (productId: string, action: "add" | "remove") => {
    onUpdateStock(productId, action);
    toast({
      title: "Stock Updated",
      description: `Product stock has been ${action === "add" ? "increased" : "decreased"}.`,
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-4">
        <Input
          placeholder="Search products..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="max-w-sm"
        />
      </div>

      <div className="grid gap-4">
        {filteredProducts.map((product) => (
          <div
            key={product.id}
            className="flex items-center justify-between bg-white p-4 rounded-lg shadow-sm"
          >
            <div className="flex items-center space-x-4">
              <div className="p-2 bg-primary/10 rounded-full">
                <Package className="w-5 h-5 text-primary" />
              </div>
              <div>
                <h3 className="font-medium">{product.name}</h3>
                <p className="text-sm text-gray-500">Price: €{product.price}</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <p className="font-medium">Stock: {product.quantity}</p>
              <div className="flex space-x-2">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => handleStockUpdate(product.id, "remove")}
                >
                  <Minus className="w-4 h-4" />
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => handleStockUpdate(product.id, "add")}
                >
                  <Plus className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};