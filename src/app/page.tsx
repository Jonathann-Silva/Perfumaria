import { redirect } from 'next/navigation';

export default function RootPage() {
  // A lógica de redirecionamento agora será tratada pelo AuthProvider
  // Se não houver usuário, ele irá para /login.
  // Se houver, irá para /dashboard.
  redirect('/dashboard');
}
