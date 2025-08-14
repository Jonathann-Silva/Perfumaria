
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
} from '@/components/ui/dialog';
import { customers } from '@/lib/data';
import type { Customer } from '@/lib/types';
import { PlusCircle, User, Mail, Phone, Car } from 'lucide-react';

export default function CustomersPage() {
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(
    null
  );

  return (
    <>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold tracking-tight">Clientes</h1>
          <Button>
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
                    onClick={() => setSelectedCustomer(customer)}
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

      {selectedCustomer && (
        <Dialog
          open={!!selectedCustomer}
          onOpenChange={(isOpen) => !isOpen && setSelectedCustomer(null)}
        >
          <DialogContent>
            <DialogHeader>
              <DialogTitle>
                <div className="flex items-center gap-2">
                  <User className="h-6 w-6" />
                  <span>{selectedCustomer.name}</span>
                </div>
              </DialogTitle>
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
            </DialogHeader>
            <div className='mt-4'>
                <h4 className='font-semibold mb-2'>Histórico de Serviços</h4>
                <p className='text-sm text-muted-foreground'>Último serviço em: {selectedCustomer.lastService}</p>
                 {/* Aqui poderia ir uma lista mais detalhada do histórico */}
            </div>
          </DialogContent>
        </Dialog>
      )}
    </>
  );
}
