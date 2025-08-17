import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line, AreaChart, Area } from 'recharts';
import { supabase } from '@/integrations/supabase/client';
import { DollarSign, Users, ShoppingCart, TrendingUp } from 'lucide-react';

interface AnalyticsData {
  totalUsers: number;
  totalOrders: number;
  totalRevenue: number;
  activeSubscriptions: number;
  ordersChart: any[];
  usersChart: any[];
  revenueChart: any[];
  userTypePie: any[];
}

const Analytics = () => {
  const [data, setData] = useState<AnalyticsData>({
    totalUsers: 0,
    totalOrders: 0,
    totalRevenue: 0,
    activeSubscriptions: 0,
    ordersChart: [],
    usersChart: [],
    revenueChart: [],
    userTypePie: []
  });
  const [loading, setLoading] = useState(true);

  const loadAnalytics = async () => {
    try {
      // Usar RPCs que ignoram RLS para dados corretos
      const { data: totalUsersData } = await supabase.rpc('get_total_users');
      const { data: totalOrdersData } = await supabase.rpc('get_total_orders');
      const { data: totalRevenueData } = await supabase.rpc('get_total_revenue');
      
      const usersCount = totalUsersData || 0;
      const ordersCount = totalOrdersData || 0;
      const totalRevenue = Number(totalRevenueData) || 0;

      // Assinaturas ativas
      const { count: subscriptionsCount } = await supabase
        .from('user_subscriptions')
        .select('*', { count: 'exact', head: true })
        .eq('status', 'active');

      // Usar funções do banco para melhor performance
      const { data: monthlyRevenueData } = await supabase.rpc('get_monthly_revenue');
      const { data: userGrowthData } = await supabase.rpc('get_user_growth');
      const { data: monthlyOrdersData } = await supabase.rpc('get_monthly_orders');

      // Formatar dados de pedidos das funções do banco
      const ordersChart = monthlyOrdersData?.map(item => ({
        month: item.month,
        value: parseInt(String(item.orders))
      })) || [];
      
      // Formatar dados de receita das funções do banco
      const revenueChart = monthlyRevenueData?.map(item => ({
        month: item.month,
        value: parseFloat(String(item.revenue))
      })) || [];

      // Gráfico de usuários por tipo (manter seleção direta pois é leitura simples)
      const { data: userTypes } = await supabase
        .from('users')
        .select('tipo');

      const userTypePie = [
        { name: 'Clientes', value: userTypes?.filter(u => u.tipo === 'cliente').length || 0, color: 'hsl(var(--primary))' },
        { name: 'Admins', value: userTypes?.filter(u => u.tipo === 'admin').length || 0, color: 'hsl(var(--accent))' }
      ];

      // Formatar dados de crescimento de usuários
      const usersChart = userGrowthData?.map(item => ({
        month: item.month,
        value: parseInt(String(item.users))
      })) || [];

      setData({
        totalUsers: usersCount,
        totalOrders: ordersCount,
        totalRevenue,
        activeSubscriptions: subscriptionsCount || 0,
        ordersChart,
        usersChart,
        revenueChart,
        userTypePie
      });
    } catch (error) {
      console.error('Error loading analytics:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAnalytics();
  }, []);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(price);
  };

  if (loading) {
    return <div>Carregando analytics...</div>;
  }

  return (
    <div className="space-y-6">
      {/* Cards de estatísticas */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="bg-gradient-card border-border/50">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-muted-foreground text-sm">Total de Usuários</p>
                <p className="text-2xl font-bold text-primary">{data.totalUsers}</p>
              </div>
              <Users className="w-8 h-8 text-primary" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-card border-border/50">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-muted-foreground text-sm">Total de Pedidos</p>
                <p className="text-2xl font-bold text-primary">{data.totalOrders}</p>
              </div>
              <ShoppingCart className="w-8 h-8 text-primary" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-card border-border/50">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-muted-foreground text-sm">Receita Total</p>
                <p className="text-2xl font-bold text-primary">{formatPrice(data.totalRevenue)}</p>
              </div>
              <DollarSign className="w-8 h-8 text-primary" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-card border-border/50">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-muted-foreground text-sm">Assinaturas Ativas</p>
                <p className="text-2xl font-bold text-success">{data.activeSubscriptions}</p>
              </div>
              <TrendingUp className="w-8 h-8 text-success" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Gráficos */}
      <div className="grid lg:grid-cols-2 gap-6">
        <Card className="bg-gradient-card border-border/50">
          <CardHeader>
            <CardTitle>Pedidos por Mês</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={data.ordersChart}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="value" fill="hsl(var(--primary))" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="bg-gradient-card border-border/50">
          <CardHeader>
            <CardTitle>Receita por Mês</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={data.revenueChart}>
                <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                <XAxis dataKey="month" tick={{ fontSize: 12 }} />
                <YAxis tick={{ fontSize: 12 }} />
                <Tooltip 
                  formatter={(value) => [formatPrice(Number(value)), 'Receita']}
                  contentStyle={{ 
                    backgroundColor: 'hsl(var(--card))', 
                    border: '1px solid hsl(var(--border))',
                    borderRadius: '8px'
                  }} 
                />
                <Area 
                  type="monotone" 
                  dataKey="value" 
                  stroke="hsl(var(--success))" 
                  fill="hsl(var(--success))"
                  fillOpacity={0.3}
                  strokeWidth={2} 
                />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="bg-gradient-card border-border/50">
          <CardHeader>
            <CardTitle>Tipos de Usuário</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={data.userTypePie}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {data.userTypePie.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="bg-gradient-card border-border/50">
          <CardHeader>
            <CardTitle>Novos Usuários por Mês</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={data.usersChart}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="value" fill="hsl(var(--success))" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Analytics;