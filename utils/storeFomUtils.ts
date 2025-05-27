// utils/storeFormUtils.ts
import { supabase } from "@/lib/supabaseClient"
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
export async function handleImageUpload(   event: React.ChangeEvent<HTMLInputElement>,   paramsId: string,   setFormData: Function,  setErrors: Function,  setUploading: Function) {
  const file = event.target.files?.[0];
  if (!file) return;

  if (!file.type.startsWith("image/")) {
    setErrors((prev: any) => ({
      ...prev,
      general: "Please select a valid image file",
    }));
    return;
  }

  // if (file.size > 5 * 1024 * 1024) {
  //   setErrors((prev: any) => ({
  //     ...prev,
  //     general: "Image size must be less than 5MB",
  //   }));
  //   return;
  // }

  setUploading(true);
  try {
    const fileExt = file.name.split(".").pop();
    const fileName = `${Date.now()}.${fileExt}`;

    const { error: uploadError } = await supabase.storage
      .from("barbershop-images")
      .upload(fileName, file);

    if (uploadError) throw uploadError;

    // ✅ Get public URL and store it
    const {  data: { publicUrl } } = await supabase.storage.from("barbershop-images").getPublicUrl(fileName);

    setFormData((prev: any) => ({ ...prev, images: [...prev.images, publicUrl], // ✅ Save URL here
    }));
  } catch (error) {
    console.error("Error uploading image:", error);
    setErrors((prev: any) => ({
      ...prev,
      general: "Failed to upload image",
    }));
  } finally {
    setUploading(false);
  }
}


export async function removeImage   (index: number, formData: any, setFormData: Function) {
    const imageToRemove = formData.images[index]

    try {
      // Remove from storage
      await supabase.storage.from("barbershop-images").remove([imageToRemove])

      // Remove from form data
      setFormData((prev: any) => ({
        ...prev,
        images: prev.images.filter((_: File, i:number) => i !== index),
      }))
    } catch (error) {
      console.error("Error removing image:", error)
    }
  }

export function addService(newService: string, formData: any, setFormData: Function, setNewService: Function, errors: any, setErrors: Function) {
  if (newService.trim() && !formData.services.includes(newService.trim())) {
    setFormData((prev: any) => ({
      ...prev,
      services: [...prev.services, newService.trim()],
    }))
    setNewService("")
    if (errors.services) {
      setErrors((prev: any) => ({ ...prev, services: undefined }))
    }
  }
}

export function removeService (index: number, formData: any, setFormData: Function) { 
    setFormData((prev:any) => ({
      ...prev,
      services: prev.services.filter((_: any, i: number) => i !== index),
    }))
  }

export function addBarber(newBarber: string, formData: any, setFormData: Function, setNewBarber: Function, errors: any, setErrors: Function) {
  if (newBarber.trim() && !formData.barbers.includes(newBarber.trim())) {
    setFormData((prev: any) => ({
      ...prev,
      barbers: [...prev.barbers, newBarber.trim()],
    }))
    setNewBarber("")
    if (errors.barbers) {
      setErrors((prev: any) => ({ ...prev, barbers: undefined }))
    }
  }
}

export function removeBarber(index: number, formData: any, setFormData: Function) {
  setFormData((prev:any) => ({
    ...prev,
    barbers: prev.barbers.filter((_: string, i:number) => i !== index), // Changed File to string
  }))
}

export async function handleSubmit( e: React.FormEvent<HTMLFormElement>,  formData: any,  params: { id: string },  setFormData: Function,  setErrors: Function, setSuccess: Function, setSaving: Function,  router: any,
  supabase: any ) { 
      e.preventDefault();
      setSuccess(false);
      setErrors({});

  if (!validateForm(formData, setErrors)) return;

  setSaving(true);
  try {
    // 1. Upload new images (if any are File objects)
    const uploadedUrls: string[] = [];

    for (const image of formData.images) {
      if (image instanceof File) {
        const fileExt = image.name.split(".").pop();
        const filePath = `store-${params.id}-${Date.now()}.${fileExt}`;

        // Upload to Supabase Storage
        const { error: uploadError } = await supabase.storage
          .from("barbershop-images")
          .upload(filePath, image);

        if (uploadError) throw uploadError;

        // Get public URL
        const { data: { publicUrl } } = await supabase.storage
          .from("barbershop-images")
          .getPublicUrl(filePath);

        uploadedUrls.push(publicUrl);
      } else {
        // If it's already a URL, keep it
        uploadedUrls.push(image);
      }
    }

    // 2. Update the database with the new URLs
    const { error } = await supabase
      .from("stores")
      .update({
        title: formData.title.trim(),
        address: formData.address.trim(),
        description: formData.description.trim(),
        services: formData.services,
        barbers: formData.barbers,
        images: uploadedUrls, // Use the processed URLs
      })
      .eq("id", params.id);

    if (error) throw error;

    setSuccess(true);
    setTimeout(() => router.push("/admin/stores"), 2000);
  } catch (error) {
    console.error("Error updating store:", error);
    setErrors({ general: "Failed to update store. Please try again." });
  } finally {
    setSaving(false);
  }
}

export async function fetchStore  ( id: any, setStore: Function, setFormData: Function, setErrors: Function, setLoading: Function) {
    try {
      const { data, error } = await supabase.from("stores").select("*").eq("id", id).single()

      if (error) throw error

      if (data) {
        setStore(data)
        setFormData({
          title: data.title || "",
          address: data.address || "",
          description: data.description || "",
          services: data.services || [],
          barbers: data.barbers || [],
          images: data.images || [],
        })
      }
    } catch (error) {
      console.error("Error fetching store:", error)
      setErrors({ general: "Failed to load store information" })
    } finally {
      setLoading(false)
    }
  }

export async function validateForm ( formData: any, setErrors: Function): Promise<boolean> {
    const newErrors: FormErrors = {}

    if (!formData.title.trim()) {
      newErrors.title = "Store name is required"
    } else if (formData.title.length < 3) {
      newErrors.title = "Store name must be at least 3 characters"
    }

    if (!formData.address.trim()) {
      newErrors.address = "Address is required"
    } else if (formData.address.length < 10) {
      newErrors.address = "Please provide a complete address"
    }

    if (!formData.description.trim()) {
      newErrors.description = "Description is required"
    } else if (formData.description.length < 20) {
      newErrors.description = "Description must be at least 20 characters"
    }

    if (formData.services.length === 0) {
      newErrors.services = "At least one service is required"
    }

    if (formData.barbers.length === 0) {
      newErrors.barbers = "At least one barber is required"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  export function handleInputChange  (field: keyof FormData,   value: string | FileList | File[], setFormData: Function, setErrors: Function, errors: any) {
    setFormData((prev: any) => ({ ...prev, [field]: value }))
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors((prev:any) => ({ ...prev, [field]: undefined }))
    }
  }