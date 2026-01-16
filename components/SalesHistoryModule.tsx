import React from 'react';
import { MOCK_SALES } from '../constants';
import { Banknote, CreditCard } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/Card';

const SalesHistoryModule: React.FC<{ t: any; currency: string }> = ({ t, currency }) => {
    return (
        <div className="space-y-6 p-4">
            <h2 className="text-2xl font-bold text-slate-800">{t.todays_sales}</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                <Card className="bg-white border-slate-200 shadow-sm">
                    <CardContent className="p-4">
                        <p className="text-sm text-slate-500">{t.revenue}</p>
                        <p className="text-2xl font-bold text-green-600">452.20 {currency}</p>
                    </CardContent>
                </Card>
                <Card className="bg-white border-slate-200 shadow-sm">
                    <CardContent className="p-4">
                        <p className="text-sm text-slate-500">{t.transactions}</p>
                        <p className="text-2xl font-bold text-slate-800">34</p>
                    </CardContent>
                </Card>
            </div>

            <Card className="bg-white rounded-xl shadow-sm border border-slate-200">
                <div className="divide-y divide-slate-100">
                    {MOCK_SALES.map(sale => (
                        <div key={sale.id} className="p-4 flex justify-between items-center hover:bg-slate-50">
                            <div className="flex items-center space-x-4 rtl:space-x-reverse">
                                <div className="w-10 h-10 bg-slate-100 rounded-full flex items-center justify-center text-slate-500">
                                    {sale.method === 'CASH' ? <Banknote size={18} /> : <CreditCard size={18} />}
                                </div>
                                <div>
                                    <p className="font-medium text-slate-800">Sale #{sale.id}</p>
                                    <p className="text-xs text-slate-400">{sale.time} • {sale.items} items</p>
                                </div>
                            </div>
                            <span className="font-bold text-slate-800">{sale.total.toFixed(2)} {currency}</span>
                        </div>
                    ))}
                </div>
            </Card>
        </div>
    )
}

export default SalesHistoryModule;
