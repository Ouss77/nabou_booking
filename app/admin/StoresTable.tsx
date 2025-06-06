"use client";
import React, { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabaseClient';
import Link from 'next/link';
import { Eye, Edit, Trash2, Loader2 } from 'lucide-react';

const StoresTable = () => {
  const [stores, setStores] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStores();
  }, []);
 
  const fetchStores = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('stores')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching stores:', error.message);
    } else {
      setStores(data);
    }
    setLoading(false);
  };

  const handleDelete = async (id:any) => {
    const confirmed = window.confirm('Are you sure you want to delete this store?');
    if (!confirmed) return;

    const { error } = await supabase.from('stores').delete().eq('id', id);
    if (error) {
      console.error('Delete failed:', error.message);
    } else {
      setStores((prev) => prev.filter((store) => store.id !== id));
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="w-8 h-8 text-amber-500 animate-spin" />
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6">
        <h2 className="text-2xl sm:text-3xl font-bold text-white mb-4 sm:mb-0">All Stores</h2>
        <Link
          href="/admin/stores/new"
          className="inline-flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-black bg-amber-500 hover:bg-amber-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-amber-500 transition-colors"
        >
          Add New Store
        </Link>
      </div>

      {/* Mobile View - Card Layout */}
      <div className="grid grid-cols-1 gap-4 sm:hidden">
        {stores.map((store) => (
          <div key={store.id} className="bg-[#1F2937] rounded-lg overflow-hidden shadow">
            <div className="p-4">
              <div className="flex items-center gap-4">
                <img
                  src={store.images?.[0] || 'https://via.placeholder.com/64'}
                  alt={store.title}
                  className="w-16 h-16 object-cover rounded-md flex-shrink-0"
                />
                <div className="min-w-0 flex-1">
                  <h3 className="text-lg font-semibold text-white truncate">{store.title}</h3>
                  <p className="text-sm text-gray-400 mt-1 truncate">{store.address}</p>
                </div>
              </div>
              
              <div className="mt-4">
                <p className="text-sm text-gray-400 line-clamp-2">{store.description}</p>
              </div>

              {store.services && store.services.length > 0 && (
                <div className="mt-4 flex flex-wrap gap-2">
                  {store.services.slice(0, 2).map((service, index) => (
                    <span
                      key={index}
                      className="bg-gray-700 text-gray-200 text-xs px-2 py-1 rounded-full"
                    >
                      {service.name}
                    </span>
                  ))}
                  {store.services.length > 2 && (
                    <span className="text-xs text-gray-400">
                      +{store.services.length - 2} more
                    </span>
                  )}
                </div>
              )}

              <div className="mt-4 flex items-center justify-end gap-3 border-t border-gray-700 pt-4">
                <Link href={`/stores/${store.id}`}>
                  <Eye className="w-5 h-5 text-gray-400 hover:text-blue-400" />
                </Link>
                <Link href={`/admin/stores/edit/${store.id}`}>
                  <Edit className="w-5 h-5 text-gray-400 hover:text-yellow-400" />
                </Link>
                <button onClick={() => handleDelete(store.id)}>
                  <Trash2 className="w-5 h-5 text-gray-400 hover:text-red-500" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Desktop View - Table Layout */}
      <div className="hidden sm:block overflow-x-auto">
        <table className="min-w-full bg-[#111827] text-white rounded-lg overflow-hidden">
          <thead className="bg-[#1F2937] text-sm">
            <tr>
              <th className="px-6 py-4 text-left font-medium">Store</th>
              <th className="px-6 py-4 text-left font-medium hidden lg:table-cell">Address</th>
              <th className="px-6 py-4 text-left font-medium hidden md:table-cell">Services</th>
              <th className="px-6 py-4 text-left font-medium hidden md:table-cell">Barbers</th>
              <th className="px-6 py-4 text-left font-medium">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-700">
            {stores.map((store) => (
              <tr key={store.id} className="hover:bg-[#1E293B] transition-colors">
                <td className="px-6 py-4">
                  <div className="flex gap-4 items-center">
                    <img
                      src={store.images?.[0] || 'https://via.placeholder.com/64'}
                      alt={store.title}
                      className="w-12 h-12 object-cover rounded-md"
                    />
                    <div className="min-w-0">
                      <div className="font-medium text-sm">{store.title}</div>
                      <div className="text-sm text-gray-400 truncate max-w-xs">{store.description}</div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 text-sm hidden lg:table-cell">{store.address}</td>
                <td className="px-6 py-4 hidden md:table-cell">
                  <div className="flex flex-wrap gap-2">
                    {(store.services || []).map((service, index) => (
                      <span
                        key={index}
                        className="bg-gray-700 text-gray-200 text-xs px-2 py-1 rounded-full"
                      >
                        {service.name}
                      </span>
                    ))}
                  </div>
                </td>
                <td className="px-6 py-4 text-sm hidden md:table-cell">
                  {(store.barbers || []).length} barber{store.barbers?.length !== 1 ? 's' : ''}
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <Link href={`/stores/${store.id}`} className="text-gray-400 hover:text-blue-400 transition-colors">
                      <Eye className="w-5 h-5" />
                    </Link>
                    <Link href={`/admin/stores/edit/${store.id}`} className="text-gray-400 hover:text-yellow-400 transition-colors">
                      <Edit className="w-5 h-5" />
                    </Link>
                    <button 
                      onClick={() => handleDelete(store.id)}
                      className="text-gray-400 hover:text-red-500 transition-colors"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {stores.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-400 text-lg">No stores found</p>
        </div>
      )}
    </div>
  );
};

export default StoresTable;
