import React from 'react';
import { X, Printer, Download } from 'lucide-react';

interface DocumentTemplateProps {
  title: string;
  data: any;
  onClose: () => void;
  type: 'PR' | 'PO' | 'GRN' | 'INVOICE' | 'TRANSFER' | 'RETURN';
}

export const DocumentTemplate: React.FC<DocumentTemplateProps> = ({ title, data, onClose, type }) => {
  
  const handlePrint = () => {
    window.print();
  };

  const handleDownloadJSON = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(data, null, 2));
    const downloadAnchorNode = document.createElement('a');
    downloadAnchorNode.setAttribute("href", dataStr);
    downloadAnchorNode.setAttribute("download", `${type}_${data.id}.json`);
    document.body.appendChild(downloadAnchorNode);
    downloadAnchorNode.click();
    downloadAnchorNode.remove();
  };

  return (
    <div className="fixed inset-0 z-[200] bg-black/75 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto print:bg-white print:p-0">
      <div className="bg-white w-full max-w-4xl min-h-[80vh] rounded-none md:rounded-lg shadow-2xl flex flex-col print:shadow-none print:w-full">
        
        {/* Toolbar - Hidden when printing */}
        <div className="bg-slate-800 text-white p-4 flex justify-between items-center rounded-t-lg print:hidden">
            <h3 className="font-bold text-lg">{title} - View Mode</h3>
            <div className="flex space-x-3">
                <button onClick={handleDownloadJSON} className="flex items-center space-x-2 text-sm bg-slate-700 hover:bg-slate-600 px-3 py-2 rounded transition-colors">
                    <Download size={16} /> <span>JSON</span>
                </button>
                <button onClick={handlePrint} className="flex items-center space-x-2 text-sm bg-blue-600 hover:bg-blue-700 px-3 py-2 rounded transition-colors">
                    <Printer size={16} /> <span>Print / Save PDF</span>
                </button>
                <button onClick={onClose} className="p-2 hover:bg-slate-700 rounded-full">
                    <X size={20} />
                </button>
            </div>
        </div>

        {/* Document Paper */}
        <div className="flex-1 p-8 md:p-12 font-serif text-slate-800 bg-white">
            
            {/* Header */}
            <div className="flex justify-between items-start border-b-2 border-slate-800 pb-8 mb-8">
                <div>
                    <h1 className="text-4xl font-bold uppercase tracking-wider text-slate-900 mb-2">{title}</h1>
                    <p className="text-sm text-slate-500">Document ID: <span className="font-mono font-bold text-slate-900">{data.id}</span></p>
                    <p className="text-sm text-slate-500">Date: {new Date(data.date).toLocaleDateString()}</p>
                </div>
                <div className="text-right">
                    <h2 className="text-xl font-bold text-slate-900">NextERP Inc.</h2>
                    <p className="text-sm text-slate-600">123 Business Rd</p>
                    <p className="text-sm text-slate-600">New York, NY 10001</p>
                </div>
            </div>

            {/* Content based on Type */}
            <div className="mb-8">
                <div className="grid grid-cols-2 gap-8 mb-8">
                    <div>
                        <h4 className="text-xs font-bold uppercase text-slate-500 mb-1">Status</h4>
                        <span className="px-3 py-1 rounded-full bg-slate-100 text-slate-800 text-sm font-bold border border-slate-200 inline-block">
                            {data.status}
                        </span>
                    </div>
                    {data.supplierName && (
                        <div className="text-right">
                             <h4 className="text-xs font-bold uppercase text-slate-500 mb-1">Vendor / Supplier</h4>
                             <p className="font-bold text-lg">{data.supplierName}</p>
                        </div>
                    )}
                    {data.sourceWarehouseId && (
                        <div>
                             <h4 className="text-xs font-bold uppercase text-slate-500 mb-1">Source</h4>
                             <p className="font-bold">{data.sourceWarehouseId}</p>
                        </div>
                    )}
                    {data.destWarehouseId && (
                         <div className="text-right">
                             <h4 className="text-xs font-bold uppercase text-slate-500 mb-1">Destination</h4>
                             <p className="font-bold">{data.destWarehouseId}</p>
                        </div>
                    )}
                </div>

                {/* Line Items Table */}
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="border-b-2 border-slate-200">
                            <th className="py-3 text-sm font-bold uppercase text-slate-500">Item / SKU</th>
                            <th className="py-3 text-sm font-bold uppercase text-slate-500 text-right">Qty</th>
                            {data.items[0].unitPrice !== undefined && (
                                <th className="py-3 text-sm font-bold uppercase text-slate-500 text-right">Unit Price</th>
                            )}
                             {data.items[0].total !== undefined && (
                                <th className="py-3 text-sm font-bold uppercase text-slate-500 text-right">Total</th>
                            )}
                        </tr>
                    </thead>
                    <tbody>
                        {data.items.map((item: any, idx: number) => (
                            <tr key={idx} className="border-b border-slate-100">
                                <td className="py-3">
                                    <div className="font-bold text-slate-800">{item.name}</div>
                                    <div className="text-xs text-slate-500 font-mono">{item.sku}</div>
                                    {item.reason && <div className="text-xs text-slate-400 italic">Reason: {item.reason}</div>}
                                </td>
                                <td className="py-3 text-right font-mono">
                                    {item.qty || item.qtyOrdered || item.qtyReceived}
                                </td>
                                {item.unitPrice !== undefined && (
                                    <td className="py-3 text-right font-mono">${item.unitPrice.toFixed(2)}</td>
                                )}
                                {item.total !== undefined && (
                                    <td className="py-3 text-right font-mono font-bold">${item.total.toFixed(2)}</td>
                                )}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Footer Totals */}
            {data.totalAmount !== undefined && (
                <div className="flex justify-end border-t border-slate-200 pt-4">
                    <div className="w-64">
                         <div className="flex justify-between text-2xl font-bold text-slate-900 mt-2">
                             <span>Total</span>
                             <span>${data.totalAmount.toFixed(2)}</span>
                         </div>
                    </div>
                </div>
            )}
             {data.total !== undefined && !data.totalAmount && (
                <div className="flex justify-end border-t border-slate-200 pt-4">
                    <div className="w-64">
                         <div className="flex justify-between text-2xl font-bold text-slate-900 mt-2">
                             <span>Total</span>
                             <span>${data.total.toFixed(2)}</span>
                         </div>
                    </div>
                </div>
            )}

            <div className="mt-16 pt-8 border-t border-slate-200 text-center text-xs text-slate-400">
                <p>Generated by NextERP System. This is a computer generated document and may not require a signature.</p>
            </div>

        </div>
      </div>
    </div>
  );
};