"use client";
import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";
import AdminSidebar from "@/Components/Admin/AdminSidebar";
import {
  ArrowLeft,
  CheckCircle,
  AlertCircle,
  Upload,
  X,
  Save,
  Loader2,
  Plus,
  MenuIcon,
} from "lucide-react";
import {
  handleInputChange,
  handleSubmit,
  validateForm,
  fetchStore,
  removeBarber,
  addBarber,
  removeService,
  handleImageUpload,
  addService,
  removeImage,
} from "@/utils/StoreFomUtils";

interface EditStorePageProps {
  params: {
    id: string;
  };
}

interface FormData {
  title: string;
  address: string;
  description: string;
  services: string[];
  barbers: string[];
  images: string[];
}

interface FormErrors {
  title?: string;
  address?: string;
  description?: string;
  services?: string;
  barbers?: string;
  general?: string;
}

export default function EditStorePage() {
  const { id } = useParams(); // ✅ this works now
  const router = useRouter();
  const [store, setStore] = useState<FormData | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [errors, setErrors] = useState<FormErrors>({});
  const [success, setSuccess] = useState(false);
  const [newService, setNewService] = useState("");
  const [newBarber, setNewBarber] = useState("");
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const [formData, setFormData] = useState<FormData>({
    title: "",
    address: "",
    description: "",
    services: [],
    barbers: [],
    images: [],
  });

  function getImageUrl(image: string) {
    if (image.startsWith("http")) return image; // it's already a full URL
    return `https://gmdtkpraeoltdhiwlpag.supabase.co/storage/v1/object/public/${image}`;
  }

  useEffect(() => {
    if (id) { // Only fetch if id exists
      fetchStore(id, setStore, setFormData, setErrors, setLoading);
    }
  }, [id]);

  return (
    <div className="min-h-screen bg-black text-white flex relative">
      {/* Mobile Sidebar Toggle */}
      <button 
        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
        className="lg:hidden fixed top-4 left-4 z-50 p-2 rounded-lg bg-gray-800 text-white hover:bg-gray-700"
      >
        {isSidebarOpen ? <X className="w-6 h-6" /> : <MenuIcon className="w-6 h-6" />}
      </button>

      {/* Sidebar */}
      <div className={`${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0 fixed lg:relative z-40 transition-transform duration-300 ease-in-out`}>
        <AdminSidebar active="Stores" />
      </div>

      {/* Overlay */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-30 lg:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Main Content */}
      <main className="flex-1 p-4 sm:p-6 lg:p-8 mt-12 lg:mt-0">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center gap-4 mb-6 sm:mb-8">
          <a
            href="/admin/stores"
            className="inline-flex items-center border border-gray-700 text-gray-300 hover:bg-gray-800 px-3 py-1.5 text-sm rounded w-full sm:w-auto justify-center sm:justify-start"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Stores
          </a>
          <div>
            <h1 className="text-2xl sm:text-4xl font-bold text-white">Edit Store</h1>
            <p className="text-gray-400 text-base sm:text-lg">
              Update store information and settings
            </p>
          </div>
        </div>

        {/* Success Message */}
        {success && (
          <div className="flex items-start gap-2 border border-green-800 bg-green-900/20 p-4 rounded mb-6">
            <CheckCircle className="h-5 w-5 text-green-400 shrink-0" />
            <p className="text-green-400">
              Store updated successfully! Redirecting to stores list...
            </p>
          </div>
        )}

        {/* Error Message */}
        {errors.general && (
          <div className="flex items-start gap-2 border border-red-800 bg-red-900/20 p-4 rounded mb-6">
            <AlertCircle className="h-5 w-5 text-red-400 shrink-0" />
            <p className="text-red-400">{errors.general}</p>
          </div>
        )}

        <form
          onSubmit={(e) =>
            handleSubmit(
              e,
              formData,
              {id},
              setFormData,
              setErrors,
              setSuccess,
              setSaving,
              router,
              supabase
            )
          }
          className="space-y-6 sm:space-y-8"
        >
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8">
            {/* Basic Info */}
            <div className="bg-gray-900 border border-gray-800 rounded-lg p-4 sm:p-6 space-y-4 sm:space-y-6">
              <h2 className="text-yellow-400 text-lg sm:text-xl font-semibold mb-4">
                Basic Information
              </h2>

              <div>
                <label htmlFor="title" className="block text-white mb-1 text-sm sm:text-base">
                  Store Name *
                </label>
                <input
                  id="title"
                  value={formData.title}
                  onChange={(e) =>
                    handleInputChange(
                      "title",
                      e.target.value,
                      setFormData,
                      setErrors,
                      errors
                    )
                  }
                  className={`w-full bg-gray-800 border ${
                    errors.title ? "border-red-500" : "border-gray-700"
                  } text-white placeholder-gray-400 p-2 rounded-md text-sm sm:text-base`}
                  placeholder="Enter store name"
                />
                {errors.title && (
                  <p className="text-red-400 text-xs sm:text-sm mt-1">{errors.title}</p>
                )}
              </div>

              <div>
                <label htmlFor="address" className="block text-white mb-1 text-sm sm:text-base">
                  Address *
                </label>
                <input
                  id="address"
                  value={formData.address}
                  onChange={(e) =>
                    handleInputChange(
                      "address",
                      e.target.value,
                      setFormData,
                      setErrors,
                      errors
                    )
                  }
                  className={`w-full bg-gray-800 border ${
                    errors.address ? "border-red-500" : "border-gray-700"
                  } text-white placeholder-gray-400 p-2 rounded-md text-sm sm:text-base`}
                  placeholder="Enter complete address"
                />
                {errors.address && (
                  <p className="text-red-400 text-xs sm:text-sm mt-1">{errors.address}</p>
                )}
              </div>

              <div>
                <label htmlFor="description" className="block text-white mb-1 text-sm sm:text-base">
                  Description *
                </label>
                <textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) =>
                    handleInputChange( "description", e.target.value, setFormData, setErrors,  errors)
                  }
                  className={`w-full bg-gray-800 border ${
                    errors.description ? "border-red-500" : "border-gray-700"
                  } text-white placeholder-gray-400 p-2 min-h-[100px] rounded-md text-sm sm:text-base`}
                  placeholder="Describe your barbershop..."
                />
                {errors.description && (
                  <p className="text-red-400 text-xs sm:text-sm mt-1">
                    {errors.description}
                  </p>
                )}
              </div>
            </div>

            {/* Images */}
            <div className="bg-gray-900 border border-gray-800 rounded p-6 space-y-6">
              <h2 className="text-yellow-400 text-xl font-semibold mb-4">
                Store Images
              </h2>

              <div>
                <label htmlFor="image-upload" className="block text-white mb-2"> Upload Images </label>
                <input
                  id="image-upload"
                  type="file"
                  accept="image/*"
                  onChange={(e) =>
                  handleImageUpload(e, id, setFormData, setErrors, setUploading) }
                  multiple
                  className="hidden"
                />
                <button
                  type="button"
                  onClick={() => document.getElementById("image-upload")?.click()}
                  disabled={uploading}
                  className="flex items-center border border-gray-700 text-gray-300 hover:bg-gray-800 px-3 py-1.5 rounded text-sm"
                >
                  {uploading ? ( <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  ) : ( <Upload className="h-4 w-4 mr-2" />  )}
                  {uploading ? "Uploading..." : "Upload Image"}
                </button>
              </div>

              {formData.images.length > 0 && (
                <div className="grid grid-cols-2 gap-4">
                  {formData.images.map((image, index) => (
                    <div key={index} className="relative group">
                      <div className="relative h-24 rounded-lg overflow-hidden">
                        <img src={getImageUrl(image) || "/placeholder.svg"} alt={`Store image ${index + 1}`} className="w-full h-full object-cover" />
                      </div>
                      <button
                        type="button"
                        onClick={() => removeImage(index, formData, setFormData)}
                        className="absolute -top-2 -right-2 h-6 w-6 rounded-full bg-red-700 text-white text-xs flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Services & Barbers */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Services */}
            <div className="bg-gray-900 border border-gray-800 rounded p-6 space-y-4">
              <h2 className="text-yellow-400 text-xl font-semibold">
                Services *
              </h2>

              <div className="flex gap-2">
                <input
                  value={newService}
                  onChange={(e) => setNewService(e.target.value)}
                  onKeyPress={(e) =>
                    e.key === "Enter" &&
                    (e.preventDefault(),
                    addService(
                      newService,
                      formData,
                      setFormData,
                      setNewService,
                      errors,
                      setErrors
                    ))
                  }
                  type="text"
                  placeholder="Add a service"
                  className="flex-1 bg-gray-800 border border-gray-700 text-white placeholder-gray-400 p-2 rounded"
                />
                <button
                  type="button"
                  onClick={() =>
                    addService(
                      newService,
                      formData,
                      setFormData,
                      setNewService,
                      errors,
                      setErrors
                    )
                  }
                  disabled={
                    !newService.trim() ||
                    formData.services.includes(newService.trim())
                  }
                  className="bg-yellow-400 hover:bg-yellow-500 text-black px-3 py-2 rounded"
                >
                  <Plus className="h-4 w-4" />
                </button>
              </div>

              {errors.services && (
                <p className="text-red-400 text-sm">{errors.services}</p>
              )}

              <div className="flex flex-wrap gap-2">
                {formData.services.map((service, index) => (
                  <span
                    key={index}
                    className="flex items-center bg-gray-800 text-gray-300 px-3 py-1.5 rounded-full"
                  >
                    {service}
                    <button
                      type="button"
                      onClick={() =>
                        removeService(index, formData, setFormData)
                      }
                      className="ml-2 text-white hover:text-red-400"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </span>
                ))}
              </div>
            </div>

            {/* Barbers */}
            <div className="bg-gray-900 border border-gray-800 rounded p-6 space-y-4">
              <h2 className="text-yellow-400 text-xl font-semibold">
                Barbers *
              </h2>

              <div className="flex gap-2">
                <input
                  value={newBarber}
                  onChange={(e) => setNewBarber(e.target.value)}
                  onKeyPress={(e) =>
                    e.key === "Enter" &&
                    (e.preventDefault(),
                    addBarber(
                      newBarber,
                      formData,
                      setFormData,
                      setNewBarber,
                      errors,
                      setErrors
                    ))
                  }
                  placeholder="Add a barber"
                  className="flex-1 bg-gray-800 border border-gray-700 text-white placeholder-gray-400 p-2 rounded"
                />
                <button
                  type="button"
                  onClick={() =>
                    addBarber(
                      newBarber,
                      formData,
                      setFormData,
                      setNewBarber,
                      errors,
                      setErrors
                    )
                  }
                  className="bg-yellow-400 hover:bg-yellow-500 text-black px-3 py-2 rounded"
                >
                  <Plus className="h-4 w-4" />
                </button>
              </div>

              {errors.barbers && (
                <p className="text-red-400 text-sm">{errors.barbers}</p>
              )}

              <div className="flex flex-wrap gap-2">
                {formData.barbers.map((barber, index) => (
                  <span
                    key={index}
                    className="flex items-center bg-gray-800 text-gray-300 px-3 py-1.5 rounded-full"
                  >
                    {barber}
                    <button
                      type="button"
                      onClick={() => removeBarber(index, formData, setFormData)}
                      className="ml-2 text-white hover:text-red-400"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Submit */}
          <div className="flex justify-end gap-4">
            <a
              href="/admin/stores"
              className="inline-flex items-center border border-gray-700 text-gray-300 hover:bg-gray-800 px-4 py-2 rounded"
            >
              Cancel
            </a>
            <button
              type="submit"
              disabled={saving}
              className="bg-yellow-400 hover:bg-yellow-500 text-black font-semibold px-8 py-2 rounded"
            >
              {saving ? (
                <span className="flex items-center">
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Saving...
                </span>
              ) : (
                <span className="flex items-center">
                  <Save className="h-4 w-4 mr-2" />
                  Save Changes
                </span>
              )}
            </button>
          </div>
        </form>
      </main>
    </div>
  );
}
