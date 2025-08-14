
'use client';

import { useState } from 'react';
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
import { customers as initialCustomers } from '@/lib/data';
import type { Customer } from '@/lib/types';
import { PlusCircle, User, Mail, Phone, Car, Edit, X, Save } from 'lucide-react';

export default function CustomersPage() {
  const [customers, setCustomers] = useState<Customer[]>(initialCustomers);
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editingCustomer, setEditingCustomer] = useState<Customer | null>(null);
  const [isNewCustomerDialogOpen, setIsNewCustomerDialogOpen] = useState(false);
  const [newCustomerData, setNewCustomerData] = useState({
    name: '',
    email: '',
    phone: '',
    vehicle: '',
  });

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

  const handleSave = () => {
    if (!editingCustomer) return;

    const updatedCustomers = customers.map(c => 
        c.id === editingCustomer.id ? editingCustomer : c
    );
    setCustomers(updatedCustomers);
    setSelectedCustomer(editingCustomer);
    setIsEditing(false);
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

  const handleAddNewCustomer = () => {
    const newCustomer: Customer = {
      id: `${Date.now()}`,
      ...newCustomerData,
      lastService: new Date().toISOString().split('T')[0], // Today's date
    };
    setCustomers([...customers, newCustomer]);
    setIsNewCustomerDialogOpen(false);
    setNewCustomerData({ name: '', email: '', phone: '', vehicle: '' }); // Reset form
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
          </CardContent>
        </Card>
      </div>

      {/* New Customer Dialog */}
      <Dialog open={isNewCustomerDialogOpen} onOpenChange={setIsNewCustomerDialogOpen}>
        <DialogContent>
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
              <Label htmlFor="vehicle" className="text-right">Veículo</Label>
              <Input id="vehicle" value={newCustomerData.vehicle} onChange={handleNewCustomerInputChange} className="col-span-3" />
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
          <DialogContent>
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
                        <span>{selectedCustomer.vehicle}</span>
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
                        <Label htmlFor="vehicle" className="text-right">Veículo</Label>
                        <Input id="vehicle" value={editingCustomer.vehicle} onChange={handleEditInputChange} className="col-span-3" />
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
