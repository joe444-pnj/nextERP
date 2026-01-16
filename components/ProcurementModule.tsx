import React, { useState } from 'react';
import { 
  FileText, Plus, Filter, CheckCircle, XCircle, Eye, 
  ShoppingCart, DollarSign, ArrowRight, ClipboardList
} from 'lucide-react';
import { PurchaseRequest, PurchaseOrder, SupplierInvoice, InventoryItem, Supplier } from '../types';
import { DocumentTemplate } from './DocumentTemplate';
import { checkThreeWayMatch } from '../services/erpService';

interface ProcurementModuleProps {
  requests: PurchaseRequest[];
  orders: PurchaseOrder[];
  invoices: SupplierInvoice[];
  inventory: InventoryItem[];
  suppliers: Supplier[];
  onUpdateRequests: (prs: PurchaseRequest[]) => void;
  onUpdateOrders: (pos: PurchaseOrder[]) => void;
  onUpdateInvoices: (invs: SupplierInvoice[]) => void;
  t: any;
}

export const ProcurementModule: React.FC<ProcurementModuleProps> = ({
    requests, orders, invoices, inventory, suppliers,
    onUpdateRequests, onUpdateOrders, onUpdateInvoices, t
}) => {
    const [activeTab, setActiveTab] = useState<'PR' | 'PO' | 'INV'>('PR');
    const [viewDoc, setViewDoc] = useState<{type: 'PR' | 'PO' | 'INVOICE', data: any} | null>(null);

    // --- Actions ---

    const handleCreatePR = () => {
        const newPR: PurchaseRequest = {
            id: `PR-${Math.floor(Math.random() * 10000)}`,
            requesterId: 'USR-01',
            date: new Date().toISOString(),
            status: 'DRAFT',
            items: inventory.slice(0, 2).map(i => ({ sku: i.sku, name: i.name, qty: 10, reason: 'Restock' }))
        };
        onUpdateRequests([newPR, ...requests]);
    };

    const handleApprovePR = (id: string) => {
        onUpdateRequests(requests.map(pr => pr.id === id ? { ...pr, status: 'APPROVED' } : pr));
    };

    const handleCreatePO = (pr?: PurchaseRequest) => {
        const supplier = suppliers[0];
        const newPO: PurchaseOrder = {
            id: `PO-${Math.floor(Math.random() * 10000)}`,
            prId: pr?.id,
            supplierId: supplier.id,
            supplierName: supplier.name,
            date: new Date().toISOString(),
            status: 'DRAFT',
            currency: supplier.currency,
            items: pr ? pr.items.map(i => {
                const inv = inventory.find(inv => inv.sku === i.sku);
                return { sku: i.sku, name: i.name, qty: i.qty, unitPrice: inv?.price || 0, total: (inv?.price || 0) * i.qty }
            }) : [],
            totalAmount: 0
        };
        // calc total
        newPO.totalAmount = newPO.items.reduce((sum, i) => sum + i.total, 0);
        onUpdateOrders([newPO, ...orders]);
        
        if (pr) {
             onUpdateRequests(requests.map(p => p.id === pr.id ? { ...p, status: 'COMPLETED' } : p));
        }
    };

    const handleSendPO = (id: string) => {
        onUpdateOrders(orders.map(po => po.id === id ? { ...po, status: 'SENT' } : po));
    };

    const handleCreateInvoice = (po: PurchaseOrder) => {
        const newInv: SupplierInvoice = {
            id: `INV-${Math.floor(Math.random() * 10000)}`,
            poId: po.id,
            grnIds: [], // In real app, select GRNs
            invoiceNumber: `SUP-INV-${Math.floor(Math.random() * 1000)}`,
            supplierId: po.supplierId,
            date: new Date().toISOString(),
            dueDate: new Date(Date.now() + 30*24*60*60*1000).toISOString(),
            status: 'DRAFT',
            subtotal: po.totalAmount,
            tax: po.totalAmount * 0.1,
            total: po.totalAmount * 1.1,
            matched: false
        };
        onUpdateInvoices([newInv, ...invoices]);
    };

    const handlePostInvoice = (inv: SupplierInvoice) => {
        // Find PO to match total
        const po = orders.find(o => o.id === inv.poId);
        const isMatched = po ? checkThreeWayMatch(inv.subtotal, po.totalAmount) : false;
        
        onUpdateInvoices(invoices.map(i => i.id === inv.id ? { 
            ...i, 
            status: 'POSTED', 
            matched: isMatched 
        } : i));
    };

    return (
        <div className="space-y-6">
            {/* Header Tabs */}
            <div className="flex space-x-1 bg-white p-1 rounded-xl border border-slate-200 shadow-sm w-fit">
                <button onClick={() => setActiveTab('PR')} className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${activeTab === 'PR' ? 'bg-indigo-100 text-indigo-700' : 'text-slate-500 hover:bg-slate-50'}`}>
                    {t.purchase_request}
                </button>
                <button onClick={() => setActiveTab('PO')} className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${activeTab === 'PO' ? 'bg-indigo-100 text-indigo-700' : 'text-slate-500 hover:bg-slate-50'}`}>
                    {t.purchase_order}
                </button>
                <button onClick={() => setActiveTab('INV')} className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${activeTab === 'INV' ? 'bg-indigo-100 text-indigo-700' : 'text-slate-500 hover:bg-slate-50'}`}>
                    {t.supplier_invoice}
                </button>
            </div>

            {/* Content Area */}
            <div className="bg-white rounded-xl border border-slate-200 shadow-sm min-h-[500px]">
                
                {/* --- PURCHASE REQUESTS --- */}
                {activeTab === 'PR' && (
                    <div className="p-6">
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-xl font-bold text-slate-800 flex items-center"><ClipboardList className="mr-2"/> {t.purchase_request}s</h2>
                            <button onClick={handleCreatePR} className="bg-indigo-600 text-white px-4 py-2 rounded-lg flex items-center text-sm font-medium hover:bg-indigo-700">
                                <Plus size={16} className="mr-2"/> {t.create_new}
                            </button>
                        </div>
                        <div className="overflow-x-auto">
                            <table className="w-full text-left text-sm">
                                <thead className="bg-slate-50 border-b border-slate-200 text-slate-500">
                                    <tr>
                                        <th className="px-4 py-3">ID</th>
                                        <th className="px-4 py-3">{t.date}</th>
                                        <th className="px-4 py-3">{t.status}</th>
                                        <th className="px-4 py-3 text-right">{t.actions}</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100">
                                    {requests.length === 0 ? <tr><td colSpan={4} className="p-8 text-center text-slate-400">No requests found</td></tr> : 
                                     requests.map(pr => (
                                        <tr key={pr.id} className="hover:bg-slate-50">
                                            <td className="px-4 py-3 font-mono font-medium text-indigo-600">{pr.id}</td>
                                            <td className="px-4 py-3">{new Date(pr.date).toLocaleDateString()}</td>
                                            <td className="px-4 py-3">
                                                <span className={`px-2 py-1 rounded text-xs font-bold 
                                                    ${pr.status === 'APPROVED' ? 'bg-green-100 text-green-700' : 
                                                      pr.status === 'COMPLETED' ? 'bg-slate-100 text-slate-600' :
                                                      'bg-yellow-100 text-yellow-700'}`}>
                                                    {pr.status}
                                                </span>
                                            </td>
                                            <td className="px-4 py-3 text-right flex justify-end space-x-2">
                                                <button onClick={() => setViewDoc({type: 'PR', data: pr})} className="text-slate-400 hover:text-slate-600"><Eye size={18}/></button>
                                                {pr.status === 'DRAFT' && (
                                                    <button onClick={() => handleApprovePR(pr.id)} className="text-green-600 hover:text-green-700 text-xs font-bold border border-green-200 px-2 py-1 rounded">Approve</button>
                                                )}
                                                {pr.status === 'APPROVED' && (
                                                    <button onClick={() => handleCreatePO(pr)} className="text-blue-600 hover:text-blue-700 text-xs font-bold border border-blue-200 px-2 py-1 rounded">Create PO</button>
                                                )}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}

                {/* --- PURCHASE ORDERS --- */}
                {activeTab === 'PO' && (
                    <div className="p-6">
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-xl font-bold text-slate-800 flex items-center"><ShoppingCart className="mr-2"/> {t.purchase_order}s</h2>
                            <button onClick={() => handleCreatePO()} className="bg-indigo-600 text-white px-4 py-2 rounded-lg flex items-center text-sm font-medium hover:bg-indigo-700">
                                <Plus size={16} className="mr-2"/> {t.create_new}
                            </button>
                        </div>
                        <div className="overflow-x-auto">
                            <table className="w-full text-left text-sm">
                                <thead className="bg-slate-50 border-b border-slate-200 text-slate-500">
                                    <tr>
                                        <th className="px-4 py-3">ID</th>
                                        <th className="px-4 py-3">{t.supplier}</th>
                                        <th className="px-4 py-3 text-right">{t.total_amount}</th>
                                        <th className="px-4 py-3">{t.status}</th>
                                        <th className="px-4 py-3 text-right">{t.actions}</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100">
                                    {orders.length === 0 ? <tr><td colSpan={5} className="p-8 text-center text-slate-400">No orders found</td></tr> : 
                                     orders.map(po => (
                                        <tr key={po.id} className="hover:bg-slate-50">
                                            <td className="px-4 py-3 font-mono font-medium text-indigo-600">{po.id}</td>
                                            <td className="px-4 py-3 font-medium">{po.supplierName}</td>
                                            <td className="px-4 py-3 text-right font-bold">${po.totalAmount.toFixed(2)}</td>
                                            <td className="px-4 py-3">
                                                 <span className={`px-2 py-1 rounded text-xs font-bold 
                                                    ${po.status === 'SENT' ? 'bg-blue-100 text-blue-700' : 
                                                      po.status === 'COMPLETED' ? 'bg-green-100 text-green-700' :
                                                      'bg-slate-100 text-slate-600'}`}>
                                                    {po.status}
                                                </span>
                                            </td>
                                            <td className="px-4 py-3 text-right flex justify-end space-x-2">
                                                <button onClick={() => setViewDoc({type: 'PO', data: po})} className="text-slate-400 hover:text-slate-600"><Eye size={18}/></button>
                                                {po.status === 'DRAFT' && (
                                                    <button onClick={() => handleSendPO(po.id)} className="text-blue-600 hover:text-blue-700 text-xs font-bold border border-blue-200 px-2 py-1 rounded">Send</button>
                                                )}
                                                {po.status === 'SENT' && (
                                                    <button onClick={() => handleCreateInvoice(po)} className="text-purple-600 hover:text-purple-700 text-xs font-bold border border-purple-200 px-2 py-1 rounded">Invoice</button>
                                                )}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}

                {/* --- SUPPLIER INVOICES --- */}
                {activeTab === 'INV' && (
                    <div className="p-6">
                         <div className="flex justify-between items-center mb-6">
                            <h2 className="text-xl font-bold text-slate-800 flex items-center"><DollarSign className="mr-2"/> {t.supplier_invoice}s</h2>
                        </div>
                        <div className="overflow-x-auto">
                            <table className="w-full text-left text-sm">
                                <thead className="bg-slate-50 border-b border-slate-200 text-slate-500">
                                    <tr>
                                        <th className="px-4 py-3">ID</th>
                                        <th className="px-4 py-3">{t.reference}</th>
                                        <th className="px-4 py-3 text-right">{t.total_amount}</th>
                                        <th className="px-4 py-3">{t.status}</th>
                                        <th className="px-4 py-3">{t.three_way_match}</th>
                                        <th className="px-4 py-3 text-right">{t.actions}</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100">
                                    {invoices.length === 0 ? <tr><td colSpan={6} className="p-8 text-center text-slate-400">No invoices found</td></tr> : 
                                     invoices.map(inv => (
                                        <tr key={inv.id} className="hover:bg-slate-50">
                                            <td className="px-4 py-3 font-mono font-medium text-indigo-600">{inv.id}</td>
                                            <td className="px-4 py-3 font-mono text-slate-500">{inv.invoiceNumber}</td>
                                            <td className="px-4 py-3 text-right font-bold">${inv.total.toFixed(2)}</td>
                                            <td className="px-4 py-3">
                                                 <span className={`px-2 py-1 rounded text-xs font-bold 
                                                    ${inv.status === 'POSTED' ? 'bg-purple-100 text-purple-700' : 
                                                      inv.status === 'PAID' ? 'bg-green-100 text-green-700' :
                                                      'bg-slate-100 text-slate-600'}`}>
                                                    {inv.status}
                                                </span>
                                            </td>
                                            <td className="px-4 py-3">
                                                {inv.status === 'POSTED' || inv.status === 'PAID' ? (
                                                    inv.matched ? 
                                                    <span className="flex items-center text-green-600 text-xs font-bold"><CheckCircle size={14} className="mr-1"/> {t.match_success}</span> : 
                                                    <span className="flex items-center text-red-600 text-xs font-bold"><XCircle size={14} className="mr-1"/> {t.match_fail}</span>
                                                ) : <span className="text-slate-400 text-xs">-</span>}
                                            </td>
                                            <td className="px-4 py-3 text-right flex justify-end space-x-2">
                                                <button onClick={() => setViewDoc({type: 'INVOICE', data: inv})} className="text-slate-400 hover:text-slate-600"><Eye size={18}/></button>
                                                {inv.status === 'DRAFT' && (
                                                    <button onClick={() => handlePostInvoice(inv)} className="text-purple-600 hover:text-purple-700 text-xs font-bold border border-purple-200 px-2 py-1 rounded">{t.post_invoice}</button>
                                                )}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}
            </div>

            {/* Document Viewer Modal */}
            {viewDoc && (
                <DocumentTemplate 
                    title={viewDoc.type === 'PR' ? t.purchase_request : viewDoc.type === 'PO' ? t.purchase_order : t.supplier_invoice}
                    type={viewDoc.type}
                    data={viewDoc.data}
                    onClose={() => setViewDoc(null)}
                />
            )}
        </div>
    );
};