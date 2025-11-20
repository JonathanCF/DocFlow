import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Badge } from '../../components/ui/Badge';
import { DocumentStatus, Document, User, UserRole } from '../../types';
import { Search, Filter, Eye, Check, X, FileText, Download, Building2, User as UserIcon, AlertCircle } from 'lucide-react';

export const AdminDashboard: React.FC = () => {
  const { documents, users, updateDocumentStatus, getSupplierName, getSupplierCompany } = useApp();
  
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSupplier, setSelectedSupplier] = useState<User | null>(null);
  
  // State for Rejection Logic
  const [rejectingDoc, setRejectingDoc] = useState<Document | null>(null);
  const [rejectionReason, setRejectionReason] = useState('');

  // 1. Get all suppliers
  const suppliers = users.filter(u => u.role === UserRole.SUPPLIER);

  // 2. Filter suppliers based on search
  const filteredSuppliers = suppliers.filter(supplier => {
    const company = getSupplierCompany(supplier.id);
    const searchLower = searchTerm.toLowerCase();
    
    const matchesName = supplier.name.toLowerCase().includes(searchLower);
    const matchesCompany = company?.fantasyName.toLowerCase().includes(searchLower) || 
                           company?.socialReason.toLowerCase().includes(searchLower) ||
                           company?.cnpj.includes(searchLower);

    return matchesName || matchesCompany;
  });

  // Helper to get docs for a specific supplier
  const getSupplierDocs = (userId: string) => {
    return documents
      .filter(d => d.userId === userId)
      .sort((a, b) => new Date(b.uploadedAt).getTime() - new Date(a.uploadedAt).getTime());
  };

  // Helper to calculate status stats
  const getSupplierStats = (userId: string) => {
    const docs = getSupplierDocs(userId);
    const pending = docs.filter(d => d.status === DocumentStatus.PENDING).length;
    const total = docs.length;
    return { pending, total, hasPending: pending > 0 };
  };

  // Actions
  const handleApprove = (doc: Document) => {
    if (window.confirm(`Deseja aprovar o documento "${doc.name}"?`)) {
      updateDocumentStatus(doc.id, DocumentStatus.APPROVED);
    }
  };

  const initiateReject = (doc: Document) => {
    setRejectingDoc(doc);
    setRejectionReason('');
  };

  const confirmReject = () => {
    if (rejectingDoc && rejectionReason.trim()) {
      updateDocumentStatus(rejectingDoc.id, DocumentStatus.REJECTED, rejectionReason);
      setRejectingDoc(null);
      setRejectionReason('');
    }
  };

  // Current Docs to show in Modal
  const selectedSupplierDocs = selectedSupplier ? getSupplierDocs(selectedSupplier.id) : [];
  const selectedSupplierCompany = selectedSupplier ? getSupplierCompany(selectedSupplier.id) : null;

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Gestão de Fornecedores</h1>
          <p className="text-gray-500">Visualize empresas e analise seus documentos.</p>
        </div>
        <div className="flex items-center gap-2">
            <div className="bg-white px-3 py-1 rounded-full border shadow-sm text-sm font-medium text-gray-600">
                Fornecedores: <span className="text-primary-600">{suppliers.length}</span>
            </div>
        </div>
      </header>

      {/* Search Bar */}
      <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-200 flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
          <input 
            type="text" 
            placeholder="Buscar por Razão Social, Nome Fantasia ou Nome do Responsável..." 
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 outline-none text-sm"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {/* Suppliers Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-gray-50 text-gray-700 font-semibold border-b border-gray-200">
              <tr>
                <th className="px-6 py-4">Empresa</th>
                <th className="px-6 py-4">Responsável</th>
                <th className="px-6 py-4">Situação</th>
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
                filteredSuppliers.map(supplier => {
                  const company = getSupplierCompany(supplier.id);
                  const stats = getSupplierStats(supplier.id);
                  
                  return (
                    <tr key={supplier.id} className="hover:bg-gray-50 transition-colors group">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-lg bg-primary-50 text-primary-600 flex items-center justify-center">
                            <Building2 size={20} />
                          </div>
                          <div>
                            <div className="font-medium text-gray-900">{company?.fantasyName || 'N/A'}</div>
                            <div className="text-xs text-gray-500">{company?.cnpj || 'Sem CNPJ'}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-gray-600">
                        <div className="flex items-center gap-2">
                          <UserIcon size={14} className="text-gray-400"/>
                          {supplier.name}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        {stats.hasPending ? (
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800 border border-yellow-200">
                            <div className="w-1.5 h-1.5 rounded-full bg-yellow-500 animate-pulse"></div>
                            Pendente Análise
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800 border border-green-200">
                             Tudo Certo
                          </span>
                        )}
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-gray-600">
                          <span className="font-semibold text-gray-900">{stats.total}</span> enviados
                          {stats.pending > 0 && (
                            <span className="text-yellow-600 ml-1 text-xs">({stats.pending} aguardando)</span>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <button 
                          onClick={() => setSelectedSupplier(supplier)}
                          className="inline-flex items-center gap-2 px-3 py-1.5 bg-white border border-gray-300 hover:bg-gray-50 hover:border-primary-300 hover:text-primary-600 rounded-lg text-sm font-medium text-gray-700 transition-all shadow-sm"
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
      </div>

      {/* Supplier Details Modal */}
      {selectedSupplier && (
        <div className="fixed inset-0 bg-black/60 z-40 flex items-center justify-center p-4 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] flex flex-col overflow-hidden animate-in slide-in-from-bottom-4 duration-300">
            
            {/* Modal Header */}
            <div className="p-6 border-b border-gray-100 flex justify-between items-start bg-gray-50">
              <div className="flex gap-4">
                 <div className="w-12 h-12 rounded-xl bg-white border border-gray-200 flex items-center justify-center text-primary-600 shadow-sm">
                    <Building2 size={24} />
                 </div>
                 <div>
                    <h2 className="text-xl font-bold text-gray-900">{selectedSupplierCompany?.fantasyName}</h2>
                    <div className="flex items-center gap-3 text-sm text-gray-500 mt-1">
                      <span>CNPJ: {selectedSupplierCompany?.cnpj}</span>
                      <span>•</span>
                      <span>{selectedSupplierCompany?.city} - {selectedSupplierCompany?.state}</span>
                    </div>
                 </div>
              </div>
              <button 
                onClick={() => setSelectedSupplier(null)}
                className="p-2 hover:bg-gray-200 rounded-full transition-colors text-gray-500"
              >
                <X size={24} />
              </button>
            </div>

            {/* Modal Body (Scrollable) */}
            <div className="flex-1 overflow-y-auto p-6 bg-gray-50/50">
              <div className="flex items-center justify-between mb-4">
                 <h3 className="text-lg font-semibold text-gray-800">Documentos Enviados</h3>
                 <span className="text-sm text-gray-500">Total: {selectedSupplierDocs.length}</span>
              </div>

              <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                <table className="w-full text-left text-sm">
                  <thead className="bg-gray-50 text-gray-700 font-semibold border-b border-gray-200">
                    <tr>
                      <th className="px-6 py-3">Documento</th>
                      <th className="px-6 py-3">Data</th>
                      <th className="px-6 py-3">Status</th>
                      <th className="px-6 py-3 text-right">Ações</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {selectedSupplierDocs.length === 0 ? (
                      <tr>
                        <td colSpan={4} className="px-6 py-8 text-center text-gray-400">
                          Nenhum documento enviado por este fornecedor.
                        </td>
                      </tr>
                    ) : (
                      selectedSupplierDocs.map(doc => (
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
                                    <div className="text-red-500" title={doc.rejectionReason}>
                                        <AlertCircle size={16} />
                                    </div>
                                )}
                            </div>
                          </td>
                          <td className="px-6 py-4 text-right">
                            <div className="flex justify-end items-center gap-2">
                              {/* Download Mock */}
                              <a 
                                href={doc.fileUrl} 
                                target="_blank"
                                rel="noreferrer"
                                className="p-1.5 text-gray-500 hover:bg-gray-100 hover:text-primary-600 rounded-md transition-colors"
                                title="Download / Visualizar"
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
                                    onClick={() => initiateReject(doc)}
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
            
            {/* Modal Footer */}
            <div className="p-4 border-t border-gray-100 bg-white flex justify-end">
                <button 
                  onClick={() => setSelectedSupplier(null)}
                  className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg font-medium transition-colors"
                >
                  Fechar
                </button>
            </div>
          </div>
        </div>
      )}

      {/* Rejection Modal (Overlay on top of Supplier Modal) */}
      {rejectingDoc && (
        <div className="fixed inset-0 z-[60] bg-black/20 flex items-center justify-center p-4 backdrop-blur-[1px] animate-in fade-in">
          <div className="bg-white rounded-xl shadow-2xl max-w-md w-full p-6 animate-in zoom-in-95 duration-200 border border-gray-200">
            <h3 className="text-lg font-bold text-gray-900 mb-2">Reprovar Documento</h3>
            <p className="text-sm text-gray-500 mb-4">
              Justifique a reprovação de <strong>{rejectingDoc.name}</strong>.
            </p>
            
            <textarea
              className="w-full h-32 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none resize-none text-sm bg-gray-50"
              placeholder="Ex: Documento ilegível, data expirada..."
              value={rejectionReason}
              onChange={e => setRejectionReason(e.target.value)}
              autoFocus
            ></textarea>

            <div className="flex justify-end gap-3 mt-6">
              <button 
                onClick={() => setRejectingDoc(null)}
                className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg font-medium transition-colors"
              >
                Cancelar
              </button>
              <button 
                onClick={confirmReject}
                disabled={!rejectionReason.trim()}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Confirmar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};