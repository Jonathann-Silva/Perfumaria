import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';

export default function SettingsPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold tracking-tight">Configurações</h1>
      <Card>
        <CardHeader>
          <CardTitle>Perfil</CardTitle>
          <CardDescription>
            Atualize as informações da sua oficina.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="shop-name">Nome da Oficina</Label>
            <Input id="shop-name" defaultValue="AutoFlow Oficina" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="email">Email de Contato</Label>
            <Input id="email" type="email" defaultValue="contato@autoflow.com" />
          </div>
           <Button>Salvar Alterações</Button>
        </CardContent>
      </Card>
       <Card>
        <CardHeader>
          <CardTitle>Chave de API do Gemini</CardTitle>
          <CardDescription>
            Insira sua chave de API do Google AI Studio para ativar as funcionalidades de IA.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="api-key">Sua Chave de API</Label>
            <Input id="api-key" type="password" placeholder="Cole sua chave aqui" />
          </div>
           <Button>Salvar Chave</Button>
        </CardContent>
      </Card>
    </div>
  );
}
