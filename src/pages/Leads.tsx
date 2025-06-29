import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Filter, Plus, Phone, Mail, Eye, Edit, Calendar, MapPin, Trash2 } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { toast } from 'react-toastify';
import { mockLeads } from '@/data/mockData';
import { Lead } from '@/types';

const Leads: React.FC = () => {
  const navigate = useNavigate();
  const [leads, setLeads] = useState<Lead[]>(mockLeads);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);

  const filteredLeads = leads.filter(lead => {
    const matchesSearch = lead.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         lead.phone.includes(searchTerm) ||
                         lead.course.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || lead.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const getStatusVariant = (status: Lead['status']) => {
    switch (status) {
      case 'new': return 'info';
      case 'contacted': return 'warning';
      case 'enrolled': return 'success';
      case 'cancelled': return 'destructive';
      default: return 'default';
    }
  };

  const getStatusText = (status: Lead['status']) => {
    switch (status) {
      case 'new': return 'Yangi';
      case 'contacted': return 'Aloqa qilindi';
      case 'enrolled': return "Ro'yxatdan o'tdi";
      case 'cancelled': return 'Bekor qilindi';
      default: return status;
    }
  };

  const handleDelete = (leadId: string) => {
    if (confirm('Lidni o\'chirishni xohlaysizmi?')) {
      setLeads(leads.filter(lead => lead.id !== leadId));
      toast.success('Lid muvaffaqiyatli o\'chirildi!', {
        position: "top-right",
        autoClose: 3000,
      });
    }
  };

  const stats = {
    total: leads.length,
    new: leads.filter(l => l.status === 'new').length,
    contacted: leads.filter(l => l.status === 'contacted').length,
    enrolled: leads.filter(l => l.status === 'enrolled').length,
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
            Lidlar
          </h1>
          <p className="text-gray-600">Potensial talabalarni boshqarish va kuzatish</p>
        </div>
        <Button
          onClick={() => navigate('/leads/new')}
          className="bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600 text-white shadow-lg rounded-xl"
        >
          <Plus className="mr-2 h-4 w-4" />
          Yangi Lid
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="border-0 shadow-lg bg-gradient-to-br from-blue-50 to-indigo-50 hover:shadow-xl transition-all duration-300">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Jami Lidlar</p>
                <p className="text-3xl font-bold text-blue-600">{stats.total}</p>
              </div>
              <div className="p-3 bg-blue-500 rounded-2xl">
                <Phone className="text-white" size={24} />
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="border-0 shadow-lg bg-gradient-to-br from-green-50 to-emerald-50 hover:shadow-xl transition-all duration-300">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Yangi</p>
                <p className="text-3xl font-bold text-green-600">{stats.new}</p>
              </div>
              <div className="p-3 bg-green-500 rounded-2xl">
                <Plus className="text-white" size={24} />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-lg bg-gradient-to-br from-yellow-50 to-amber-50 hover:shadow-xl transition-all duration-300">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Aloqa qilindi</p>
                <p className="text-3xl font-bold text-yellow-600">{stats.contacted}</p>
              </div>
              <div className="p-3 bg-yellow-500 rounded-2xl">
                <Phone className="text-white" size={24} />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-lg bg-gradient-to-br from-purple-50 to-violet-50 hover:shadow-xl transition-all duration-300">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Ro'yxatdan o'tdi</p>
                <p className="text-3xl font-bold text-purple-600">{stats.enrolled}</p>
              </div>
              <div className="p-3 bg-purple-500 rounded-2xl">
                <Calendar className="text-white" size={24} />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
        <CardContent className="p-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                <Input
                  placeholder="Ism, telefon yoki kurs bo'yicha qidirish..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 rounded-xl border-gray-200"
                />
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Filter size={20} className="text-gray-400" />
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-[180px] rounded-xl border-gray-200">
                  <SelectValue placeholder="Status tanlang" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Barcha statuslar</SelectItem>
                  <SelectItem value="new">Yangi</SelectItem>
                  <SelectItem value="contacted">Aloqa qilindi</SelectItem>
                  <SelectItem value="enrolled">Ro'yxatdan o'tdi</SelectItem>
                  <SelectItem value="cancelled">Bekor qilindi</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Leads Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredLeads.map((lead) => (
          <Card key={lead.id} className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-[1.02] bg-white/80 backdrop-blur-sm group">
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div className="flex items-center space-x-3">
                  <Avatar className="w-12 h-12 ring-2 ring-gray-200">
                    <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-600 text-white font-semibold">
                      {lead.name.split(' ').map(n => n[0]).join('')}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <CardTitle className="text-lg font-bold text-gray-900">{lead.name}</CardTitle>
                    <CardDescription className="text-gray-600">{lead.course}</CardDescription>
                  </div>
                </div>
                <Badge variant={getStatusVariant(lead.status)} className="shadow-sm">
                  {getStatusText(lead.status)}
                </Badge>
              </div>
            </CardHeader>

            <CardContent className="space-y-4">
              <div className="space-y-2">
                <div className="flex items-center text-sm text-gray-600">
                  <Phone size={16} className="mr-2 text-gray-400" />
                  {lead.phone}
                </div>
                {lead.email && (
                  <div className="flex items-center text-sm text-gray-600">
                    <Mail size={16} className="mr-2 text-gray-400" />
                    {lead.email}
                  </div>
                )}
                <div className="flex items-center text-sm text-gray-600">
                  <MapPin size={16} className="mr-2 text-gray-400" />
                  {lead.source}
                </div>
              </div>

              {lead.notes && (
                <div className="p-3 bg-gray-50 rounded-xl border border-gray-100">
                  <p className="text-sm text-gray-600 italic">"{lead.notes}"</p>
                </div>
              )}

              <div className="flex items-center justify-between pt-2 border-t border-gray-100">
                <p className="text-xs text-gray-500">
                  {new Date(lead.createdAt).toLocaleDateString('uz-UZ')}
                </p>
                
                <div className="flex items-center space-x-1">
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => setSelectedLead(lead)}
                        className="hover:bg-blue-50 hover:text-blue-600 rounded-xl"
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-2xl">
                      <DialogHeader>
                        <DialogTitle>Lid Tafsilotlari</DialogTitle>
                        <DialogDescription>To'liq ma'lumotlar va tarix</DialogDescription>
                      </DialogHeader>
                      {selectedLead && (
                        <div className="space-y-6">
                          <div className="flex items-center space-x-4">
                            <Avatar className="w-16 h-16 ring-2 ring-gray-200">
                              <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-600 text-white text-lg font-semibold">
                                {selectedLead.name.split(' ').map(n => n[0]).join('')}
                              </AvatarFallback>
                            </Avatar>
                            <div className="space-y-1">
                              <h3 className="text-xl font-semibold">{selectedLead.name}</h3>
                              <p className="text-gray-600">{selectedLead.course}</p>
                              <Badge variant={getStatusVariant(selectedLead.status)}>
                                {getStatusText(selectedLead.status)}
                              </Badge>
                            </div>
                          </div>
                          
                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <p className="font-medium">Telefon</p>
                              <p className="text-gray-600">{selectedLead.phone}</p>
                            </div>
                            <div>
                              <p className="font-medium">Email</p>
                              <p className="text-gray-600">{selectedLead.email || 'Ko\'rsatilmagan'}</p>
                            </div>
                            <div>
                              <p className="font-medium">Manba</p>
                              <p className="text-gray-600">{selectedLead.source}</p>
                            </div>
                            <div>
                              <p className="font-medium">Sana</p>
                              <p className="text-gray-600">{new Date(selectedLead.createdAt).toLocaleDateString('uz-UZ')}</p>
                            </div>
                          </div>
                          
                          {selectedLead.notes && (
                            <div>
                              <p className="font-medium mb-2">Izohlar</p>
                              <div className="p-4 bg-gray-50 rounded-xl">
                                <p className="text-gray-600 italic">"{selectedLead.notes}"</p>
                              </div>
                            </div>
                          )}
                        </div>
                      )}
                    </DialogContent>
                  </Dialog>
                  
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => navigate(`/leads/${lead.id}`)}
                    className="hover:bg-green-50 hover:text-green-600 rounded-xl"
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleDelete(lead.id)}
                    className="hover:bg-red-50 hover:text-red-600 rounded-xl"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default Leads;