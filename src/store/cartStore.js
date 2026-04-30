/**
 * Cart Store (Zustand)
 * Cart state with localStorage persistence + DB sync
 */

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { cartAPI } from '../services/api';
import toast from 'react-hot-toast';

const useCartStore = create(
  persist(
    (set, get) => ({
      items: [],       // { productId, product, quantity, variant, cartItemId }
      dbSynced: false, // Whether local cart is synced with DB
      isLoading: false,

      // Computed
      get itemCount() {
        return get().items.reduce((acc, item) => acc + item.quantity, 0);
      },
      get subtotal() {
        return get().items.reduce((acc, item) => {
          const price = item.variant?.price || item.product?.effectivePrice || item.product?.price || 0;
          return acc + price * item.quantity;
        }, 0);
      },

      addItem: async (product, quantity = 1, variant = null, isLoggedIn = false) => {
        const items = get().items;
        const existingIdx = items.findIndex(
          (i) => i.productId === product._id && (!variant || i.variant?.variantId === variant?.variantId)
        );

        if (existingIdx > -1) {
          const newItems = [...items];
          newItems[existingIdx].quantity = Math.min(newItems[existingIdx].quantity + quantity, 20);
          set({ items: newItems });
        } else {
          set({ items: [...items, { productId: product._id, product, quantity, variant, cartItemId: null }] });
        }

        toast.success(`${product.name} added to cart!`, { icon: '🛒' });

        // Sync to DB if logged in
        if (isLoggedIn) {
          try {
            const { data } = await cartAPI.add(product._id, quantity, variant?.variantId);
            // Update cartItemId from DB response
            const dbItem = data.cart.items.find((i) => i.product._id === product._id);
            if (dbItem) {
              set((state) => ({
                items: state.items.map((i) =>
                  i.productId === product._id ? { ...i, cartItemId: dbItem._id } : i
                ),
                dbSynced: true,
              }));
            }
          } catch (e) {
            console.warn('Cart sync failed:', e);
          }
        }
      },

      updateQuantity: async (productId, quantity, cartItemId = null, isLoggedIn = false) => {
        if (quantity <= 0) return get().removeItem(productId, cartItemId, isLoggedIn);

        set((state) => ({
          items: state.items.map((i) =>
            i.productId === productId ? { ...i, quantity: Math.min(quantity, 20) } : i
          ),
        }));

        if (isLoggedIn && cartItemId) {
          try { await cartAPI.update(cartItemId, quantity); } catch (e) { console.warn(e); }
        }
      },

      removeItem: async (productId, cartItemId = null, isLoggedIn = false) => {
        set((state) => ({ items: state.items.filter((i) => i.productId !== productId) }));

        if (isLoggedIn && cartItemId) {
          try { await cartAPI.remove(cartItemId); } catch (e) { console.warn(e); }
        }
      },

      clearCart: async (isLoggedIn = false) => {
        set({ items: [] });
        if (isLoggedIn) {
          try { await cartAPI.clear(); } catch (e) { console.warn(e); }
        }
      },

      // Sync local cart to DB after login
      syncToDatabase: async () => {
        const { items } = get();
        if (!items.length) return;

        try {
          const localItems = items.map((i) => ({
            productId: i.productId,
            quantity: i.quantity,
            variant: i.variant,
          }));
          const { data } = await cartAPI.sync(localItems);
          
          // Replace local items with DB items (populated)
          const syncedItems = data.cart.items.map((dbItem) => ({
            productId: dbItem.product._id,
            product: dbItem.product,
            quantity: dbItem.quantity,
            variant: dbItem.variant,
            cartItemId: dbItem._id,
          }));
          set({ items: syncedItems, dbSynced: true });
        } catch (e) {
          console.warn('Cart sync failed:', e);
        }
      },

      // Load cart from DB
      loadFromDatabase: async () => {
        try {
          const { data } = await cartAPI.get();
          if (data.cart?.items) {
            const dbItems = data.cart.items.map((dbItem) => ({
              productId: dbItem.product._id,
              product: dbItem.product,
              quantity: dbItem.quantity,
              variant: dbItem.variant,
              cartItemId: dbItem._id,
            }));
            set({ items: dbItems, dbSynced: true });
          }
        } catch (e) { console.warn(e); }
      },
    }),
    {
      name: 'cart-store',
      partialize: (state) => ({ items: state.items }),
    }
  )
);

export default useCartStore;
