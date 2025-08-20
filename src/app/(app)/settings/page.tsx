
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
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { Loader2, Save } from 'lucide-react';

type ShopProfile = {
  name: string;
  email: string;
  address: string;
};

export default function SettingsPage() {
  const { toast } = useToast();
  const [profile, setProfile] = useState<ShopProfile>({
    name: '',
    email: '',
    address: '',
  });
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const docRef = doc(db, 'shopSettings', 'profile');
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setProfile(docSnap.data() as ShopProfile);
        } else {
          // Set default values if no profile exists yet
          setProfile({
            name: 'AutoFlow Oficina',
            email: 'contato@autoflow.com',
            address: 'Avenida Paulista, 1000, São Paulo - SP, 01310-100',
          });
        }
      } catch (error) {
        console.error("Error fetching profile: ", error);
        toast({
          title: 'Erro ao carregar perfil',
          description: 'Não foi possível buscar as informações da oficina.',
          variant: 'destructive',
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchProfile();
  }, [toast]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setProfile((prevProfile) => ({ ...prevProfile, [id]: value }));
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      const docRef = doc(db, 'shopSettings', 'profile');
      await setDoc(docRef, profile);
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
          {isLoading ? (
            <div className="flex justify-center items-center h-24">
              <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
          ) : (
            <>
              <div className="space-y-2">
                <Label htmlFor="name">Nome da Oficina</Label>
                <Input id="name" value={profile.name} onChange={handleInputChange} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email de Contato</Label>
                <Input id="email" type="email" value={profile.email} onChange={handleInputChange} />
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
          )}
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
