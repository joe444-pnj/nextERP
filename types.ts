export enum ModuleType {
  INVENTORY = 'INVENTORY',
  LABEL_PRINTING = 'LABEL_PRINTING',
  SALES = 'SALES',
  PROCUREMENT = 'PROCUREMENT',
  WAREHOUSE = 'WAREHOUSE',
  SETTINGS = 'SETTINGS',
  ARCHITECTURE = 'ARCHITECTURE'
}

export type Language = 'en' | 'ar';

export type DocumentStatus = 
  | 'DRAFT' | 'PENDING_APPROVAL' | 'APPROVED' | 'REJECTED' 
  | 'SENT' | 'PARTIAL' | 'COMPLETED' 
  | 'VERIFIED' | 'POSTED' | 'PAID' 
  | 'IN_TRANSIT' | 'RECEIVED' | 'SHIPPED';

export interface Warehouse {
  id: string;
  name: string;
  location: string;
}

export interface InventoryItem {
  id: string;
  sku: string;
  barcode: string;   // Normal barcode
  shelfTag: string;  // Shelf Tag ID
  name: string;
  company: string;   // Manufacturer/Company
  category: string;
  stockLevel: number;
  price: number;
  lastUpdated?: string; // To track stock date/edits
  image?: string;
  warehouseId?: string; // For multi-warehouse tracking (simplified to main location for now)
}

export interface Supplier {
  id: string;
  name: string;
  code: string;
  currency: string;
  paymentTerms: string; // e.g. "Net 30"
  contactEmail: string;
}

export interface PurchaseRequest {
  id: string;
  requesterId: string;
  date: string;
  status: DocumentStatus;
  items: { sku: string; name: string; qty: number; reason: string }[];
  approverId?: string;
}

export interface PurchaseOrder {
  id: string;
  prId?: string; // Linked Purchase Request
  supplierId: string;
  supplierName: string;
  date: string;
  status: DocumentStatus;
  items: { sku: string; name: string; qty: number; unitPrice: number; total: number }[];
  currency: string;
  totalAmount: number;
}

export interface GoodsReceiptNote {
  id: string;
  poId: string; // Linked PO
  date: string;
  warehouseId: string;
  status: DocumentStatus;
  items: { sku: string; name: string; qtyOrdered: number; qtyReceived: number; condition: 'GOOD' | 'DAMAGED' }[];
}

export interface SupplierInvoice {
  id: string;
  poId: string;
  grnIds: string[]; // Linked GRNs for 3-way match
  invoiceNumber: string; // Supplier's Reference
  supplierId: string;
  date: string;
  dueDate: string;
  status: DocumentStatus; // POSTED -> PAID
  subtotal: number;
  tax: number;
  total: number;
  matched: boolean; // 3-way match status
}

export interface StockTransfer {
  id: string;
  sourceWarehouseId: string;
  destWarehouseId: string;
  date: string;
  status: DocumentStatus; // DRAFT -> IN_TRANSIT -> RECEIVED
  items: { sku: string; name: string; qty: number }[];
}

export interface PurchaseReturn {
  id: string;
  grnId?: string;
  supplierId: string;
  date: string;
  reason: string;
  status: DocumentStatus;
  items: { sku: string; name: string; qty: number }[];
  refundStatus: 'PENDING' | 'CREDITED';
}

export interface CartItem extends InventoryItem {
  quantity: number;
}

export interface SaleRecord {
  id: string;
  time: string;
  items: number; // count of items
  total: number;
  method: 'CASH' | 'CARD';
}

export interface Notification {
  id: string;
  title: string;
  message: string;
  time: string;
  read: boolean;
}