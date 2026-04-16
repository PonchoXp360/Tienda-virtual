'use client';

import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import type { Product } from '@/lib/types';

export interface CartItem extends Product {
  quantity: number;
}

type CartStore = {
  items: CartItem[];
  addItem: (product: Product) => void;
  removeItem: (productId: string) => void;
  updateItemQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
};

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],
      addItem: (product) => {
        const currentItems = get().items;
        const existingItem = currentItems.find((item) => item.id === product.id);

        if (existingItem) {
          if (existingItem.quantity < product.stock) {
            set({
              items: currentItems.map((item) =>
                item.id === product.id
                  ? { ...item, quantity: item.quantity + 1 }
                  : item
              ),
            });
          }
        } else {
          if (1 <= product.stock) {
            set({ items: [...currentItems, { ...product, quantity: 1 }] });
          }
        }
      },
      removeItem: (productId) => {
        set({
          items: get().items.filter((item) => item.id !== productId),
        });
      },
      updateItemQuantity: (productId, quantity) => {
        const itemToUpdate = get().items.find((item) => item.id === productId);
        if (!itemToUpdate) return;
        
        const validQuantity = Math.max(0, Math.min(quantity, itemToUpdate.stock));

        if (validQuantity === 0) {
          get().removeItem(productId);
        } else {
          set({
            items: get().items.map((item) =>
              item.id === productId ? { ...item, quantity: validQuantity } : item
            ),
          });
        }
      },
      clearCart: () => set({ items: [] }),
    }),
    {
      name: 'omni-cart-storage',
      storage: createJSONStorage(() => localStorage),
    }
  )
);
