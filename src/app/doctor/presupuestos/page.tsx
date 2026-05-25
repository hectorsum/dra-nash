'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { Plus, Search, FileText, Download } from 'lucide-react';
import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';
import { BudgetPDF } from '@/components/BudgetPDF';

interface Budget {
  id: string;
  totalAmount: number;
  createdAt: string;
  patient: {
    firstName: string | null;
    paternalSurname: string | null;
    maternalSurname: string | null;
    phoneCountryCode: string | null;
    documentNumber: string | null;
    address: string | null;
    country: string | null;
    user: {
      name: string;
      phone: string | null;
      email: string;
    };
  };
  items: Array<{
    quantity: number;
    unitPrice: number;
    subtotal: number;
    service: {
      name: string;
    }
  }>;
}

export default function PresupuestosPage() {
  const [budgets, setBudgets] = useState<Budget[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  
  // State for the PDF generation
  const [selectedBudgetForPDF, setSelectedBudgetForPDF] = useState<Budget | null>(null);
  const pdfComponentRef = useRef<HTMLDivElement>(null);
  const [isGeneratingPDF, setIsGeneratingPDF] = useState('');

  useEffect(() => {
    fetchBudgets();
  }, []);

  // Use an effect to automatically trigger generation when the component state changes
  useEffect(() => {
    if (selectedBudgetForPDF && pdfComponentRef.current) {
        generatePDF();
    }
  }, [selectedBudgetForPDF]);


  const fetchBudgets = async () => {
    try {
      const response = await fetch('/api/budgets');
      if (response.ok) {
        const data = await response.json();
        setBudgets(data);
      }
    } catch (error) {
      console.error('Error fetching budgets:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDownloadPDF = (budget: Budget) => {
    setIsGeneratingPDF(budget.id);
    setSelectedBudgetForPDF(budget);
  };

  const generatePDF = async () => {
    try {
      if (!pdfComponentRef.current || !selectedBudgetForPDF) return;

      const element = pdfComponentRef.current;
      const canvas = await html2canvas(element, {
        scale: 2, // Higher scale for better resolution
        useCORS: true,
        logging: false,
        backgroundColor: '#B5BAEF'
      });

      const imgData = canvas.toDataURL('image/png');
      
      // A4 format: 210mm x 297mm
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4'
      });

      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (canvas.height * pdfWidth) / canvas.width;

      pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
      
      const patientName = selectedBudgetForPDF.patient?.firstName 
        ? `${selectedBudgetForPDF.patient.firstName}_${selectedBudgetForPDF.patient.paternalSurname || ''}`.trim()
        : selectedBudgetForPDF.patient?.user?.name || 'paciente';

      pdf.save(`Presupuesto_${patientName.replace(/\s+/g, '_')}.pdf`);
    } catch (error) {
       console.error('Error generating PDF:', error);
       alert('Hubo un error al generar el PDF. Asegúrate de intentar nuevamente.');
    } finally {
       setIsGeneratingPDF('');
       setSelectedBudgetForPDF(null);
    }
  };

  const filteredBudgets = budgets.filter((budget) => {
    const searchString = `${budget.patient?.firstName || ''} ${budget.patient?.paternalSurname || ''} ${budget.patient?.maternalSurname || ''} ${budget.patient?.user?.name || ''}`.toLowerCase();
    return searchString.includes(searchTerm.toLowerCase());
  });

  if (loading) {
    return (
      <div className="flex justify-center items-center h-full">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#071535]"></div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-[calc(100vh-4rem)] p-8 overflow-hidden">
      
      {/* Hidden container for PDF rendering */}
      <div style={{ position: 'absolute', top: '-9999px', left: '-9999px' }}>
         {selectedBudgetForPDF && (
           <BudgetPDF ref={pdfComponentRef} budget={selectedBudgetForPDF} />
         )}
      </div>

      <div className="flex justify-between items-center mb-8 shrink-0">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Presupuestos</h1>
          <p className="text-gray-500 mt-1">Gestiona los presupuestos de tus pacientes</p>
        </div>
        <Link
          href="/doctor/presupuestos/nuevo"
          className="flex items-center gap-2 bg-[#071535] text-white px-4 py-2 rounded-lg hover:bg-[#071535]/90 transition-colors"
        >
          <Plus size={20} />
          Nuevo Presupuesto
        </Link>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-8 shrink-0">
        <div className="relative max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
          <input
            type="text"
            placeholder="Buscar por paciente..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#071535]/20 focus:border-[#071535]"
          />
        </div>
      </div>

      <div className="flex-1 bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden flex flex-col min-h-0">
        <div className="overflow-x-auto flex-1">
          <table className="w-full relative">
            <thead className="bg-gray-50 border-b border-gray-100 sticky top-0 z-10">
              <tr>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Paciente</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Fecha</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Total (S/)</th>
                <th className="px-6 py-4 text-right text-sm font-semibold text-gray-900">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 overflow-y-auto">
              {filteredBudgets.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-6 py-12 text-center text-gray-500">
                    No se encontraron presupuestos.
                  </td>
                </tr>
              ) : (
                filteredBudgets.map((budget) => {
                  const patientName = budget.patient?.firstName 
                    ? `${budget.patient.firstName} ${budget.patient.paternalSurname || ''}`
                    : budget.patient?.user?.name || 'Desconocido';

                  return (
                    <tr key={budget.id} className="hover:bg-gray-50/50 transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-[#071535]/10 flex items-center justify-center text-[#071535] font-semibold">
                            {patientName.charAt(0).toUpperCase()}
                          </div>
                          <div>
                            <p className="font-medium text-gray-900">{patientName}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-gray-500">
                        {new Date(budget.createdAt).toLocaleDateString('es-PE', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric'
                        })}
                      </td>
                      <td className="px-6 py-4 font-medium text-gray-900">
                        S/ {Number(budget.totalAmount).toFixed(2)}
                      </td>
                      <td className="px-6 py-4 text-right">
                        <button 
                          onClick={() => handleDownloadPDF(budget)}
                          disabled={isGeneratingPDF === budget.id}
                          className="text-gray-400 hover:text-[#071535] transition-colors p-2 rounded-lg hover:bg-[#071535]/10 disabled:opacity-50"
                          title="Descargar PDF"
                        >
                          {isGeneratingPDF === budget.id ? (
                            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-gray-400"></div>
                          ) : (
                            <Download size={20} />
                          )}
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
    </div>
  );
}
