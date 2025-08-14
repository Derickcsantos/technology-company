import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  DollarSign, 
  Package, 
  Users, 
  TrendingUp, 
  Plus, 
  Edit, 
  Trash2,
  BarChart3,
  Upload 
} from 'lucide-react';
import Header from '@/components/Header';
import UserManagement from '@/components/UserManagement';
import Analytics from '@/components/Analytics';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

const AdminDashboard = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [products, setProducts] = useState<any[]>([]);
  const [blogProducts, setBlogProducts] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingProduct, setEditingProduct] = useState<any>(null);
  const [editingBlogProduct, setEditingBlogProduct] = useState<any>(null);
  
  const [newProduct, setNewProduct] = useState({
    name: '',
    description: '',
    price: '',
    category_id: '',
    image_url: ''
  });

  const [newBlogProduct, setNewBlogProduct] = useState({
    title: '',
    description: '',
    price: '',
    external_link: '',
    image_url: ''
  });

  const [stats, setStats] = useState({
    totalRevenue: 0,
    totalOrders: 0,
    totalUsers: 0,
    growthRate: 0
  });

  const loadData = async () => {
    try {
      // Carregar produtos
      const { data: productsData } = await supabase
        .from('products')
        .select(`
          *,
          categories(name)
        `)
        .order('created_at', { ascending: false });
      
      // Carregar produtos do blog
      const { data: blogProductsData } = await supabase
        .from('blog_products')
        .select('*')
        .order('created_at', { ascending: false });

      // Carregar categorias
      const { data: categoriesData } = await supabase
        .from('categories')
        .select('*')
        .order('name');

      // Carregar pedidos
      const { data: ordersData } = await supabase
        .from('orders')
        .select(`
          *,
          users(name, email),
          order_items(
            quantity,
            unit_price,
            products(name)
          )
        `)
        .order('created_at', { ascending: false })
        .limit(10);

      // Carregar estatísticas
      const { count: usersCount } = await supabase
        .from('users')
        .select('*', { count: 'exact', head: true });

      const { count: ordersCount } = await supabase
        .from('orders')
        .select('*', { count: 'exact', head: true });

      const { data: ordersTotal } = await supabase
        .from('orders')
        .select('total');

      const totalRevenue = ordersTotal?.reduce((sum, order) => sum + Number(order.total), 0) || 0;

      setProducts(productsData || []);
      setBlogProducts(blogProductsData || []);
      setCategories(categoriesData || []);
      setOrders(ordersData || []);
      setStats({
        totalRevenue,
        totalOrders: ordersCount || 0,
        totalUsers: usersCount || 0,
        growthRate: 12.5
      });
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(price);
  };

  const handleImageUpload = async (file: File, bucket: string) => {
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${Math.random()}.${fileExt}`;
      const filePath = `${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from(bucket)
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const { data } = supabase.storage
        .from(bucket)
        .getPublicUrl(filePath);

      return data.publicUrl;
    } catch (error) {
      console.error('Error uploading image:', error);
      toast({
        title: "Erro",
        description: "Erro ao fazer upload da imagem",
        variant: "destructive",
      });
      return null;
    }
  };

  const handleCreateProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const { error } = await supabase
        .from('products')
        .insert({
          name: newProduct.name,
          description: newProduct.description,
          price: parseFloat(newProduct.price),
          category_id: newProduct.category_id,
          image_url: newProduct.image_url
        });

      if (error) throw error;

      toast({
        title: "Sucesso",
        description: "Produto criado com sucesso",
      });

      setNewProduct({
        name: '',
        description: '',
        price: '',
        category_id: '',
        image_url: ''
      });
      loadData();
    } catch (error) {
      console.error('Error creating product:', error);
      toast({
        title: "Erro",
        description: "Erro ao criar produto",
        variant: "destructive",
      });
    }
  };

  const handleUpdateProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingProduct) return;

    try {
      const { error } = await supabase
        .from('products')
        .update({
          name: newProduct.name,
          description: newProduct.description,
          price: parseFloat(newProduct.price),
          category_id: newProduct.category_id,
          image_url: newProduct.image_url
        })
        .eq('id', editingProduct.id);

      if (error) throw error;

      toast({
        title: "Sucesso",
        description: "Produto atualizado com sucesso",
      });

      setEditingProduct(null);
      setNewProduct({
        name: '',
        description: '',
        price: '',
        category_id: '',
        image_url: ''
      });
      loadData();
    } catch (error) {
      console.error('Error updating product:', error);
      toast({
        title: "Erro",
        description: "Erro ao atualizar produto",
        variant: "destructive",
      });
    }
  };

  const handleDeleteProduct = async (productId: string) => {
    if (!confirm('Tem certeza que deseja excluir este produto?')) return;

    try {
      const { error } = await supabase
        .from('products')
        .delete()
        .eq('id', productId);

      if (error) throw error;

      toast({
        title: "Sucesso",
        description: "Produto excluído com sucesso",
      });

      loadData();
    } catch (error) {
      console.error('Error deleting product:', error);
      toast({
        title: "Erro",
        description: "Erro ao excluir produto",
        variant: "destructive",
      });
    }
  };

  const handleCreateBlogProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const { error } = await supabase
        .from('blog_products')
        .insert({
          title: newBlogProduct.title,
          description: newBlogProduct.description,
          price: newBlogProduct.price ? parseFloat(newBlogProduct.price) : null,
          external_link: newBlogProduct.external_link,
          image_url: newBlogProduct.image_url
        });

      if (error) throw error;

      toast({
        title: "Sucesso",
        description: "Produto do blog criado com sucesso",
      });

      setNewBlogProduct({
        title: '',
        description: '',
        price: '',
        external_link: '',
        image_url: ''
      });
      loadData();
    } catch (error) {
      console.error('Error creating blog product:', error);
      toast({
        title: "Erro",
        description: "Erro ao criar produto do blog",
        variant: "destructive",
      });
    }
  };

  const startEditProduct = (product: any) => {
    setEditingProduct(product);
    setNewProduct({
      name: product.name,
      description: product.description,
      price: product.price.toString(),
      category_id: product.category_id,
      image_url: product.image_url || ''
    });
  };

  const cancelEdit = () => {
    setEditingProduct(null);
    setNewProduct({
      name: '',
      description: '',
      price: '',
      category_id: '',
      image_url: ''
    });
  };

  if (loading) {
    return <div>Carregando...</div>;
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <div className="container mx-auto px-4 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">
            Painel Administrativo
          </h1>
          <p className="text-muted-foreground">
            Bem-vindo, {user?.name}! Gerencie sua loja e vendas
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="bg-gradient-card border-border/50">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-muted-foreground text-sm">Receita Total</p>
                  <p className="text-2xl font-bold text-primary">
                    {formatPrice(stats.totalRevenue)}
                  </p>
                </div>
                <DollarSign className="w-8 h-8 text-primary" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-card border-border/50">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-muted-foreground text-sm">Total de Pedidos</p>
                  <p className="text-2xl font-bold text-primary">
                    {stats.totalOrders}
                  </p>
                </div>
                <Package className="w-8 h-8 text-primary" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-card border-border/50">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-muted-foreground text-sm">Usuários</p>
                  <p className="text-2xl font-bold text-primary">
                    {stats.totalUsers}
                  </p>
                </div>
                <Users className="w-8 h-8 text-primary" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-card border-border/50">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-muted-foreground text-sm">Crescimento</p>
                  <p className="text-2xl font-bold text-success">
                    +{stats.growthRate}%
                  </p>
                </div>
                <TrendingUp className="w-8 h-8 text-success" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="grid w-full grid-cols-6">
            <TabsTrigger value="overview">Visão Geral</TabsTrigger>
            <TabsTrigger value="products">Produtos</TabsTrigger>
            <TabsTrigger value="blog">Blog</TabsTrigger>
            <TabsTrigger value="orders">Pedidos</TabsTrigger>
            <TabsTrigger value="users">Usuários</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <div className="grid lg:grid-cols-2 gap-6">
              <Card className="bg-gradient-card border-border/50">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <BarChart3 className="w-5 h-5" />
                    Pedidos Recentes
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {orders.slice(0, 5).map(order => (
                      <div key={order.id} className="flex items-center justify-between p-3 bg-secondary/30 rounded-lg">
                        <div>
                          <p className="font-semibold">#{order.id.slice(0, 8)}</p>
                          <p className="text-sm text-muted-foreground">{order.users?.name}</p>
                        </div>
                        <div className="text-right">
                          <p className="font-bold">{formatPrice(order.total)}</p>
                          <Badge variant="secondary" className="text-xs">
                            {order.status}
                          </Badge>
                        </div>
                      </div>
                    ))}
                    {orders.length === 0 && (
                      <p className="text-center text-muted-foreground py-4">
                        Nenhum pedido encontrado
                      </p>
                    )}
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gradient-card border-border/50">
                <CardHeader>
                  <CardTitle>Ações Rápidas</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <Button variant="outline" className="w-full justify-start">
                    <Plus className="w-4 h-4 mr-2" />
                    Adicionar Produto
                  </Button>
                  <Button variant="outline" className="w-full justify-start">
                    <Edit className="w-4 h-4 mr-2" />
                    Editar Blog Post
                  </Button>
                  <Button variant="outline" className="w-full justify-start">
                    <BarChart3 className="w-4 h-4 mr-2" />
                    Ver Relatórios
                  </Button>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="products" className="space-y-6">
            <Card className="bg-gradient-card border-border/50">
              <CardHeader>
                <CardTitle>Criar Novo Produto (E-commerce)</CardTitle>
              </CardHeader>
                <CardContent>
                  <form onSubmit={editingProduct ? handleUpdateProduct : handleCreateProduct} className="space-y-4">
                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="productName">Nome do Produto</Label>
                        <Input
                          id="productName"
                          value={newProduct.name}
                          onChange={(e) => setNewProduct(prev => ({ ...prev, name: e.target.value }))}
                          placeholder="Ex: Smartphone Premium"
                          required
                        />
                      </div>
                      <div>
                        <Label htmlFor="productPrice">Preço (R$)</Label>
                        <Input
                          id="productPrice"
                          type="number"
                          step="0.01"
                          value={newProduct.price}
                          onChange={(e) => setNewProduct(prev => ({ ...prev, price: e.target.value }))}
                          placeholder="0.00"
                          required
                        />
                      </div>
                    </div>
                    <div>
                      <Label htmlFor="productDescription">Descrição</Label>
                      <Textarea
                        id="productDescription"
                        value={newProduct.description}
                        onChange={(e) => setNewProduct(prev => ({ ...prev, description: e.target.value }))}
                        placeholder="Descreva o produto..."
                        required
                      />
                    </div>
                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="productCategory">Categoria</Label>
                        <Select 
                          value={newProduct.category_id} 
                          onValueChange={(value) => setNewProduct(prev => ({ ...prev, category_id: value }))}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Selecione uma categoria" />
                          </SelectTrigger>
                          <SelectContent>
                            {categories.map(category => (
                              <SelectItem key={category.id} value={category.id}>
                                {category.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label htmlFor="productImage">URL da Imagem</Label>
                        <Input
                          id="productImage"
                          value={newProduct.image_url}
                          onChange={(e) => setNewProduct(prev => ({ ...prev, image_url: e.target.value }))}
                          placeholder="https://..."
                        />
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button type="submit" variant="default" className="flex-1">
                        <Plus className="w-4 h-4 mr-2" />
                        {editingProduct ? 'Atualizar Produto' : 'Criar Produto'}
                      </Button>
                      {editingProduct && (
                        <Button type="button" variant="outline" onClick={cancelEdit}>
                          Cancelar
                        </Button>
                      )}
                    </div>
                  </form>
                  
                  {/* Lista de produtos */}
                  <div className="mt-8">
                    <h3 className="text-lg font-semibold mb-4">Produtos Existentes</h3>
                    <div className="space-y-3">
                      {products.map(product => (
                        <div key={product.id} className="flex items-center justify-between p-4 bg-secondary/30 rounded-lg">
                          <div>
                            <p className="font-semibold">{product.name}</p>
                            <p className="text-sm text-muted-foreground">{product.categories?.name}</p>
                            <p className="text-sm font-bold">{formatPrice(product.price)}</p>
                          </div>
                          <div className="flex items-center gap-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => startEditProduct(product)}
                            >
                              <Edit className="w-4 h-4" />
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleDeleteProduct(product.id)}
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="blog" className="space-y-6">
            <Card className="bg-gradient-card border-border/50">
              <CardHeader>
                <CardTitle>Criar Produto do Blog</CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleCreateBlogProduct} className="space-y-4">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="blogProductName">Título</Label>
                      <Input
                        id="blogProductName"
                        value={newBlogProduct.title}
                        onChange={(e) => setNewBlogProduct(prev => ({ ...prev, title: e.target.value }))}
                        placeholder="Ex: Curso de Marketing Digital"
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="blogProductPrice">Preço (R$)</Label>
                      <Input
                        id="blogProductPrice"
                        type="number"
                        step="0.01"
                        value={newBlogProduct.price}
                        onChange={(e) => setNewBlogProduct(prev => ({ ...prev, price: e.target.value }))}
                        placeholder="0.00"
                      />
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="blogProductDescription">Descrição</Label>
                    <Textarea
                      id="blogProductDescription"
                      value={newBlogProduct.description}
                      onChange={(e) => setNewBlogProduct(prev => ({ ...prev, description: e.target.value }))}
                      placeholder="Descreva o produto/serviço..."
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="blogProductLink">Link Externo</Label>
                    <Input
                      id="blogProductLink"
                      value={newBlogProduct.external_link}
                      onChange={(e) => setNewBlogProduct(prev => ({ ...prev, external_link: e.target.value }))}
                      placeholder="https://link-do-produto.com"
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="blogProductImage">URL da Imagem</Label>
                    <Input
                      id="blogProductImage"
                      value={newBlogProduct.image_url}
                      onChange={(e) => setNewBlogProduct(prev => ({ ...prev, image_url: e.target.value }))}
                      placeholder="https://..."
                    />
                  </div>
                  <Button type="submit" variant="default" className="w-full">
                    <Plus className="w-4 h-4 mr-2" />
                    Criar Produto do Blog
                  </Button>
                </form>
                
                {/* Lista de produtos do blog */}
                <div className="mt-8">
                  <h3 className="text-lg font-semibold mb-4">Produtos do Blog Existentes</h3>
                  <div className="space-y-3">
                    {blogProducts.map(product => (
                      <div key={product.id} className="flex items-center justify-between p-4 bg-secondary/30 rounded-lg">
                        <div>
                          <p className="font-semibold">{product.title}</p>
                          <p className="text-sm text-muted-foreground">{product.description}</p>
                          {product.price && (
                            <p className="text-sm font-bold">{formatPrice(product.price)}</p>
                          )}
                        </div>
                        <div className="flex items-center gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => window.open(product.external_link, '_blank')}
                          >
                            Ver
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="orders" className="space-y-6">
            <Card className="bg-gradient-card border-border/50">
              <CardHeader>
                <CardTitle>Gerenciar Pedidos</CardTitle>
              </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {orders.map(order => (
                      <div key={order.id} className="flex items-center justify-between p-4 bg-secondary/30 rounded-lg">
                        <div>
                          <p className="font-semibold">#{order.id.slice(0, 8)}</p>
                          <p className="text-sm text-muted-foreground">{order.users?.name}</p>
                          <p className="text-xs text-muted-foreground">{order.users?.email}</p>
                          <Badge variant="secondary" className="mt-1">
                            {order.status}
                          </Badge>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="text-right">
                            <p className="font-bold">{formatPrice(order.total)}</p>
                            <p className="text-xs text-muted-foreground">
                              {new Date(order.created_at).toLocaleDateString('pt-BR')}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))}
                    {orders.length === 0 && (
                      <p className="text-center text-muted-foreground py-8">
                        Nenhum pedido encontrado
                      </p>
                    )}
                  </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="users" className="space-y-6">
            <UserManagement />
          </TabsContent>

          <TabsContent value="analytics" className="space-y-6">
            <Analytics />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default AdminDashboard;