import React from 'react';
import { Link } from 'react-router-dom';
import { Instagram, Mail, MessageCircle } from 'lucide-react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-card border-t mt-12">
      <div className="container mx-auto px-4 py-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <section>
            <h2 className="text-xl font-semibold text-foreground mb-3">Technology</h2>
            <p className="text-sm text-muted-foreground">
              Soluções completas em tecnologia e serviços digitais.
            </p>
          </section>

          {/* Contato e Redes */}
          <section>
            <h3 className="text-base font-medium text-foreground mb-3">Redes sociais</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <a
                  href="#"
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-2 text-foreground hover:text-primary transition-colors"
                  aria-label="Instagram da Technology"
                >
                  <Instagram className="w-4 h-4" /> Instagram
                </a>
              </li>
              <li>
                <a
                  href="#"
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-2 text-foreground hover:text-primary transition-colors"
                  aria-label="WhatsApp da Technology"
                >
                  <MessageCircle className="w-4 h-4" /> WhatsApp
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="inline-flex items-center gap-2 text-foreground hover:text-primary transition-colors"
                  aria-label="Email da Technology"
                >
                  <Mail className="w-4 h-4" /> Email
                </a>
              </li>
            </ul>
          </section>

          {/* Localização e Horário */}
          <section>
            <h3 className="text-base font-medium text-foreground mb-3">Onde estamos</h3>
            <address className="not-italic text-sm text-muted-foreground">
              Av. Professor Mario Mazagão, 23<br />
              Jardim Angela, São Paulo - SP<br />
              04929-040
            </address>
            <div className="mt-4">
              <h4 className="text-sm font-medium text-foreground">Horário de funcionamento</h4>
              <p className="text-sm text-muted-foreground">Segunda a sábado — 9:00 às 20:00</p>
            </div>
          </section>

          {/* Navegação Rápida */}
          <nav aria-label="Navegação rápida">
            <h3 className="text-base font-medium text-foreground mb-3">Navegação</h3>
            <ul className="space-y-2 text-sm">
              <li><Link to="/" className="hover:text-primary transition-colors">Início</Link></li>
              <li><Link to="/ecommerce" className="hover:text-primary transition-colors">Loja</Link></li>
              <li><Link to="/blog" className="hover:text-primary transition-colors">Blog</Link></li>
              <li><Link to="/login" className="hover:text-primary transition-colors">Entrar</Link></li>
            </ul>
          </nav>
        </div>

        <div className="mt-10 pt-6 border-t text-xs text-muted-foreground flex flex-col sm:flex-row items-center justify-between gap-2">
          <p>&copy; {new Date().getFullYear()} Technology. Todos os direitos reservados.</p>
          <p className="text-muted-foreground/80">Feito com carinho e tecnologia.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
