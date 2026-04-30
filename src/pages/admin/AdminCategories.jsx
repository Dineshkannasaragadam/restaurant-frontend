// AdminCategories.jsx
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Edit3, Trash2, X } from 'lucide-react';
import toast from 'react-hot-toast';
import { useCategories } from '../../hooks/useProducts';
import { categoryAPI } from '../../services/api';

function CategoryModal({ cat, onClose, onSaved }) {
  const isEdit = !!cat;
  const [form, setForm] = useState({ name: cat?.name || '', description: cat?.description || '', type: cat?.type || 'mixed', icon: cat?.icon || '', sortOrder: cat?.sortOrder || 0 });
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(cat?.image?.url || null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const fd = new FormData();
      Object.entries(form).forEach(([k, v]) => fd.append(k, v));
      if (image) fd.append('image', image);
      if (isEdit) { await categoryAPI.update(cat._id, fd); toast.success('Category updated!'); }
      else { await categoryAPI.create(fd); toast.success('Category created!'); }
      onSaved(); onClose();
    } catch (err) { toast.error(err.response?.data?.message || 'Failed'); }
    finally { setLoading(false); }
  };

  return (
    <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
      <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }}
        className="bg-white rounded-2xl w-full max-w-md">
        <div className="flex justify-between items-center px-6 py-4 border-b border-gray-100">
          <h2 className="font-bold text-gray-900">{isEdit ? 'Edit Category' : 'Add Category'}</h2>
          <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-gray-100"><X size={18} /></button>
        </div>
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {/* Image */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Image</label>
            {preview && <img src={preview} alt="" className="w-full h-32 object-cover rounded-xl mb-2" />}
            <input type="file" accept="image/*" onChange={(e) => { setImage(e.target.files[0]); setPreview(URL.createObjectURL(e.target.files[0])); }}
              className="block w-full text-sm text-gray-500 file:mr-3 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:bg-brand-50 file:text-brand-700 file:text-sm file:font-medium" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Name *</label>
            <input className="input-field" value={form.name} onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))} placeholder="Main Course" required />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Description</label>
            <textarea rows={2} className="input-field resize-none" value={form.description} onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))} />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Type</label>
              <select className="input-field" value={form.type} onChange={(e) => setForm((f) => ({ ...f, type: e.target.value }))}>
                {['veg', 'non-veg', 'vegan', 'drinks', 'desserts', 'mixed'].map((t) => <option key={t} value={t}>{t}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Icon (emoji)</label>
              <input className="input-field" value={form.icon} onChange={(e) => setForm((f) => ({ ...f, icon: e.target.value }))} placeholder="🍛" />
            </div>
          </div>
          <div className="flex gap-3">
            <button type="button" onClick={onClose} className="btn-secondary flex-1">Cancel</button>
            <button type="submit" disabled={loading} className="btn-primary flex-1 flex items-center justify-center gap-2">
              {loading && <span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />}
              {isEdit ? 'Update' : 'Create'}
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
}

export default function AdminCategories() {
  const { categories, isLoading, refetch } = (() => {
    const [cats, setCats] = React.useState([]);
    const [loading, setLoading] = React.useState(true);
    const fetch = () => { setLoading(true); categoryAPI.getAll({ active: 'false' }).then(({ data }) => setCats(data.categories)).finally(() => setLoading(false)); };
    React.useEffect(() => { fetch(); }, []);
    return { categories: cats, isLoading: loading, refetch: fetch };
  })();
  const [modal, setModal] = useState(null);

  const handleDelete = async (id, name) => {
    if (!window.confirm(`Delete category "${name}"?`)) return;
    try { await categoryAPI.delete(id); toast.success('Deleted'); refetch(); }
    catch (err) { toast.error(err.response?.data?.message || 'Delete failed'); }
  };

  return (
    <div className="space-y-5">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-bold text-gray-900">Categories ({categories.length})</h2>
        <button onClick={() => setModal('create')} className="btn-primary flex items-center gap-2"><Plus size={18} /> Add Category</button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {isLoading ? Array(8).fill(0).map((_, i) => <div key={i} className="loading-skeleton h-40 rounded-2xl" />)
          : categories.map((cat) => (
            <div key={cat._id} className="bg-white rounded-2xl border border-gray-100 shadow-card overflow-hidden">
              {cat.image?.url
                ? <img src={cat.image.url} alt={cat.name} className="w-full h-28 object-cover" />
                : <div className="w-full h-28 bg-brand-50 flex items-center justify-center text-5xl">{cat.icon || '🍴'}</div>
              }
              <div className="p-4">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-semibold text-gray-900">{cat.name}</h3>
                    <p className="text-xs text-gray-500">{cat.productCount || 0} products · {cat.type}</p>
                  </div>
                  <div className="flex gap-1">
                    <button onClick={() => setModal(cat)} className="p-1.5 rounded-lg hover:bg-blue-50 text-gray-400 hover:text-blue-600 transition-colors"><Edit3 size={14} /></button>
                    <button onClick={() => handleDelete(cat._id, cat.name)} className="p-1.5 rounded-lg hover:bg-red-50 text-gray-400 hover:text-red-600 transition-colors"><Trash2 size={14} /></button>
                  </div>
                </div>
              </div>
            </div>
          ))}
      </div>

      <AnimatePresence>
        {modal && <CategoryModal cat={modal === 'create' ? null : modal} onClose={() => setModal(null)} onSaved={refetch} />}
      </AnimatePresence>
    </div>
  );
}
