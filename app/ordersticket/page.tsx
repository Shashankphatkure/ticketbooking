'use client';

import { useState } from 'react';
import Link from 'next/link';
import {
  ArrowLeft,
  Search,
  Ticket,
  CheckCircle2,
  Clock,
  XCircle,
  Download,
  Mail,
  Phone,
  User,
  Calendar,
  MapPin,
  Loader2,
  AlertCircle,
} from 'lucide-react';

interface TicketInfo {
  ticket_id: string;
  ticket_type: string;
  status: string;
}

interface BookingInfo {
  id: string;
  booking_id: string;
  customer_name: string;
  customer_email: string;
  customer_phone: string;
  total_amount: number;
  payment_status: string;
  tickets_generated: boolean;
  created_at: string;
  tickets: TicketInfo[];
}

export default function OrdersTicketPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [booking, setBooking] = useState<BookingInfo | null>(null);
  const [error, setError] = useState('');
  const [searched, setSearched] = useState(false);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
    }).format(price);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) {
      setError('Please enter a booking ID, email, or phone number');
      return;
    }

    setLoading(true);
    setError('');
    setBooking(null);
    setSearched(true);

    try {
      const response = await fetch(`/api/bookings?search=${encodeURIComponent(searchQuery.trim())}&limit=1`);
      const data = await response.json();

      if (data.bookings && data.bookings.length > 0) {
        // Fetch full booking details with tickets
        const bookingResponse = await fetch(`/api/bookings/${data.bookings[0].id}`);
        const bookingData = await bookingResponse.json();
        setBooking(bookingData);
      } else {
        setError('No booking found. Please check your booking ID, email, or phone number.');
      }
    } catch (err) {
      console.error('Error searching booking:', err);
      setError('Failed to search. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'confirmed':
        return <CheckCircle2 className="w-5 h-5 text-green-500" />;
      case 'pending':
        return <Clock className="w-5 h-5 text-yellow-500" />;
      case 'failed':
      case 'refunded':
        return <XCircle className="w-5 h-5 text-red-500" />;
      default:
        return <Clock className="w-5 h-5 text-gray-500" />;
    }
  };

  const getStatusBadge = (status: string) => {
    const styles: Record<string, string> = {
      pending: 'bg-yellow-100 text-yellow-700 border-yellow-200',
      confirmed: 'bg-green-100 text-green-700 border-green-200',
      refunded: 'bg-red-100 text-red-700 border-red-200',
      failed: 'bg-gray-100 text-gray-700 border-gray-200',
    };
    return styles[status] || styles.pending;
  };

  return (
    <div className="min-h-screen px-3 sm:px-4 py-6 sm:py-10">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6 sm:mb-8">
          <Link
            href="/"
            className="flex items-center gap-1.5 sm:gap-2 px-3 py-1.5 sm:px-4 sm:py-2 glass-card rounded-lg sm:rounded-xl text-gray-600 hover:text-gray-900 transition-colors"
          >
            <ArrowLeft className="w-4 h-4 sm:w-5 sm:h-5" />
            <span className="font-medium text-sm sm:text-base">Back</span>
          </Link>
          <div className="flex items-center gap-2">
            <img
              src="/logo.png"
              alt="Mangozzz Resort"
              className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg sm:rounded-xl object-contain"
            />
          </div>
        </div>

        {/* Title Section */}
        <div className="text-center mb-6 sm:mb-8">
          <div className="w-16 h-16 sm:w-20 sm:h-20 mx-auto mb-4 rounded-2xl sm:rounded-3xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-lg shadow-indigo-500/25">
            <Ticket className="w-8 h-8 sm:w-10 sm:h-10 text-white" />
          </div>
          <h1 className="text-xl sm:text-2xl font-bold text-gray-800 mb-1.5 sm:mb-2">
            Find Your Order
          </h1>
          <p className="text-sm sm:text-base text-gray-600">
            Enter your booking ID, email, or phone number to view your tickets
          </p>
        </div>

        {/* Search Form */}
        <div className="glass-strong rounded-2xl sm:rounded-3xl p-4 sm:p-6 mb-6">
          <form onSubmit={handleSearch} className="space-y-4">
            <div className="relative">
              <div className="absolute left-3 sm:left-4 top-1/2 -translate-y-1/2 w-8 h-8 sm:w-10 sm:h-10 rounded-lg sm:rounded-xl bg-gray-100 flex items-center justify-center">
                <Search className="w-4 h-4 sm:w-5 sm:h-5 text-gray-500" />
              </div>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Booking ID, Email, or Phone Number"
                className="w-full pl-14 sm:pl-[4.5rem] pr-3 sm:pr-4 py-3 sm:py-4 glass-card rounded-xl sm:rounded-2xl border-2 border-transparent focus:border-indigo-300 focus:outline-none transition-colors text-gray-800 text-sm sm:text-base"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 sm:py-4 bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white rounded-xl sm:rounded-2xl font-semibold flex items-center justify-center gap-2 transition-all disabled:opacity-70 text-sm sm:text-base shadow-lg shadow-indigo-500/25"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 sm:w-5 sm:h-5 animate-spin" />
                  <span>Searching...</span>
                </>
              ) : (
                <>
                  <Search className="w-4 h-4 sm:w-5 sm:h-5" />
                  <span>Find My Order</span>
                </>
              )}
            </button>
          </form>
        </div>

        {/* Error Message */}
        {error && searched && (
          <div className="glass-strong rounded-2xl sm:rounded-3xl p-4 sm:p-6 mb-6 bg-red-50 border border-red-200">
            <div className="flex items-center gap-3">
              <AlertCircle className="w-5 h-5 sm:w-6 sm:h-6 text-red-500 flex-shrink-0" />
              <p className="text-sm sm:text-base text-red-700">{error}</p>
            </div>
          </div>
        )}

        {/* Booking Result */}
        {booking && (
          <div className="space-y-4 sm:space-y-6">
            {/* Booking Info Card */}
            <div className="glass-strong rounded-2xl sm:rounded-3xl overflow-hidden">
              <div className="bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-600 p-4 sm:p-5">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-white/70 text-xs sm:text-sm">Booking ID</p>
                    <p className="text-white font-bold text-lg sm:text-xl font-mono">
                      {booking.booking_id}
                    </p>
                  </div>
                  <div className={`px-3 py-1.5 rounded-full text-xs sm:text-sm font-medium border ${getStatusBadge(booking.payment_status)}`}>
                    {booking.payment_status.charAt(0).toUpperCase() + booking.payment_status.slice(1)}
                  </div>
                </div>
              </div>

              <div className="p-4 sm:p-6 space-y-4">
                {/* Customer Details */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                  <div className="flex items-center gap-3 p-3 glass-card rounded-xl">
                    <div className="w-10 h-10 rounded-lg bg-indigo-50 flex items-center justify-center">
                      <User className="w-5 h-5 text-indigo-600" />
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Name</p>
                      <p className="font-medium text-gray-800 text-sm sm:text-base">{booking.customer_name}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 p-3 glass-card rounded-xl">
                    <div className="w-10 h-10 rounded-lg bg-purple-50 flex items-center justify-center">
                      <Mail className="w-5 h-5 text-purple-600" />
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Email</p>
                      <p className="font-medium text-gray-800 text-sm sm:text-base truncate">{booking.customer_email}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 p-3 glass-card rounded-xl">
                    <div className="w-10 h-10 rounded-lg bg-pink-50 flex items-center justify-center">
                      <Phone className="w-5 h-5 text-pink-600" />
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Phone</p>
                      <p className="font-medium text-gray-800 text-sm sm:text-base">{booking.customer_phone}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 p-3 glass-card rounded-xl">
                    <div className="w-10 h-10 rounded-lg bg-emerald-50 flex items-center justify-center">
                      <Calendar className="w-5 h-5 text-emerald-600" />
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Booked On</p>
                      <p className="font-medium text-gray-800 text-sm sm:text-base">{formatDate(booking.created_at)}</p>
                    </div>
                  </div>
                </div>

                {/* Amount */}
                <div className="pt-4 border-t border-gray-200">
                  <div className="flex justify-between items-center">
                    <span className="font-semibold text-gray-800">Total Amount</span>
                    <span className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                      {formatPrice(booking.total_amount)}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Tickets Section */}
            {booking.tickets && booking.tickets.length > 0 && (
              <div className="glass-strong rounded-2xl sm:rounded-3xl p-4 sm:p-6 bg-gradient-to-br from-purple-50 to-indigo-50">
                <h3 className="font-semibold text-gray-800 mb-3 sm:mb-4 flex items-center gap-2 text-sm sm:text-base">
                  <Ticket className="w-4 h-4 sm:w-5 sm:h-5 text-purple-500" />
                  Your Tickets ({booking.tickets.length})
                </h3>
                <div className="space-y-2 sm:space-y-3">
                  {booking.tickets.map((ticket, index) => (
                    <a
                      key={ticket.ticket_id}
                      href={`/api/tickets/${ticket.ticket_id}/pdf`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-between p-3 sm:p-4 bg-white rounded-xl border border-purple-200 hover:border-purple-400 hover:shadow-md transition-all group"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg bg-purple-100 flex items-center justify-center">
                          <Ticket className="w-4 h-4 sm:w-5 sm:h-5 text-purple-600" />
                        </div>
                        <div>
                          <p className="font-medium text-gray-800 text-sm sm:text-base">
                            Ticket #{index + 1}
                          </p>
                          <p className="text-xs text-gray-500">{ticket.ticket_type}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 text-purple-600 group-hover:text-purple-700">
                        <span className="text-xs sm:text-sm font-medium">Download PDF</span>
                        <Download className="w-4 h-4 sm:w-5 sm:h-5" />
                      </div>
                    </a>
                  ))}
                </div>
              </div>
            )}

            {/* No Tickets Yet */}
            {(!booking.tickets || booking.tickets.length === 0) && booking.payment_status === 'confirmed' && (
              <div className="glass-strong rounded-2xl sm:rounded-3xl p-4 sm:p-6 bg-gradient-to-br from-yellow-50 to-orange-50">
                <div className="flex items-center gap-3">
                  <Loader2 className="w-5 h-5 text-orange-600 animate-spin" />
                  <p className="text-sm text-orange-700">Your tickets are being generated. Please check back in a few moments.</p>
                </div>
              </div>
            )}

            {/* Pending Payment */}
            {booking.payment_status === 'pending' && (
              <div className="glass-strong rounded-2xl sm:rounded-3xl p-4 sm:p-6 bg-gradient-to-br from-yellow-50 to-orange-50">
                <div className="flex items-start gap-3">
                  <Clock className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="font-medium text-yellow-800 mb-1">Payment Pending</p>
                    <p className="text-sm text-yellow-700">
                      Your payment is still being processed. Tickets will be available once payment is confirmed.
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Event Info */}
            <div className="glass-card rounded-xl sm:rounded-2xl p-3 sm:p-4">
              <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-6 text-xs sm:text-sm text-gray-600">
                <div className="flex items-center gap-1.5">
                  <Calendar className="w-4 h-4 text-pink-500" />
                  <span>31st Dec 2025</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Clock className="w-4 h-4 text-purple-500" />
                  <span>7:00 PM onwards</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <MapPin className="w-4 h-4 text-indigo-500" />
                  <span>Karjat, Chowk</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Help Section */}
        <div className="mt-6 sm:mt-8 p-3 sm:p-4 bg-indigo-50 rounded-xl sm:rounded-2xl border border-indigo-200">
          <div className="flex items-start gap-2 sm:gap-3">
            <AlertCircle className="w-4 h-4 sm:w-5 sm:h-5 text-indigo-500 flex-shrink-0 mt-0.5" />
            <div>
              <p className="font-medium text-indigo-800 mb-0.5 sm:mb-1 text-sm sm:text-base">Need Help?</p>
              <p className="text-xs sm:text-sm text-indigo-700">
                Contact us on WhatsApp at +91 79771 27312 for any queries about your booking.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
