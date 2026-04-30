/**
 * Custom hooks for data fetching
 */

import { useState, useEffect, useCallback } from 'react';
import { productAPI, categoryAPI, orderAPI, adminAPI } from '../services/api';

// ─── Products Hook ────────────────────────────────────────────────────────────
export const useProducts = (params = {}) => {
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [meta, setMeta] = useState({ total: 0, page: 1, pages: 1 });

  const fetchProducts = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const { data } = await productAPI.getAll(params);
      setProducts(data.products);
      setMeta({ total: data.total, page: data.page, pages: data.pages });
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load products');
    } finally {
      setIsLoading(false);
    }
  }, [JSON.stringify(params)]);

  useEffect(() => { fetchProducts(); }, [fetchProducts]);

  return { products, isLoading, error, meta, refetch: fetchProducts };
};

// ─── Single Product Hook ───────────────────────────────────────────────────────
export const useProduct = (slug) => {
  const [product, setProduct] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!slug) return;
    setIsLoading(true);
    productAPI.getBySlug(slug)
      .then(({ data }) => setProduct(data.product))
      .catch((err) => setError(err.response?.data?.message || 'Product not found'))
      .finally(() => setIsLoading(false));
  }, [slug]);

  return { product, isLoading, error };
};

// ─── Categories Hook ──────────────────────────────────────────────────────────
export const useCategories = () => {
  const [categories, setCategories] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    categoryAPI.getAll()
      .then(({ data }) => setCategories(data.categories))
      .catch(console.warn)
      .finally(() => setIsLoading(false));
  }, []);

  return { categories, isLoading };
};

// ─── Orders Hook ──────────────────────────────────────────────────────────────
export const useOrders = (params = {}) => {
  const [orders, setOrders] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [meta, setMeta] = useState({ total: 0, page: 1, pages: 1 });

  const fetchOrders = useCallback(async () => {
    setIsLoading(true);
    try {
      const { data } = await orderAPI.getMyOrders(params);
      setOrders(data.orders);
      setMeta({ total: data.total, page: data.page, pages: data.pages });
    } catch (err) {
      console.warn(err);
    } finally {
      setIsLoading(false);
    }
  }, [JSON.stringify(params)]);

  useEffect(() => { fetchOrders(); }, [fetchOrders]);

  return { orders, isLoading, meta, refetch: fetchOrders };
};

// ─── Single Order Hook ─────────────────────────────────────────────────────────
export const useOrder = (id) => {
  const [order, setOrder] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchOrder = useCallback(async () => {
    if (!id) return;
    setIsLoading(true);
    try {
      const { data } = await orderAPI.getById(id);
      setOrder(data.order);
    } catch (err) {
      setError(err.response?.data?.message || 'Order not found');
    } finally {
      setIsLoading(false);
    }
  }, [id]);

  useEffect(() => { fetchOrder(); }, [fetchOrder]);

  return { order, setOrder, isLoading, error, refetch: fetchOrder };
};

// ─── Admin Dashboard Hook ──────────────────────────────────────────────────────
export const useDashboard = () => {
  const [dashboard, setDashboard] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    adminAPI.getDashboard()
      .then(({ data }) => setDashboard(data.dashboard))
      .catch(console.warn)
      .finally(() => setIsLoading(false));
  }, []);

  return { dashboard, isLoading };
};

// ─── Admin Orders Hook ─────────────────────────────────────────────────────────
export const useAdminOrders = (params = {}) => {
  const [orders, setOrders] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [meta, setMeta] = useState({ total: 0, page: 1, pages: 1 });

  const fetchOrders = useCallback(async () => {
    setIsLoading(true);
    try {
      const { data } = await adminAPI.getOrders(params);
      setOrders(data.orders);
      setMeta({ total: data.total, page: data.page, pages: data.pages });
    } catch (err) { console.warn(err); }
    finally { setIsLoading(false); }
  }, [JSON.stringify(params)]);

  useEffect(() => { fetchOrders(); }, [fetchOrders]);
  return { orders, isLoading, meta, refetch: fetchOrders };
};
