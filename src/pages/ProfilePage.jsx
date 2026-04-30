// ProfilePage.jsx
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { User, Mail, Phone, Lock, Save } from 'lucide-react';
import { Helmet } from 'react-helmet-async';
import toast from 'react-hot-toast';
import useAuthStore from '../store/authStore';
import { authAPI } from '../services/api';

export default function ProfilePage() {
  const { user, updateUser } = useAuthStore();
  const [form, setForm] = useState({ name: user?.name || '', phone: user?.phone || '' });
  const [pwForm, setPwForm] = useState({ currentPassword: '', newPassword: '', confirm: '' });
  const [loading, setLoading] = useState(false);
  const [pwLoading, setPwLoading] = useState(false);

  const handleProfile = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { data } = await authAPI.updateProfile(form);
      updateUser(data.user);
      toast.success('Profile updated!');
    } catch (err) { toast.error(err.response?.data?.message || 'Update failed'); }
    finally { setLoading(false); }
  };

  const handlePassword = async (e) => {
    e.preventDefault();
    if (pwForm.newPassword !== pwForm.confirm) { toast.error('Passwords do not match'); return; }
    if (pwForm.newPassword.length < 8) { toast.error('Password must be at least 8 characters'); return; }
    setPwLoading(true);
    try {
      await authAPI.changePassword({ currentPassword: pwForm.currentPassword, newPassword: pwForm.newPassword });
      toast.success('Password changed successfully!');
      setPwForm({ currentPassword: '', newPassword: '', confirm: '' });
    } catch (err) { toast.error(err.response?.data?.message || 'Failed to change password'); }
    finally { setPwLoading(false); }
  };

  return (
    <>
      <Helmet><title>Profile — Athidhi</title></Helmet>
      <div className="pt-24 pb-16">
        <div className="page-container max-w-2xl">
          <h1 className="section-title mb-8">My Profile</h1>

          {/* Avatar */}
          <div className="card p-6 mb-6 flex items-center gap-4">
            <div className="w-16 h-16 bg-brand-600 rounded-2xl flex items-center justify-center shadow-brand">
              <span className="text-white font-bold text-2xl">{user?.name?.charAt(0)}</span>
            </div>
            <div>
              <h2 className="font-semibold text-gray-900">{user?.name}</h2>
              <p className="text-gray-500 text-sm">{user?.email}</p>
              <span className="text-xs bg-purple-100 text-purple-700 px-2 py-0.5 rounded-full capitalize">{user?.role}</span>
            </div>
          </div>

          {/* Edit Profile */}
          <div className="card p-6 mb-6">
            <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2"><User size={16} className="text-brand-600" /> Personal Information</h3>
            <form onSubmit={handleProfile} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Full Name</label>
                <input className="input-field" value={form.name} onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))} />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Email</label>
                <input className="input-field bg-gray-50" value={user?.email} disabled />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Phone</label>
                <input className="input-field" type="tel" placeholder="+91 98765 43210" value={form.phone} onChange={(e) => setForm((f) => ({ ...f, phone: e.target.value }))} />
              </div>
              <button type="submit" disabled={loading} className="btn-primary flex items-center gap-2">
                {loading ? <span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" /> : <Save size={16} />}
                Save Changes
              </button>
            </form>
          </div>

          {/* Change Password */}
          <div className="card p-6">
            <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2"><Lock size={16} className="text-brand-600" /> Change Password</h3>
            <form onSubmit={handlePassword} className="space-y-4">
              {[
                { label: 'Current Password', key: 'currentPassword', ph: '••••••••' },
                { label: 'New Password', key: 'newPassword', ph: 'Min 8 characters' },
                { label: 'Confirm New Password', key: 'confirm', ph: 'Re-enter new password' },
              ].map(({ label, key, ph }) => (
                <div key={key}>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">{label}</label>
                  <input type="password" className="input-field" placeholder={ph} value={pwForm[key]} onChange={(e) => setPwForm((f) => ({ ...f, [key]: e.target.value }))} />
                </div>
              ))}
              <button type="submit" disabled={pwLoading} className="btn-primary flex items-center gap-2">
                {pwLoading ? <span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" /> : <Lock size={16} />}
                Update Password
              </button>
            </form>
          </div>
        </div>
      </div>
    </>
  );
}
