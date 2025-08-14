import { Product } from '@/contexts/CartContext';

export const ecommerceProducts: Product[] = [
  {
    id: '1',
    name: 'Smartphone Galaxy Pro',
    description: 'Smartphone avançado com câmera de 108MP, tela AMOLED 6.7" e bateria de longa duração.',
    price: 2299.99,
    image: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=400&h=400&fit=crop',
    category: 'Smartphones'
  },
  {
    id: '2',
    name: 'Notebook Gaming Elite',
    description: 'Notebook gamer com RTX 4060, Intel i7, 16GB RAM e SSD 512GB para máxima performance.',
    price: 4599.99,
    image: 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=400&h=400&fit=crop',
    category: 'Notebooks'
  },
  {
    id: '3',
    name: 'Fone Bluetooth Premium',
    description: 'Fone de ouvido sem fio com cancelamento de ruído ativo e qualidade de áudio superior.',
    price: 299.99,
    image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&h=400&fit=crop',
    category: 'Áudio'
  },
  {
    id: '4',
    name: 'Smart TV 55" 4K',
    description: 'Smart TV 4K Ultra HD com HDR, sistema Android TV e conectividade completa.',
    price: 1899.99,
    image: 'https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?w=400&h=400&fit=crop',
    category: 'TVs'
  },
  {
    id: '5',
    name: 'Tablet Pro 12"',
    description: 'Tablet profissional com tela 12", processador octa-core e suporte à caneta digital.',
    price: 1299.99,
    image: 'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=400&h=400&fit=crop',
    category: 'Tablets'
  },
  {
    id: '6',
    name: 'Smartwatch Fitness',
    description: 'Relógio inteligente com monitoramento de saúde, GPS e resistência à água.',
    price: 599.99,
    image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400&h=400&fit=crop',
    category: 'Wearables'
  }
];

export const blogProducts: Product[] = [
  {
    id: 'b1',
    name: 'Curso Completo de Programação',
    description: 'Aprenda programação do zero ao avançado com projetos práticos e mentoria especializada.',
    price: 497.00,
    image: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=400&h=400&fit=crop',
    category: 'Cursos',
    link: 'https://exemplo.com/curso-programacao'
  },
  {
    id: 'b2',
    name: 'E-book Marketing Digital',
    description: 'Guia completo de estratégias de marketing digital para alavancar seu negócio online.',
    price: 97.00,
    image: 'https://images.unsplash.com/photo-1432888622747-4eb9a8efeb07?w=400&h=400&fit=crop',
    category: 'E-books',
    link: 'https://exemplo.com/ebook-marketing'
  },
  {
    id: 'b3',
    name: 'Consultoria em Tecnologia',
    description: 'Sessão de consultoria personalizada para implementação de soluções tecnológicas.',
    price: 299.00,
    image: 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=400&h=400&fit=crop',
    category: 'Serviços',
    link: 'https://exemplo.com/consultoria-tech'
  },
  {
    id: 'b4',
    name: 'Template Website Profissional',
    description: 'Template responsivo e moderno para criar seu site profissional rapidamente.',
    price: 149.00,
    image: 'https://images.unsplash.com/photo-1467232004584-a241de8bcf5d?w=400&h=400&fit=crop',
    category: 'Templates',
    link: 'https://exemplo.com/template-website'
  }
];

export const categories = [
  'Todos',
  'Smartphones',
  'Notebooks', 
  'Áudio',
  'TVs',
  'Tablets',
  'Wearables'
];

export const blogCategories = [
  'Todos',
  'Cursos',
  'E-books',
  'Serviços',
  'Templates'
];

export const plans = [
  {
    id: 'mensal',
    name: 'Plano Mensal',
    description: 'Acesso completo por 30 dias',
    price: 29.99,
    interval: 'mensal',
    features: [
      'Acesso a todos os canais',
      'Qualidade HD',
      'Suporte 24h',
      'Até 2 dispositivos'
    ]
  },
  {
    id: 'trimestral',
    name: 'Plano Trimestral',
    description: 'Acesso completo por 90 dias',
    price: 79.99,
    interval: 'trimestral',
    features: [
      'Acesso a todos os canais',
      'Qualidade Full HD',
      'Suporte prioritário',
      'Até 3 dispositivos',
      '10% de desconto'
    ]
  },
  {
    id: 'anual',
    name: 'Plano Anual',
    description: 'Acesso completo por 12 meses',
    price: 299.99,
    interval: 'anual',
    features: [
      'Acesso a todos os canais',
      'Qualidade 4K',
      'Suporte VIP',
      'Dispositivos ilimitados',
      '30% de desconto',
      'Canais exclusivos'
    ]
  }
];