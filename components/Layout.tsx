import React, { useState, useEffect } from 'react';
import {
  Package,
  History,
  Settings,
  Menu,
  X,
  Search,
  Bell,
  Sparkles,
  Printer,
  FileText,
  Briefcase,
  Truck,
  LogOut
} from 'lucide-react';
import { ModuleType, Language } from '../types';
import { TRANSLATIONS } from '../constants';
import { Button } from './ui/Button';
import { LayoutGroup, motion, AnimatePresence } from 'framer-motion';

interface LayoutProps {
  currentModule: ModuleType;
  setModule: (module: ModuleType) => void;
  children: React.ReactNode;
  toggleAI: () => void;
  onOpenSettings: () => void;
  onOpenNotifications: () => void;
  onOpenQuickLookup: () => void;
  notificationCount: number;
  language: Language;
  setLanguage: (lang: Language) => void;
}

export const Layout: React.FC<LayoutProps> = ({
  currentModule,
  setModule,
  children,
  toggleAI,
  onOpenSettings,
  onOpenNotifications,
  onOpenQuickLookup,
  notificationCount,
  language,
  setLanguage
}) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    document.body.dir = language === 'ar' ? 'rtl' : 'ltr';
  }, [language]);

  const t = TRANSLATIONS[language];

  const navItems = [
    { type: ModuleType.INVENTORY, label: t.inventory, icon: Package },
    { type: ModuleType.PROCUREMENT, label: t.procurement, icon: Briefcase },
    { type: ModuleType.WAREHOUSE, label: t.warehouse_menu, icon: Truck },
    { type: ModuleType.LABEL_PRINTING, label: t.label_printing, icon: Printer },
    { type: ModuleType.SALES, label: t.sales, icon: History },
  ];

  return (
    <div className={`flex h-screen bg-slate-50 overflow-hidden ${language === 'ar' ? 'text-right' : 'text-left'}`} dir={language === 'ar' ? 'rtl' : 'ltr'}>
      {/* Sidebar */}
      <aside className={`
        fixed inset-y-0 ${language === 'ar' ? 'right-0' : 'left-0'} z-50 w-72 bg-slate-900 text-white transform transition-transform duration-300 ease-in-out
        ${isMobileMenuOpen ? 'translate-x-0' : (language === 'ar' ? 'translate-x-full' : '-translate-x-full')}
        md:relative md:translate-x-0 shadow-2xl flex flex-col justify-between
      `}>
        <div>
          <div className="flex items-center justify-between p-6 h-20 border-b border-slate-800 bg-slate-900/50 backdrop-blur-sm">
            <div className="flex items-center space-x-3 rtl:space-x-reverse">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/20">
                <span className="font-bold text-white text-xl">N</span>
              </div>
              <span className="text-xl font-bold tracking-tight text-white">NextERP</span>
            </div>
            <button onClick={() => setIsMobileMenuOpen(false)} className="md:hidden text-slate-400 hover:text-white transition-colors">
              <X size={24} />
            </button>
          </div>

          <nav className="p-4 space-y-2 mt-4">
            {navItems.map((item) => (
              <button
                key={item.type}
                onClick={() => {
                  setModule(item.type);
                  setIsMobileMenuOpen(false);
                }}
                className={`
                    relative flex items-center w-full px-4 py-3.5 text-sm font-medium rounded-xl transition-all duration-300 group overflow-hidden
                    ${currentModule === item.type
                    ? 'bg-blue-600/10 text-blue-400 shadow-sm'
                    : 'text-slate-400 hover:bg-slate-800 hover:text-slate-200'}
                `}
              >
                {currentModule === item.type && (
                  <motion.div
                    layoutId="activeTab"
                    className="absolute inset-0 bg-blue-600/10 rounded-xl"
                    initial={false}
                    transition={{ type: "spring", stiffness: 500, damping: 30 }}
                  />
                )}
                <item.icon size={20} className={`mx-3 z-10 ${language === 'ar' ? 'ml-3 mr-0' : 'mr-3 ml-0'} ${currentModule === item.type ? 'text-blue-400' : 'group-hover:text-white transition-colors'}`} />
                <span className="z-10">{item.label}</span>
                {currentModule === item.type && (
                  <motion.div
                    className={`absolute ${language === 'ar' ? 'right-0' : 'left-0'} top-1/2 transform -translate-y-1/2 w-1 h-8 bg-blue-500 rounded-full shadow-[0_0_10px_rgba(59,130,246,0.5)]`}
                    layoutId="activeIndicator"
                  />
                )}
              </button>
            ))}
          </nav>
        </div>

        <div className="p-4 border-t border-slate-800 bg-slate-900/50">
          <div className="flex items-center space-x-3 rtl:space-x-reverse mb-4 p-2 rounded-lg bg-slate-800/50">
            <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-slate-700 to-slate-600 flex items-center justify-center text-slate-300 font-bold border border-slate-500 shadow-inner">
              AU
            </div>
            <div className="flex-1 overflow-hidden">
              <p className="text-sm font-medium text-white truncate">Admin User</p>
              <p className="text-xs text-green-400 flex items-center">
                <span className="w-2 h-2 bg-green-500 rounded-full mx-1 animate-pulse shadow-[0_0_5px_rgba(34,197,94,0.5)]"></span>
                {t.online}
              </p>
            </div>
            <button
              onClick={onOpenSettings}
              className="text-slate-400 hover:text-white p-2 rounded-lg hover:bg-slate-700 transition-colors"
              title={t.settings}
            >
              <Settings size={18} />
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0 bg-slate-50 relative">
        {/* Top Header */}
        <header className="bg-white/80 backdrop-blur-md border-b border-slate-200 h-20 flex items-center justify-between px-8 sticky top-0 z-40 transition-shadow transition-all duration-300">
          <div className="flex items-center">
            <button
              onClick={() => setIsMobileMenuOpen(true)}
              className={`md:hidden text-slate-500 hover:text-slate-700 p-2 rounded-lg active:bg-slate-100 ${language === 'ar' ? 'ml-4' : 'mr-4'} transition-colors`}
            >
              <Menu size={24} />
            </button>
            <div className="hidden md:flex items-center text-slate-500 text-sm font-medium">
              <span className="bg-slate-100/80 px-4 py-1.5 rounded-full border border-slate-200/50 shadow-sm text-slate-600">
                Morning Shift • {new Date().toLocaleDateString()}
              </span>
            </div>
          </div>

          <div className="flex items-center space-x-4 rtl:space-x-reverse">
            {/* Quick Lookup Button */}
            <Button
              variant="outline"
              size="sm"
              onClick={onOpenQuickLookup}
              className="hidden md:flex h-10 rounded-full px-4 border-slate-200 hover:border-blue-200 hover:bg-blue-50/50 text-slate-600"
            >
              <Search size={16} className={`mr-2 rtl:ml-2 rtl:mr-0 text-slate-400`} />
              {t.quick_lookup}
              <span className="ml-4 rtl:mr-4 text-xs text-slate-300">CTRL+K</span>
            </Button>
            <button onClick={onOpenQuickLookup} className="md:hidden p-2 text-slate-500"><Search size={22} /></button>

            <button
              onClick={onOpenNotifications}
              className="relative p-2.5 text-slate-500 hover:text-blue-600 hover:bg-blue-50 rounded-full transition-all focus:outline-none active:scale-95"
              title={t.notifications}
            >
              <Bell size={22} />
              {notificationCount > 0 && (
                <span className="absolute top-2 right-2 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-white shadow-sm ring-2 ring-red-100"></span>
              )}
            </button>

            <button
              onClick={() => setLanguage(language === 'en' ? 'ar' : 'en')}
              className="w-10 h-10 flex items-center justify-center text-slate-600 hover:text-white hover:bg-slate-900 rounded-full transition-all font-bold text-xs border border-slate-200 hover:border-slate-900"
              title="Switch Language"
            >
              {language === 'en' ? 'AR' : 'EN'}
            </button>

            <div className="h-8 w-px bg-slate-200 mx-2"></div>

            <Button
              onClick={toggleAI}
              className="hidden md:flex bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-700 hover:to-violet-700 text-white rounded-full shadow-lg shadow-indigo-500/30 border-0"
            >
              <Sparkles size={16} className="mr-2 rtl:ml-2 rtl:mr-0" />
              <span className="text-sm font-medium">{t.ask_ai}</span>
            </Button>
            <button
              onClick={toggleAI}
              className="md:hidden flex items-center justify-center w-10 h-10 bg-indigo-600 text-white rounded-full shadow-md active:scale-95"
            >
              <Sparkles size={18} />
            </button>
          </div>
        </header>

        {/* Scrollable Content Area */}
        <main className="flex-1 overflow-y-auto overflow-x-hidden p-6 md:p-8">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentModule}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
              className="max-w-7xl mx-auto"
            >
              {children}
            </motion.div>
          </AnimatePresence>
        </main>
      </div>
    </div>
  );
};