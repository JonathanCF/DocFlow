import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { UploadCloud, FileText, AlertCircle, CheckCircle, XCircle, Search } from 'lucide-react';
import { Badge } from '../../components/ui/Badge';
import { DocumentStatus } from '../../types';

export const SupplierDashboard: React.FC = () => {
  const { documents, currentUser, uploadDocument } = useApp();
  const [docName, setDocName] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  const myDocs = documents.filter(d => d.userId === currentUser?.id).sort((a, b) => new Date(b.uploadedAt).getTime() - new Date(a.uploadedAt).getTime());

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleUpload = (e: React.FormEvent) => {
    e.preventDefault();
    if (!file || !docName) return;

    setIsUploading(true);
    // Simulate network delay
    setTimeout(() => {
      uploadDocument(file, docName);
      setFile(null);
      setDocName('');
      setIsUploading(false);
      // Reset file input manually
      const fileInput = document.getElementById('file-upload') as HTMLInputElement;
      if (fileInput) fileInput.value = '';
    }, 1000);
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <header>
        <h1 className="text-2xl font-bold text-gray-900">Meus Documentos</h1>
        <p className="text-gray-500">Envie e acompanhe o status dos documentos da sua empresa.</p>
      </header>

      {/* Upload Card */}
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200">
        <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
          <UploadCloud className="text-primary-600" size={20} />
          Novo Envio
        </h2>
        <form onSubmit={handleUpload} className="grid grid-cols-1 md:grid-cols-12 gap-4 items-end">
          <div className="md:col-span-5">
            <label className="block text-sm font-medium text-gray-700 mb-1">Nome do Documento</label>
            <input 
              type="text" 
              value={docName}
              onChange={e => setDocName(e.target.value)}
              placeholder="Ex: Contrato Social, Cartão CNPJ" 
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 outline-none"
              required
            />
          </div>
          <div className="md:col-span-5">
            <label className="block text-sm font-medium text-gray-700 mb-1">Arquivo (PDF, JPG, PNG)</label>
            <div className="relative">
              <input 
                id="file-upload"
                type="file" 
                accept=".pdf,.jpg,.jpeg,.png"
                onChange={handleFileChange}
                className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-primary-50 file:text-primary-700 hover:file:bg-primary-100"
                required
              />
            </div>
          </div>
          <div className="md:col-span-2">
            <button 
              type="submit" 
              disabled={isUploading}
              className={`w-full py-2 px-4 rounded-lg font-medium text-white transition-all ${isUploading ? 'bg-gray-400 cursor-not-allowed' : 'bg-primary-600 hover:bg-primary-700 shadow-lg shadow-primary-200'}`}
            >
              {isUploading ? 'Enviando...' : 'Enviar'}
            </button>
          </div>
        </form>
      </div>

      {/* Documents List */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="p-6 border-b border-gray-100 flex justify-between items-center">
          <h2 className="text-lg font-semibold text-gray-800">Histórico de Envios</h2>
          <div className="text-sm text-gray-500">Total: {myDocs.length}</div>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-gray-600">
            <thead className="bg-gray-50 text-gray-700 font-semibold border-b border-gray-200">
              <tr>
                <th className="px-6 py-4">Documento</th>
                <th className="px-6 py-4">Data Envio</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4">Detalhes</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {myDocs.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-6 py-12 text-center text-gray-400">
                    <div className="flex flex-col items-center gap-2">
                      <FileText size={40} className="opacity-20" />
                      <p>Nenhum documento enviado ainda.</p>
                    </div>
                  </td>
                </tr>
              ) : (
                myDocs.map(doc => (
                  <tr key={doc.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 font-medium text-gray-900 flex items-center gap-2">
                      {doc.fileType === 'pdf' ? <FileText size={16} className="text-red-500" /> : <FileText size={16} className="text-blue-500" />}
                      {doc.name}
                    </td>
                    <td className="px-6 py-4">{new Date(doc.uploadedAt).toLocaleDateString('pt-BR')}</td>
                    <td className="px-6 py-4">
                      <Badge status={doc.status} />
                    </td>
                    <td className="px-6 py-4">
                      {doc.status === DocumentStatus.REJECTED && (
                        <div className="group relative flex items-center gap-1 text-red-600 cursor-help">
                          <AlertCircle size={16} />
                          <span className="text-xs font-medium">Ver Motivo</span>
                          <div className="absolute bottom-full right-0 mb-2 w-64 p-3 bg-white rounded-lg shadow-xl border border-red-100 text-xs text-gray-700 hidden group-hover:block z-10 animate-in fade-in zoom-in-95">
                            <strong>Motivo da Reprovação:</strong>
                            <p className="mt-1">{doc.rejectionReason}</p>
                          </div>
                        </div>
                      )}
                      {doc.status === DocumentStatus.APPROVED && (
                        <span className="text-green-600 flex items-center gap-1 text-xs">
                          <CheckCircle size={16} /> Aprovado
                        </span>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};