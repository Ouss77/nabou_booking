import React from 'react'
import AdminSidebar from '@/Components/Admin/AdminSidebar' 
import StoresTable from '@/Components/Admin/StoresTable'

function StoresAdmin() {
  return (
    <div className="flex bg-[#111827] min-h-screen">
        <AdminSidebar active="Stores" />
            <StoresTable />

    </div>
  )
}

export default StoresAdmin