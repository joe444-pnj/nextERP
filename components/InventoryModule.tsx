import React, { useState } from 'react';
import { InventoryItem } from '../types';
import { RefreshCcw, Plus, Edit, Trash2, X, Barcode, Tag } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/Card';
import { Button } from './ui/Button';

const InventoryModule: React.FC<{
    inventory: InventoryItem[];
    onSaveItem: (item: any) => void;
    onDeleteItem: (id: string) => void;
    onSync: () => void;
    t: any;
    currency: string;
}> = ({ inventory, onSaveItem, onDeleteItem, onSync, t, currency }) => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isSyncing, setIsSyncing] = useState(false);

    // Default empty item
    const emptyItem = { name: '', sku: '', barcode: '', shelfTag: '', company: '', category: 'Grocery', price: '', stockLevel: '' };
    const [formData, setFormData] = useState<any>(emptyItem);
    const [editingId, setEditingId] = useState<string | null>(null);

    const handleOpenAdd = () => {
        setFormData(emptyItem);
        setEditingId(null);
        setIsModalOpen(true);
    };

    const handleOpenEdit = (item: InventoryItem) => {
        setFormData({
            ...item,
            price: item.price.toString(),
            stockLevel: item.stockLevel.toString()
        });
        setEditingId(item.id);
        setIsModalOpen(true);
    };

    const handleSync = () => {
        setIsSyncing(true);
        onSync();
        setTimeout(() => {
            setIsSyncing(false);
        }, 1500);
    };

    const handleSubmit = () => {
        const itemToSave = {
            ...formData,
            id: editingId || Math.random().toString(),
            price: parseFloat(formData.price) || 0,
            stockLevel: parseInt(formData.stockLevel) || 0,
            lastUpdated: new Date().toISOString()
        };
        onSaveItem(itemToSave);
        setIsModalOpen(false);
    };

    const handleDeleteClick = (id: string) => {
        if (window.confirm(t.confirm_delete)) {
            onDeleteItem(id);
        }
    };

    return (
        <div className="space-y-6 p-4">
            <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold text-slate-800">{t.inventory}</h2>
                <div className="flex space-x-2 rtl:space-x-reverse">
                    <Button
                        onClick={handleSync}
                        disabled={isSyncing}
                        variant="outline"
                        className="bg-white"
                    >
                        <RefreshCcw size={16} className={`mr-2 rtl:ml-2 ${isSyncing ? 'animate-spin' : ''}`} />
                        <span>{isSyncing ? t.syncing : t.sync}</span>
                    </Button>
                    <Button
                        onClick={handleOpenAdd}
                        className="bg-slate-900"
                    >
                        <Plus size={16} className="mr-2 rtl:ml-2" />
                        <span>{t.add_item}</span>
                    </Button>
                </div>
            </div>

            <Card className="rounded-xl shadow-sm border border-slate-200 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left rtl:text-right">
                        <thead className="bg-slate-50 border-b border-slate-200">
                            <tr>
                                <th className="px-6 py-4 text-sm font-semibold text-slate-600">{t.product_name}</th>
                                <th className="px-6 py-4 text-sm font-semibold text-slate-600">{t.category}</th>
                                <th className="px-6 py-4 text-sm font-semibold text-slate-600">{t.shelf_tag}</th>
                                <th className="px-6 py-4 text-sm font-semibold text-slate-600 text-right rtl:text-left">{t.price} ({currency})</th>
                                <th className="px-6 py-4 text-sm font-semibold text-slate-600 text-right rtl:text-left">{t.stock}</th>
                                <th className="px-6 py-4 text-sm font-semibold text-slate-600">{t.last_updated}</th>
                                <th className="px-6 py-4 text-sm font-semibold text-slate-600 text-center">{t.actions}</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {inventory.length === 0 ? (
                                <tr>
                                    <td colSpan={7} className="text-center py-12 text-slate-400">Inventory is empty. Add items to start.</td>
                                </tr>
                            ) : inventory.map((item) => (
                                <tr key={item.id} className="hover:bg-slate-50 transition-colors">
                                    <td className="px-6 py-4">
                                        <div className="font-medium text-slate-800">{item.name}</div>
                                        <div className="flex space-x-2 rtl:space-x-reverse text-xs text-slate-400 font-mono mt-1">
                                            <span>{item.sku}</span>
                                            <span className="text-slate-300">|</span>
                                            <span>{item.company}</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-sm text-slate-500">{item.category}</td>
                                    <td className="px-6 py-4 text-sm text-slate-500 font-mono bg-slate-50 rounded w-fit px-2">{item.shelfTag}</td>
                                    <td className="px-6 py-4 text-sm text-slate-800 text-right rtl:text-left">{item.price.toFixed(2)}</td>
                                    <td className="px-6 py-4 text-sm text-slate-800 text-right rtl:text-left">
                                        <span className={`font-mono font-bold ${item.stockLevel <= 5 ? 'text-red-600' : 'text-slate-700'}`}>{item.stockLevel}</span>
                                    </td>
                                    <td className="px-6 py-4 text-xs text-slate-400">
                                        {item.lastUpdated ? new Date(item.lastUpdated).toLocaleDateString() : '-'}
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center justify-center space-x-2 rtl:space-x-reverse">
                                            <button onClick={() => handleOpenEdit(item)} className="p-2 text-slate-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors" title={t.edit}>
                                                <Edit size={16} />
                                            </button>
                                            <button onClick={() => handleDeleteClick(item.id)} className="p-2 text-slate-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors" title={t.delete}>
                                                <Trash2 size={16} />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </Card>

            {/* Item Modal (Add / Edit) */}
            {isModalOpen && (
                <div className="fixed inset-0 z-[100] bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in">
                    <div className="bg-white w-full max-w-lg rounded-2xl shadow-2xl p-6">
                        <div className="flex justify-between items-center mb-6">
                            <h3 className="text-xl font-bold text-slate-800">{t.add_item_title}</h3>
                            <button onClick={() => setIsModalOpen(false)} className="p-1 hover:bg-slate-100 rounded-full"><X size={20} /></button>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="col-span-2">
                                <label className="block text-sm font-medium text-slate-700 mb-1">{t.product_name}</label>
                                <input type="text" className="w-full p-2 border rounded-lg" value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">{t.sku}</label>
                                <input type="text" className="w-full p-2 border rounded-lg font-mono text-sm" placeholder="ABC-123" value={formData.sku} onChange={e => setFormData({ ...formData, sku: e.target.value })} />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">{t.category}</label>
                                <select className="w-full p-2 border rounded-lg" value={formData.category} onChange={e => setFormData({ ...formData, category: e.target.value })}>
                                    <option>Produce</option><option>Dairy</option><option>Meat</option><option>Bakery</option><option>Grocery</option><option>Beverages</option><option>Snacks</option>
                                </select>
                            </div>
                            {/* Specific Barcode Fields */}
                            <div className="col-span-2 grid grid-cols-2 gap-4 bg-slate-50 p-3 rounded-lg border border-slate-100">
                                <div>
                                    <label className="flex items-center text-xs font-bold text-slate-600 mb-1 uppercase tracking-wider">
                                        <Barcode size={14} className="mr-1 rtl:ml-1" /> {t.barcode} (UPC)
                                    </label>
                                    <input type="text" className="w-full p-2 border rounded bg-white font-mono text-sm" placeholder="Scannable Barcode" value={formData.barcode} onChange={e => setFormData({ ...formData, barcode: e.target.value })} />
                                </div>
                                <div>
                                    <label className="flex items-center text-xs font-bold text-slate-600 mb-1 uppercase tracking-wider">
                                        <Tag size={14} className="mr-1 rtl:ml-1" /> {t.shelf_tag}
                                    </label>
                                    <input type="text" className="w-full p-2 border rounded bg-white font-mono text-sm" placeholder="A-01-01" value={formData.shelfTag} onChange={e => setFormData({ ...formData, shelfTag: e.target.value })} />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">{t.company}</label>
                                <input type="text" className="w-full p-2 border rounded-lg" placeholder="Manufacturer" value={formData.company} onChange={e => setFormData({ ...formData, company: e.target.value })} />
                            </div>
                            <div></div>

                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">{t.price} ({currency})</label>
                                <input type="number" className="w-full p-2 border rounded-lg" placeholder="0.00" value={formData.price} onChange={e => setFormData({ ...formData, price: e.target.value })} />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">{t.stock}</label>
                                <input type="number" className="w-full p-2 border rounded-lg" placeholder="0" value={formData.stockLevel} onChange={e => setFormData({ ...formData, stockLevel: e.target.value })} />
                            </div>
                        </div>

                        <div className="mt-6 flex justify-end space-x-2 rtl:space-x-reverse">
                            <Button onClick={() => setIsModalOpen(false)} variant="ghost" className="text-slate-600">{t.cancel}</Button>
                            <Button onClick={handleSubmit} className="bg-green-600 hover:bg-green-700">{t.save_product}</Button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default InventoryModule;
