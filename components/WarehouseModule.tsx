import React, { useState } from 'react';
import { 
  Truck, ArrowRightLeft, RotateCcw, Plus, Package, Eye,
  ArrowRight, CheckCircle
} from 'lucide-react';
import { GoodsReceiptNote, StockTransfer, PurchaseReturn, InventoryItem, PurchaseOrder, Warehouse } from '../types';
import { DocumentTemplate } from './DocumentTemplate';
import { postGRN, completeStockTransfer, postPurchaseReturn } from '../services/erpService';

interface WarehouseModuleProps {
  grns: GoodsReceiptNote[];
  transfers: StockTransfer[];
  returns: PurchaseReturn[];
  orders: PurchaseOrder[]; // To create GRN from
  warehouses: Warehouse[];
  inventory: InventoryItem[];
  
  onUpdateGRNs: (grns: GoodsReceiptNote[]) => void;
  onUpdateTransfers: (trf: StockTransfer[]) => void;
  onUpdateReturns: (ret: PurchaseReturn[]) => void;
  onUpdateInventory: (inv: InventoryItem[]) => void;
  t: any;
}

export const WarehouseModule: React.FC<WarehouseModuleProps> = ({
    grns, transfers, returns, orders, warehouses, inventory,
    onUpdateGRNs, onUpdateTransfers, onUpdateReturns, onUpdateInventory, t
}) => {
    const [activeTab, setActiveTab] = useState<'GRN' | 'TRF' | 'RET'>('GRN');
    const [viewDoc, setViewDoc] = useState<{type: 'GRN' | 'TRANSFER' | 'RETURN', data: any} | null>(null);

    // --- Actions ---

    const handleCreateGRN = () => {
        // Mocking picking the first SENT PO
        const validPO = orders.find(o => o.status === 'SENT');
        if (!validPO) {
            alert("No Purchase Orders in 'SENT' status to receive.");
            return;
        }

        const newGRN: GoodsReceiptNote = {
            id: `GRN-${Math.floor(Math.random() * 10000)}`,
            poId: validPO.id,
            warehouseId: warehouses[0].id,
            date: new Date().toISOString(),
            status: 'DRAFT',
            items: validPO.items.map(i => ({ sku: i.sku, name: i.name, qtyOrdered: i.qty, qtyReceived: i.qty, condition: 'GOOD' }))
        };
        onUpdateGRNs([newGRN, ...grns]);
    };

    const handleVerifyGRN = (grn: GoodsReceiptNote) => {
        // Logic to update inventory
        const updatedInventory = postGRN(grn, inventory);
        onUpdateInventory(updatedInventory);
        
        onUpdateGRNs(grns.map(g => g.id === grn.id ? { ...g, status: 'VERIFIED' } : g));
    };

    const handleCreateTransfer = () => {
        const newTrf: StockTransfer = {
            id: `TRF-${Math.floor(Math.random() * 10000)}`,
            sourceWarehouseId: warehouses[0].id,
            destWarehouseId: warehouses[1].id,
            date: new Date().toISOString(),
            status: 'DRAFT',
            items: inventory.slice(0, 1).map(i => ({ sku: i.sku, name: i.name, qty: 5 }))
        };
        onUpdateTransfers([newTrf, ...transfers]);
    };

    const handleCompleteTransfer = (trf: StockTransfer) => {
        const updatedInventory = completeStockTransfer(trf, inventory);
        onUpdateInventory(updatedInventory);
        onUpdateTransfers(transfers.map(t => t.id === trf.id ? { ...t, status: 'RECEIVED' } : t));
    };

    const handleCreateReturn = () => {
        const newRet: PurchaseReturn = {
            id: `RET-${Math.floor(Math.random() * 10000)}`,
            supplierId: 'sup-1',
            date: new Date().toISOString(),
            reason: 'Damaged Goods',
            status: 'DRAFT',
            items: inventory.slice(0, 1).map(i => ({ sku: i.sku, name: i.name, qty: 2 })),
            refundStatus: 'PENDING'
        };
        onUpdateReturns([newRet, ...returns]);
    };

    const handleShipReturn = (ret: PurchaseReturn) => {
        const updatedInventory = postPurchaseReturn(ret, inventory);
        onUpdateInventory(updatedInventory);
        onUpdateReturns(returns.map(r => r.id === ret.id ? { ...r, status: 'SHIPPED' } : r));
    };

    return (
        <div className="space-y-6">
             {/* Header Tabs */}
             <div className="flex space-x-1 bg-white p-1 rounded-xl border border-slate-200 shadow-sm w-fit">
                <button onClick={() => setActiveTab('GRN')} className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${activeTab === 'GRN' ? 'bg-indigo-100 text-indigo-700' : 'text-slate-500 hover:bg-slate-50'}`}>
                    {t.grn}
                </button>
                <button onClick={() => setActiveTab('TRF')} className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${activeTab === 'TRF' ? 'bg-indigo-100 text-indigo-700' : 'text-slate-500 hover:bg-slate-50'}`}>
                    {t.stock_transfer}
                </button>
                <button onClick={() => setActiveTab('RET')} className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${activeTab === 'RET' ? 'bg-indigo-100 text-indigo-700' : 'text-slate-500 hover:bg-slate-50'}`}>
                    {t.returns}
                </button>
            </div>

            <div className="bg-white rounded-xl border border-slate-200 shadow-sm min-h-[500px]">
                
                {/* --- GRN --- */}
                {activeTab === 'GRN' && (
                    <div className="p-6">
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-xl font-bold text-slate-800 flex items-center"><Truck className="mr-2"/> {t.grn}</h2>
                            <button onClick={handleCreateGRN} className="bg-green-600 text-white px-4 py-2 rounded-lg flex items-center text-sm font-medium hover:bg-green-700">
                                <Plus size={16} className="mr-2"/> Receive from PO
                            </button>
                        </div>
                        <div className="overflow-x-auto">
                            <table className="w-full text-left text-sm">
                                <thead className="bg-slate-50 border-b border-slate-200 text-slate-500">
                                    <tr>
                                        <th className="px-4 py-3">ID</th>
                                        <th className="px-4 py-3">PO Ref</th>
                                        <th className="px-4 py-3">{t.warehouse}</th>
                                        <th className="px-4 py-3">{t.status}</th>
                                        <th className="px-4 py-3 text-right">{t.actions}</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100">
                                    {grns.length === 0 ? <tr><td colSpan={5} className="p-8 text-center text-slate-400">No active receipts</td></tr> : 
                                     grns.map(grn => (
                                        <tr key={grn.id} className="hover:bg-slate-50">
                                            <td className="px-4 py-3 font-mono font-medium text-indigo-600">{grn.id}</td>
                                            <td className="px-4 py-3 font-mono text-slate-500">{grn.poId}</td>
                                            <td className="px-4 py-3">{warehouses.find(w => w.id === grn.warehouseId)?.name || grn.warehouseId}</td>
                                            <td className="px-4 py-3">
                                                <span className={`px-2 py-1 rounded text-xs font-bold 
                                                    ${grn.status === 'VERIFIED' ? 'bg-green-100 text-green-700' : 'bg-slate-100 text-slate-600'}`}>
                                                    {grn.status}
                                                </span>
                                            </td>
                                            <td className="px-4 py-3 text-right flex justify-end space-x-2">
                                                <button onClick={() => setViewDoc({type: 'GRN', data: grn})} className="text-slate-400 hover:text-slate-600"><Eye size={18}/></button>
                                                {grn.status === 'DRAFT' && (
                                                    <button onClick={() => handleVerifyGRN(grn)} className="text-green-600 hover:text-green-700 text-xs font-bold border border-green-200 px-2 py-1 rounded">{t.verify}</button>
                                                )}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}

                {/* --- TRANSFERS --- */}
                {activeTab === 'TRF' && (
                     <div className="p-6">
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-xl font-bold text-slate-800 flex items-center"><ArrowRightLeft className="mr-2"/> {t.stock_transfer}s</h2>
                            <button onClick={handleCreateTransfer} className="bg-indigo-600 text-white px-4 py-2 rounded-lg flex items-center text-sm font-medium hover:bg-indigo-700">
                                <Plus size={16} className="mr-2"/> {t.create_new}
                            </button>
                        </div>
                        <div className="overflow-x-auto">
                            <table className="w-full text-left text-sm">
                                <thead className="bg-slate-50 border-b border-slate-200 text-slate-500">
                                    <tr>
                                        <th className="px-4 py-3">ID</th>
                                        <th className="px-4 py-3">{t.source}</th>
                                        <th className="px-4 py-3">{t.destination}</th>
                                        <th className="px-4 py-3">{t.status}</th>
                                        <th className="px-4 py-3 text-right">{t.actions}</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100">
                                    {transfers.length === 0 ? <tr><td colSpan={5} className="p-8 text-center text-slate-400">No transfers found</td></tr> : 
                                     transfers.map(trf => (
                                        <tr key={trf.id} className="hover:bg-slate-50">
                                            <td className="px-4 py-3 font-mono font-medium text-indigo-600">{trf.id}</td>
                                            <td className="px-4 py-3">{warehouses.find(w => w.id === trf.sourceWarehouseId)?.name}</td>
                                            <td className="px-4 py-3">{warehouses.find(w => w.id === trf.destWarehouseId)?.name}</td>
                                            <td className="px-4 py-3">
                                                 <span className={`px-2 py-1 rounded text-xs font-bold 
                                                    ${trf.status === 'RECEIVED' ? 'bg-green-100 text-green-700' : 'bg-orange-100 text-orange-700'}`}>
                                                    {trf.status}
                                                </span>
                                            </td>
                                            <td className="px-4 py-3 text-right flex justify-end space-x-2">
                                                <button onClick={() => setViewDoc({type: 'TRANSFER', data: trf})} className="text-slate-400 hover:text-slate-600"><Eye size={18}/></button>
                                                {trf.status === 'DRAFT' && (
                                                    <button onClick={() => handleCompleteTransfer(trf)} className="text-green-600 hover:text-green-700 text-xs font-bold border border-green-200 px-2 py-1 rounded">Receive</button>
                                                )}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}

                {/* --- RETURNS --- */}
                {activeTab === 'RET' && (
                     <div className="p-6">
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-xl font-bold text-slate-800 flex items-center"><RotateCcw className="mr-2"/> {t.returns}</h2>
                            <button onClick={handleCreateReturn} className="bg-red-600 text-white px-4 py-2 rounded-lg flex items-center text-sm font-medium hover:bg-red-700">
                                <Plus size={16} className="mr-2"/> {t.create_new}
                            </button>
                        </div>
                        <div className="overflow-x-auto">
                            <table className="w-full text-left text-sm">
                                <thead className="bg-slate-50 border-b border-slate-200 text-slate-500">
                                    <tr>
                                        <th className="px-4 py-3">ID</th>
                                        <th className="px-4 py-3">{t.reason}</th>
                                        <th className="px-4 py-3">{t.status}</th>
                                        <th className="px-4 py-3 text-right">{t.actions}</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100">
                                    {returns.length === 0 ? <tr><td colSpan={4} className="p-8 text-center text-slate-400">No returns found</td></tr> : 
                                     returns.map(ret => (
                                        <tr key={ret.id} className="hover:bg-slate-50">
                                            <td className="px-4 py-3 font-mono font-medium text-indigo-600">{ret.id}</td>
                                            <td className="px-4 py-3">{ret.reason}</td>
                                            <td className="px-4 py-3">
                                                 <span className={`px-2 py-1 rounded text-xs font-bold 
                                                    ${ret.status === 'SHIPPED' ? 'bg-slate-100 text-slate-600' : 'bg-red-100 text-red-700'}`}>
                                                    {ret.status}
                                                </span>
                                            </td>
                                            <td className="px-4 py-3 text-right flex justify-end space-x-2">
                                                <button onClick={() => setViewDoc({type: 'RETURN', data: ret})} className="text-slate-400 hover:text-slate-600"><Eye size={18}/></button>
                                                {ret.status === 'DRAFT' && (
                                                    <button onClick={() => handleShipReturn(ret)} className="text-red-600 hover:text-red-700 text-xs font-bold border border-red-200 px-2 py-1 rounded">Ship</button>
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
                    title={viewDoc.type === 'GRN' ? t.grn : viewDoc.type === 'TRANSFER' ? t.stock_transfer : t.returns}
                    type={viewDoc.type}
                    data={viewDoc.data}
                    onClose={() => setViewDoc(null)}
                />
            )}
        </div>
    );
};