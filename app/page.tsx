'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Loader2, ShoppingCart, ChevronLeft, ChevronRight, Star, Heart } from 'lucide-react';

interface Product {
  _id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  variants: {
    type: string;
    options: string[];
  }[];
  inventory: number;
}

export default function LandingPage() {
  const router = useRouter();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [selectedVariants, setSelectedVariants] = useState<Record<string, string>>({});
  const [quantity, setQuantity] = useState(1);
  const [currentPage, setCurrentPage] = useState(0);
  const productsPerPage = 4;

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await fetch('/api/products');
      const data = await response.json();
      setProducts(data);
      if (data.length > 0) {
        setSelectedProduct(data[0]);
        // Initialize default variants
        const defaultVariants: Record<string, string> = {};
        data[0].variants.forEach((variant: any) => {
          defaultVariants[variant.type] = variant.options[0];
        });
        setSelectedVariants(defaultVariants);
      }
    } catch (error) {
      console.error('Failed to fetch products:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleProductSelect = (product: Product) => {
    setSelectedProduct(product);
    const defaultVariants: Record<string, string> = {};
    product.variants.forEach(variant => {
      defaultVariants[variant.type] = variant.options[0];
    });
    setSelectedVariants(defaultVariants);
    setQuantity(1);
  };

  const handleBuyNow = () => {
    if (!selectedProduct) return;

    const params = new URLSearchParams({
      productId: selectedProduct._id,
      quantity: quantity.toString(),
      ...selectedVariants
    });

    router.push(`/checkout?${params.toString()}`);
  };

  const nextPage = () => {
    const maxPage = Math.ceil(products.length / productsPerPage) - 1;
    setCurrentPage(prev => Math.min(prev + 1, maxPage));
  };

  const prevPage = () => {
    setCurrentPage(prev => Math.max(prev - 1, 0));
  };

  const displayedProducts = products.slice(
    currentPage * productsPerPage,
    (currentPage + 1) * productsPerPage
  );

  const maxPage = Math.ceil(products.length / productsPerPage) - 1;

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Header */}
      <header className="bg-white shadow-lg border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                <ShoppingCart className="h-6 w-6 text-white" />
              </div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
                ShoeStore
              </h1>
            </div>
            <Badge variant="secondary" className="text-sm">
              <ShoppingCart className="h-4 w-4 mr-1" />
              {products.length} Products
            </Badge>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <h2 className="text-4xl font-extrabold text-gray-900 mb-4">
            Discover Your Perfect Pair
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            From classic sneakers to performance runners, find the shoes that match your style and lifestyle.
          </p>
        </div>

        {/* Products Scroller Section */}
        <div className="mb-12">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-2xl font-bold text-gray-900">Featured Products</h3>
            <div className="flex items-center space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={prevPage}
                disabled={currentPage === 0}
                className="h-10 w-10 p-0"
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <span className="text-sm text-gray-500 px-3">
                {currentPage + 1} of {maxPage + 1}
              </span>
              <Button
                variant="outline"
                size="sm"
                onClick={nextPage}
                disabled={currentPage >= maxPage}
                className="h-10 w-10 p-0"
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Product Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {displayedProducts.map((product) => (
              <Card 
                key={product._id}
                className={`cursor-pointer transition-all duration-300 hover:shadow-xl hover:-translate-y-1 border-2 ${
                  selectedProduct?._id === product._id 
                    ? 'ring-2 ring-blue-500 border-blue-500 shadow-lg' 
                    : 'border-gray-200 hover:border-gray-300'
                }`}
                onClick={() => handleProductSelect(product)}
              >
                <CardHeader className="p-0">
                  <div className="relative group p-4">
                    <img 
                      src={product.image} 
                      alt={product.name}
                      className="w-full h-48 object-cover rounded-md group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity">
                      <Button variant="secondary" size="sm" className="h-8 w-8 p-0">
                        <Heart className="h-4 w-4" />
                      </Button>
                    </div>
                    {product.inventory <= 10 && (
                      <Badge variant="destructive" className="absolute top-3 left-3">
                        Low Stock
                      </Badge>
                    )}
                  </div>
                </CardHeader>
                <CardContent className="p-4">
                  <CardTitle className="text-lg mb-2 line-clamp-1">{product.name}</CardTitle>
                  <CardDescription className="text-sm text-gray-600 mb-3 line-clamp-2">
                    {product.description}
                  </CardDescription>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-2xl font-bold text-gray-900">${product.price.toFixed(2)}</span>
                    <div className="flex items-center space-x-1">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                      ))}
                      <span className="text-sm text-gray-500 ml-1">(4.8)</span>
                    </div>
                  </div>
                  <Badge variant={product.inventory > 10 ? "default" : "destructive"} className="text-xs">
                    {product.inventory > 10 
                      ? `${product.inventory} in stock` 
                      : `Only ${product.inventory} left`}
                  </Badge>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Pagination Dots */}
          <div className="flex justify-center space-x-2">
            {[...Array(maxPage + 1)].map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentPage(index)}
                className={`w-3 h-3 rounded-full transition-all ${
                  currentPage === index 
                    ? 'bg-blue-600' 
                    : 'bg-gray-300 hover:bg-gray-400'
                }`}
              />
            ))}
          </div>
        </div>

        {/* Product Details Section */}
        {selectedProduct && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Product Image */}
            <div className="space-y-4 ">
              <Card className="overflow-hidden p-4">
                <div className="aspect-square">
                  <img 
                    src={selectedProduct.image} 
                    alt={selectedProduct.name}
                    className="w-full h-full object-cover hover:scale-102 transition-transform duration-500 rounded-md"
                  />
                </div>
              </Card>
            </div>

            {/* Product Info */}
            <div className="space-y-6">
              <div>
                <h1 className="text-3xl font-bold text-gray-900 mb-3">{selectedProduct.name}</h1>
                <div className="flex items-center space-x-4 mb-4">
                  <span className="text-4xl font-bold text-gray-900">${selectedProduct.price.toFixed(2)}</span>
                  <div className="flex items-center space-x-1">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                    ))}
                    <span className="text-gray-600 ml-2">(128 reviews)</span>
                  </div>
                </div>
                <p className="text-gray-600 text-lg leading-relaxed">
                  {selectedProduct.description}
                </p>
              </div>

              {/* Variants */}
              <div className="space-y-4">
                {selectedProduct.variants.map((variant) => (
                  <div key={variant.type}>
                    <Label className="text-base font-semibold">{variant.type}</Label>
                    <Select
                      value={selectedVariants[variant.type]}
                      onValueChange={(value) => 
                        setSelectedVariants(prev => ({ ...prev, [variant.type]: value }))
                      }
                    >
                      <SelectTrigger className="w-full mt-2">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {variant.options.map((option) => (
                          <SelectItem key={option} value={option}>
                            {option}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                ))}

                {/* Quantity */}
                <div>
                  <Label className="text-base font-semibold">Quantity</Label>
                  <Select
                    value={quantity.toString()}
                    onValueChange={(value) => setQuantity(parseInt(value))}
                  >
                    <SelectTrigger className="w-full mt-2">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {[1, 2, 3, 4, 5].map((num) => (
                        <SelectItem key={num} value={num.toString()}>
                          {num}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Stock Status */}
              <div className="p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center justify-between">
                  <span className="font-semibold">Availability:</span>
                  <Badge variant={selectedProduct.inventory > 10 ? "default" : "destructive"}>
                    {selectedProduct.inventory > 10 
                      ? `${selectedProduct.inventory} in stock` 
                      : `Only ${selectedProduct.inventory} left`}
                  </Badge>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="space-y-3">
                <Button 
                  className="w-full h-12 text-lg font-semibold" 
                  size="lg"
                  onClick={handleBuyNow}
                  disabled={selectedProduct.inventory < quantity}
                >
                  <ShoppingCart className="mr-3 h-5 w-5" />
                  Buy Now - ${(selectedProduct.price * quantity).toFixed(2)}
                </Button>
                <Button variant="outline" className="w-full h-12 text-lg font-semibold">
                  <Heart className="mr-3 h-5 w-5" />
                  Add to Wishlist
                </Button>
              </div>

              {/* Features */}
              <div className="border-t pt-6">
                <h3 className="font-semibold mb-3">Features:</h3>
                <ul className="space-y-2 text-gray-600">
                  <li className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                    <span>Free shipping on orders over $75</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                    <span>30-day return policy</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                    <span>Authentic products guaranteed</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}