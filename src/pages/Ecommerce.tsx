import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useCart } from '@/contexts/CartContext';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import Header from '@/components/Header';
import ProductCard from '@/components/ProductCard';
import { Product } from '@/contexts/CartContext';
import Footer from '@/components/Footer';

const Ecommerce = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Todos');
  const [sortBy, setSortBy] = useState('name');
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<string[]>(['Todos']);
  const [loading, setLoading] = useState(true);
  const { addToCart } = useCart();
  const { toast } = useToast();

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch products with categories
        const { data: productsData } = await supabase
          .from('products')
          .select(`
            *,
            categories (name)
          `)
          .order('created_at', { ascending: false });

        // Fetch categories
        const { data: categoriesData } = await supabase
          .from('categories')
          .select('name')
          .order('name');

        // Transform products data - agora com suporte a múltiplas imagens
        const transformedProducts = productsData?.map(product => ({
          id: product.id,
          name: product.name,
          description: product.description,
          price: Number(product.price),
          image: product.images?.[0] || product.image_url || '/placeholder.svg',
          images: product.images || (product.image_url ? [product.image_url] : []),
          category: product.categories?.name || 'Sem categoria'
        })) || [];

        // Transform categories data
        const categoryNames = ['Todos', ...(categoriesData?.map(cat => cat.name) || [])];

        setProducts(transformedProducts);
        setCategories(categoryNames);
      } catch (error) {
        console.error('Error fetching products:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         product.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'Todos' || product.category === selectedCategory;
    return matchesSearch && matchesCategory;
  }).sort((a, b) => {
    if (sortBy === 'price-asc') {
      return a.price - b.price;
    } else if (sortBy === 'price-desc') {
      return b.price - a.price;
    } else {
      return a.name.localeCompare(b.name);
    }
  });

  const handleAddToCart = (product: Product) => {
    addToCart(product);
    toast({
      title: "Produto adicionado!",
      description: `${product.name} foi adicionado ao carrinho.`,
    });
  };

  const handleBuyNow = (product: Product) => {
    const message = `Olá! Gostaria de comprar:\n\n*${product.name}*\nPreço: R$ ${product.price.toFixed(2).replace('.', ',')}\n\n${product.description}`;
    const whatsappUrl = `https://wa.me/5511986261007?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
  };

  return (
    <div className="min-h-screen bg-background">
      <Header onSearch={setSearchQuery} searchQuery={searchQuery} />
      
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold bg-gradient-primary bg-clip-text text-transparent mb-4">
            Loja Virtual
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Os melhores produtos de tecnologia com entrega rápida e segura
          </p>
        </div>

        {/* Filters */}
        <div className="flex flex-col md:flex-row gap-4 mb-8">
          {/* Categories Filter */}
          <div className="flex flex-wrap gap-2 justify-center md:justify-start">
            {categories.map(category => (
              <Button
                key={category}
                variant={selectedCategory === category ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedCategory(category)}
                className="transition-all duration-300"
              >
                {category}
              </Button>
            ))}
          </div>
          
          {/* Price Sort */}
          <div className="flex gap-2 justify-center md:justify-end md:ml-auto">
            <Button
              variant={sortBy === 'price-asc' ? "default" : "outline"}
              size="sm"
              onClick={() => setSortBy('price-asc')}
              className="transition-all duration-300"
            >
              Menor Preço
            </Button>
            <Button
              variant={sortBy === 'price-desc' ? "default" : "outline"}
              size="sm"
              onClick={() => setSortBy('price-desc')}
              className="transition-all duration-300"
            >
              Maior Preço
            </Button>
          </div>
        </div>

        {/* Products Grid */}
        {loading ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground text-lg">Carregando produtos...</p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredProducts.map(product => (
                <ProductCard
                  key={product.id}
                  product={product}
                  onAddToCart={handleAddToCart}
                  onBuyNow={handleBuyNow}
                />
              ))}
            </div>

            {filteredProducts.length === 0 && !loading && (
              <div className="text-center py-12">
                <p className="text-muted-foreground text-lg">
                  Nenhum produto encontrado com os filtros selecionados.
                </p>
              </div>
            )}
          </>
        )}
      </div>
      <Footer />
    </div>
  );
};

export default Ecommerce;