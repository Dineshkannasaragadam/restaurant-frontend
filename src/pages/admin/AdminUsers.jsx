// AdminUsers.jsx
import React, { useState } from 'react';
import { Search, UserCheck, UserX } from 'lucide-react';
import { format } from 'date-fns';
import toast from 'react-hot-toast';
import { adminAPI } from '../../services/api';

export default function AdminUsers() {
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [users, setUsers] = React.useState([]);
  const [total, setTotal] = React.useState(0);
  const [pages, setPages] = React.useState(1);
  const [isLoading, setIsLoading] = React.useState(true);

  const fetch = React.useCallback(() => {
    setIsLoading(true);
    adminAPI.getUsers({ search, page, limit: 20 })
      .then(({ data }) => { setUsers(data.users); setTotal(data.total); setPages(data.pages); })
      .finally(() => setIsLoading(false));
  }, [search, page]);

  React.useEffect(() => { fetch(); }, [fetch]);

  const toggleStatus = async (user) => {
    try {
      await adminAPI.toggleUserStatus(user._id);
      toast.success(`User ${user.isActive ? 'deactivated' : 'activated'}`);
      fetch();
    } catch { toast.error('Failed to update'); }
  };

  return (
    <div className="space-y-5">
      <div className="flex justify-between items-center">
        <div><h2 className="text-xl font-bold text-gray-900">Users</h2><p className="text-sm text-gray-500">{total} registered users</p></div>
      </div>

      <div className="bg-white rounded-2xl p-4 border border-gray-100">
        <div className="relative max-w-sm">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input className="input-field pl-9 !py-2 text-sm" placeholder="Search users..." value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(1); }} />
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 shadow-card overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-100">
              {['User', 'Email', 'Phone', 'Joined', 'Status', 'Action'].map((h) => (
                <th key={h} className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {isLoading ? Array(10).fill(0).map((_, i) => (
              <tr key={i}>{Array(6).fill(0).map((_, j) => <td key={j} className="px-4 py-3"><div className="loading-skeleton h-4 rounded w-24" /></td>)}</tr>
            )) : users.map((user) => (
              <tr key={user._id} className="hover:bg-gray-50/50">
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 bg-brand-100 rounded-lg flex items-center justify-center flex-shrink-0">
                      <span className="text-brand-700 font-bold text-sm">{user.name?.charAt(0)}</span>
                    </div>
                    <span className="font-medium text-gray-900 text-xs">{user.name}</span>
                  </div>
                </td>
                <td className="px-4 py-3 text-xs text-gray-600">{user.email}</td>
                <td className="px-4 py-3 text-xs text-gray-500">{user.phone || '—'}</td>
                <td className="px-4 py-3 text-xs text-gray-500">{format(new Date(user.createdAt), 'MMM d, yyyy')}</td>
                <td className="px-4 py-3">
                  <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${user.isActive ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                    {user.isActive ? 'Active' : 'Inactive'}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <button onClick={() => toggleStatus(user)}
                    className={`p-1.5 rounded-lg transition-colors ${user.isActive ? 'hover:bg-red-50 text-gray-400 hover:text-red-600' : 'hover:bg-green-50 text-gray-400 hover:text-green-600'}`}>
                    {user.isActive ? <UserX size={15} /> : <UserCheck size={15} />}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {pages > 1 && (
          <div className="flex justify-center gap-2 p-4 border-t border-gray-100">
            {Array.from({ length: pages }, (_, i) => i + 1).map((p) => (
              <button key={p} onClick={() => setPage(p)}
                className={`w-8 h-8 rounded-lg text-xs font-medium ${page === p ? 'bg-brand-600 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}>{p}</button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
