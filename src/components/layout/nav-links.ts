import {
  LayoutDashboard,
  Package,
  ShoppingBag,
  Users,
  Settings,
} from 'lucide-react';

export const navLinks = [
  { href: '/admin', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/admin/products', label: 'Produtos', icon: Package },
  { href: '/admin/orders', label: 'Pedidos', icon: ShoppingBag, badge: '3' },
  { href: '/admin/customers', label: 'Clientes', icon: Users },
  { href: '/admin/settings', label: 'Configurações', icon: Settings },
];
