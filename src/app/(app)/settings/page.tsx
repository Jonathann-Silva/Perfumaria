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
          <CardTitle>Perfil da Oficina</CardTitle>
          <CardDescription>
            Atualize as informações do seu negócio.
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
          <div className="space-y-2">
            <Label htmlFor="address">Endereço</Label>
            <Input id="address" defaultValue="Avenida Paulista, 1000, São Paulo - SP, 01310-100" />
          </div>
           <Button>Salvar Alterações</Button>
        </CardContent>
      </Card>
       <Card>
        <CardHeader>
          <CardTitle>Localização</CardTitle>
          <CardDescription>
            Visualize a localização da sua oficina no mapa.
          </CardDescription>
        </CardHeader>
        <CardContent className="aspect-video">
           <iframe
              className="w-full h-full rounded-md border"
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3657.145891398539!2d-46.65653908447573!3d-23.56333506765799!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x94ce599a0714b2d7%3A0x493976f64e1564b3!2sAv.%20Paulista%2C%201000%20-%20Bela%20Vista%2C%20S%C3%A3o%20Paulo%20-%20SP%2C%2001310-100!5e0!3m2!1spt-BR!2sbr!4v1716312528761!5m2!1spt-BR!2sbr"
              allowFullScreen={false}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            ></iframe>
        </CardContent>
      </Card>
    </div>
  );
}
