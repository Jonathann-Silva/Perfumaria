'use client';

import { useState } from 'react';
import { Store, Phone, Mail, MapPin, Save, Building, Ticket, Percent, Hash, Plus, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { useToast } from '@/hooks/use-toast';

interface Coupon {
  id: number;
  code: string;
  discountPercentage: number;
  quantity: number;
  used: number;
}

const initialCoupons: Coupon[] = [
    { id: 1, code: 'BEMVINDO10', discountPercentage: 10, quantity: 100, used: 23 },
    { id: 2, code: 'NATALVIP', discountPercentage: 15, quantity: 50, used: 12 },
];


export default function AdminSettingsPage() {
  const { toast } = useToast();
  const [coupons, setCoupons] = useState<Coupon[]>(initialCoupons);

  const [newCouponCode, setNewCouponCode] = useState('');
  const [newCouponDiscount, setNewCouponDiscount] = useState('');
  const [newCouponQuantity, setNewCouponQuantity] = useState('');


  const handleSaveChanges = () => {
    toast({
      title: "Alterações Salvas!",
      description: "As configurações da sua loja foram atualizadas com sucesso.",
    });
  }

  const handleAddCoupon = () => {
    if (!newCouponCode || !newCouponDiscount || !newCouponQuantity) {
      toast({
        variant: 'destructive',
        title: 'Campos obrigatórios',
        description: 'Por favor, preencha todos os campos do cupom.',
      });
      return;
    }

    const newCoupon: Coupon = {
      id: Date.now(),
      code: newCouponCode,
      discountPercentage: parseInt(newCouponDiscount, 10),
      quantity: parseInt(newCouponQuantity, 10),
      used: 0,
    };

    setCoupons([...coupons, newCoupon]);

    // Clear inputs
    setNewCouponCode('');
    setNewCouponDiscount('');
    setNewCouponQuantity('');

    toast({
      title: 'Cupom Adicionado!',
      description: `O cupom "${newCoupon.code}" foi criado com sucesso.`,
    });
  };

  const handleRemoveCoupon = (couponId: number) => {
    setCoupons(coupons.filter(c => c.id !== couponId));
    toast({
      variant: 'destructive',
      title: 'Cupom Removido!',
      description: 'O cupom foi removido da lista.',
    });
  };


  return (
    <div className="flex flex-col gap-8">
      <div className="flex flex-wrap items-end justify-between gap-6">
        <div className="flex max-w-2xl flex-col gap-2">
          <h1 className="font-headline text-4xl font-black leading-tight tracking-tight text-foreground">
            Configurações da Loja
          </h1>
          <p className="text-lg text-muted-foreground">
            Ajuste as configurações gerais e promocionais da sua loja.
          </p>
        </div>
        <Button 
          onClick={handleSaveChanges}
          className="gap-2 rounded-full bg-primary px-6 py-3 font-bold text-primary-foreground shadow-lg transition-all hover:-translate-y-0.5 hover:shadow-xl">
          <Save className="size-5" />
          Salvar Alterações
        </Button>
      </div>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
        <div className="flex flex-col gap-8 lg:col-span-2">
          <Card className="dark:bg-[#1a190b]">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Store className="text-primary" />
                Informações da Loja
              </CardTitle>
              <CardDescription>
                Informações públicas que serão exibidas aos seus clientes.
              </CardDescription>
            </CardHeader>
            <CardContent className="grid grid-cols-1 gap-6 md:grid-cols-2">
              <div className="md:col-span-2">
                <Label htmlFor="storeName">Nome da Loja</Label>
                <Input
                  id="storeName"
                  placeholder="Ex: Perfumes & Decantes"
                  defaultValue="Perfumes & Decantes"
                />
              </div>
              <div className="md:col-span-2">
                <Label htmlFor="storeSlogan">Slogan (Opcional)</Label>
                <Input
                  id="storeSlogan"
                  placeholder="Ex: Sua Assinatura Olfativa"
                  defaultValue="Sua Assinatura Olfativa"
                />
              </div>
            </CardContent>
          </Card>
          
          <Card className="dark:bg-[#1a190b]">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Ticket className="text-primary" />
                Cupons de Desconto
              </CardTitle>
              <CardDescription>
                Crie e gerencie códigos promocionais para seus clientes.
              </CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col gap-6">
                <div className="grid grid-cols-1 items-end gap-4 md:grid-cols-[1fr_1fr_1fr_auto]">
                    <div>
                        <Label htmlFor="couponCode">Código Promocional</Label>
                        <Input id="couponCode" placeholder="EX: BEMVINDO10" value={newCouponCode} onChange={(e) => setNewCouponCode(e.target.value)} />
                    </div>
                    <div>
                        <Label htmlFor="discountPercentage">Desconto (%)</Label>
                        <Input id="discountPercentage" type="number" placeholder="10" value={newCouponDiscount} onChange={(e) => setNewCouponDiscount(e.target.value)} />
                    </div>
                    <div>
                        <Label htmlFor="couponQuantity">Quantidade</Label>
                        <Input id="couponQuantity" type="number" placeholder="100" value={newCouponQuantity} onChange={(e) => setNewCouponQuantity(e.target.value)} />
                    </div>
                    <Button onClick={handleAddCoupon} className="w-full md:w-auto">
                        <Plus className="mr-2 size-4" />
                        Adicionar
                    </Button>
                </div>

                <div className="overflow-hidden rounded-lg border">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Código</TableHead>
                                <TableHead>Desconto</TableHead>
                                <TableHead>Uso</TableHead>
                                <TableHead className="text-right">Ações</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {coupons.map((coupon) => (
                                <TableRow key={coupon.id}>
                                    <TableCell className="font-medium">{coupon.code}</TableCell>
                                    <TableCell>{coupon.discountPercentage}%</TableCell>
                                    <TableCell>{coupon.used} / {coupon.quantity}</TableCell>
                                    <TableCell className="text-right">
                                        <Button variant="ghost" size="icon" className="text-red-500 hover:text-red-600" onClick={() => handleRemoveCoupon(coupon.id)}>
                                            <Trash2 className="size-4" />
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </div>
            </CardContent>
          </Card>

          <Card className="dark:bg-[#1a190b]">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Phone className="text-primary" />
                Contato
              </CardTitle>
              <CardDescription>
                Como seus clientes podem entrar em contato com você.
              </CardDescription>
            </CardHeader>
            <CardContent className="grid grid-cols-1 gap-6 md:grid-cols-2">
              <div>
                <Label htmlFor="phone1">Telefone Principal</Label>
                <Input
                  id="phone1"
                  type="tel"
                  placeholder="(XX) 99999-9999"
                />
              </div>
              <div>
                <Label htmlFor="phone2">Telefone Secundário (Opcional)</Label>
                <Input
                  id="phone2"
                  type="tel"
                  placeholder="(XX) 99999-9999"
                />
              </div>
              <div className="md:col-span-2">
                <Label htmlFor="supportEmail">E-mail de Suporte</Label>
                <Input
                  id="supportEmail"
                  type="email"
                  placeholder="suporte@exemplo.com"
                />
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="lg:col-span-1">
          <Card className="sticky top-24 dark:bg-[#1a190b]">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Building className="text-primary" />
                Endereço da Sede
              </CardTitle>
              <CardDescription>
                Endereço físico principal do seu negócio.
              </CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col gap-4">
              <div>
                <Label htmlFor="zipCode">CEP</Label>
                <Input id="zipCode" placeholder="00000-000" />
              </div>
              <div>
                <Label htmlFor="street">Logradouro</Label>
                <Input id="street" placeholder="Rua das Flores" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="number">Número</Label>
                  <Input id="number" placeholder="123" />
                </div>
                <div>
                  <Label htmlFor="complement">Complemento</Label>
                  <Input id="complement" placeholder="Sala 10" />
                </div>
              </div>
              <div>
                <Label htmlFor="city">Cidade</Label>
                <Input id="city" placeholder="São Paulo" />
              </div>
              <div>
                <Label htmlFor="state">Estado</Label>
                <Input id="state" placeholder="SP" />
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
