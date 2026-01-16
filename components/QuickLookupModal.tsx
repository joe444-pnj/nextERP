import React, { useState } from 'react';
import { InventoryItem } from '../types';
import { Search, X } from 'lucide-react';

const QuickLookupModal: React.FC<{
    isOpen: boolean;
    onClose: () => void;
    inventory: InventoryItem[];
    t: any;
    currency: string;
}> = ({ isOpen, onClose, inventory, t, currency }) => {
    const [search, setSearch] = useState('');
    const [result, setResult] = useState<InventoryItem | null>(null);

    const handleSearch = () => {
        const found = inventory.find(i =>
            i.barcode === search ||
            i.shelfTag.toLowerCase() === search.toLowerCase() ||
            i.sku.toLowerCase() === search.toLowerCase()
        );
        setResult(found || null);
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[100] bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in">
            <div className="bg-white w-full max-w-lg rounded-2xl shadow-2xl p-6 relative">
                <button onClick={onClose} className="absolute top-4 right-4 rtl:left-4 rtl:right-auto text-slate-400 hover:text-slate-600">
                    <X size={24} />
                </button>

                <div className="text-center mb-6">
                    <div className="w-16 h-16 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mx-auto mb-3">
                        <Search size={32} />
                    </div>
                    <h3 className="text-xl font-bold text-slate-800">{t.lookup_title}</h3>
                    <p className="text-sm text-slate-500">{t.lookup_desc}</p>
                </div>

                <div className="flex space-x-2 rtl:space-x-reverse mb-6">
                    <input
                        className="flex-1 border border-slate-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 outline-none"
                        placeholder={t.lookup_input}
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                        autoFocus
                    />
                    <button onClick={handleSearch} className="bg-blue-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-blue-700">{t.quick_lookup}</button>
                </div>

                {result ? (
                    <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 animate-in zoom-in-95">
                        <div className="flex justify-between items-start mb-4">
                            <div>
                                <h4 className="text-lg font-bold text-slate-900">{result.name}</h4>
                                <p className="text-sm text-slate-500">{result.company}</p>
                            </div>
                            <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm font-bold">{result.price.toFixed(2)} {currency}</span>
                        </div>
                        <div className="grid grid-cols-2 gap-4 text-sm">
                            <div className="bg-white p-2 rounded border border-slate-100">
                                <span className="block text-xs text-slate-400 uppercase">{t.stock}</span>
                                <span className="font-mono font-bold">{result.stockLevel}</span>
                            </div>
                            <div className="bg-white p-2 rounded border border-slate-100">
                                <span className="block text-xs text-slate-400 uppercase">{t.category}</span>
                                <span>{result.category}</span>
                            </div>
                            <div className="bg-white p-2 rounded border border-slate-100">
                                <span className="block text-xs text-slate-400 uppercase">{t.shelf_tag}</span>
                                <span className="font-mono">{result.shelfTag}</span>
                            </div>
                            <div className="bg-white p-2 rounded border border-slate-100">
                                <span className="block text-xs text-slate-400 uppercase">{t.barcode}</span>
                                <span className="font-mono">{result.barcode}</span>
                            </div>
                            <div className="col-span-2 bg-white p-2 rounded border border-slate-100">
                                <span className="block text-xs text-slate-400 uppercase">{t.last_updated}</span>
                                <span>{result.lastUpdated ? new Date(result.lastUpdated).toLocaleString() : '-'}</span>
                            </div>
                        </div>
                    </div>
                ) : search && (
                    <div className="text-center text-slate-400 py-4">No item found.</div>
                )}
            </div>
        </div>
    );
}

export default QuickLookupModal;
