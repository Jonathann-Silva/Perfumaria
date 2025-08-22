
'use client';

import { useState, useEffect } from 'react';
import { db } from '@/lib/firebase';
import { collection, getDocs, addDoc, doc, updateDoc } from 'firebase/firestore';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
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
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import type { Customer } from '@/lib/types';
import { PlusCircle, User, Mail, Phone, Car, Edit, X, Save, Home, Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/components/auth-provider';

export default function CustomersPage() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editingCustomer, setEditingCustomer] = useState<Customer | null>(null);
  const [isNewCustomerDialogOpen, setIsNewCustomerDialogOpen] = useState(false);
  const [newCustomerData, setNewCustomerData] = useState({
    name: '',
    email: '',
    phone: '',
    vehicle: '',
    vehiclePlate: '',
    addressStreet: '',
    addressNeighborhood: '',
    addressNumber: '',
  });

  const fetchCustomers = async () => {
    if (!user) return;
    try {
      const customersCollection = collection(db, 'users', user.uid, 'customers');
      const customersSnapshot = await getDocs(customersCollection);
      const customersList = customersSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Customer));
      setCustomers(customersList);
    } catch (error) {
      console.error("Error fetching customers: ", error);
      toast({
        title: 'Erro ao buscar clientes',
        description: 'Não foi possível carregar a lista de clientes.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if(user) {
        fetchCustomers();
    }
  }, [user]);

  const handleRowClick = (customer: Customer) => {
    setSelectedCustomer(customer);
    setEditingCustomer({ ...customer });
    setIsEditing(false);
  };

  const handleCloseDialog = () => {
    setSelectedCustomer(null);
    setEditingCustomer(null);
    setIsEditing(false);
  };

  const handleSave = async () => {
    if (!editingCustomer || !editingCustomer.id || !user) return;

    try {
        const customerDoc = doc(db, 'users', user.uid, 'customers', editingCustomer.id);
        const { id, ...customerToUpdate } = editingCustomer;
        await updateDoc(customerDoc, customerToUpdate);
        
        toast({
            title: 'Cliente atualizado!',
            description: 'Os dados do cliente foram salvos com sucesso.',
        });

        // Update local state
        const updatedCustomers = customers.map(c => 
            c.id === editingCustomer.id ? editingCustomer : c
        );
        setCustomers(updatedCustomers);
        setSelectedCustomer(editingCustomer);
        setIsEditing(false);
    } catch (error) {
        console.error("Error updating customer: ", error);
        toast({
            title: 'Erro ao atualizar',
            description: 'Não foi possível salvar as alterações.',
            variant: 'destructive',
        });
    }
  };

  const handleEditInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!editingCustomer) return;
    const { id, value } = e.target;
    setEditingCustomer({ ...editingCustomer, [id]: value });
  };

  const handleNewCustomerInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setNewCustomerData({ ...newCustomerData, [id]: value });
  };

  const handleAddNewCustomer = async () => {
    if (!user) return;
    try {
        const newCustomer: Omit<Customer, 'id' | 'lastService'> = {
            ...newCustomerData,
        };
        const docRef = await addDoc(collection(db, 'users', user.uid, 'customers'), {
            ...newCustomer,
            lastService: new Date().toISOString().split('T')[0],
        });

        setCustomers([...customers, { id: docRef.id, ...newCustomer, lastService: new Date().toISOString().split('T')[0] }]);
        setIsNewCustomerDialogOpen(false);
        setNewCustomerData({
            name: '',
            email: '',
            phone: '',
            vehicle: '',
            vehiclePlate: '',
            addressStreet: '',
            addressNeighborhood: '',
            addressNumber: '',
        });
         toast({
            title: 'Cliente adicionado!',
            description: 'O novo cliente foi salvo com sucesso.',
        });
    } catch (error) {
        console.error("Error adding customer: ", error);
         toast({
            title: 'Erro ao adicionar cliente',
            description: 'Não foi possível salvar o novo cliente.',
            variant: 'destructive',
        });
    }
  };

  return (
    <>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold tracking-tight">Clientes</h1>
          <Button onClick={() => setIsNewCustomerDialogOpen(true)}>
            <PlusCircle className="mr-2 h-4 w-4" />
            Novo Cliente
          </Button>
        </div>
        <Card>
          <CardHeader>
            <CardTitle>Lista de Clientes</CardTitle>
          </CardHeader>
          <CardContent>
             {isLoading ? (
                <div className="flex justify-center items-center h-40">
                    <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
                </div>
            ) : (
                <Table>
                <TableHeader>
                    <TableRow>
                    <TableHead>Nome</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Telefone</TableHead>
                    <TableHead>Veículo</TableHead>
                    <TableHead>Último Serviço</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {customers.map((customer) => (
                    <TableRow
                        key={customer.id}
                        className="cursor-pointer"
                        onClick={() => handleRowClick(customer)}
                    >
                        <TableCell className="font-medium">
                        {customer.name}
                        </TableCell>
                        <TableCell>{customer.email}</TableCell>
                        <TableCell>{customer.phone}</TableCell>
                        <TableCell>{customer.vehicle}</TableCell>
                        <TableCell>{customer.lastService}</TableCell>
                    </TableRow>
                    ))}
                </TableBody>
                </Table>
            )}
          </CardContent>
        </Card>
      </div>

      {/* New Customer Dialog */}
      <Dialog open={isNewCustomerDialogOpen} onOpenChange={setIsNewCustomerDialogOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Adicionar Novo Cliente</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="name" className="text-right">Nome</Label>
              <Input id="name" value={newCustomerData.name} onChange={handleNewCustomerInputChange} className="col-span-3" />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="email" className="text-right">Email</Label>
              <Input id="email" value={newCustomerData.email} onChange={handleNewCustomerInputChange} className="col-span-3" />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="phone" className="text-right">Telefone</Label>
              <Input id="phone" value={newCustomerData.phone} onChange={handleNewCustomerInputChange} className="col-span-3" />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="vehicle" className="text-right">Veículo/Placa</Label>
                <div className="col-span-3 grid grid-cols-3 gap-2">
                    <Input id="vehicle" placeholder="Veículo" value={newCustomerData.vehicle} onChange={handleNewCustomerInputChange} className="col-span-2" />
                    <Input id="vehiclePlate" placeholder="Placa" value={newCustomerData.vehiclePlate} onChange={handleNewCustomerInputChange} className="col-span-1" />
                </div>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="addressStreet" className="text-right">Rua</Label>
              <Input id="addressStreet" value={newCustomerData.addressStreet} onChange={handleNewCustomerInputChange} className="col-span-3" />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="addressNeighborhood" className="text-right">Bairro/Número</Label>
                <div className="col-span-3 grid grid-cols-3 gap-2">
                    <Input id="addressNeighborhood" placeholder="Bairro" value={newCustomerData.addressNeighborhood} onChange={handleNewCustomerInputChange} className="col-span-2" />
                    <Input id="addressNumber" placeholder="Nº" value={newCustomerData.addressNumber} onChange={handleNewCustomerInputChange} className="col-span-1" />
                </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsNewCustomerDialogOpen(false)}>
              <X className="mr-2 h-4 w-4" /> Cancelar
            </Button>
            <Button onClick={handleAddNewCustomer}>
              <Save className="mr-2 h-4 w-4" /> Salvar Cliente
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Customer Details/Edit Dialog */}
      {selectedCustomer && (
        <Dialog
          open={!!selectedCustomer}
          onOpenChange={(isOpen) => !isOpen && handleCloseDialog()}
        >
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle>
                <div className="flex items-center gap-2">
                  <User className="h-6 w-6" />
                  <span>{isEditing ? 'Editando Cliente' : selectedCustomer.name}</span>
                </div>
              </DialogTitle>
              {!isEditing && (
                  <DialogDescription asChild>
                    <div className="pt-4 space-y-2">
                      <div className="flex items-center gap-2">
                        <Mail className="h-4 w-4 text-muted-foreground" />
                        <span>{selectedCustomer.email}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Phone className="h-4 w-4 text-muted-foreground" />
                        <span>{selectedCustomer.phone}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Car className="h-4 w-4 text-muted-foreground" />
                        <span>{selectedCustomer.vehicle} ({selectedCustomer.vehiclePlate})</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Home className="h-4 w-4 text-muted-foreground" />
                        <span>{selectedCustomer.addressStreet}, {selectedCustomer.addressNumber} - {selectedCustomer.addressNeighborhood}</span>
                      </div>
                    </div>
                  </DialogDescription>
              )}
            </DialogHeader>

            {isEditing && editingCustomer ? (
                <div className="grid gap-4 py-4">
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="name" className="text-right">Nome</Label>
                        <Input id="name" value={editingCustomer.name} onChange={handleEditInputChange} className="col-span-3" />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="email" className="text-right">Email</Label>
                        <Input id="email" value={editingCustomer.email} onChange={handleEditInputChange} className="col-span-3" />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="phone" className="text-right">Telefone</Label>
                        <Input id="phone" value={editingCustomer.phone} onChange={handleEditInputChange} className="col-span-3" />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="vehicle" className="text-right">Veículo/Placa</Label>
                        <div className="col-span-3 grid grid-cols-3 gap-2">
                            <Input id="vehicle" placeholder="Veículo" value={editingCustomer.vehicle} onChange={handleEditInputChange} className="col-span-2" />
                            <Input id="vehiclePlate" placeholder="Placa" value={editingCustomer.vehiclePlate} onChange={handleEditInputChange} className="col-span-1" />
                        </div>
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="addressStreet" className="text-right">Rua</Label>
                        <Input id="addressStreet" value={editingCustomer.addressStreet} onChange={handleEditInputChange} className="col-span-3" />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="addressNeighborhood" className="text-right">Bairro/Número</Label>
                        <div className="col-span-3 grid grid-cols-3 gap-2">
                            <Input id="addressNeighborhood" placeholder="Bairro" value={editingCustomer.addressNeighborhood} onChange={handleEditInputChange} className="col-span-2" />
                            <Input id="addressNumber" placeholder="Nº" value={editingCustomer.addressNumber} onChange={handleEditInputChange} className="col-span-1" />
                        </div>
                    </div>
                </div>
            ) : (
                <div className='mt-4'>
                    <h4 className='font-semibold mb-2'>Histórico de Serviços</h4>
                    <p className='text-sm text-muted-foreground'>Último serviço em: {selectedCustomer.lastService}</p>
                </div>
            )}
            
            <DialogFooter>
                {isEditing ? (
                    <>
                        <Button variant="outline" onClick={() => setIsEditing(false)}>
                            <X className="mr-2 h-4 w-4" /> Cancelar
                        </Button>
                        <Button onClick={handleSave}>
                            <Save className="mr-2 h-4 w-4" /> Salvar
                        </Button>
                    </>
                ) : (
                    <Button variant="outline" onClick={() => setIsEditing(true)}>
                      <Edit className="mr-2 h-4 w-4" /> Editar Cliente
                    </Button>
                )}
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </>
  );
}
