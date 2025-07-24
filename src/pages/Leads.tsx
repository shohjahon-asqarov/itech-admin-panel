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
import { Lead } from '@/types';
import { LeadService } from '@/services';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { formatDate } from '@/utils';
import { ConfirmDialog } from '@/components/ui/confirm-dialog';

const Leads: React.FC = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);
  const [deleteDialog, setDeleteDialog] = useState<{ open: boolean; leadId: string | null }>({ open: false, leadId: null });
  const queryClient = useQueryClient();

  // Fetch leads (GET)
  const {
    data: leads = [],
    isLoading,
    isError,
    error,
    refetch,
  } = useQuery({
    queryKey: ['leads'],
    queryFn: async () => {
      return await LeadService.getAll();
    },
  });

  // Delete lead (DELETE)
  const {
    mutate: deleteLead,
    isLoading: isDeleting,
    error: deleteError,
  } = useMutation({
    mutationFn: (id: string) => LeadService.delete(id),
    onSuccess: () => {
      toast.success("Lid muvaffaqiyatli o'chirildi!");
      queryClient.invalidateQueries({ queryKey: ['leads'] });
    },
    onError: (err: any) => {
      toast.error(err?.message || 'Lidni o‘chirishda xatolik!');
    },
  });

  const filteredLeads = leads.filter((lead: Lead) => {
    const matchesSearch = lead.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      lead.phone.includes(searchTerm) ||
      (lead.course?.title || '').toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'ALL' || lead.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const getStatusVariant = (status: Lead['status']) => {
    switch (status) {
      case 'NEW': return 'default';
      case 'CONTACTED': return 'secondary';
      case 'ENROLLED': return 'default';
      case 'REJECTED': return 'destructive';
      default: return 'default';
    }
  };

  const getStatusText = (status: Lead['status']) => {
    switch (status) {
      case 'NEW': return 'Yangi';
      case 'CONTACTED': return 'Aloqa qilindi';
      case 'ENROLLED': return "Ro'yxatdan o'tdi";
      case 'REJECTED': return 'Bekor qilindi';
      default: return status;
    }
  };

  const getStatusColor = (status: Lead['status']) => {
    switch (status) {
      case 'NEW': return 'bg-blue-100 text-blue-700 border-blue-200';
      case 'CONTACTED': return 'bg-yellow-100 text-yellow-700 border-yellow-200';
      case 'ENROLLED': return 'bg-green-100 text-green-700 border-green-200';
      case 'REJECTED': return 'bg-red-100 text-red-700 border-red-200';
      default: return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  const handleDelete = (leadId: string) => {
    setDeleteDialog({ open: true, leadId });
  };

  const stats = {
    total: leads.length,
    new: leads.filter(l => l.status === 'NEW').length,
    contacted: leads.filter(l => l.status === 'CONTACTED').length,
    enrolled: leads.filter(l => l.status === 'ENROLLED').length,
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Lidlar yuklanmoqda...</p>
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-red-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-red-600">Xatolik: {(error as Error)?.message || 'Lidlarni yuklashda xatolik!'}</p>
          <Button onClick={() => refetch()} className="mt-4">Qayta yuklash</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 lg:space-y-8 p-4 lg:p-0">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
            Lidlar
          </h1>
          <p className="text-gray-600 text-sm lg:text-base">Potensial talabalarni boshqarish va kuzatish</p>
        </div>
        <Button
          onClick={() => navigate('/leads/new')}
          className="bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600 text-white shadow-lg rounded-xl w-full sm:w-auto"
        >
          <Plus className="mr-2 h-4 w-4" />
          Yangi Lid
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 lg:gap-6">
        <Card className="border-0 shadow-lg bg-gradient-to-br from-blue-50 to-indigo-50 hover:shadow-xl transition-all duration-300">
          <CardContent className="p-4 lg:p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs lg:text-sm font-medium text-gray-600">Jami Lidlar</p>
                <p className="text-2xl lg:text-3xl font-bold text-blue-600">{stats.total}</p>
              </div>
              <div className="p-2 lg:p-3 bg-blue-500 rounded-xl lg:rounded-2xl">
                <Phone className="text-white" size={20} />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-lg bg-gradient-to-br from-green-50 to-emerald-50 hover:shadow-xl transition-all duration-300">
          <CardContent className="p-4 lg:p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs lg:text-sm font-medium text-gray-600">Yangi</p>
                <p className="text-2xl lg:text-3xl font-bold text-green-600">{stats.new}</p>
              </div>
              <div className="p-2 lg:p-3 bg-green-500 rounded-xl lg:rounded-2xl">
                <Plus className="text-white" size={20} />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-lg bg-gradient-to-br from-yellow-50 to-amber-50 hover:shadow-xl transition-all duration-300">
          <CardContent className="p-4 lg:p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs lg:text-sm font-medium text-gray-600">Aloqa qilindi</p>
                <p className="text-2xl lg:text-3xl font-bold text-yellow-600">{stats.contacted}</p>
              </div>
              <div className="p-2 lg:p-3 bg-yellow-500 rounded-xl lg:rounded-2xl">
                <Phone className="text-white" size={20} />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-lg bg-gradient-to-br from-purple-50 to-violet-50 hover:shadow-xl transition-all duration-300">
          <CardContent className="p-4 lg:p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs lg:text-sm font-medium text-gray-600">Ro'yxatdan o'tdi</p>
                <p className="text-2xl lg:text-3xl font-bold text-purple-600">{stats.enrolled}</p>
              </div>
              <div className="p-2 lg:p-3 bg-purple-500 rounded-xl lg:rounded-2xl">
                <Calendar className="text-white" size={20} />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card className="border-0 shadow-lg bg-white/90 backdrop-blur-sm">
        <CardContent className="p-4 lg:p-6">
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
                <SelectTrigger className="w-full sm:w-[180px] rounded-xl border-gray-200">
                  <SelectValue placeholder="Status tanlang" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ALL">Barcha statuslar</SelectItem>
                  <SelectItem value="NEW">Yangi</SelectItem>
                  <SelectItem value="CONTACTED">Aloqa qilindi</SelectItem>
                  <SelectItem value="ENROLLED">Ro'yxatdan o'tdi</SelectItem>
                  <SelectItem value="REJECTED">Bekor qilindi</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Leads Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 lg:gap-6">
        {filteredLeads.map((lead) => (
          <Card key={lead.id} className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-[1.02] bg-white/90 backdrop-blur-sm group">
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div className="flex items-center space-x-3">
                  <Avatar className="w-10 h-10 lg:w-12 lg:h-12 ring-2 ring-gray-200">
                    <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-600 text-white font-semibold text-sm">
                      {lead.name.split(' ').map(n => n[0]).join('')}
                    </AvatarFallback>
                  </Avatar>
                  <div className="min-w-0 flex-1">
                    <CardTitle className="text-base lg:text-lg font-bold text-gray-900 truncate">{lead.name}</CardTitle>
                    <CardDescription className="text-gray-600 text-sm truncate">
                      {lead.course?.title || 'Kurs tanlanmagan'}
                    </CardDescription>
                  </div>
                </div>
                <div className={`px-2 py-1 rounded-lg text-xs font-medium border ${getStatusColor(lead.status)}`}>
                  {getStatusText(lead.status)}
                </div>
              </div>
            </CardHeader>

            <CardContent className="space-y-4">
              <div className="space-y-2">
                <div className="flex items-center text-sm text-gray-600">
                  <Phone size={14} className="mr-2 text-gray-400 flex-shrink-0" />
                  <span className="truncate">{lead.phone}</span>
                </div>
                {lead.email && (
                  <div className="flex items-center text-sm text-gray-600">
                    <Mail size={14} className="mr-2 text-gray-400 flex-shrink-0" />
                    <span className="truncate">{lead.email}</span>
                  </div>
                )}
                <div className="flex items-center text-sm text-gray-600">
                  <Calendar size={14} className="mr-2 text-gray-400 flex-shrink-0" />
                  <span className="truncate">{formatDate(lead.createdAt)}</span>
                </div>
              </div>

              {lead.message && (
                <div className="p-3 bg-gray-50 rounded-xl border border-gray-100">
                  <p className="text-sm text-gray-600 italic line-clamp-2">"{lead.message}"</p>
                </div>
              )}

              <div className="flex items-center justify-between pt-2 border-t border-gray-100">
                <p className="text-xs text-gray-500">
                  {formatDate(lead.createdAt)}
                </p>

                <div className="flex items-center space-x-1">
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => setSelectedLead(lead)}
                        className="hover:bg-blue-50 hover:text-blue-600 rounded-xl h-8 w-8"
                      >
                        <Eye className="h-3 w-3" />
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-md">
                      <DialogHeader>
                        <DialogTitle>Lid ma'lumotlari</DialogTitle>
                        <DialogDescription>
                          {selectedLead?.name} haqida batafsil ma'lumot
                        </DialogDescription>
                      </DialogHeader>
                      {selectedLead && (
                        <div className="space-y-4">
                          <div className="flex items-center space-x-3">
                            <Avatar className="w-12 h-12">
                              <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-600 text-white font-semibold">
                                {selectedLead.name.split(' ').map(n => n[0]).join('')}
                              </AvatarFallback>
                            </Avatar>
                            <div>
                              <h3 className="font-semibold text-gray-900">{selectedLead.name}</h3>
                              <p className="text-sm text-gray-600">{selectedLead.course?.title || 'Kurs tanlanmagan'}</p>
                            </div>
                          </div>

                          <div className="space-y-2">
                            <div className="flex items-center text-sm">
                              <Phone size={16} className="mr-2 text-gray-400" />
                              <span>{selectedLead.phone}</span>
                            </div>
                            {selectedLead.email && (
                              <div className="flex items-center text-sm">
                                <Mail size={16} className="mr-2 text-gray-400" />
                                <span>{selectedLead.email}</span>
                              </div>
                            )}
                            <div className="flex items-center text-sm">
                              <Calendar size={16} className="mr-2 text-gray-400" />
                              <span>{formatDate(selectedLead.createdAt)}</span>
                            </div>
                            <div className="flex items-center text-sm">
                              <Badge className={getStatusColor(selectedLead.status)}>
                                {getStatusText(selectedLead.status)}
                              </Badge>
                            </div>
                          </div>

                          {selectedLead.message && (
                            <div className="p-3 bg-gray-50 rounded-lg">
                              <p className="text-sm text-gray-600">{selectedLead.message}</p>
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
                    className="hover:bg-green-50 hover:text-green-600 rounded-xl h-8 w-8"
                  >
                    <Edit className="h-3 w-3" />
                  </Button>

                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleDelete(lead.id)}
                    className="hover:bg-red-50 hover:text-red-600 rounded-xl h-8 w-8"
                    disabled={isDeleting}
                  >
                    {isDeleting ? (
                      <span className="w-4 h-4 border-2 border-red-300 border-t-red-600 rounded-full animate-spin block mx-auto"></span>
                    ) : (
                      <Trash2 className="h-3 w-3" />
                    )}
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredLeads.length === 0 && !isLoading && (
        <Card className="border-0 shadow-lg bg-white/90 backdrop-blur-sm">
          <CardContent className="p-8 text-center">
            <div className="text-gray-400 mb-4">
              <Phone size={48} className="mx-auto" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Lidlar topilmadi</h3>
            <p className="text-gray-600 mb-4">
              {searchTerm || statusFilter !== 'ALL'
                ? 'Qidiruv natijalariga mos lidlar yo\'q'
                : 'Hali hech qanday lid qo\'shilmagan'
              }
            </p>
            {!searchTerm && statusFilter === 'ALL' && (
              <Button
                onClick={() => navigate('/leads/new')}
                className="bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600 text-white"
              >
                <Plus className="mr-2 h-4 w-4" />
                Birinchi lidni qo'shing
              </Button>
            )}
          </CardContent>
        </Card>
      )}
      {deleteError && (
        <div className="p-4 bg-destructive/10 border border-destructive/20 rounded-lg mt-4">
          <p className="text-destructive text-sm font-medium">{(deleteError as Error)?.message || 'Lidni o‘chirishda xatolik!'}</p>
        </div>
      )}
      <ConfirmDialog
        open={deleteDialog.open}
        title="Lidni o'chirishni tasdiqlang"
        description="Ushbu lidni o'chirishni xohlaysizmi? Ushbu amalni bekor qilib bo'lmaydi."
        confirmText="Ha, o'chirish"
        cancelText="Bekor qilish"
        loading={isDeleting}
        onCancel={() => setDeleteDialog({ open: false, leadId: null })}
        onConfirm={() => {
          if (deleteDialog.leadId) {
            deleteLead(deleteDialog.leadId, {
              onSettled: () => setDeleteDialog({ open: false, leadId: null })
            });
          }
        }}
      />
    </div>
  );
};

export default Leads;