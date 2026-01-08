'use client';

import { useState } from 'react';
import Image from 'next/image';
import {
  Check,
  CreditCard,
  HelpCircle,
  Lock,
  LockOpen,
  Loader2,
  Trash2,
  Truck,
  User,
  PartyPopper,
  MapPin,
  Bike,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { getImageById } from '@/lib/placeholder-images';
import { formatCurrency, cn } from '@/lib/utils';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { LogoIcon } from '@/components/icons/logo-icon';
import { getShippingRates } from '../actions';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { useCart } from '@/context/cart-context';

const steps = [
  { id: 1, name: 'Identificação', status: 'current', icon: null },
  { id: 2, name: 'Entrega', status: 'upcoming', icon: null },
  { id: 3, name: 'Pagamento', status: 'upcoming', icon: null },
];

type ShippingOption = {
  id: number | string;
  name: string;
  price: string;
  delivery_time: number;
  icon: React.ElementType;
  error?: string;
};

const motoboyRates: { [key: string]: number } = {
  arapongas: 10.0,
  rolandia: 15.0,
  apucarana: 15.0,
  londrina: 20.0,
  maringa: 30.0,
};


export default function CheckoutAddressPage() {
  const router = useRouter();
  const { cartItems, removeFromCart, cartSubtotal } = useCart();
  const [cep, setCep] = useState('');
  const [address, setAddress] = useState({
    street: '',
    city: '',
    state: '',
  });

  const [isFetchingCep, setIsFetchingCep] = useState(false);
  const [isFetchingRates, setIsFetchingRates] = useState(false);

  const [shippingOptions, setShippingOptions] = useState<ShippingOption[]>([]);
  const [selectedShipping, setSelectedShipping] = useState<ShippingOption | null>(null);
  const [shippingError, setShippingError] = useState<string | null>(null);

  const handleCepBlur = async (event: React.FocusEvent<HTMLInputElement>) => {
    const cepValue = event.target.value.replace(/\D/g, '');
    if (cepValue.length !== 8) {
      setShippingOptions([]);
      setSelectedShipping(null);
      return;
    }

    setIsFetchingCep(true);
    setIsFetchingRates(true);
    setShippingError(null);
    setShippingOptions([]);
    setSelectedShipping(null);

    try {
      // Fetch address
      const response = await fetch(`https://viacep.com.br/ws/${cepValue}/json/`);
      const data = await response.json();

      if (!data.erro) {
        const city = data.localidade.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
        setAddress({
          street: data.logradouro,
          city: data.localidade,
          state: data.uf,
        });
        
        let allOptions: ShippingOption[] = [];
        
        // Always add local pickup option
        allOptions.push({
          id: 'pickup',
          name: 'Retirar no Local',
          price: '0.00',
          delivery_time: 0,
          icon: MapPin,
        });

        // Add motoboy option
        if (motoboyRates[city]) {
          allOptions.push({
            id: 'motoboy',
            name: 'Motoboy',
            price: motoboyRates[city].toFixed(2),
            delivery_time: 1,
            icon: Bike,
          });
        }
        
        // Fetch shipping rates from Melhor Envio
        const rates = await getShippingRates(cepValue);
        
        if (rates && rates.length > 0) {
          const correiosOptions = rates.map(rate => ({ ...rate, icon: Truck }));
          allOptions.push(...correiosOptions);
        }
        
        if (allOptions.length > 0) {
          const validRates = allOptions.filter(rate => !rate.error);
          setShippingOptions(allOptions);
          if (validRates.length > 0) {
            setSelectedShipping(validRates[0]);
          } else {
             setShippingError(allOptions[0]?.error || 'Nenhuma opção de frete válida encontrada.');
          }
        } else {
           setShippingError('Não foram encontradas opções de frete para este CEP. Verifique o CEP digitado.');
        }

      } else {
        setAddress({ street: '', city: '', state: '' });
        setShippingError('CEP não encontrado. Por favor, verifique.');
      }
    } catch (error) {
      console.error('Erro ao buscar informações:', error);
      setShippingError('Não foi possível buscar as informações de frete. Tente novamente.');
    } finally {
      setIsFetchingCep(false);
      setIsFetchingRates(false);
    }
  };

  const handleProceedToPayment = () => {
    if (!selectedShipping) return;
    const params = new URLSearchParams({
      shipping_id: String(selectedShipping.id),
      shipping_name: selectedShipping.name,
      shipping_cost: selectedShipping.price,
    });
    router.push(`/checkout?${params.toString()}`);
  }

  const shippingCost = selectedShipping ? parseFloat(selectedShipping.price) : 0;
  const total = cartSubtotal + shippingCost;
  
  return (
    <div className="flex min-h-screen flex-col bg-background font-display text-foreground selection:bg-primary selection:text-primary-foreground">
      <header className="sticky top-0 z-50 w-full border-b bg-card/80 backdrop-blur-md dark:bg-background-dark/80">
        <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <Link href="/" className="flex items-center gap-3">
            <div className="flex size-10 items-center justify-center rounded-full bg-primary text-primary-foreground">
              <LogoIcon />
            </div>
            <span className="font-headline text-xl font-bold tracking-tight">
              Perfumes & Decantes
            </span>
          </Link>
          <div className="flex items-center gap-3 rounded-full bg-muted px-4 py-2 text-sm font-bold text-foreground dark:bg-white/10">
            <Lock className="size-4" />
            <span className="hidden sm:inline">Checkout Seguro</span>
          </div>
        </div>
      </header>

      <main className="mx-auto w-full max-w-7xl flex-grow px-4 py-8 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-x-12 gap-y-10 lg:grid-cols-12">
          <div className="space-y-10 lg:col-span-7">
            <nav aria-label="Progress">
              <ol role="list" className="flex w-full items-center">
                {steps.map((step, stepIdx) => (
                  <li
                    key={step.name}
                    className="relative flex flex-1 flex-col items-center"
                  >
                    {stepIdx < steps.length - 1 && (
                      <div
                        className={`absolute left-[50%] right-[-50%] top-4 -z-10 h-0.5 ${
                          step.status === 'complete' ? 'bg-primary' : 'bg-border'
                        }`}
                      />
                    )}
                    <a
                      href="#"
                      className={`relative flex size-8 items-center justify-center rounded-full ring-4 ring-background ${
                        step.status === 'complete' || step.status === 'current'
                          ? 'bg-primary'
                          : 'bg-muted'
                      }`}
                    >
                      {step.status === 'complete' ? (
                        <Check className="size-4 font-bold text-primary-foreground" />
                      ) : (
                        <span
                          className={`text-sm font-bold ${
                            step.status === 'current'
                              ? 'text-primary-foreground'
                              : 'text-muted-foreground'
                          }`}
                        >
                          {step.id}
                        </span>
                      )}
                    </a>
                    <span
                      className={`mt-2 text-xs font-bold uppercase tracking-wider ${
                        step.status === 'upcoming'
                          ? 'text-muted-foreground'
                          : 'text-foreground'
                      }`}
                    >
                      {step.name}
                    </span>
                  </li>
                ))}
              </ol>
            </nav>

            <section className="rounded-2xl border bg-card p-6 dark:bg-white/5">
              <div className="mb-4">
                <h2 className="flex items-center gap-2 text-lg font-bold text-foreground">
                  <User className="text-primary" />
                  Dados Pessoais
                </h2>
              </div>
              <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="email" className="font-bold">E-mail</Label>
                  <Input id="email" type="email" placeholder="seuemail@exemplo.com" required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone" className="font-bold">Telefone / Celular</Label>
                  <Input id="phone" type="tel" placeholder="(XX) 99999-9999" required />
                </div>
              </div>
            </section>

            <section>
              <div className="flex flex-col gap-6">
                <div className="mb-2 flex items-center gap-2">
                  <div className="flex size-8 items-center justify-center rounded-full bg-primary/20 text-primary">
                    <Truck className="size-4" />
                  </div>
                  <h2 className="font-headline text-xl font-black tracking-tight text-foreground">
                    Endereço de Entrega
                  </h2>
                </div>
                <div className="grid grid-cols-1 gap-5 sm:grid-cols-6">
                  <div className="sm:col-span-6 space-y-2">
                    <Label htmlFor="recipient-name" className="font-bold">
                      Nome do Destinatário
                    </Label>
                    <Input
                      id="recipient-name"
                      placeholder="Ex: João da Silva"
                      defaultValue="João da Silva"
                    />
                  </div>
                  <div className="sm:col-span-3 space-y-2">
                    <Label htmlFor="cpf" className="font-bold">
                      CPF
                    </Label>
                    <Input id="cpf" placeholder="000.000.000-00" />
                  </div>
                   <div className="sm:col-span-3 space-y-2">
                    <Label htmlFor="zip" className="font-bold">
                      CEP
                    </Label>
                    <div className="relative">
                      <Input
                        id="zip"
                        placeholder="00000-000"
                        value={cep}
                        onChange={(e) => setCep(e.target.value)}
                        onBlur={handleCepBlur}
                        maxLength={9}
                      />
                       {isFetchingCep && (
                        <div className="absolute right-3 top-1/2 -translate-y-1/2 animate-spin rounded-full h-5 w-5 border-b-2 border-primary"></div>
                      )}
                    </div>
                  </div>

                  <div className="sm:col-span-4 space-y-2">
                    <Label htmlFor="address" className="font-bold">
                      Endereço
                    </Label>
                    <Input id="address" placeholder="Rua, Avenida, etc." value={address.street} onChange={e => setAddress({...address, street: e.target.value})} />
                  </div>
                   <div className="sm:col-span-2 space-y-2">
                    <Label htmlFor="number" className="font-bold">
                      Número
                    </Label>
                    <Input id="number" placeholder="123" />
                  </div>
                   <div className="sm:col-span-2 space-y-2">
                    <Label htmlFor="complement" className="font-bold">
                      Complemento{' '}
                      <span className="font-normal text-muted-foreground">
                        (Opcional)
                      </span>
                    </Label>
                    <Input id="complement" placeholder="Apto 101, Bloco B" />
                  </div>
                  <div className="sm:col-span-2 space-y-2">
                     <Label htmlFor="city" className="font-bold">
                      Cidade
                    </Label>
                    <Input id="city" placeholder="Sua cidade" value={address.city} onChange={e => setAddress({...address, city: e.target.value})} />
                  </div>
                   <div className="sm:col-span-2 space-y-2">
                     <Label htmlFor="state" className="font-bold">
                      Estado
                    </Label>
                    <Input id="state" placeholder="UF" value={address.state} onChange={e => setAddress({...address, state: e.target.value})} />
                  </div>
                </div>
              </div>
            </section>

            <section className="rounded-2xl bg-muted/50 p-6 dark:bg-white/5">
              <h3 className="mb-4 text-base font-bold text-foreground">
                Opções de Envio
              </h3>
              {isFetchingRates && (
                  <div className="flex items-center justify-center gap-2 py-8 text-muted-foreground">
                    <Loader2 className="h-5 w-5 animate-spin" />
                    <span>Calculando frete...</span>
                  </div>
              )}
              {shippingError && (
                <Alert variant="destructive">
                  <AlertTitle>Erro no Frete</AlertTitle>
                  <AlertDescription>{shippingError}</AlertDescription>
                </Alert>
              )}
              {!isFetchingRates && shippingOptions.length > 0 && (
                <div className="space-y-3">
                  {shippingOptions.map((option) => (
                    <Label
                      key={option.id}
                      htmlFor={`shipping-${option.id}`}
                      className={cn(
                        "relative flex cursor-pointer rounded-xl border bg-card p-4 shadow-sm transition-all",
                        selectedShipping?.id === option.id ? "border-2 border-primary" : "hover:border-muted-foreground",
                        option.error && "cursor-not-allowed opacity-60"
                      )}
                    >
                      <div className="flex w-full items-center justify-between">
                        <div className="flex items-center gap-4">
                           <input
                            type="radio"
                            name="shipping"
                            id={`shipping-${option.id}`}
                            value={option.id}
                            checked={selectedShipping?.id === option.id}
                            onChange={() => !option.error && setSelectedShipping(option)}
                            className="h-4 w-4 border-muted-foreground text-primary focus:ring-primary"
                            disabled={!!option.error}
                          />
                           <div className="flex items-center gap-3 text-primary">
                              <option.icon className="size-6" />
                           </div>
                          <div className="flex flex-col">
                            <span className="block text-sm font-bold text-foreground">
                              {option.name}
                            </span>
                            {!option.error ? (
                               <span className="block text-xs text-muted-foreground">
                                {option.id === 'pickup'
                                ? 'Disponível para retirada em Arapongas-PR'
                                : option.id === 'motoboy'
                                ? `Entrega no mesmo dia para ${address.city}`
                                : `Entrega em até ${option.delivery_time} dias úteis`}
                              </span>
                            ) : (
                               <span className="block text-xs text-destructive">
                                {option.error}
                              </span>
                            )}
                          </div>
                        </div>
                        <span className="font-bold text-foreground">{!option.error ? formatCurrency(parseFloat(option.price)) : '--'}</span>
                      </div>
                    </Label>
                  ))}
                </div>
              )}
            </section>
          </div>

          <div className="lg:col-span-5">
            <div className="sticky top-24 rounded-3xl border bg-card p-6 shadow-xl shadow-neutral-100/50 dark:border-white/10 dark:bg-white/5 dark:shadow-none">
              <h2 className="mb-6 font-headline text-xl font-black text-foreground">
                Resumo do Pedido
              </h2>
              {cartItems.length > 0 ? (
                <ul className="mb-6 divide-y divide-border">
                  {cartItems.map((item) => {
                    const itemImage = getImageById(item.imageId);
                    return (
                      <li key={item.id} className="flex gap-4 py-4">
                        <div className="relative h-20 w-20 flex-shrink-0 overflow-hidden rounded-2xl border bg-muted">
                          {itemImage && (
                            <Image
                              src={itemImage.imageUrl}
                              alt={itemImage.description}
                              fill
                              className="object-cover"
                              data-ai-hint={itemImage.imageHint}
                            />
                          )}
                        </div>
                        <div className="flex flex-1 flex-col">
                          <div className="flex justify-between text-base font-bold text-foreground">
                            <h3>{item.name}</h3>
                            <p className="ml-2">{formatCurrency(item.price)}</p>
                          </div>
                          <p className="text-sm text-muted-foreground">
                            {item.type === 'decant' ? `Decant ${item.decantMl}ml` : 'Frasco'}
                          </p>
                          <div className="mt-auto flex items-center justify-between">
                            <p className="rounded-lg bg-muted px-2 py-0.5 text-sm font-medium text-muted-foreground">
                              Qtd: {item.quantity}
                            </p>
                            <Button variant="ghost" size="icon" className="group -mr-2 h-8 w-8 rounded-full" onClick={() => removeFromCart(item.id)}>
                              <Trash2 className="size-4 text-muted-foreground transition-colors group-hover:text-red-500" />
                            </Button>
                          </div>
                        </div>
                      </li>
                    )
                  })}
                </ul>
                ) : (
                <div className="py-10 text-center text-sm text-muted-foreground">
                  Seu carrinho está vazio.
                </div>
              )}
              <div className="mb-6">
                <div className="flex gap-2">
                  <Input
                    type="text"
                    placeholder="Cupom de desconto"
                    className="text-sm"
                  />
                  <Button variant="secondary" className="font-bold">
                    Aplicar
                  </Button>
                </div>
              </div>
              <div className="space-y-4 border-t border-dashed pt-6 text-sm">
                <div className="flex justify-between text-muted-foreground">
                  <p>Subtotal</p>
                  <p className="font-medium text-foreground">
                    {formatCurrency(cartSubtotal)}
                  </p>
                </div>
                <div className="flex justify-between text-muted-foreground">
                  <p>Frete</p>
                  <p className="font-medium text-foreground">
                    {selectedShipping ? formatCurrency(shippingCost) : '--'}
                  </p>
                </div>
                <div className="flex items-end justify-between border-t pt-4">
                  <p className="font-headline text-lg font-black text-foreground">
                    Total
                  </p>
                  <div className="text-right">
                    <p className="font-headline text-3xl font-black tracking-tight text-foreground">
                      {formatCurrency(total)}
                    </p>
                    <p className="mt-1 text-xs text-muted-foreground">
                      em até 3x sem juros
                    </p>
                  </div>
                </div>
              </div>
              <div className="mt-8">
                 <Button
                  onClick={handleProceedToPayment}
                  disabled={!selectedShipping || cartItems.length === 0}
                  className="group flex h-auto w-full items-center justify-center rounded-full bg-primary py-4 px-6 text-lg font-bold text-primary-foreground shadow-xl shadow-primary/20 transition-all hover:scale-[1.02] hover:bg-yellow-400 hover:shadow-primary/40 focus:ring-4 focus:ring-primary/30"
                >
                  <LockOpen className="mr-2 transition-transform group-hover:scale-110" />
                  Ir para Pagamento
                </Button>
                <div className="mt-6 flex flex-col items-center gap-3">
                  <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wide text-muted-foreground">
                    <Lock className="size-4" />
                    Ambiente 100% Seguro
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      <footer className="mt-auto border-t bg-card py-8 dark:bg-black/20">
        <div className="mx-auto max-w-7xl px-4 text-center text-sm text-muted-foreground">
          <p>
            © {new Date().getFullYear()} Perfumes & Decantes. Todos os direitos
            reservados.
          </p>
        </div>
      </footer>
    </div>
  );
}
