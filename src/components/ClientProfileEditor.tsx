import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Edit, Calendar, CreditCard, Settings, Crown, Zap } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';

interface Plan {
  id: string;
  name: string;
  description: string;
  price: number;
  duration_months: number;
}

const ClientProfileEditor = () => {
  const { user, updateUser } = useAuth();
  const { toast } = useToast();
  const [isProfileDialogOpen, setIsProfileDialogOpen] = useState(false);
  const [isSubscriptionDialogOpen, setIsSubscriptionDialogOpen] = useState(false);
  const [isChangePlanDialogOpen, setIsChangePlanDialogOpen] = useState(false);
  const [plans, setPlans] = useState<Plan[]>([]);
  const [userSubscription, setUserSubscription] = useState<any>(null);
  const [profileData, setProfileData] = useState({
    name: user?.name || '',
    email: user?.email || ''
  });
  const [subscriptionData, setSubscriptionData] = useState({
    planId: '',
    paymentDate: '',
    paymentMethod: 'Cartão de Crédito'
  });

  useEffect(() => {
    loadPlans();
    loadUserSubscription();
  }, [user]);

  const loadPlans = async () => {
    try {
      const { data, error } = await supabase
        .from('iptv_plans')
        .select('*')
        .order('duration_months');
      
      if (error) throw error;
      setPlans(data || []);
    } catch (error) {
      console.error('Error loading plans:', error);
    }
  };

  const loadUserSubscription = async () => {
    if (!user) return;
    
    try {
      const { data, error } = await supabase
        .from('user_subscriptions')
        .select(`
          *,
          iptv_plans (name, price, duration_months)
        `)
        .eq('user_id', user.id)
        .eq('status', 'active')
        .maybeSingle();
      
      if (error) throw error;
      setUserSubscription(data);
    } catch (error) {
      console.error('Error loading subscription:', error);
    }
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(price);
  };

  const handleUpdateProfile = async () => {
    try {
      const success = await updateUser({
        name: profileData.name,
        email: profileData.email
      });

      if (success) {
        toast({
          title: "Sucesso",
          description: "Perfil atualizado com sucesso",
        });
        setIsProfileDialogOpen(false);
      } else {
        throw new Error('Falha ao atualizar perfil');
      }
    } catch (error) {
      console.error('Error updating profile:', error);
      toast({
        title: "Erro",
        description: "Erro ao atualizar perfil",
        variant: "destructive",
      });
    }
  };

  const handleCreateSubscription = async () => {
    if (!user) return;
    
    try {
      if (!subscriptionData.planId || !subscriptionData.paymentDate) {
        toast({
          title: "Erro",
          description: "Preencha todos os campos obrigatórios",
          variant: "destructive",
        });
        return;
      }

      const { error } = await supabase
        .from('user_subscriptions')
        .insert({
          user_id: user.id,
          plan_id: subscriptionData.planId,
          payment_method: subscriptionData.paymentMethod,
          status: 'active',
          next_payment_date: subscriptionData.paymentDate
        });

      if (error) throw error;

      toast({
        title: "Sucesso",
        description: "Assinatura criada com sucesso",
      });

      setIsSubscriptionDialogOpen(false);
      loadUserSubscription();
    } catch (error) {
      console.error('Error creating subscription:', error);
      toast({
        title: "Erro",
        description: "Erro ao criar assinatura",
        variant: "destructive",
      });
    }
  };

  const handleChangePlan = async () => {
    if (!user || !userSubscription) return;
    
    try {
      if (!subscriptionData.planId) {
        toast({
          title: "Erro",
          description: "Selecione um plano",
          variant: "destructive",
        });
        return;
      }

      const { error } = await supabase
        .from('user_subscriptions')
        .update({
          plan_id: subscriptionData.planId,
          next_payment_date: subscriptionData.paymentDate || userSubscription.next_payment_date
        })
        .eq('id', userSubscription.id);

      if (error) throw error;

      toast({
        title: "Sucesso",
        description: "Plano alterado com sucesso",
      });

      setIsChangePlanDialogOpen(false);
      loadUserSubscription();
    } catch (error) {
      console.error('Error changing plan:', error);
      toast({
        title: "Erro",
        description: "Erro ao alterar plano",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="space-y-6">
      {/* Profile Management */}
      <Card className="bg-gradient-card border-border/50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Edit className="w-5 h-5 text-primary" />
            Gerenciar Perfil
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-muted-foreground">Nome</p>
              <p className="font-medium text-foreground">{user?.name}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Email</p>
              <p className="font-medium text-foreground">{user?.email}</p>
            </div>
          </div>
          
          <Dialog open={isProfileDialogOpen} onOpenChange={setIsProfileDialogOpen}>
            <DialogTrigger asChild>
              <Button variant="outline" className="w-full">
                <Edit className="w-4 h-4 mr-2" />
                Editar Perfil
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Editar Perfil</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="name">Nome</Label>
                  <Input
                    id="name"
                    value={profileData.name}
                    onChange={(e) => setProfileData(prev => ({ ...prev, name: e.target.value }))}
                  />
                </div>
                <div>
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={profileData.email}
                    onChange={(e) => setProfileData(prev => ({ ...prev, email: e.target.value }))}
                  />
                </div>
                <div className="flex gap-2">
                  <Button onClick={handleUpdateProfile} className="flex-1">
                    Salvar
                  </Button>
                  <Button variant="outline" onClick={() => setIsProfileDialogOpen(false)} className="flex-1">
                    Cancelar
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </CardContent>
      </Card>

      {/* Subscription Management */}
      <Card className="bg-gradient-card border-border/50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Crown className="w-5 h-5 text-accent" />
            Gerenciar Assinatura IPTV
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {userSubscription ? (
            <div className="space-y-4">
              <div className="p-4 bg-secondary/20 rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-semibold text-lg">{userSubscription.iptv_plans?.name}</h3>
                  <Badge className="bg-success text-success-foreground">Ativo</Badge>
                </div>
                <div className="grid md:grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-muted-foreground">Valor Mensal:</p>
                    <p className="font-bold text-primary">{formatPrice(userSubscription.iptv_plans?.price || 0)}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Próximo Pagamento:</p>
                    <p className="font-medium">{new Date(userSubscription.next_payment_date).toLocaleDateString('pt-BR')}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Método de Pagamento:</p>
                    <p className="font-medium">{userSubscription.payment_method}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Duração:</p>
                    <p className="font-medium">{userSubscription.iptv_plans?.duration_months} mês(es)</p>
                  </div>
                </div>
              </div>
              
              <div className="flex gap-2">
                <Dialog open={isChangePlanDialogOpen} onOpenChange={setIsChangePlanDialogOpen}>
                  <DialogTrigger asChild>
                    <Button variant="outline" className="flex-1">
                      <Settings className="w-4 h-4 mr-2" />
                      Alterar Plano
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Alterar Plano</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4">
                      <div>
                        <Label htmlFor="newPlan">Novo Plano</Label>
                        <Select value={subscriptionData.planId} onValueChange={(value) => setSubscriptionData(prev => ({ ...prev, planId: value }))}>
                          <SelectTrigger>
                            <SelectValue placeholder="Selecione um plano" />
                          </SelectTrigger>
                          <SelectContent>
                            {plans.map(plan => (
                              <SelectItem key={plan.id} value={plan.id}>
                                {plan.name} - {formatPrice(plan.price)} ({plan.duration_months} mês{plan.duration_months > 1 ? 'es' : ''})
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label htmlFor="newPaymentDate">Nova Data de Pagamento (opcional)</Label>
                        <Input
                          id="newPaymentDate"
                          type="date"
                          value={subscriptionData.paymentDate}
                          onChange={(e) => setSubscriptionData(prev => ({ ...prev, paymentDate: e.target.value }))}
                        />
                      </div>
                      <div className="flex gap-2">
                        <Button onClick={handleChangePlan} className="flex-1">
                          Alterar Plano
                        </Button>
                        <Button variant="outline" onClick={() => setIsChangePlanDialogOpen(false)} className="flex-1">
                          Cancelar
                        </Button>
                      </div>
                    </div>
                  </DialogContent>
                </Dialog>
              </div>
            </div>
          ) : (
            <div className="text-center py-6">
              <Zap className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground mb-4">Você ainda não possui uma assinatura IPTV ativa</p>
              
              <Dialog open={isSubscriptionDialogOpen} onOpenChange={setIsSubscriptionDialogOpen}>
                <DialogTrigger asChild>
                  <Button variant="gradient">
                    <Crown className="w-4 h-4 mr-2" />
                    Assinar Plano IPTV
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Assinar Plano IPTV</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="plan">Plano</Label>
                      <Select value={subscriptionData.planId} onValueChange={(value) => setSubscriptionData(prev => ({ ...prev, planId: value }))}>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione um plano" />
                        </SelectTrigger>
                        <SelectContent>
                          {plans.map(plan => (
                            <SelectItem key={plan.id} value={plan.id}>
                              {plan.name} - {formatPrice(plan.price)} ({plan.duration_months} mês{plan.duration_months > 1 ? 'es' : ''})
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="paymentDate">Data do Primeiro Pagamento</Label>
                      <Input
                        id="paymentDate"
                        type="date"
                        value={subscriptionData.paymentDate}
                        onChange={(e) => setSubscriptionData(prev => ({ ...prev, paymentDate: e.target.value }))}
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="paymentMethod">Método de Pagamento</Label>
                      <Select value={subscriptionData.paymentMethod} onValueChange={(value) => setSubscriptionData(prev => ({ ...prev, paymentMethod: value }))}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Cartão de Crédito">Cartão de Crédito</SelectItem>
                          <SelectItem value="Cartão de Débito">Cartão de Débito</SelectItem>
                          <SelectItem value="PIX">PIX</SelectItem>
                          <SelectItem value="Boleto">Boleto</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="flex gap-2">
                      <Button onClick={handleCreateSubscription} className="flex-1">
                        Assinar
                      </Button>
                      <Button variant="outline" onClick={() => setIsSubscriptionDialogOpen(false)} className="flex-1">
                        Cancelar
                      </Button>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default ClientProfileEditor;