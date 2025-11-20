import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Badge } from '../../components/ui/Badge';
import { DocumentStatus, Document, Company, User } from '../../types';
import { Search, Eye, Check, X, FileText, Download, Building2, User as UserIcon, AlertCircle } from 'lucide-react';

export const AdminDashboard: React.FC = () => {
  const { suppliers, documents, updateDocumentStatus } = useApp();
  
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSupplierId, setSelectedSupplierId] = useState<string | null>(null);
  
  // Rejection State
  const [rejectingDoc, setRejectingDoc] = useState<Document | null>(null);
  const [rejectionReason, setRejectionReason] = useState('');

  // --- Derived State & Helpers ---

  // 1. Filter Suppliers
  const filteredSuppliers = suppliers.filter(({ company, responsible }) => {
    const term = searchTerm.toLowerCase();
    return (
      company.fantasyName.toLowerCase().includes(term) ||
      company.cnpj.includes(term) ||
      responsible.name.toLowerCase().includes(term)
    );
  });

  // 2. Get Data for Selected Modal
  const selectedData = selectedSupplierId 
    ? suppliers.find(s => s.company.id === selectedSupplierId)
    : null;
  
  const selectedDocs = selectedSupplierId 
    ? documents.filter(d => d.companyId === selectedSupplierId)
    : [];

  // 3. Calculate Status
  const getStatusStats = (companyId: string) => {
    const docs = documents.filter(d => d.companyId === companyId);
    const pending = docs.filter(d => d.status === DocumentStatus.PENDING).length;
    return { total: docs.length, pending, hasPending: pending > 0 };
  };

  // --- Handlers ---

  const handleApprove = async (doc: Document) => {
    if (window.confirm(`Aprovar documento "${doc.name}"?`)) {
      await updateDocumentStatus(doc.id, DocumentStatus.APPROVED);
    }
  };

  const handleRejectSubmit = async () => {
    if (rejectingDoc && rejectionReason.trim()) {
      await updateDocumentStatus(rejectingDoc.id, DocumentStatus.REJECTED, rejectionReason);
      setRejectingDoc(null);
      setRejectionReason('');
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      
      {/* Header */}
      <header className="flex flex-col md:flex-row justify-between items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Gestão de Fornecedores</h1>
          <p className="text-gray-500">Visualize empresas e modere os documentos enviados.</p>
        </div>
      </header>

      {/* Filter */}
      <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-200">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
          <input 
            type="text" 
            placeholder="Buscar fornecedor por Razão Social, CNPJ ou Responsável..." 
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 outline-none text-sm"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {/* Main Table: Supplier List */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <table className="w-full text-left text-sm">
          <thead className="bg-gray-50 text-gray-700 font-semibold border-b border-gray-200">
            <tr>
              <th className="px-6 py-4">Empresa</th>
              <th className="px-6 py-4">Responsável</th>
              <th className="px-6 py-4">Status Geral</th>
              <th className="px-6 py-4">Documentos</th>
              <th className="px-6 py-4 text-right">Ações</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {filteredSuppliers.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-6 py-12 text-center text-gray-400">
                  Nenhum fornecedor encontrado.
                </td>
              </tr>
            ) : (
              filteredSuppliers.map(({ company, responsible }) => {
                const stats = getStatusStats(company.id);
                return (
                  <tr key={company.id} className="hover:bg-gray-50 transition-colors group">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-primary-50 text-primary-600 flex items-center justify-center shrink-0">
                          <Building2 size={20} />
                        </div>
                        <div className="min-w-0">
                          <div className="font-medium text-gray-900 truncate">{company.fantasyName}</div>
                          <div className="text-xs text-gray-500">{company.cnpj}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2 text-gray-600">
                        <UserIcon size={14} className="text-gray-400"/>
                        {responsible.name}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      {stats.hasPending ? (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800 border border-yellow-200">
                          <span className="w-1.5 h-1.5 rounded-full bg-yellow-500 animate-pulse" />
                          Pendente Análise
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800 border border-green-200">
                           Regular
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-gray-600">
                      <span className="font-semibold text-gray-900">{stats.total}</span> enviados
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button 
                        onClick={() => setSelectedSupplierId(company.id)}
                        className="inline-flex items-center gap-2 px-3 py-1.5 bg-white border border-gray-300 hover:border-primary-500 hover:text-primary-600 rounded-lg text-sm font-medium text-gray-700 transition-all shadow-sm"
                      >
                        <Eye size={16} />
                        Visualizar
                      </button>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Modal: Document Details */}
      {selectedData && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setSelectedSupplierId(null)} />
          
          <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] flex flex-col overflow-hidden animate-in slide-in-from-bottom-8 zoom-in-95 duration-300">
            
            {/* Header */}
            <div className="p-6 border-b border-gray-100 bg-gray-50 flex justify-between items-start">
              <div className="flex gap-4">
                 <div className="w-12 h-12 rounded-xl bg-white border border-gray-200 flex items-center justify-center text-primary-600 shadow-sm">
                    <Building2 size={24} />
                 </div>
                 <div>
                    <h2 className="text-xl font-bold text-gray-900">{selectedData.company.fantasyName}</h2>
                    <p className="text-sm text-gray-500 mt-1">{selectedData.company.socialReason}</p>
                    <div className="flex items-center gap-3 text-xs text-gray-400 mt-1">
                      <span>CNPJ: {selectedData.company.cnpj}</span>
                    </div>
                 </div>
              </div>
              <button 
                onClick={() => setSelectedSupplierId(null)}
                className="p-2 hover:bg-gray-200 rounded-full transition-colors text-gray-500"
              >
                <X size={24} />
              </button>
            </div>

            {/* Body */}
            <div className="flex-1 overflow-y-auto p-6 bg-gray-50/50">
              <div className="mb-4 flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-800">Documentação</h3>
              </div>

              <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                <table className="w-full text-left text-sm">
                  <thead className="bg-gray-50 text-gray-700 font-semibold border-b border-gray-200">
                    <tr>
                      <th className="px-6 py-3">Documento</th>
                      <th className="px-6 py-3">Enviado em</th>
                      <th className="px-6 py-3">Status</th>
                      <th className="px-6 py-3 text-right">Ações</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {selectedDocs.length === 0 ? (
                      <tr>
                        <td colSpan={4} className="px-6 py-8 text-center text-gray-400">
                          Nenhum documento cadastrado.
                        </td>
                      </tr>
                    ) : (
                      selectedDocs.map(doc => (
                        <tr key={doc.id} className="hover:bg-gray-50">
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-2 font-medium text-gray-900">
                              <FileText size={16} className={doc.fileType === 'pdf' ? "text-red-500" : "text-blue-500"} />
                              {doc.name}
                            </div>
                          </td>
                          <td className="px-6 py-4 text-gray-500">
                            {new Date(doc.uploadedAt).toLocaleDateString('pt-BR')}
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-2">
                                <Badge status={doc.status} />
                                {doc.status === DocumentStatus.REJECTED && (
                                    <div className="text-red-500 cursor-help" title={doc.rejectionReason}>
                                        <AlertCircle size={16} />
                                    </div>
                                )}
                            </div>
                          </td>
                          <td className="px-6 py-4 text-right">
                            <div className="flex justify-end items-center gap-2">
                              <a 
                                href={doc.fileUrl} 
                                target="_blank"
                                rel="noreferrer"
                                className="p-1.5 text-gray-500 hover:bg-gray-100 hover:text-primary-600 rounded-md transition-colors"
                                title="Download"
                              >
                                <Download size={18} />
                              </a>

                              {doc.status === DocumentStatus.PENDING && (
                                <>
                                  <button 
                                    onClick={() => handleApprove(doc)}
                                    className="p-1.5 text-green-600 hover:bg-green-50 rounded-md transition-colors"
                                    title="Aprovar"
                                  >
                                    <Check size={18} />
                                  </button>
                                  <button 
                                    onClick={() => { setRejectingDoc(doc); setRejectionReason(''); }}
                                    className="p-1.5 text-red-600 hover:bg-red-50 rounded-md transition-colors"
                                    title="Reprovar"
                                  >
                                    <X size={18} />
                                  </button>
                                </>
                              )}
                            </div>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal: Rejection Reason Input */}
      {rejectingDoc && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/20 backdrop-blur-[2px] animate-in fade-in">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-md p-6 animate-in zoom-in-95 duration-200">
            <h3 className="text-lg font-bold text-gray-900 mb-2">Reprovar Documento</h3>
            <p className="text-sm text-gray-500 mb-4">
              Justificativa para reprovar <strong>{rejectingDoc.name}</strong>:
            </p>
            <textarea
              className="w-full h-32 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 outline-none resize-none text-sm bg-gray-50"
              value={rejectionReason}
              onChange={e => setRejectionReason(e.target.value)}
              placeholder="Descreva o motivo..."
              autoFocus
            />
            <div className="flex justify-end gap-3 mt-6">
              <button 
                onClick={() => setRejectingDoc(null)}
                className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg font-medium"
              >
                Cancelar
              </button>
              <button 
                onClick={handleRejectSubmit}
                disabled={!rejectionReason.trim()}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 font-medium disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Confirmar Reprovação
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
