import React, { useState } from 'react';
import { InventoryItem } from '../types';
import { Barcode, Tag, Search, Plus, RefreshCcw, Printer, Copy, X } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/Card';
import { Button } from './ui/Button';

const LabelPrintingModule: React.FC<{
    inventory: InventoryItem[];
    t: any;
    currency: string;
}> = ({ inventory, t, currency }) => {
    const [mode, setMode] = useState<'BARCODE' | 'SHELF'>('BARCODE');
    const [searchCode, setSearchCode] = useState('');
    const [foundItem, setFoundItem] = useState<InventoryItem | null>(null);
    const [printQueue, setPrintQueue] = useState<InventoryItem[]>([]);
    const [isPrinting, setIsPrinting] = useState(false);

    const handleSearch = (code: string) => {
        setSearchCode(code);
        if (!code) {
            setFoundItem(null);
            return;
        }

        const item = inventory.find(i =>
            i.barcode === code ||
            i.shelfTag.toLowerCase() === code.toLowerCase() ||
            i.sku.toLowerCase() === code.toLowerCase() ||
            i.name.toLowerCase().includes(code.toLowerCase())
        );
        setFoundItem(item || null);
    };

    const handleAddToQueue = () => {
        if (foundItem) {
            setPrintQueue(prev => [...prev, foundItem]);
            setSearchCode('');
            setFoundItem(null);
        }
    };

    const handlePrint = (singleItem?: InventoryItem) => {
        setIsPrinting(true);
        setTimeout(() => {
            setIsPrinting(false);
            if (!singleItem) {
                setPrintQueue([]);
            }
            alert(`Printing ${singleItem ? 1 : printQueue.length} labels...`);
        }, 1500);
    };

    return (
        <div className="h-full flex flex-col md:flex-row gap-6 p-4">
            <div className="flex-1 space-y-6">
                {/* Top Controls */}
                <Card>
                    <CardHeader>
                        <CardTitle className="text-xl font-bold text-slate-800">{t.label_printing}</CardTitle>
                    </CardHeader>

                    <CardContent>
                        <div className="flex space-x-4 rtl:space-x-reverse mb-6">
                            <Button
                                onClick={() => setMode('BARCODE')}
                                variant={mode === 'BARCODE' ? 'default' : 'outline'}
                                className="flex-1 h-12"
                            >
                                <Barcode size={20} className="mr-2 rtl:ml-2" />
                                {t.mode_barcode}
                            </Button>
                            <Button
                                onClick={() => setMode('SHELF')}
                                variant={mode === 'SHELF' ? 'default' : 'outline'}
                                className="flex-1 h-12"
                            >
                                <Tag size={20} className="mr-2 rtl:ml-2" />
                                {t.mode_shelftag}
                            </Button>
                        </div>

                        <div className="relative">
                            <input
                                value={searchCode}
                                onChange={(e) => handleSearch(e.target.value)}
                                placeholder={t.scan_input_placeholder}
                                type="text"
                                className="w-full pl-12 pr-4 py-4 text-lg border-2 border-indigo-100 rounded-xl focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 outline-none transition-all"
                                autoFocus
                            />
                            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-indigo-300" size={24} />
                        </div>
                    </CardContent>
                </Card>

                {/* Search Result */}
                {foundItem ? (
                    <Card className="border-green-200 animate-in fade-in slide-in-from-bottom-4 shadow-md shadow-green-100">
                        <CardContent className="p-6">
                            <div className="flex justify-between items-start mb-6">
                                <div>
                                    <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide mb-2 inline-block">
                                        {t.item_found}
                                    </span>
                                    <h3 className="text-2xl font-bold text-slate-900">{foundItem.name}</h3>
                                    <p className="text-slate-500">{foundItem.company} • {foundItem.sku}</p>
                                </div>
                                <div className="text-right">
                                    <div className="text-3xl font-bold text-slate-900">{foundItem.price.toFixed(2)} {currency}</div>
                                    <div className="text-sm text-slate-400">{t.stock}: {foundItem.stockLevel}</div>
                                </div>
                            </div>

                            <div className="flex items-center space-x-4 rtl:space-x-reverse">
                                <Button
                                    onClick={handleAddToQueue}
                                    variant="secondary"
                                    className="flex-1 h-12"
                                >
                                    <Plus size={20} className="mr-2" />
                                    {t.add_to_print_queue}
                                </Button>
                                <Button
                                    onClick={() => handlePrint(foundItem)}
                                    disabled={isPrinting}
                                    className="flex-1 h-12 bg-indigo-600 hover:bg-indigo-700 text-white shadow-md shadow-indigo-200"
                                >
                                    {isPrinting ? <RefreshCcw className="animate-spin mr-2" size={20} /> : <Printer className="mr-2" size={20} />}
                                    {t.print_label}
                                </Button>
                            </div>

                            {/* Preview Area */}
                            <div className="mt-8 pt-8 border-t border-slate-100">
                                <h4 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-4 text-center">{t.preview}</h4>
                                <div className="flex justify-center">
                                    {mode === 'BARCODE' ? (
                                        <div className="bg-white border-2 border-slate-800 p-4 rounded w-64 text-center">
                                            <h5 className="font-bold text-slate-900 truncate">{foundItem.name}</h5>
                                            <div className="my-2 h-16 bg-slate-900 w-full"></div> {/* Fake Barcode */}
                                            <div className="flex justify-between text-xs font-mono">
                                                <span>{foundItem.barcode}</span>
                                                <span className="font-bold text-lg">{foundItem.price.toFixed(2)} {currency}</span>
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="bg-yellow-100 border-2 border-yellow-400 p-4 rounded w-64 h-32 flex flex-col justify-between">
                                            <div className="flex justify-between items-start">
                                                <span className="font-bold text-3xl text-slate-900">{foundItem.shelfTag}</span>
                                                <span className="font-bold text-xl">{foundItem.price.toFixed(2)} {currency}</span>
                                            </div>
                                            <div className="text-sm font-medium text-slate-700 truncate">
                                                {foundItem.name}
                                            </div>
                                            <div className="text-xs text-slate-500 font-mono text-right">{foundItem.sku}</div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                ) : searchCode && (
                    <div className="bg-slate-50 border border-slate-200 p-8 rounded-xl text-center text-slate-400">
                        <Search size={48} className="mx-auto mb-2 opacity-20" />
                        <p>No item found for "{searchCode}"</p>
                    </div>
                )}
            </div>

            {/* Print Queue Sidebar */}
            <Card className="w-full md:w-80 flex flex-col overflow-hidden h-[600px] md:h-auto border-slate-200">
                <div className="p-4 bg-slate-900 text-white flex justify-between items-center">
                    <div className="flex items-center space-x-2 rtl:space-x-reverse">
                        <Copy size={18} />
                        <h3 className="font-bold">{t.print_queue}</h3>
                    </div>
                    <span className="bg-slate-700 px-2 py-0.5 rounded text-xs font-bold">{printQueue.length}</span>
                </div>

                <div className="flex-1 overflow-y-auto p-4 space-y-3">
                    {printQueue.length === 0 ? (
                        <div className="h-full flex flex-col items-center justify-center text-slate-400 text-sm">
                            <Printer size={32} className="opacity-20 mb-2" />
                            {t.no_items_queue}
                        </div>
                    ) : (
                        printQueue.map((item, idx) => (
                            <div key={`${item.id}-${idx}`} className="flex justify-between items-center p-3 bg-slate-50 rounded-lg border border-slate-100">
                                <div className="overflow-hidden">
                                    <div className="font-medium text-slate-800 text-sm truncate">{item.name}</div>
                                    <div className="text-xs text-slate-400 font-mono">{mode === 'BARCODE' ? item.barcode : item.shelfTag}</div>
                                </div>
                                <button
                                    onClick={() => setPrintQueue(prev => prev.filter((_, i) => i !== idx))}
                                    className="text-red-400 hover:text-red-600 p-1"
                                >
                                    <X size={16} />
                                </button>
                            </div>
                        ))
                    )}
                </div>

                <div className="p-4 border-t border-slate-200 bg-slate-50">
                    <div className="grid grid-cols-2 gap-3">
                        <Button
                            onClick={() => setPrintQueue([])}
                            disabled={printQueue.length === 0}
                            variant="outline"
                            className="w-full"
                        >
                            {t.clear_queue}
                        </Button>
                        <Button
                            onClick={() => handlePrint()}
                            disabled={printQueue.length === 0 || isPrinting}
                            className="w-full"
                        >
                            {isPrinting ? <RefreshCcw className="animate-spin mr-1" size={14} /> : null}
                            {t.print_all}
                        </Button>
                    </div>
                </div>
            </Card>
        </div>
    );
}

export default LabelPrintingModule;
