import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { ShoppingBag, MessageSquare, Smartphone, Laptop, Monitor, Headphones } from 'lucide-react';
import Header from '@/components/Header';

const Index = () => {
  const features = [
    {
      icon: <ShoppingBag className="w-8 h-8 text-primary" />,
      title: "Loja Virtual",
      description: "Produtos eletrônicos com integração WhatsApp"
    },
    {
      icon: <MessageSquare className="w-8 h-8 text-accent" />,
      title: "Blog de Produtos",
      description: "Conteúdos e produtos externos selecionados"
    },
    {
      icon: <Smartphone className="w-8 h-8 text-success" />,
      title: "IPTV Premium",
      description: "Planos de streaming com qualidade superior"
    }
  ];

  const categories = [
    { icon: <Smartphone className="w-6 h-6" />, name: "Smartphones" },
    { icon: <Laptop className="w-6 h-6" />, name: "Notebooks" },
    { icon: <Monitor className="w-6 h-6" />, name: "Monitores" },
    { icon: <Headphones className="w-6 h-6" />, name: "Áudio" }
  ];

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      {/* Hero Section */}
      <section className="relative py-20 px-4 bg-gradient-hero overflow-hidden">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="container mx-auto text-center relative z-10">
          <h1 className="text-5xl md:text-7xl font-bold text-white mb-6">
            TechStore
          </h1>
          <p className="text-xl md:text-2xl text-white/90 mb-8 max-w-3xl mx-auto">
            Sua loja completa de tecnologia com os melhores produtos e serviços digitais
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/ecommerce">
              <Button variant="hero" size="lg" className="text-lg px-8 py-3">
                Explorar Loja
              </Button>
            </Link>
            <Link to="/blog">
              <Button variant="outline" size="lg" className="text-lg px-8 py-3 bg-white/10 border-white/30 text-white hover:bg-white/20">
                Ver Blog
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-foreground mb-4">
              O que oferecemos
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Soluções completas em tecnologia para suas necessidades digitais
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <Card key={index} className="bg-gradient-card border-border/50 hover:shadow-card-hover transition-all duration-300 hover:-translate-y-2">
                <CardContent className="p-8 text-center">
                  <div className="mb-4 flex justify-center">
                    {feature.icon}
                  </div>
                  <h3 className="text-xl font-semibold text-foreground mb-2">
                    {feature.title}
                  </h3>
                  <p className="text-muted-foreground">
                    {feature.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-20 px-4 bg-secondary/30">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-foreground mb-4">
              Categorias Populares
            </h2>
            <p className="text-xl text-muted-foreground">
              Encontre produtos das melhores marcas
            </p>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {categories.map((category, index) => (
              <Link key={index} to="/ecommerce">
                <Card className="bg-card hover:shadow-card-hover transition-all duration-300 hover:-translate-y-1 cursor-pointer">
                  <CardContent className="p-6 text-center">
                    <div className="mb-3 flex justify-center text-primary">
                      {category.icon}
                    </div>
                    <h3 className="font-medium text-foreground">
                      {category.name}
                    </h3>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 bg-gradient-primary">
        <div className="container mx-auto text-center">
          <h2 className="text-4xl font-bold text-white mb-4">
            Pronto para começar?
          </h2>
          <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
            Explore nossos produtos ou entre em contato para saber mais sobre nossos serviços
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/ecommerce">
              <Button variant="hero" size="lg" className="bg-white text-primary hover:bg-white/90">
                Ver Produtos
              </Button>
            </Link>
            <Button 
              variant="outline" 
              size="lg" 
              className="border-white/30 text-white hover:bg-white/20"
              onClick={() => window.open('https://wa.me/c/5511952801212', '_blank')}
            >
              Falar no WhatsApp
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Index;
