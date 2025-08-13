
'use client';

import { useState, useMemo } from 'react';
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
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { schedules } from '@/lib/data';
import { PlusCircle, Search } from 'lucide-react';

export default function SchedulesPage() {
  const [searchTerm, setSearchTerm] = useState('');

  const getStatusVariant = (status: 'Agendado' | 'Concluído' | 'Cancelado') => {
    switch (status) {
      case 'Concluído':
        return 'default';
      case 'Agendado':
        return 'secondary';
      case 'Cancelado':
        return 'destructive';
      default:
        return 'outline';
    }
  };

  const filteredSchedules = useMemo(() => {
    if (!searchTerm) {
      return schedules;
    }
    return schedules.filter(
      (schedule) =>
        schedule.customerName
          .toLowerCase()
          .includes(searchTerm.toLowerCase()) ||
        schedule.vehicle.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [searchTerm]);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Agendamentos</h1>
        <Button>
          <PlusCircle className="mr-2 h-4 w-4" />
          Novo Agendamento
        </Button>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Próximos Agendamentos</CardTitle>
           <div className="relative mt-2">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Buscar por cliente, carro ou placa..."
              className="w-full rounded-lg bg-background pl-8"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Cliente</TableHead>
                <TableHead>Veículo</TableHead>
                <TableHead>Serviço</TableHead>
                <TableHead>Data</TableHead>
                <TableHead>Hora</TableHead>
                <TableHead className="text-center">Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredSchedules.map((schedule) => (
                <TableRow key={schedule.id}>
                  <TableCell className="font-medium">
                    {schedule.customerName}
                  </TableCell>
                  <TableCell>{schedule.vehicle}</TableCell>
                  <TableCell>{schedule.service}</TableCell>
                  <TableCell>{schedule.date}</TableCell>
                  <TableCell>{schedule.time}</TableCell>
                  <TableCell className="text-center">
                    <Badge variant={getStatusVariant(schedule.status)}>
                      {schedule.status}
                    </Badge>
                  </TableCell>
                </TableRow>
              ))}
               {filteredSchedules.length === 0 && (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-10 text-muted-foreground">
                    Nenhum agendamento encontrado.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
