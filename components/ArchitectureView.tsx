import React from 'react';
import { Database, Server, FileText, ArrowRight, Share2, ClipboardCheck, DollarSign, Layers, Globe, Workflow } from 'lucide-react';

export const ArchitectureView: React.FC = () => {
  return (
    <div className="space-y-8 max-w-6xl mx-auto pb-12">
      <div className="bg-white rounded-xl p-8 border border-slate-200 shadow-sm">
        <div className="flex items-center space-x-3 mb-6">
           <div className="p-3 bg-indigo-100 rounded-lg text-indigo-700">
              <Server size={32} />
           </div>
           <div>
              <h1 className="text-3xl font-bold text-slate-800">NextERP System Specification</h1>
              <p className="text-slate-500">Procurement, Warehouse & Financial Workflow Design</p>
           </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
           <div className="p-4 bg-slate-50 rounded-lg border border-slate-200">
              <h3 className="font-bold text-slate-700 mb-2 flex items-center"><Layers className="w-4 h-4 mr-2" /> Modules</h3>
              <p className="text-sm text-slate-600">Inventory, Procurement, Finance, Warehouse, Sales</p>
           </div>
           <div className="p-4 bg-slate-50 rounded-lg border border-slate-200">
              <h3 className="font-bold text-slate-700 mb-2 flex items-center"><Database className="w-4 h-4 mr-2" /> Database</h3>
              <p className="text-sm text-slate-600">PostgreSQL (Relational Schema with JSONB support)</p>
           </div>
           <div className="p-4 bg-slate-50 rounded-lg border border-slate-200">
              <h3 className="font-bold text-slate-700 mb-2 flex items-center"><Globe className="w-4 h-4 mr-2" /> API</h3>
              <p className="text-sm text-slate-600">RESTful Endpoints with Role-Based Access Control (RBAC)</p>
           </div>
        </div>
      </div>

      {/* --- WORKFLOWS --- */}
      <div className="bg-white rounded-xl p-8 border border-slate-200 shadow-sm">
        <h2 className="text-xl font-bold text-slate-800 mb-6 flex items-center">
          <Workflow className="w-6 h-6 mr-2 text-indigo-600" /> Procurement Cycle & Status Flow
        </h2>
        
        <div className="space-y-8">
           {/* Flow 1: Purchase to Pay */}
           <div className="relative">
              <h3 className="font-bold text-sm text-slate-500 uppercase tracking-wider mb-4">1. Purchase to Pay (P2P) Flow</h3>
              <div className="flex flex-col md:flex-row items-start md:items-center justify-between bg-slate-50 p-6 rounded-xl border border-slate-200 gap-4">
                  
                  <div className="flex-1 text-center bg-white p-4 rounded shadow-sm w-full md:w-auto">
                      <div className="font-bold text-indigo-600 mb-1">Purchase Request</div>
                      <div className="text-xs text-slate-400">Created by Staff</div>
                      <div className="mt-2 text-xs font-mono bg-slate-100 p-1 rounded">DRAFT → PENDING → APPROVED</div>
                  </div>

                  <ArrowRight className="text-slate-300 hidden md:block" />
                  
                  <div className="flex-1 text-center bg-white p-4 rounded shadow-sm w-full md:w-auto">
                      <div className="font-bold text-indigo-600 mb-1">Purchase Order</div>
                      <div className="text-xs text-slate-400">Sent to Supplier</div>
                      <div className="mt-2 text-xs font-mono bg-slate-100 p-1 rounded">DRAFT → SENT → PARTIAL → CLOSED</div>
                  </div>

                  <ArrowRight className="text-slate-300 hidden md:block" />

                  <div className="flex-1 text-center bg-white p-4 rounded shadow-sm w-full md:w-auto">
                      <div className="font-bold text-green-600 mb-1">GRN</div>
                      <div className="text-xs text-slate-400">Goods Receipt</div>
                      <div className="mt-2 text-xs font-mono bg-slate-100 p-1 rounded">DRAFT → VERIFIED</div>
                      <div className="mt-1 text-[10px] text-green-600 font-bold">+ Increases Stock</div>
                  </div>

                  <ArrowRight className="text-slate-300 hidden md:block" />

                  <div className="flex-1 text-center bg-white p-4 rounded shadow-sm w-full md:w-auto">
                      <div className="font-bold text-purple-600 mb-1">Supplier Invoice</div>
                      <div className="text-xs text-slate-400">3-Way Match</div>
                      <div className="mt-2 text-xs font-mono bg-slate-100 p-1 rounded">DRAFT → POSTED → PAID</div>
                      <div className="mt-1 text-[10px] text-purple-600 font-bold">+ Creates Liability</div>
                  </div>
              </div>
           </div>

           {/* Flow 2: Warehouse Ops */}
           <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                  <h3 className="font-bold text-sm text-slate-500 uppercase tracking-wider mb-4">2. Stock Transfer Logic</h3>
                  <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
                     <div className="flex items-center space-x-2 text-sm mb-2">
                        <span className="font-bold text-slate-700">Source Warehouse</span>
                        <ArrowRight size={14} className="text-slate-400"/>
                        <span className="font-bold text-orange-600">In Transit</span>
                        <ArrowRight size={14} className="text-slate-400"/>
                        <span className="font-bold text-slate-700">Dest Warehouse</span>
                     </div>
                     <p className="text-xs text-slate-500">
                        Audit trail created for all movements. Stock is deducted from Source immediately but only added to Dest upon Receipt.
                     </p>
                  </div>
              </div>
              <div>
                  <h3 className="font-bold text-sm text-slate-500 uppercase tracking-wider mb-4">3. Purchase Return</h3>
                  <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
                     <div className="flex items-center space-x-2 text-sm mb-2">
                        <span className="font-bold text-red-600">Return Request</span>
                        <ArrowRight size={14} className="text-slate-400"/>
                        <span className="font-bold text-slate-700">Approval</span>
                        <ArrowRight size={14} className="text-slate-400"/>
                        <span className="font-bold text-slate-700">Shipment</span>
                     </div>
                     <p className="text-xs text-slate-500">
                        Automatically creates a Debit Note in Accounts Payable and reduces Inventory Qty.
                     </p>
                  </div>
              </div>
           </div>
        </div>
      </div>

      {/* --- SCHEMA --- */}
      <div className="bg-white rounded-xl p-8 border border-slate-200 shadow-sm">
        <h2 className="text-xl font-bold text-slate-800 mb-6 flex items-center">
          <Database className="w-6 h-6 mr-2 text-indigo-600" /> Database Schema (New Core Tables)
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Purchase Order Table */}
            <div className="border border-slate-200 rounded-lg overflow-hidden">
                <div className="bg-slate-100 px-4 py-2 border-b border-slate-200 font-mono text-sm font-bold text-slate-700 flex justify-between">
                    <span>purchase_orders</span>
                    <span className="text-xs text-slate-500 self-center">PO Header</span>
                </div>
                <div className="p-4 bg-white font-mono text-xs text-slate-600 space-y-1">
                    <div className="flex justify-between"><span>id</span> <span className="text-indigo-500">UUID (PK)</span></div>
                    <div className="flex justify-between"><span>supplier_id</span> <span className="text-orange-500">UUID (FK)</span></div>
                    <div className="flex justify-between"><span>pr_id</span> <span className="text-orange-500">UUID (FK, Nullable)</span></div>
                    <div className="flex justify-between"><span>status</span> <span className="text-green-600">ENUM</span></div>
                    <div className="flex justify-between"><span>currency_code</span> <span className="text-slate-400">VARCHAR(3)</span></div>
                    <div className="flex justify-between"><span>total_amount</span> <span className="text-slate-400">DECIMAL(10,2)</span></div>
                    <div className="flex justify-between"><span>created_at</span> <span className="text-slate-400">TIMESTAMP</span></div>
                </div>
            </div>

            {/* GRN Table */}
            <div className="border border-slate-200 rounded-lg overflow-hidden">
                <div className="bg-slate-100 px-4 py-2 border-b border-slate-200 font-mono text-sm font-bold text-slate-700 flex justify-between">
                    <span>goods_receipt_notes</span>
                    <span className="text-xs text-slate-500 self-center">Inventory In</span>
                </div>
                <div className="p-4 bg-white font-mono text-xs text-slate-600 space-y-1">
                    <div className="flex justify-between"><span>id</span> <span className="text-indigo-500">UUID (PK)</span></div>
                    <div className="flex justify-between"><span>po_id</span> <span className="text-orange-500">UUID (FK)</span></div>
                    <div className="flex justify-between"><span>warehouse_id</span> <span className="text-orange-500">UUID (FK)</span></div>
                    <div className="flex justify-between"><span>received_date</span> <span className="text-slate-400">DATE</span></div>
                    <div className="flex justify-between"><span>status</span> <span className="text-green-600">ENUM (DRAFT, VERIFIED)</span></div>
                    <div className="border-t border-slate-100 pt-1 mt-1 font-bold text-slate-400">// Items stored in separate table</div>
                </div>
            </div>

            {/* Supplier Invoice Table */}
            <div className="border border-slate-200 rounded-lg overflow-hidden">
                <div className="bg-slate-100 px-4 py-2 border-b border-slate-200 font-mono text-sm font-bold text-slate-700 flex justify-between">
                    <span>supplier_invoices</span>
                    <span className="text-xs text-slate-500 self-center">Accounts Payable</span>
                </div>
                <div className="p-4 bg-white font-mono text-xs text-slate-600 space-y-1">
                    <div className="flex justify-between"><span>id</span> <span className="text-indigo-500">UUID (PK)</span></div>
                    <div className="flex justify-between"><span>po_id</span> <span className="text-orange-500">UUID (FK)</span></div>
                    <div className="flex justify-between"><span>invoice_ref</span> <span className="text-slate-400">VARCHAR</span></div>
                    <div className="flex justify-between"><span>due_date</span> <span className="text-slate-400">DATE</span></div>
                    <div className="flex justify-between"><span>status</span> <span className="text-green-600">ENUM (POSTED, PAID)</span></div>
                    <div className="flex justify-between"><span>payment_status</span> <span className="text-slate-400">ENUM</span></div>
                </div>
            </div>

            {/* Stock Transfer Table */}
            <div className="border border-slate-200 rounded-lg overflow-hidden">
                <div className="bg-slate-100 px-4 py-2 border-b border-slate-200 font-mono text-sm font-bold text-slate-700 flex justify-between">
                    <span>stock_transfers</span>
                    <span className="text-xs text-slate-500 self-center">Internal Mov.</span>
                </div>
                <div className="p-4 bg-white font-mono text-xs text-slate-600 space-y-1">
                    <div className="flex justify-between"><span>id</span> <span className="text-indigo-500">UUID (PK)</span></div>
                    <div className="flex justify-between"><span>source_wh_id</span> <span className="text-orange-500">UUID (FK)</span></div>
                    <div className="flex justify-between"><span>dest_wh_id</span> <span className="text-orange-500">UUID (FK)</span></div>
                    <div className="flex justify-between"><span>status</span> <span className="text-green-600">ENUM</span></div>
                    <div className="flex justify-between"><span>sent_at</span> <span className="text-slate-400">TIMESTAMP</span></div>
                    <div className="flex justify-between"><span>received_at</span> <span className="text-slate-400">TIMESTAMP</span></div>
                </div>
            </div>
        </div>
      </div>

      {/* --- POSTING RULES --- */}
      <div className="bg-white rounded-xl p-8 border border-slate-200 shadow-sm">
        <h2 className="text-xl font-bold text-slate-800 mb-6 flex items-center">
          <DollarSign className="w-6 h-6 mr-2 text-indigo-600" /> Automatic Posting Rules (GL Impact)
        </h2>
        <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
                <thead className="bg-slate-50 text-slate-700 font-bold uppercase text-xs">
                    <tr>
                        <th className="px-4 py-3">Transaction</th>
                        <th className="px-4 py-3">Debit (DR)</th>
                        <th className="px-4 py-3">Credit (CR)</th>
                        <th className="px-4 py-3">Trigger Status</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                    <tr>
                        <td className="px-4 py-3 font-medium">Goods Receipt (GRN)</td>
                        <td className="px-4 py-3 text-blue-600">Inventory Asset</td>
                        <td className="px-4 py-3 text-red-600">GRN Suspense (Liability)</td>
                        <td className="px-4 py-3"><span className="bg-green-100 text-green-800 px-2 py-1 rounded text-xs font-bold">VERIFIED</span></td>
                    </tr>
                    <tr>
                        <td className="px-4 py-3 font-medium">Supplier Invoice</td>
                        <td className="px-4 py-3 text-blue-600">GRN Suspense</td>
                        <td className="px-4 py-3 text-red-600">Accounts Payable</td>
                        <td className="px-4 py-3"><span className="bg-indigo-100 text-indigo-800 px-2 py-1 rounded text-xs font-bold">POSTED</span></td>
                    </tr>
                    <tr>
                        <td className="px-4 py-3 font-medium">Purchase Return</td>
                        <td className="px-4 py-3 text-blue-600">Accounts Payable (Debit Note)</td>
                        <td className="px-4 py-3 text-red-600">Inventory Asset</td>
                        <td className="px-4 py-3"><span className="bg-orange-100 text-orange-800 px-2 py-1 rounded text-xs font-bold">SHIPPED</span></td>
                    </tr>
                </tbody>
            </table>
        </div>
      </div>

       {/* --- API SPEC --- */}
       <div className="bg-white rounded-xl p-8 border border-slate-200 shadow-sm">
        <h2 className="text-xl font-bold text-slate-800 mb-6 flex items-center">
          <Share2 className="w-6 h-6 mr-2 text-indigo-600" /> REST API Endpoints
        </h2>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <div className="space-y-2">
                <div className="font-bold text-sm text-slate-500 uppercase">Procurement</div>
                <div className="flex items-center space-x-2 font-mono text-xs bg-slate-50 p-2 rounded border border-slate-200">
                   <span className="bg-green-100 text-green-700 px-1.5 rounded font-bold">POST</span>
                   <span>/api/v1/purchase-requests</span>
                </div>
                <div className="flex items-center space-x-2 font-mono text-xs bg-slate-50 p-2 rounded border border-slate-200">
                   <span className="bg-blue-100 text-blue-700 px-1.5 rounded font-bold">PUT</span>
                   <span>/api/v1/purchase-orders/:id/status</span>
                </div>
            </div>
            <div className="space-y-2">
                <div className="font-bold text-sm text-slate-500 uppercase">Warehouse</div>
                <div className="flex items-center space-x-2 font-mono text-xs bg-slate-50 p-2 rounded border border-slate-200">
                   <span className="bg-green-100 text-green-700 px-1.5 rounded font-bold">POST</span>
                   <span>/api/v1/grn/verify</span>
                </div>
                <div className="flex items-center space-x-2 font-mono text-xs bg-slate-50 p-2 rounded border border-slate-200">
                   <span className="bg-purple-100 text-purple-700 px-1.5 rounded font-bold">GET</span>
                   <span>/api/v1/stock-transfers/audit-log</span>
                </div>
            </div>
        </div>
      </div>

    </div>
  );
};