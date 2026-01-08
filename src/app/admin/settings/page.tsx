'use client';

import { useState, useEffect, useMemo } from 'react';
import { Store, Phone, Mail, MapPin, Save, Building, Ticket, Plus, Trash2 } from 'lucide-react';
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
import { useFirestore, useCollection, useDoc } from '@/firebase';
import { collection, addDoc, deleteDoc, doc, setDoc } from 'firebase/firestore';
import { z } from 'zod';

interface Coupon {
  id: string;
  code: string;
  discountPercentage: number;
  quantity: number;
  used: number;
}

const storeSettingsSchema = z.object({
    storeName: z.string().optional(),
    slogan: z.string().optional(),
    phone1: z.string().optional(),
    phone2: z.string().optional(),
    supportEmail: z.string().email().optional(),
    zipCode: z.string().optional(),
    street: z.string().optional(),
    number: z.string().optional(),
    complement: z.string().optional(),
    city: z.string().optional(),
    state: z.string().optional(),
});

type StoreSettings = z.infer<typeof storeSettingsSchema>;

export default function AdminSettingsPage() {
  const { toast } = useToast();
  const firestore = useFirestore();

  const [formState, setFormState] = useState<StoreSettings>({});

  const settingsRef = useMemo(() => firestore ? doc(firestore, 'settings', 'storeInfo') : null, [firestore]);
  const { data: settingsData } = useDoc(settingsRef);

  const couponsRef = useMemo(() => firestore ? collection(firestore, 'coupons') : null, [firestore]);
  const { data: coupons, loading: couponsLoading } = useCollection<Coupon>(couponsRef);

  const [newCouponCode, setNewCouponCode] = useState('');
  const [newCouponDiscount, setNewCouponDiscount] = useState('');
  const [newCouponQuantity, setNewCouponQuantity] = useState('');

  useEffect(() => {
    if (settingsData) {
      setFormState({
          storeName: settingsData.storeName || '',
          slogan: settingsData.slogan || '',
          phone1: settingsData.contact?.phone1 || '',
          phone2: settingsData.contact?.phone2 || '',
          supportEmail: settingsData.contact?.supportEmail || '',
          zipCode: settingsData.address?.zipCode || '',
          street: settingsData.address?.street || '',
          number: settingsData.address?.number || '',
          complement: settingsData.address?.complement || '',
          city: settingsData.address?.city || '',
          state: settingsData.address?.state || '',
      });
    }
  }, [settingsData]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setFormState(prevState => ({...prevState, [id]: value}));
  }

  const handleSaveChanges = async () => {
    if (!firestore || !settingsRef) return;
    
    const dataToSave = {
        storeName: formState.storeName || '',
        slogan: formState.slogan || '',
        contact: {
            phone1: formState.phone1 || '',
            phone2: formState.phone2 || '',
            supportEmail: formState.supportEmail || '',
        },
        address: {
            zipCode: formState.zipCode || '',
            street: formState.street || '',
            number: formState.number || '',
            complement: formState.complement || '',
            city: formState.city || '',
            state: formState.state || '',
        }
    };

    try {
        await setDoc(settingsRef, dataToSave, { merge: true });
        toast({
        title: "Alterações Salvas!",
        description: "As configurações da sua loja foram atualizadas com sucesso.",
        });
    } catch (error) {
        console.error("Error saving settings: ", error);
        toast({
            variant: "destructive",
            title: "Erro ao Salvar",
            description: "Não foi possível salvar as configurações.",
        });
    }
  }

  const handleAddCoupon = async () => {
    if (!couponsRef || !newCouponCode || !newCouponDiscount || !newCouponQuantity) {
      toast({
        variant: 'destructive',
        title: 'Campos obrigatórios',
        description: 'Por favor, preencha todos os campos do cupom.',
      });
      return;
    }

    const newCoupon = {
      code: newCouponCode.toUpperCase(),
      discountPercentage: parseInt(newCouponDiscount, 10),
      quantity: parseInt(newCouponQuantity, 10),
      used: 0,
    };

    try {
        await addDoc(couponsRef, newCoupon);
        toast({
            title: 'Cupom Adicionado!',
            description: `O cupom "${newCoupon.code}" foi criado com sucesso.`,
        });
        setNewCouponCode('');
        setNewCouponDiscount('');
        setNewCouponQuantity('');
    } catch (error) {
        console.error("Error adding coupon: ", error);
        toast({
            variant: "destructive",
            title: "Erro ao Adicionar",
            description: "Não foi possível adicionar o cupom.",
        });
    }
  };

  const handleRemoveCoupon = async (couponId: string) => {
    if (!firestore) return;
    try {
        await deleteDoc(doc(firestore, 'coupons', couponId));
        toast({
            variant: 'destructive',
            title: 'Cupom Removido!',
            description: 'O cupom foi removido com sucesso.',
        });
    } catch (error) {
        console.error("Error removing coupon: ", error);
        toast({
            variant: "destructive",
            title: "Erro ao Remover",
            description: "Não foi possível remover o cupom.",
        });
    }
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
                  value={formState.storeName || ''}
                  onChange={handleInputChange}
                />
              </div>
              <div className="md:col-span-2">
                <Label htmlFor="slogan">Slogan (Opcional)</Label>
                <Input
                  id="slogan"
                  placeholder="Ex: Sua Assinatura Olfativa"
                  value={formState.slogan || ''}
                  onChange={handleInputChange}
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
                        <Label htmlFor="newCouponCode">Código Promocional</Label>
                        <Input id="newCouponCode" placeholder="EX: BEMVINDO10" value={newCouponCode} onChange={(e) => setNewCouponCode(e.target.value.toUpperCase())} />
                    </div>
                    <div>
                        <Label htmlFor="newCouponDiscount">Desconto (%)</Label>
                        <Input id="newCouponDiscount" type="number" placeholder="10" value={newCouponDiscount} onChange={(e) => setNewCouponDiscount(e.target.value)} />
                    </div>
                    <div>
                        <Label htmlFor="newCouponQuantity">Quantidade</Label>
                        <Input id="newCouponQuantity" type="number" placeholder="100" value={newCouponQuantity} onChange={(e) => setNewCouponQuantity(e.target.value)} />
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
                            {couponsLoading && (
                                <TableRow><TableCell colSpan={4} className="text-center">Carregando...</TableCell></TableRow>
                            )}
                            {coupons?.map((coupon) => (
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
                  value={formState.phone1 || ''}
                  onChange={handleInputChange}
                />
              </div>
              <div>
                <Label htmlFor="phone2">Telefone Secundário (Opcional)</Label>
                <Input
                  id="phone2"
                  type="tel"
                  placeholder="(XX) 99999-9999"
                  value={formState.phone2 || ''}
                  onChange={handleInputChange}
                />
              </div>
              <div className="md:col-span-2">
                <Label htmlFor="supportEmail">E-mail de Suporte</Label>
                <Input
                  id="supportEmail"
                  type="email"
                  placeholder="suporte@exemplo.com"
                  value={formState.supportEmail || ''}
                  onChange={handleInputChange}
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
                <Input id="zipCode" placeholder="00000-000" value={formState.zipCode || ''} onChange={handleInputChange} />
              </div>
              <div>
                <Label htmlFor="street">Logradouro</Label>
                <Input id="street" placeholder="Rua das Flores" value={formState.street || ''} onChange={handleInputChange} />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="number">Número</Label>
                  <Input id="number" placeholder="123" value={formState.number || ''} onChange={handleInputChange} />
                </div>
                <div>
                  <Label htmlFor="complement">Complemento</Label>
                  <Input id="complement" placeholder="Sala 10" value={formState.complement || ''} onChange={handleInputChange} />
                </div>
              </div>
              <div>
                <Label htmlFor="city">Cidade</Label>
                <Input id="city" placeholder="São Paulo" value={formState.city || ''} onChange={handleInputChange} />
              </div>
              <div>
                <Label htmlFor="state">Estado</Label>
                <Input id="state" placeholder="SP" value={formState.state || ''} onChange={handleInputChange} />
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
