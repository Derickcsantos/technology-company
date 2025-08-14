import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { plans } from '@/data/mockData';
import { Package, CreditCard, User, Calendar } from 'lucide-react';
import Header from '@/components/Header';

const Dashboard = () => {
  const { user } = useAuth();
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null);

  // Mock data para pedidos do cliente
  const orders = [
    {
      id: '#001',
      date: '2024-01-15',
      status: 'Entregue',
      total: 2299.99,
      items: ['Smartphone Galaxy Pro']
    },
    {
      id: '#002',
      date: '2024-01-10',
      status: 'Em trânsito',
      total: 299.99,
      items: ['Fone Bluetooth Premium']
    }
  ];

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(price);
  };

  const handleSelectPlan = (planId: string) => {
    setSelectedPlan(planId);
    // Aqui seria integrado com Pagar.me
    alert(`Plano ${planId} selecionado! Integração com Pagar.me seria implementada aqui.`);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Entregue':
        return 'bg-success text-success-foreground';
      case 'Em trânsito':
        return 'bg-warning text-warning-foreground';
      case 'Processando':
        return 'bg-primary text-primary-foreground';
      default:
        return 'bg-secondary text-secondary-foreground';
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <div className="container mx-auto px-4 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">
            Bem-vindo, {user?.name}!
          </h1>
          <p className="text-muted-foreground">
            Gerencie seus pedidos e assinaturas
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Meus Pedidos */}
          <div className="lg:col-span-2 space-y-6">
            <Card className="bg-gradient-card border-border/50">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Package className="w-5 h-5" />
                  Meus Pedidos
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {orders.map(order => (
                    <div key={order.id} className="flex items-center justify-between p-4 bg-secondary/30 rounded-lg">
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-semibold">{order.id}</span>
                          <Badge className={getStatusColor(order.status)}>
                            {order.status}
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground mb-1">
                          {new Date(order.date).toLocaleDateString('pt-BR')}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {order.items.join(', ')}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-primary">
                          {formatPrice(order.total)}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Planos IPTV */}
            <Card className="bg-gradient-card border-border/50">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CreditCard className="w-5 h-5" />
                  Planos IPTV Premium
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-3 gap-4">
                  {plans.map(plan => (
                    <div key={plan.id} className="border rounded-lg p-4 hover:shadow-card transition-all duration-300">
                      <h3 className="font-semibold text-lg mb-2">{plan.name}</h3>
                      <p className="text-muted-foreground text-sm mb-3">{plan.description}</p>
                      <p className="text-2xl font-bold text-primary mb-4">
                        {formatPrice(plan.price)}
                        <span className="text-sm text-muted-foreground">/{plan.interval}</span>
                      </p>
                      <ul className="text-sm space-y-1 mb-4">
                        {plan.features.map((feature, index) => (
                          <li key={index} className="text-muted-foreground">
                            • {feature}
                          </li>
                        ))}
                      </ul>
                      <Button 
                        variant={plan.id === 'anual' ? 'default' : 'outline'} 
                        className="w-full"
                        onClick={() => handleSelectPlan(plan.id)}
                      >
                        Assinar Plano
                      </Button>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar - Informações do Usuário */}
          <div className="space-y-6">
            <Card className="bg-gradient-card border-border/50">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="w-5 h-5" />
                  Minha Conta
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <p className="text-sm text-muted-foreground">Nome</p>
                  <p className="font-medium">{user?.name}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Email</p>
                  <p className="font-medium">{user?.email}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Tipo de conta</p>
                  <Badge variant="secondary">Cliente</Badge>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-card border-border/50">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="w-5 h-5" />
                  Assinatura Ativa
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground text-sm mb-2">
                  Nenhuma assinatura ativa
                </p>
                <Button variant="outline" size="sm" className="w-full">
                  Contratar Plano
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;