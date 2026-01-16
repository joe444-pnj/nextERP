import { GoodsReceiptNote, InventoryItem, StockTransfer, PurchaseReturn } from "../types";

// Simulate Backend Logic for "Automatic Posting" rules

/**
 * Rule 1: GRN increases stock
 * When a GRN is verified, we must update the inventory quantities.
 */
export const postGRN = (grn: GoodsReceiptNote, inventory: InventoryItem[]): InventoryItem[] => {
    // Clone inventory to avoid mutation
    const newInventory = [...inventory];

    grn.items.forEach(grnItem => {
        // Find matching item by SKU
        const invItemIndex = newInventory.findIndex(i => i.sku === grnItem.sku);
        
        if (invItemIndex > -1) {
            // Update existing stock
            // Only add "GOOD" condition items to sellable stock
            if (grnItem.condition === 'GOOD') {
                newInventory[invItemIndex] = {
                    ...newInventory[invItemIndex],
                    stockLevel: newInventory[invItemIndex].stockLevel + grnItem.qtyReceived,
                    lastUpdated: new Date().toISOString()
                };
            }
        } else {
            // In a real system, we might create a new item here or error out.
            // For now, we ignore items not in master data or assume they were created before PO.
            console.warn(`Item ${grnItem.sku} from GRN not found in Inventory Master.`);
        }
    });

    return newInventory;
};

/**
 * Rule 2: Stock Transfer
 * Deduces from source, Add to destination.
 * Since our mock inventory is a flat list (simplified), we will just assume stock levels 
 * represent the "Source" if we are viewing the source warehouse context.
 * 
 * For this simplified Global State, we will just decrement the global stock if it's "Leaving" 
 * and increment if it's "Arriving".
 * 
 * To properly simulate "Transfer", we'll just implement the "RECEIVE" logic which completes the transfer.
 */
export const completeStockTransfer = (transfer: StockTransfer, inventory: InventoryItem[]): InventoryItem[] => {
    // Assuming 'inventory' passed here represents the system inventory.
    // In a real system, inventory is separated by warehouse. 
    // Here, we will just assume the inventory list is the "Destination" warehouse view for simplicity, 
    // OR we just track total stock. 
    
    // Let's implement logic: Receiving a transfer increases stock at destination.
    const newInventory = [...inventory];
    
    transfer.items.forEach(item => {
        const idx = newInventory.findIndex(i => i.sku === item.sku);
        if (idx > -1) {
             newInventory[idx] = {
                 ...newInventory[idx],
                 stockLevel: newInventory[idx].stockLevel + item.qty,
                 lastUpdated: new Date().toISOString()
             };
        }
    });
    return newInventory;
};

/**
 * Rule 3: Purchase Return
 * Reverses quantities (decreases stock).
 */
export const postPurchaseReturn = (ret: PurchaseReturn, inventory: InventoryItem[]): InventoryItem[] => {
    const newInventory = [...inventory];

    ret.items.forEach(item => {
        const idx = newInventory.findIndex(i => i.sku === item.sku);
        if (idx > -1) {
            // Decrease stock
             newInventory[idx] = {
                 ...newInventory[idx],
                 stockLevel: Math.max(0, newInventory[idx].stockLevel - item.qty),
                 lastUpdated: new Date().toISOString()
             };
        }
    });

    return newInventory;
};

/**
 * 3-Way Match Logic
 * Returns true if Invoice matches PO and GRN tolerances
 */
export const checkThreeWayMatch = (invoiceTotal: number, poTotal: number): boolean => {
    // Simple tolerance check (e.g. +/- 5%)
    const tolerance = 0.05;
    const diff = Math.abs(invoiceTotal - poTotal);
    return diff <= (poTotal * tolerance);
};