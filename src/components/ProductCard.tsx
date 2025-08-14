import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ShoppingCart, ExternalLink } from 'lucide-react';
import { Product } from '@/contexts/CartContext';

interface ProductCardProps {
  product: Product;
  onAddToCart?: (product: Product) => void;
  onBuyNow?: (product: Product) => void;
  isBlogProduct?: boolean;
}

const ProductCard: React.FC<ProductCardProps> = ({ 
  product, 
  onAddToCart, 
  onBuyNow, 
  isBlogProduct = false 
}) => {
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(price);
  };

  const handleAddToCart = () => {
    onAddToCart?.(product);
  };

  const handleBuyNow = () => {
    if (isBlogProduct && product.link) {
      window.open(product.link, '_blank');
    } else {
      onBuyNow?.(product);
    }
  };

  return (
    <Card className="group bg-gradient-card border-border/50 hover:shadow-card-hover transition-all duration-300 hover:-translate-y-1">
      <CardContent className="p-0">
        <div className="aspect-square overflow-hidden rounded-t-lg bg-secondary/20">
          <img
            src={product.image}
            alt={product.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
        </div>
        <div className="p-4">
          <div className="flex items-start justify-between mb-2">
            <h3 className="font-semibold text-foreground group-hover:text-primary transition-colors duration-300 line-clamp-2">
              {product.name}
            </h3>
            <Badge variant="secondary" className="ml-2 shrink-0">
              {product.category}
            </Badge>
          </div>
          <p className="text-muted-foreground text-sm mb-3 line-clamp-3">
            {product.description}
          </p>
          <p className="text-2xl font-bold text-primary">
            {formatPrice(product.price)}
          </p>
        </div>
      </CardContent>
      <CardFooter className="p-4 pt-0 flex flex-col space-y-2">
        {isBlogProduct ? (
          <Button 
            variant="gradient" 
            className="w-full" 
            onClick={handleBuyNow}
          >
            <ExternalLink className="w-4 h-4 mr-2" />
            Ver Produto
          </Button>
        ) : (
          <div className="flex space-x-2 w-full">
            <Button 
              variant="outline" 
              size="sm" 
              className="flex-1" 
              onClick={handleAddToCart}
            >
              <ShoppingCart className="w-4 h-4 mr-2" />
              Carrinho
            </Button>
            <Button 
              variant="whatsapp" 
              size="sm" 
              className="flex-1" 
              onClick={handleBuyNow}
            >
              Comprar
            </Button>
          </div>
        )}
      </CardFooter>
    </Card>
  );
};

export default ProductCard;