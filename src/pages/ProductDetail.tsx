import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useCart } from '@/contexts/CartContext';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import Header from '@/components/Header';
import { ArrowLeft, ShoppingCart } from 'lucide-react';
import { Product } from '@/contexts/CartContext';

const ProductDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const { addToCart } = useCart();
  const { toast } = useToast();

  useEffect(() => {
    const fetchProduct = async () => {
      if (!id) return;

      try {
        const { data, error } = await supabase
          .from('products')
          .select(`
            *,
            categories (name)
          `)
          .eq('id', id)
          .single();

        if (error || !data) {
          navigate('/ecommerce');
          return;
        }

        const transformedProduct: Product = {
          id: data.id,
          name: data.name,
          description: data.description,
          price: Number(data.price),
          image: data.image_url || '/placeholder.svg',
          category: data.categories?.name || 'Sem categoria'
        };

        setProduct(transformedProduct);
      } catch (error) {
        console.error('Error fetching product:', error);
        navigate('/ecommerce');
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id, navigate]);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(price);
  };

  const handleAddToCart = () => {
    if (product) {
      addToCart(product);
      toast({
        title: "Produto adicionado!",
        description: `${product.name} foi adicionado ao carrinho.`,
      });
    }
  };

  const handleBuyNow = () => {
    if (product) {
      const message = `Olá! Gostaria de comprar:\n\n*${product.name}*\nPreço: ${formatPrice(product.price)}\n\n${product.description}`;
      const whatsappUrl = `https://wa.me/5511952801212?text=${encodeURIComponent(message)}`;
      window.open(whatsappUrl, '_blank');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Header onSearch={() => {}} searchQuery="" />
        <div className="container mx-auto px-4 py-8">
          <div className="text-center py-12">
            <p className="text-muted-foreground text-lg">Carregando produto...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-background">
        <Header onSearch={() => {}} searchQuery="" />
        <div className="container mx-auto px-4 py-8">
          <div className="text-center py-12">
            <p className="text-muted-foreground text-lg">Produto não encontrado</p>
            <Button 
              onClick={() => navigate('/ecommerce')} 
              className="mt-4"
              variant="outline"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Voltar à loja
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header onSearch={() => {}} searchQuery="" />
      
      <div className="container mx-auto px-4 py-8">
        <Button 
          onClick={() => navigate('/ecommerce')} 
          variant="outline" 
          className="mb-6"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Voltar à loja
        </Button>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Product Image */}
          <div className="space-y-4">
            <div className="aspect-square overflow-hidden rounded-lg bg-secondary/20 border border-border/50">
              <img
                src={product.image}
                alt={product.name}
                className="w-full h-full object-cover"
              />
            </div>
          </div>

          {/* Product Info */}
          <div className="space-y-6">
            <div>
              <Badge variant="secondary" className="mb-2">
                {product.category}
              </Badge>
              <h1 className="text-3xl font-bold text-foreground mb-4">
                {product.name}
              </h1>
              <p className="text-4xl font-bold text-primary mb-6">
                {formatPrice(product.price)}
              </p>
            </div>

            <div>
              <h2 className="text-xl font-semibold mb-3">Descrição</h2>
              <p className="text-muted-foreground leading-relaxed">
                {product.description}
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-3">
              <Button 
                onClick={handleAddToCart}
                variant="outline"
                size="lg"
                className="flex-1"
              >
                <ShoppingCart className="w-4 h-4 mr-2" />
                Adicionar ao Carrinho
              </Button>
              <Button 
                onClick={handleBuyNow}
                variant="whatsapp"
                size="lg"
                className="flex-1"
              >
                Comprar Agora
              </Button>
            </div>

            <div className="pt-6 border-t border-border/50">
              <h3 className="font-medium mb-2">Informações adicionais:</h3>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• Entrega rápida e segura</li>
                <li>• Garantia do fabricante</li>
                <li>• Suporte técnico especializado</li>
                <li>• Parcelamento disponível</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;