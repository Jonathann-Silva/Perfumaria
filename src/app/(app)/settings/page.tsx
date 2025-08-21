
'use client';

import { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
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
import { db, storage } from '@/lib/firebase';
import { doc, setDoc } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { Loader2, Save, Upload } from 'lucide-react';
import { useShop } from '@/components/shop-provider';
import type { ShopProfile } from '@/lib/types';

export default function SettingsPage() {
  const { toast } = useToast();
  const { profile: initialProfile, loading: isLoading, refreshProfile } = useShop();
  const [profile, setProfile] = useState<ShopProfile | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [logoPreview, setLogoPreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);


  useEffect(() => {
    if (initialProfile) {
      setProfile(initialProfile);
      if (initialProfile.logoUrl) {
        setLogoPreview(initialProfile.logoUrl);
      }
    }
  }, [initialProfile]);


  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    if (profile) {
      setProfile((prevProfile) => ({ ...prevProfile!, [id]: value }));
    }
  };

  const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setLogoFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setLogoPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = async () => {
    if (!profile || !initialProfile) return; // Make sure we have initialProfile for required fields
    setIsSaving(true);

    try {
      let logoUrl = profile.logoUrl; // Keep existing logo if not changed

      if (logoFile) {
        // Path in storage: shopLogos/profile_logo.<extension>
        const fileExtension = logoFile.name.split('.').pop();
        const storageRef = ref(storage, `shopLogos/profile_logo.${fileExtension}`);
        await uploadBytes(storageRef, logoFile);
        logoUrl = await getDownloadURL(storageRef);
      }
      
      const profileToSave: ShopProfile = {
        // Ensure all required fields are present by spreading the initial profile
        ...initialProfile,
        ...profile,
        logoUrl: logoUrl || '',
      };

      const docRef = doc(db, 'shopSettings', 'profile');
      await setDoc(docRef, profileToSave, { merge: true });

      // After saving, we clear the temporary file and refresh the context
      setLogoFile(null);
      if (refreshProfile) refreshProfile();

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
        <CardContent className="space-y-6">
            <div className="space-y-4">
                <div className="flex items-center gap-6">
                  <div className="w-24 h-24 rounded-lg bg-muted flex items-center justify-center border">
                      {logoPreview ? (
                        <Image src={logoPreview} alt="Logo da Oficina" width={96} height={96} className="object-contain rounded-lg w-full h-full" />
                      ) : (
                        <span className="text-xs text-muted-foreground text-center">Sua Logo</span>
                      )}
                  </div>
                  <div>
                    <Button variant="outline" onClick={() => fileInputRef.current?.click()}>
                      <Upload className="mr-2 h-4 w-4" />
                      Alterar Logo
                    </Button>
                    <Input 
                      type="file" 
                      ref={fileInputRef} 
                      className="hidden"
                      accept="image/png, image/jpeg, image/webp"
                      onChange={handleLogoChange}
                    />
                    <p className="text-xs text-muted-foreground mt-2">PNG, JPG ou WEBP (Max. 2MB)</p>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="name">Nome da Oficina</Label>
                  <Input id="name" value={profile.name} onChange={handleInputChange} />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="phone">Telefone para contato</Label>
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
            </div>
            
            <Button onClick={handleSave} disabled={isSaving}>
              {isSaving ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <Save className="mr-2 h-4 w-4" />
              )}
              Salvar Alterações
            </Button>
        </CardContent>
      </Card>
    </div>
  );
}
