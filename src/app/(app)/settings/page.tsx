
'use client';

import { useState, useEffect } from 'react';
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
import { useToast } from '@/hooks/use-toast';
import { db } from '@/lib/firebase';
import { doc, setDoc } from 'firebase/firestore';
import { Loader2, Save } from 'lucide-react';
import { useShop } from '@/components/shop-provider';
import type { ShopProfile } from '@/lib/types';

export default function SettingsPage() {
  const { toast } = useToast();
  const { profile: initialProfile, loading: isLoading } = useShop();
  const [profile, setProfile] = useState<ShopProfile | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (initialProfile) {
      setProfile(initialProfile);
    }
  }, [initialProfile]);


  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    if (profile) {
      setProfile((prevProfile) => ({ ...prevProfile!, [id]: value }));
    }
  };

  const handleSave = async () => {
    if (!profile) return;
    setIsSaving(true);
    try {
      const docRef = doc(db, 'shopSettings', 'profile');
      await setDoc(docRef, profile, { merge: true });
      toast({
        title: 'Sucesso!',
        description: 'As informações da oficina foram salvas.',
      });
    } catch (error) {
      console.error("Error saving profile: ", error);
      toast({
        title: 'Erro ao salvar',
        description: 'Não foi possível salvar as alterações.',
        variant: 'destructive',
      });
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading || !profile) {
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
            <div className="flex justify-center items-center h-24">
              <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

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
            <>
              <div className="space-y-2">
                <Label htmlFor="name">Nome da Oficina</Label>
                <Input id="name" value={profile.name} onChange={handleInputChange} />
              </div>
               <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="phone">Telefone pra contato</Label>
                  <Input id="phone" type="tel" value={profile.phone} onChange={handleInputChange} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="cnpj">CNPJ</Label>
                  <Input id="cnpj" value={profile.cnpj} onChange={handleInputChange} />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="address">Endereço</Label>
                <Input id="address" value={profile.address} onChange={handleInputChange} />
              </div>
              <Button onClick={handleSave} disabled={isSaving}>
                {isSaving ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  <Save className="mr-2 h-4 w-4" />
                )}
                Salvar Alterações
              </Button>
            </>
        </CardContent>
      </Card>
    </div>
  );
}
