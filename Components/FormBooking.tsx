import { supabase } from "@/lib/supabaseClient";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
interface FormBookingProps {
  selectedDate: Date;
  selectedTime: string;
  selectedBarber: string;
  storeId: string;
  store?: { title: string };
  serviceName: string;
  servicePrice: string | number;
}

interface CustomerInfo {
  name: string;
  email: string;
  phone: string;
}

function FormBooking({
  selectedDate,
  selectedTime,
  selectedBarber,
  storeId,
  store,
  serviceName,
  servicePrice,
}: FormBookingProps) {
  const [customerInfo, setCustomerInfo] = useState<CustomerInfo>({
    name: "",
    email: "",
    phone: "",
  });
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setCustomerInfo((prev) => ({ ...prev, [name]: value }));
  };

 const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const appointmentData = {
        store_id: storeId,
        store_name: store?.title,
        service_name: serviceName,
        service_price: Number(servicePrice),
        barber: selectedBarber,
        date: selectedDate?.toISOString().split("T")[0],
        time: selectedTime,
        customer_name: customerInfo.name,
        customer_email: customerInfo.email,
        customer_phone: customerInfo.phone,
      };

      const { error } = await supabase
        .from("appointments")
        .insert([appointmentData]);

      if (error) {
        throw error;
      }

      setShowConfirmation(true);
    } catch (error: any) {
      console.error("Error booking appointment:", error);
      alert(error.message || "Failed to book appointment");
    } finally {
      setIsSubmitting(false);
    }
  };

  const closeConfirmation = () => {
    setShowConfirmation(false);
    router.push("/");
  };

  return (
    <div>
      <form
        onSubmit={handleSubmit}
        className="max-w-md mx-auto p-6 rounded-xl shadow-md text-white space-y-4"
      >
        <h2 className="text-2xl font-bold text-center">Booking Form</h2>

        <div>
          <label className="block mb-1 font-medium">Full Name</label>
          <input
            type="text"
            name="name"
            required
            value={customerInfo.name}
            onChange={handleChange}
            placeholder="Enter your full name"
            className="w-full px-4 py-2 border text-black border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500"
          />
        </div>

        <div>
          <label className="block mb-1 font-medium">Email</label>
          <input
            type="email"
            name="email"
            required
            value={customerInfo.email}
            onChange={handleChange}
            placeholder="Enter your email"
            className="w-full px-4 py-2 border text-black border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500"
          />
        </div>

        <div>
          <label className="block mb-1 font-medium">Phone Number</label>
          <input
            type="tel"
            name="phone"
            required
            value={customerInfo.phone}
            onChange={handleChange}
            placeholder="Enter your phone number"
            className="w-full px-4 py-2 border text-black border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500"
          />
        </div>

        {selectedDate && selectedTime && (
          <div className="bg-gray-800 p-4 rounded-lg border border-gray-600">
            <h4 className="font-semibold mb-2 text-yellow-400">
              Appointment Details:
            </h4>
            <p className="text-sm text-gray-300">
              {selectedDate.toLocaleDateString()} at {selectedTime}
            </p>
            <p className="text-sm text-gray-300">with {selectedBarber}</p>
          </div>
        )}

        <button
          type="submit"
          disabled={isSubmitting}
          className={`w-full py-2 px-4 bg-yellow-600 text-white font-semibold rounded-lg hover:bg-yellow-700 transition ${
            isSubmitting ? "opacity-50 cursor-not-allowed" : ""
          }`}
        >
          {isSubmitting ? "Submitting..." : "Submit Booking"}
        </button>
      </form>
         {/* Confirmation Ticket Modal */}
      {showConfirmation && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6 relative">
            <div className="absolute top-0 left-0 right-0 h-2 bg-yellow-500 rounded-t-lg"></div>
            <div className="text-center mb-6">
              <h2 className="text-2xl font-bold text-gray-800">Booking Confirmed!</h2>
              <p className="text-yellow-600 mt-2">Your appointment is scheduled</p>
            </div>

            <div className="space-y-4 mb-6">
              <div className="flex justify-between border-b pb-2">
                <span className="font-medium text-gray-600">Service:</span>
                <span className="text-gray-800">{serviceName}</span>
              </div>
              <div className="flex justify-between border-b pb-2">
                <span className="font-medium text-gray-600">Barber:</span>
                <span className="text-gray-800">{selectedBarber}</span>
              </div>
              <div className="flex justify-between border-b pb-2">
                <span className="font-medium text-gray-600">Date:</span>
                <span className="text-gray-800">
                  {selectedDate.toLocaleDateString()} at {selectedTime}
                </span>
              </div>
              <div className="flex justify-between border-b pb-2">
                <span className="font-medium text-gray-600">Location:</span>
                <span className="text-gray-800">{store?.title}</span>
              </div>
              <div className="flex justify-between border-b pb-2">
                <span className="font-medium text-gray-600">Price:</span>
                <span className="text-gray-800">€{servicePrice}</span>
              </div>
              <div className="flex justify-between border-b pb-2">
                <span className="font-medium text-gray-600">Customer:</span>
                <span className="text-gray-800">{customerInfo.name}</span>
              </div>
            </div>

            <div className="bg-gray-100 p-4 rounded-lg mb-4">
              <p className="text-sm text-gray-600">
                A confirmation has been sent to {customerInfo.email}
              </p>
            </div>

            <button
              onClick={closeConfirmation}
              className="w-full py-2 px-4 bg-yellow-600 text-white font-semibold rounded-lg hover:bg-yellow-700 transition"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default FormBooking;