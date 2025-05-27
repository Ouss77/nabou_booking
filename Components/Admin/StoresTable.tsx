"use client";
import React, { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabaseClient';
import Link from 'next/link';
import { Eye, Edit, Trash2 } from 'lucide-react'; // Make sure lucide-react is installed

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

  return (
    <div className="max-w-7xl mx-auto p-6">
      <h2 className="text-3xl font-bold mb-6 text-white">All Stores</h2>
      {loading ? (
        <p className="text-white">Loading...</p>
      ) : (
        <table className="min-w-full bg-[#111827] text-white text-lg rounded-lg overflow-hidden">
          <thead className="bg-[#1F2937]">
            <tr>
              <th className="px-6 py-4 text-left">Store</th>
              <th className="px-6 py-4 text-left">Address</th>
              <th className="px-6 py-4 text-left">Services</th>
              <th className="px-6 py-4 text-left">Barbers</th>
              <th className="px-6 py-4 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {stores.map((store) => (
              <tr key={store.id} className="border-b border-gray-700 hover:bg-[#1E293B]">
                <td className="px-6 py-4 flex gap-4 items-center">
                  <img
                    src={store.images?.[0] || 'https://via.placeholder.com/64'}
                    alt={store.title}
                    className="w-16 h-16 object-cover rounded-md"
                  />
                  <div>
                    <div className="font-semibold">{store.title}</div>
                    <div className="text-sm text-gray-400">{store.description}</div>
                  </div>
                </td>
                <td className="px-6 py-4">{store.address}</td>
                <td className="px-6 py-4">
                  {(store.services || []).map((service, index) => (
                    <span
                      key={index}
                      className="bg-white text-black text-sm px-3 py-1 rounded-full mr-2 inline-block"
                    >
                      {service.name}
                    </span>
                  ))}
                </td>
                <td className="px-6 py-4">
                  {(store.barbers || []).length} barber{store.barbers?.length !== 1 ? 's' : ''}
                </td>
                <td className="px-6 py-4 flex gap-4 items-center">
                  {/* View Icon */}
                  <Link href={`/stores/${store.id}`} title="View">
                    <Eye className="w-5 h-5 hover:text-blue-400 cursor-pointer" />
                  </Link>

                  {/* Edit Icon */}
                  <Link href={`/admin/stores/edit/${store.id}`} title="Edit">
                    <Edit className="w-5 h-5 hover:text-yellow-400 cursor-pointer" />
                  </Link>

                  {/* Delete Icon */}
                  <button onClick={() => handleDelete(store.id)} title="Delete">
                    <Trash2 className="w-5 h-5 hover:text-red-500 cursor-pointer" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default StoresTable;
