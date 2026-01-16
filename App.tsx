import React, { useState, useEffect } from 'react';
import { Layout } from './components/Layout';
import { ModuleType, InventoryItem, Language, PurchaseRequest, PurchaseOrder, SupplierInvoice, GoodsReceiptNote, StockTransfer, PurchaseReturn } from './types';
import { MOCK_INVENTORY, MOCK_SALES, MOCK_NOTIFICATIONS, TRANSLATIONS, MOCK_SUPPLIERS, MOCK_WAREHOUSES } from './constants';
import { AIAssistant } from './components/AIAssistant';
import { ProcurementModule } from './components/ProcurementModule';
import { WarehouseModule } from './components/WarehouseModule';
import InventoryModule from './components/InventoryModule';
import LabelPrintingModule from './components/LabelPrintingModule';
import SalesHistoryModule from './components/SalesHistoryModule';
import SettingsModal from './components/SettingsModal';
import NotificationsDropdown from './components/NotificationsDropdown';
import QuickLookupModal from './components/QuickLookupModal';

export default function App() {
    const [currentModule, setCurrentModule] = useState<ModuleType>(ModuleType.INVENTORY);
    const [isAIOpen, setIsAIOpen] = useState(false);

    // -- State Logic with Local Storage --
    const [inventory, setInventory] = useState<InventoryItem[]>(() => {
        try {
            const saved = localStorage.getItem('grandmarket_inventory');
            return saved ? JSON.parse(saved) : MOCK_INVENTORY;
        } catch (e) {
            return MOCK_INVENTORY;
        }
    });

    const [salesHistory, setSalesHistory] = useState(() => {
        try {
            const saved = localStorage.getItem('grandmarket_sales');
            return saved ? JSON.parse(saved) : MOCK_SALES;
        } catch {
            return MOCK_SALES;
        }
    });

    const [currency, setCurrency] = useState(() => {
        return localStorage.getItem('nexterp_currency') || 'USD';
    });

    // ERP States
    const [purchaseRequests, setPurchaseRequests] = useState<PurchaseRequest[]>([]);
    const [purchaseOrders, setPurchaseOrders] = useState<PurchaseOrder[]>([]);
    const [supplierInvoices, setSupplierInvoices] = useState<SupplierInvoice[]>([]);
    const [grns, setGrns] = useState<GoodsReceiptNote[]>([]);
    const [transfers, setTransfers] = useState<StockTransfer[]>([]);
    const [returns, setReturns] = useState<PurchaseReturn[]>([]);


    // Persist Data
    useEffect(() => {
        localStorage.setItem('grandmarket_inventory', JSON.stringify(inventory));
    }, [inventory]);

    useEffect(() => {
        localStorage.setItem('grandmarket_sales', JSON.stringify(salesHistory));
    }, [salesHistory]);

    useEffect(() => {
        localStorage.setItem('nexterp_currency', currency);
    }, [currency]);


    // State for Language
    const [language, setLanguage] = useState<Language>('en');

    // New State for Modals/Overlays
    const [isSettingsOpen, setIsSettingsOpen] = useState(false);
    const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
    const [isQuickLookupOpen, setIsQuickLookupOpen] = useState(false);

    // Get current translations
    const t = TRANSLATIONS[language];

    const handleSaveItem = (item: InventoryItem) => {
        setInventory(prev => {
            const exists = prev.find(i => i.id === item.id);
            if (exists) {
                return prev.map(i => i.id === item.id ? item : i);
            }
            return [...prev, item];
        });
    };

    const handleDeleteItem = (id: string) => {
        setInventory(prev => prev.filter(item => item.id !== id));
    };

    const handleSync = () => {
        console.log("Syncing to cloud...");
        localStorage.setItem('grandmarket_inventory', JSON.stringify(inventory));
    };

    const renderModule = () => {
        switch (currentModule) {
            case ModuleType.INVENTORY:
                return <InventoryModule
                    inventory={inventory}
                    onSaveItem={handleSaveItem}
                    onDeleteItem={handleDeleteItem}
                    onSync={handleSync}
                    t={t}
                    currency={currency}
                />;
            case ModuleType.PROCUREMENT:
                return <ProcurementModule
                    requests={purchaseRequests}
                    orders={purchaseOrders}
                    invoices={supplierInvoices}
                    inventory={inventory}
                    suppliers={MOCK_SUPPLIERS}
                    onUpdateRequests={setPurchaseRequests}
                    onUpdateOrders={setPurchaseOrders}
                    onUpdateInvoices={setSupplierInvoices}
                    t={t}
                />;
            case ModuleType.WAREHOUSE:
                return <WarehouseModule
                    grns={grns}
                    transfers={transfers}
                    returns={returns}
                    orders={purchaseOrders}
                    warehouses={MOCK_WAREHOUSES}
                    inventory={inventory}
                    onUpdateGRNs={setGrns}
                    onUpdateTransfers={setTransfers}
                    onUpdateReturns={setReturns}
                    onUpdateInventory={setInventory}
                    t={t}
                />;
            case ModuleType.LABEL_PRINTING:
                return <LabelPrintingModule
                    inventory={inventory}
                    t={t}
                    currency={currency}
                />;
            case ModuleType.SALES:
                return <SalesHistoryModule t={t} currency={currency} />;

            default:
                return <InventoryModule inventory={inventory} onSaveItem={handleSaveItem} onDeleteItem={handleDeleteItem} onSync={handleSync} t={t} currency={currency} />;
        }
    };

    return (
        <Layout
            currentModule={currentModule}
            setModule={setCurrentModule}
            toggleAI={() => setIsAIOpen(prev => !prev)}
            onOpenSettings={() => setIsSettingsOpen(true)}
            onOpenNotifications={() => setIsNotificationsOpen(prev => !prev)}
            onOpenQuickLookup={() => setIsQuickLookupOpen(true)}
            notificationCount={MOCK_NOTIFICATIONS.filter(n => !n.read).length}
            language={language}
            setLanguage={setLanguage}
        >
            {renderModule()}

            {/* Overlays */}
            <AIAssistant isOpen={isAIOpen} onClose={() => setIsAIOpen(false)} />
            <SettingsModal
                isOpen={isSettingsOpen}
                onClose={() => setIsSettingsOpen(false)}
                t={t}
                currency={currency}
                setCurrency={setCurrency}
            />
            <NotificationsDropdown
                isOpen={isNotificationsOpen}
                onClose={() => setIsNotificationsOpen(false)}
                notifications={MOCK_NOTIFICATIONS}
                t={t}
            />
            <QuickLookupModal
                isOpen={isQuickLookupOpen}
                onClose={() => setIsQuickLookupOpen(false)}
                inventory={inventory}
                t={t}
                currency={currency}
            />

            {/* Click outside listener for notifications */}
            {isNotificationsOpen && (
                <div
                    className="fixed inset-0 z-[80]"
                    onClick={() => setIsNotificationsOpen(false)}
                />
            )}
        </Layout>
    );
}