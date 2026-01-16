import React from 'react';
import { Settings, X, Save } from 'lucide-react';
import { Button } from './ui/Button';

const SettingsModal: React.FC<{
    isOpen: boolean;
    onClose: () => void;
    t: any;
    currency: string;
    setCurrency: (c: string) => void;
}> = ({ isOpen, onClose, t, currency, setCurrency }) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[100] bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200">
            <div className="bg-white w-full max-w-md rounded-2xl shadow-2xl overflow-hidden">
                <div className="p-4 border-b border-slate-200 flex justify-between items-center bg-slate-50">
                    <h3 className="font-bold text-lg text-slate-800 flex items-center">
                        <Settings size={18} className="mr-2 rtl:ml-2 rtl:mr-0" /> {t.settings}
                    </h3>
                    <button onClick={onClose} className="text-slate-400 hover:text-slate-600 p-1">
                        <X size={20} />
                    </button>
                </div>
                <div className="p-6 space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">{t.store_name}</label>
                        <input type="text" defaultValue="Grand Market - Downtown" className="w-full p-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-green-500 outline-none" />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">{t.currency}</label>
                        <input
                            type="text"
                            value={currency}
                            onChange={(e) => setCurrency(e.target.value)}
                            placeholder={t.currency_placeholder}
                            className="w-full p-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-green-500 outline-none uppercase font-mono"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">{t.register_id}</label>
                        <input type="text" defaultValue="DEV-01" disabled className="w-full p-2 border border-slate-200 bg-slate-50 rounded-lg text-slate-500" />
                    </div>
                    <div className="pt-2">
                        <label className="flex items-center space-x-2 rtl:space-x-reverse cursor-pointer">
                            <input type="checkbox" className="w-4 h-4 text-green-600 rounded focus:ring-green-500" defaultChecked />
                            <span className="text-sm text-slate-700">{t.enable_sound}</span>
                        </label>
                    </div>
                </div>
                <div className="p-4 border-t border-slate-100 bg-slate-50 flex justify-end space-x-2 rtl:space-x-reverse">
                    <Button onClick={onClose} variant="secondary" className="text-slate-600 hover:bg-slate-200">{t.cancel}</Button>
                    <Button onClick={onClose} className="bg-green-600 hover:bg-green-700">
                        <Save size={16} className="mr-2 rtl:ml-2 rtl:mr-0" /> {t.save_changes}
                    </Button>
                </div>
            </div>
        </div>
    )
}

export default SettingsModal;
