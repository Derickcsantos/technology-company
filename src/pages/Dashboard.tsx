import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { User, CreditCard, Calendar, Package, Star, Crown, Zap } from 'lucide-react';
import Header from '@/components/Header';
import ClientProfileEditor from '@/components/ClientProfileEditor';

const Dashboard = () => {
  const { user } = useAuth();
  const [selectedPlan, setSelectedPlan] = useState<string>('');
  const [plans, setPlans] = useState<any[]>([]);
  const [orders, setOrders] = useState<any[]>([]);
  const [userSubscription, setUserSubscription] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      if (!user) return;

      try {
        // Fetch IPTV plans
        const { data: plansData } = await supabase
          .from('iptv_plans')
          .select('*')
          .order('duration_months');

        // Transform plans data
        const transformedPlans = plansData?.map(plan => ({
          id: plan.id,
          name: plan.name,
          description: plan.description,
          price: Number(plan.price),
          interval: `${plan.duration_months} ${plan.duration_months === 1 ? 'mês' : 'meses'}`,
          features: [
            'Canais em HD e 4K',
            'Filmes e séries',
            'Suporte 24/7',
            'Múltiplas conexões'
          ]
        })) || [];

        // Fetch user orders
        const { data: ordersData } = await supabase
          .from('orders')
          .select(`
            *,
            order_items (
              *,
              products (name)
            )
          `)
          .eq('user_id', user.id)
          .order('created_at', { ascending: false })
          .limit(5);

        // Transform orders data
        const transformedOrders = ordersData?.map(order => ({
          id: order.id,
          product: order.order_items?.[0]?.products?.name || 'Produto',
          price: Number(order.total),
          status: order.status === 'pending' ? 'Pendente' : 
                 order.status === 'completed' ? 'Entregue' : 
                 order.status === 'shipped' ? 'Em trânsito' : 'Cancelado',
          date: new Date(order.created_at).toLocaleDateString('pt-BR')
        })) || [];

        // Fetch user subscription
        const { data: subscriptionData } = await supabase
          .from('user_subscriptions')
          .select(`
            *,
            iptv_plans (name, price)
          `)
          .eq('user_id', user.id)
          .eq('status', 'active')
          .maybeSingle();

        setPlans(transformedPlans);
        setOrders(transformedOrders);
        setUserSubscription(subscriptionData);
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [user]);

  const formatPrice = (price: number): string => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(price);
  };

  const handleSelectPlan = async (planId: string) => {
    if (!user) return;
    
    setSelectedPlan(planId);
    
    try {
      // Create subscription record
      const { error } = await supabase
        .from('user_subscriptions')
        .insert({
          user_id: user.id,
          plan_id: planId,
          payment_method: 'Aguardando seleção',
          status: 'pending',
          next_payment_date: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
        });

      if (error) throw error;

      alert(`Plano selecionado! Em breve você será redirecionado para o pagamento.`);
      
      // Refresh data
      window.location.reload();
    } catch (error) {
      console.error('Error selecting plan:', error);
      alert('Erro ao selecionar plano. Tente novamente.');
    }
  };

  const getStatusColor = (status: string): string => {
    switch (status) {
      case 'Entregue':
        return 'bg-success text-success-foreground';
      case 'Em trânsito':
        return 'bg-warning text-warning-foreground';
      case 'Pendente':
        return 'bg-primary text-primary-foreground';
      default:
        return 'bg-secondary text-secondary-foreground';
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <div className="container mx-auto px-4 py-8">
        {/* Welcome Message */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold bg-gradient-primary bg-clip-text text-transparent mb-4">
            Bem-vindo, {user?.name}!
          </h1>
          <p className="text-xl text-muted-foreground">
            Gerencie sua conta e explore nossos planos IPTV
          </p>
        </div>

        {loading && (
          <div className="text-center py-8">
            <p className="text-muted-foreground">Carregando dados...</p>
          </div>
        )}

        {!loading && (
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-8">
            {/* Profile & Subscription Management */}
            <div className="space-y-8">
              <ClientProfileEditor />
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* User Account Summary */}
            <Card className="bg-gradient-card border-border/50">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="w-5 h-5 text-primary" />
                  Resumo da Conta
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <p className="text-sm text-muted-foreground">Nome</p>
                  <p className="font-medium text-foreground">{user?.name}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Email</p>
                  <p className="font-medium text-foreground">{user?.email}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Tipo de conta</p>
                  <Badge variant="secondary">Cliente</Badge>
                </div>
                {userSubscription && (
                  <div>
                    <p className="text-sm text-muted-foreground">Plano Ativo</p>
                    <Badge className="bg-success text-success-foreground">
                      {userSubscription.iptv_plans?.name}
                    </Badge>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card className="bg-gradient-card border-border/50">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="w-5 h-5 text-accent" />
                  Ações Rápidas
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button variant="outline" className="w-full justify-start">
                  <CreditCard className="w-4 h-4 mr-2" />
                  Ver Histórico de Pagamentos
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <Package className="w-4 h-4 mr-2" />
                  Meus Pedidos
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <Star className="w-4 h-4 mr-2" />
                  Suporte Técnico
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      )}
    </div>
  </div>
);
};

export default Dashboard;