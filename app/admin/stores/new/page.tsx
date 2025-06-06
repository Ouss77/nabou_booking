"use client";
import { supabase } from "@/lib/supabaseClient";
import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {StoreFormProvider,  useStoreForm,} from "@/Components/NewStore/store-form-context";
import BasicInfoTab from "@/Components/NewStore/basic-info-tab";
import ImagesTab from "@/Components/NewStore/images-tab";
import TeamTab from "@/Components/NewStore/team-tab";
import ServicesTab from "@/Components/NewStore/services-tab";
import { FaArrowLeft } from "react-icons/fa";
import StoreFormTabs from "@/Components/NewStore/store-form-tabs";

function StoreFormContent({
  activeTab,
  setActiveTab,
  isSubmitting,
  setIsSubmitting,
}: {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  isSubmitting: boolean;
  setIsSubmitting: React.Dispatch<React.SetStateAction<boolean>>;
}) {
  const router = useRouter();
  const { formData } = useStoreForm();

  // Now handleSubmit is inside the provider, so useStoreForm() works
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      if (
        !formData.title.trim() ||
        !formData.address.trim() ||
        !formData.description.trim() ||
        formData.images.length === 0 ||
        formData.barbers.length === 0 ||
        formData.barbers.some((barber) => !barber.trim()) ||
        formData.services.length === 0
      ) {
        throw new Error(
          "Title and address are required fields, and you must upload at least one image, add at least one barber, and select at least one service."
        );
      }

      const uploadedUrls: string[] = [];

      if (formData.images.length > 0) {
        for (const file of formData.images) {
          const fileExt = file.name.split(".").pop();
          const filePath = `${Date.now()}-${Math.random()}.${fileExt}`;

          const { error } = await supabase.storage
            .from("barbershop-images") 
            .upload(filePath, file);

          if (error) throw error;

          const {
            data: { publicUrl },
          } = await supabase.storage
            .from("barbershop-images")
            .getPublicUrl(filePath);

          uploadedUrls.push(publicUrl);
        }
      }

      const { error: insertError } = await supabase.from("stores").insert([
        {
          title: formData.title,
          address: formData.address,
          description: formData.description,
          images: uploadedUrls,
          barbers: formData.barbers.filter((b) => b.trim() !== ""),
          services: formData.services,
        },
      ]);

      if (insertError) throw insertError;

      alert("Store created successfully!");
      router.push("/");
    } catch (error) {
      console.error("Error:", error);
      alert(error instanceof Error ? error.message : "Failed to create store");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="bg-zinc-900 rounded-lg p-4 sm:p-6 border border-zinc-800">
        <StoreFormTabs activeTab={activeTab} setActiveTab={setActiveTab} />

        <div className="mt-6">
          {activeTab === "basic" && <BasicInfoTab />}
          {activeTab === "images" && <ImagesTab />}
          {activeTab === "team" && <TeamTab />}
          {activeTab === "services" && <ServicesTab />}
        </div>

        <div className="mt-8 flex flex-col sm:flex-row gap-3 sm:justify-end">
          <button
            type="button"
            className="w-full sm:w-auto px-4 py-2 border border-zinc-700 rounded-md text-zinc-300 hover:bg-zinc-800 transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            className={`w-full sm:w-auto px-4 py-2 rounded-md ${
              isSubmitting
                ? "bg-amber-600 text-zinc-950 cursor-not-allowed"
                : "bg-amber-500 text-zinc-950 hover:bg-amber-600"
            }`}
            disabled={isSubmitting}
          >
            {isSubmitting ? "Creating Store..." : "Create Store"}
          </button>
        </div>
      </div>
    </form>
  );
}

export default function NewStorePage() {
  const [activeTab, setActiveTab] = useState("basic");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const initialData = {
    title: "",
    address: "",
    images: [],
    barbers: [""],
    services: [],
    description: "",
  };

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100">
      <header className="border-b border-zinc-800 bg-zinc-950 sticky top-0 z-10">
        <div className="container mx-auto flex h-16 items-center justify-between px-4">
          <Link
            href="/"
            className="text-lg sm:text-xl font-bold tracking-tight text-amber-500"
          >
            Nabou
          </Link>
          <button
            className="inline-flex items-center px-3 py-1.5 text-sm border border-zinc-700 rounded-md text-zinc-300 hover:bg-zinc-800 hover:text-zinc-100 transition-colors"
            onClick={() => history.back()}
            aria-label="Go back"
          >
            <FaArrowLeft className="h-3 w-3 mr-2" />
            <span className="hidden sm:inline">Back</span>
          </button>
        </div>
      </header>

      <main className="container mx-auto py-6 sm:py-8 lg:py-12 px-4">
        <div className="max-w-3xl mx-auto">
          <div className="mb-6 sm:mb-8">
            <h1 className="text-2xl sm:text-3xl font-bold">Add New Store</h1>
            <p className="mt-2 text-sm sm:text-base text-zinc-400">
              Create a new store to manage your services and appointments
            </p>
          </div>

          <StoreFormProvider initialData={initialData}>
            <StoreFormContent
              activeTab={activeTab}
              setActiveTab={setActiveTab}
              isSubmitting={isSubmitting}
              setIsSubmitting={setIsSubmitting}
            />
          </StoreFormProvider>
        </div>
      </main>
    </div>
  );
}
