import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useNavigate, Link } from 'react-router-dom';
import { LogIn, ArrowLeft, UserPlus } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [isRegister, setIsRegister] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (isRegister) {
        await handleRegister();
      } else {
        const success = await login(email, password);
        if (success) {
          navigate('/dashboard');
        } else {
          setError('Email ou senha incorretos');
        }
      }
    } catch (err) {
      setError('Erro ao processar solicitação. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async () => {
    if (!name.trim()) {
      setError('Nome é obrigatório');
      return;
    }

    // Hash da senha (mesma lógica do AuthContext)
    const hashPassword = (password: string): string => {
      return btoa(password);
    };

    const hashedPassword = hashPassword(password);

    // Inserir usuário no banco de dados
    const { error } = await supabase
      .from('users')
      .insert({
        email,
        password_hash: hashedPassword,
        name,
        tipo: 'cliente'
      });

    if (error) {
      if (error.code === '23505') {
        setError('Este email já está cadastrado');
      } else {
        setError('Erro ao criar conta. Tente novamente.');
      }
      return;
    }

    // Fazer login automático após registro
    const success = await login(email, password);
    if (success) {
      navigate('/dashboard');
    } else {
      setError('Conta criada! Faça login para continuar.');
      setIsRegister(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-hero flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center text-white hover:text-white/80 transition-colors mb-4">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Voltar ao início
          </Link>
          <h1 className="text-3xl font-bold text-white mb-2">
            {isRegister ? 'Criar Conta' : 'Bem-vindo de volta'}
          </h1>
          <p className="text-white/80">
            {isRegister ? 'Crie sua conta para começar' : 'Entre na sua conta para continuar'}
          </p>
        </div>

        <Card className="bg-card/95 backdrop-blur-sm border-border/50 shadow-card-hover">
          <CardHeader>
            <CardTitle className="text-center flex items-center justify-center gap-2">
              {isRegister ? <UserPlus className="w-5 h-5" /> : <LogIn className="w-5 h-5" />}
              {isRegister ? 'Criar Conta' : 'Entrar'}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              {isRegister && (
                <div className="space-y-2">
                  <Label htmlFor="name">Nome Completo</Label>
                  <Input
                    id="name"
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Seu nome completo"
                    required
                    className="bg-secondary/50 border-border/50 focus:bg-background transition-all duration-300"
                  />
                </div>
              )}

              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="seu@email.com"
                  required
                  className="bg-secondary/50 border-border/50 focus:bg-background transition-all duration-300"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Senha</Label>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  minLength={6}
                  className="bg-secondary/50 border-border/50 focus:bg-background transition-all duration-300"
                />
                {isRegister && (
                  <p className="text-xs text-muted-foreground">Mínimo 6 caracteres</p>
                )}
              </div>

              {error && (
                <Alert className="border-destructive/50 bg-destructive/10">
                  <AlertDescription className="text-destructive">
                    {error}
                  </AlertDescription>
                </Alert>
              )}

              <Button 
                type="submit" 
                className="w-full" 
                variant="gradient"
                disabled={loading}
                size="lg"
              >
                {loading ? (isRegister ? 'Criando conta...' : 'Entrando...') : (isRegister ? 'Criar Conta' : 'Entrar')}
              </Button>
            </form>

            <div className="mt-4 text-center">
              <button
                type="button"
                onClick={() => {
                  setIsRegister(!isRegister);
                  setError('');
                  setName('');
                }}
                className="text-sm text-primary hover:text-primary/80 transition-colors"
              >
                {isRegister ? 'Já tem uma conta? Faça login' : 'Não tem conta? Registre-se'}
              </button>
            </div>

            {!isRegister && (
              <div className="mt-6 p-4 bg-secondary/30 rounded-lg">
                <p className="text-sm text-muted-foreground mb-2 font-medium">
                  Contas de demonstração:
                </p>
                <div className="space-y-1 text-xs">
                  <p><strong>Admin:</strong> admin@teste.com / 123456</p>
                  <p><strong>Cliente:</strong> cliente@teste.com / 123456</p>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Login;