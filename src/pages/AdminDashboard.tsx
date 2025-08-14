import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { 
  DollarSign, 
  Package, 
  Users, 
  TrendingUp, 
  Plus, 
  Edit, 
  Trash2,
  BarChart3 
} from 'lucide-react';
import Header from '@/components/Header';

const AdminDashboard = () => {
  const { user } = useAuth();
  const [newProduct, setNewProduct] = useState({
    name: '',
    description: '',
    price: '',
    category: '',
    image: '',
    link: ''
  });

  // Mock data para estatísticas
  const stats = {
    totalRevenue: 45320.50,
    totalOrders: 156,
    totalUsers: 432,
    growthRate: 12.5
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(price);
  };

  const handleCreateProduct = (e: React.FormEvent) => {
    e.preventDefault();
    // Aqui seria implementada a criação do produto
    alert('Produto criado com sucesso! (Mock)');
    setNewProduct({
      name: '',
      description: '',
      price: '',
      category: '',
      image: '',
      link: ''
    });
  };

  const recentOrders = [
    { id: '#001', customer: 'João Silva', total: 2299.99, status: 'Processando' },
    { id: '#002', customer: 'Maria Santos', total: 299.99, status: 'Entregue' },
    { id: '#003', customer: 'Pedro Costa', total: 1899.99, status: 'Em trânsito' }
  ];

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
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview">Visão Geral</TabsTrigger>
            <TabsTrigger value="products">Produtos</TabsTrigger>
            <TabsTrigger value="blog">Blog</TabsTrigger>
            <TabsTrigger value="orders">Pedidos</TabsTrigger>
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
                    {recentOrders.map(order => (
                      <div key={order.id} className="flex items-center justify-between p-3 bg-secondary/30 rounded-lg">
                        <div>
                          <p className="font-semibold">{order.id}</p>
                          <p className="text-sm text-muted-foreground">{order.customer}</p>
                        </div>
                        <div className="text-right">
                          <p className="font-bold">{formatPrice(order.total)}</p>
                          <Badge variant="secondary" className="text-xs">
                            {order.status}
                          </Badge>
                        </div>
                      </div>
                    ))}
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
                <form onSubmit={handleCreateProduct} className="space-y-4">
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
                      <Input
                        id="productCategory"
                        value={newProduct.category}
                        onChange={(e) => setNewProduct(prev => ({ ...prev, category: e.target.value }))}
                        placeholder="Ex: Smartphones"
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="productImage">URL da Imagem</Label>
                      <Input
                        id="productImage"
                        value={newProduct.image}
                        onChange={(e) => setNewProduct(prev => ({ ...prev, image: e.target.value }))}
                        placeholder="https://..."
                        required
                      />
                    </div>
                  </div>
                  <Button type="submit" variant="default" className="w-full">
                    <Plus className="w-4 h-4 mr-2" />
                    Criar Produto
                  </Button>
                </form>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="blog" className="space-y-6">
            <Card className="bg-gradient-card border-border/50">
              <CardHeader>
                <CardTitle>Criar Produto do Blog</CardTitle>
              </CardHeader>
              <CardContent>
                <form className="space-y-4">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="blogProductName">Título</Label>
                      <Input
                        id="blogProductName"
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
                        placeholder="0.00"
                        required
                      />
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="blogProductDescription">Descrição</Label>
                    <Textarea
                      id="blogProductDescription"
                      placeholder="Descreva o produto/serviço..."
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="blogProductLink">Link Externo</Label>
                    <Input
                      id="blogProductLink"
                      placeholder="https://link-do-produto.com"
                      required
                    />
                  </div>
                  <Button type="submit" variant="default" className="w-full">
                    <Plus className="w-4 h-4 mr-2" />
                    Criar Produto do Blog
                  </Button>
                </form>
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
                  {recentOrders.map(order => (
                    <div key={order.id} className="flex items-center justify-between p-4 bg-secondary/30 rounded-lg">
                      <div>
                        <p className="font-semibold">{order.id}</p>
                        <p className="text-sm text-muted-foreground">{order.customer}</p>
                        <Badge variant="secondary" className="mt-1">
                          {order.status}
                        </Badge>
                      </div>
                      <div className="flex items-center gap-2">
                        <p className="font-bold">{formatPrice(order.total)}</p>
                        <Button variant="outline" size="sm">
                          <Edit className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default AdminDashboard;