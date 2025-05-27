"use client";

import { useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";
import { CalendarDays, Clock, MapPin, Scissors, User, ArrowLeft } from "lucide-react";
import Link from "next/link";
import FormBooking from "@/Components/FormBooking";

interface Store {
  id: string;
  title: string;
  address: string;
  barbers: string[];
}

const timeSlots = [
  "9:00", "9:30", "10:00", "10:30", "11:00", "11:30", "12:00", "12:30",
  "13:00", "13:30", "14:00", "14:30", "15:00", "15:30", "16:00", "16:30",
  "17:00", "17:30", "18:00", "18:30", "19:00", "19:30", "20:00"
];

export default function BookingPage() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const storeId = searchParams.get("store");
  const serviceName = searchParams.get("service");
  const servicePrice = searchParams.get("price");

  const [store, setStore] = useState<Store | null>(null);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedTime, setSelectedTime] = useState<string>("");
  const [selectedBarber, setSelectedBarber] = useState<string>("");
  const [isLoading, setIsLoading] = useState(true);
  const [bookedSlots, setBookedSlots] = useState<string[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (storeId) {
      fetchStore();
    } else {
      setIsLoading(false);
      setError("Missing store ID");
    }
  }, [storeId]);

  useEffect(() => {
    if (selectedDate && selectedBarber) {
      fetchBookedSlots();
    } else {
      setBookedSlots([]);
    }
  }, [selectedDate, selectedBarber, storeId]);

  const fetchStore = async () => {
    if (!storeId) return;

    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from("stores")
        .select("*")
        .eq("id", storeId)
        .single();

      if (error) throw error;
      setStore(data);
      setError(null);
    } catch (error) {
      console.error("Error fetching store:", error);
      setError("Failed to load store information");
      router.push("/");
    } finally {
      setIsLoading(false);
    }
  };

  const fetchBookedSlots = async () => {
    if (!selectedDate || !selectedBarber || !storeId) return;

    try {
      const dateStr = selectedDate.toISOString().split("T")[0];
      const { data, error } = await supabase
        .from("appointments")
        .select("time")
        .eq("store_id", storeId)
        .eq("barber", selectedBarber)
        .eq("date", dateStr);

      if (error) throw error;
      setBookedSlots(data.map((appointment) => appointment.time));
    } catch (error) {
      console.error("Error fetching booked slots:", error);
      setBookedSlots([]);
    }
  };

  const isTimeSlotAvailable = (timeSlot: string): boolean => {
    if (!selectedDate) return false;
    
    const isBooked = bookedSlots.includes(timeSlot);
    const isPast = isTimeInPast(selectedDate, timeSlot);
    
    return !isBooked && !isPast;
  };

  const isTimeInPast = (date: Date, timeSlot: string): boolean => {
    const now = new Date();
    const [hours, minutes] = timeSlot.split(":").map(Number);
    
    const slotDateTime = new Date(date);
    slotDateTime.setHours(hours, minutes, 0, 0);
    
    return slotDateTime < now;
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-yellow-400">Loading...</div>
      </div>
    );
  }

  if (error || !store || !serviceName || !storeId) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="w-full max-w-md bg-gray-900 border border-gray-700 rounded-lg">
          <div className="p-6 text-center">
            <p className="text-gray-400 mb-4">{error || "Invalid booking information"}</p>
            <Link href="/">
              <button className="bg-yellow-400 hover:bg-yellow-500 text-black px-4 py-2 rounded">
                Back to Home
              </button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const showForm = !!selectedDate && !!selectedTime && !!selectedBarber;

  return (
    <div className="min-h-screen bg-black text-white">
      <header className="bg-gray-900 border-b border-gray-800">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <Link
            href={`/stores/${storeId}`}
            className="inline-flex items-center gap-2 text-yellow-400 hover:text-yellow-300 transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to {store.title}
          </Link>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-4">Book Your Appointment</h1>

          <div className="bg-gray-900 border border-gray-700 rounded-lg p-4 mb-6">
            <h2 className="text-yellow-400 text-lg font-semibold mb-4">Booking Summary</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="flex items-center gap-3">
                <MapPin className="h-5 w-5 text-yellow-400" />
                <div>
                  <p className="font-semibold text-white">{store.title}</p>
                  <p className="text-sm text-gray-400">{store.address}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Scissors className="h-5 w-5 text-yellow-400" />
                <div>
                  <p className="font-semibold text-white">{serviceName}</p>
                  <span className="inline-block px-2 py-1 text-sm rounded bg-yellow-400 text-black font-medium">
                    €{servicePrice}
                  </span>
                </div>
              </div>
              {selectedBarber && (
                <div className="flex items-center gap-3">
                  <User className="h-5 w-5 text-yellow-400" />
                  <div>
                    <p className="font-semibold text-white">{selectedBarber}</p>
                    <p className="text-sm text-gray-400">Your barber</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="space-y-6">
            <div className="bg-gray-900 border border-gray-700 rounded-lg p-4">
              <h2 className="flex items-center gap-2 text-yellow-400 text-lg font-semibold mb-3">
                <User className="h-5 w-5" />
                Select Your Barber
              </h2>
              <select
                className="w-full bg-gray-800 border border-gray-600 text-white rounded p-2"
                value={selectedBarber}
                onChange={(e) => {
                  setSelectedBarber(e.target.value);
                  setSelectedTime("");
                }}
              >
                <option value="">Choose a barber</option>
                {store.barbers?.map((barber) => (
                  <option key={barber} value={barber}>
                    {barber}
                  </option>
                ))}
              </select>
            </div>

            <div className="bg-gray-900 border border-gray-700 rounded-lg overflow-hidden">
              <div className="p-4 border-b border-gray-700">
                <h2 className="flex items-center gap-2 text-yellow-400 text-lg font-semibold">
                  <CalendarDays className="h-5 w-5" />
                  Select Date
                </h2>
              </div>
              <div className="p-4">
                <input
                  type="date"
                  className="w-full bg-gray-800 border border-gray-600 text-white rounded p-2"
                  min={new Date().toISOString().split('T')[0]}
                  onChange={(e) => {
                    setSelectedDate(new Date(e.target.value));
                    setSelectedTime("");
                  }}
                />
              </div>
            </div>

            {selectedDate && selectedBarber && (
              <div className="bg-gray-900 border border-gray-700 rounded-lg overflow-hidden">
                <div className="p-4 border-b border-gray-700">
                  <h2 className="flex items-center gap-2 text-yellow-400 text-lg font-semibold">
                    <Clock className="h-5 w-5" />
                    Select Time
                  </h2>
                </div>
                <div className="p-4">
                  <div className="grid grid-cols-4 gap-2">
                    {timeSlots.map((time) => {
                      const isAvailable = isTimeSlotAvailable(time);
                      const isSelected = selectedTime === time;
                      const isBooked = bookedSlots.includes(time);
                      const isPast = isTimeInPast(selectedDate, time);

                      return (
                        <button
                          key={time}
                          onClick={() => isAvailable && setSelectedTime(time)}
                          disabled={!isAvailable}
                          className={`
                            p-2 rounded text-sm
                            ${isSelected
                              ? 'bg-yellow-500 text-black font-bold'
                              : isAvailable
                                ? 'bg-gray-800 text-white hover:bg-gray-700'
                                : 'bg-gray-700 text-gray-500 cursor-not-allowed'
                            }
                          `}
                        >
                          {time}
                          {isBooked && <span className="block text-xs text-red-400">Booked</span>}
                          {isPast && <span className="block text-xs text-gray-400">Passed</span>}
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>
            )}
          </div>

          {showForm && (
            <div className="bg-gray-900 border border-gray-700 rounded-lg overflow-hidden">
              <div className="p-4 border-b border-gray-700">
                <h2 className="text-yellow-400 text-lg font-semibold">Your Information</h2>
              </div>
              <div className="p-4">
                <FormBooking 
                  selectedDate={selectedDate} 
                  selectedBarber={selectedBarber} 
                  selectedTime={selectedTime}
                  storeId={storeId}
                  store={store}
                  serviceName={serviceName}
                  servicePrice={servicePrice}
                />
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}