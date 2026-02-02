'use client'

import { useState, useEffect } from 'react'
import { api } from '@/lib/api'
import { Calendar, Filter, Video, MoreHorizontal, Clock } from 'lucide-react'
import { format, isPast, isFuture } from 'date-fns'

export default function BookingsDashboard() {
    const [bookings, setBookings] = useState([])
    const [loading, setLoading] = useState(true)
    const [activeTab, setActiveTab] = useState('upcoming')

    useEffect(() => {
        loadBookings()
    }, [])

    async function loadBookings() {
        try {
            const res = await api.bookings.getAll()
            setBookings(res.data || [])
        } catch (error) {
            console.error(error)
        } finally {
            setLoading(false)
        }
    }

    const handleCancel = async (id) => {
        if (!confirm('Are you sure you want to cancel this booking?')) return
        try {
            await api.bookings.cancel(id)
            loadBookings() // Refresh
        } catch (error) {
            console.error(error)
            alert('Failed to cancel')
        }
    }

    const tabs = [
        { id: 'upcoming', label: 'Upcoming' },
        { id: 'unconfirmed', label: 'Unconfirmed' },
        { id: 'recurring', label: 'Recurring' },
        { id: 'past', label: 'Past' },
        { id: 'canceled', label: 'Canceled' },
    ]

    const filteredBookings = bookings.filter(b => {
        const date = new Date(b.startTime)

        if (activeTab === 'upcoming') {
            return b.status === 'confirmed' && isFuture(date)
        }
        if (activeTab === 'past') {
            return b.status === 'confirmed' && isPast(date)
        }
        if (activeTab === 'canceled') {
            return b.status === 'cancelled'
        }
        return false
    })

    return (
        <div className="max-w-5xl mx-auto h-full flex flex-col">
            {/* Header */}
            <div className="pt-6 px-6 mb-6">
                <h1 className="text-xl font-semibold text-white">Bookings</h1>
                <p className="text-gray-400 text-sm mt-1">See upcoming and past events booked through your event type links.</p>
            </div>

            {/* Filters Navigation */}
            <div className="px-6 flex items-center justify-between mb-6">
                <div className="flex items-center gap-1 bg-[#101010] p-1 rounded-lg">
                    {tabs.map(tab => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={`px-3 py-1.5 text-sm font-medium rounded-md transition-colors ${activeTab === tab.id
                                ? 'bg-[#1C1C1C] text-white'
                                : 'text-gray-500 hover:text-gray-300 hover:bg-[#1C1C1C]/50'
                                }`}
                        >
                            {tab.label}
                        </button>
                    ))}
                </div>
                <div className="flex gap-2">
                    <button className="flex items-center gap-2 px-3 py-1.5 text-sm font-medium text-white border border-[#2C2C2C] rounded-md hover:bg-[#1C1C1C] transition-colors">
                        <Filter size={14} />
                        Filter
                    </button>
                    <button className="flex items-center gap-2 px-3 py-1.5 text-sm font-medium text-white border border-[#2C2C2C] rounded-md hover:bg-[#1C1C1C] transition-colors">
                        Saved filters
                        <span className="text-[10px]">▼</span>
                    </button>
                </div>
            </div>

            {/* Content Area */}
            <div className="flex-1 px-6 pb-12">
                {loading ? (
                    <div className="text-gray-400 text-sm">Loading...</div>
                ) : filteredBookings.length === 0 ? (
                    <div className="border border-[#2C2C2C] border-dashed rounded-lg bg-[#101010] h-[400px] flex flex-col items-center justify-center text-center">
                        <div className="w-16 h-16 rounded-full bg-[#1C1C1C] flex items-center justify-center mb-4">
                            <Calendar size={32} className="text-gray-400" strokeWidth={1.5} />
                        </div>
                        <h3 className="text-white font-semibold text-lg mb-2">No {activeTab} bookings</h3>
                        <p className="text-gray-400 text-sm max-w-sm">
                            You have no {activeTab} bookings. As soon as someone books a time with you it will show up here.
                        </p>
                    </div>
                ) : (
                    <div className="border border-[#2C2C2C] rounded-lg divide-y divide-[#2C2C2C] bg-[#101010] overflow-hidden">
                        {filteredBookings.map(booking => {
                            const start = new Date(booking.startTime)
                            const end = new Date(booking.endTime)

                            return (
                                <div key={booking.id} className="group flex flex-col md:flex-row md:items-center justify-between p-4 hover:bg-[#1C1C1C]/50 transition-colors gap-4">
                                    {/* Left: Date & Time */}
                                    <div className="flex items-start gap-4 min-w-[180px]">
                                        <div className="text-center bg-[#1C1C1C] px-3 py-2 rounded border border-[#2C2C2C]">
                                            <div className="text-xs text-gray-500 uppercase font-medium">{format(start, 'MMM')}</div>
                                            <div className="text-lg font-semibold text-white">{format(start, 'dd')}</div>
                                        </div>
                                        <div>
                                            <div className="text-white font-medium">{format(start, 'EEE, MMMM d')}</div>
                                            <div className="text-sm text-gray-400 flex items-center gap-1.5 mt-0.5">
                                                <Clock size={12} />
                                                {format(start, 'HH:mm')} - {format(end, 'HH:mm')}
                                            </div>
                                        </div>
                                    </div>

                                    {/* Middle: Event Info */}
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center gap-2 mb-1">
                                            <div className="w-2 h-2 rounded-full bg-purple-500"></div>
                                            <h3 className="text-sm font-semibold text-white truncate">{booking.eventType?.title || 'Meeting'}</h3>
                                            <span className="text-xs px-1.5 py-0.5 rounded bg-[#1C1C1C] text-gray-400 border border-[#2C2C2C]">
                                                /{booking.eventType?.slug}
                                            </span>
                                        </div>
                                        <div className="text-sm text-gray-400">
                                            {booking.guestName} <span className="text-gray-600 px-1">•</span> <a href={`mailto:${booking.guestEmail}`} className="hover:text-white hover:underline">{booking.guestEmail}</a>
                                        </div>
                                        {booking.notes && (
                                            <div className="text-xs text-gray-500 mt-1 italic truncate">
                                                "{booking.notes}"
                                            </div>
                                        )}
                                    </div>

                                    {/* Right: Actions */}
                                    <div className="flex items-center gap-2 self-start md:self-center">
                                        <a
                                            href={booking.location || '#'}
                                            className="px-3 py-1.5 text-sm font-medium text-white border border-[#2C2C2C] bg-[#1C1C1C] rounded-md hover:bg-[#2C2C2C] flex items-center gap-2 transition-colors"
                                        >
                                            <Video size={14} />
                                            Join
                                        </a>
                                        <button
                                            onClick={() => handleCancel(booking.id)}
                                            className="p-2 text-gray-400 hover:text-white hover:bg-[#2C2C2C] rounded-md transition-colors border border-[#2C2C2C]"
                                            title="Cancel Booking"
                                        >
                                            <MoreHorizontal size={14} />
                                        </button>
                                    </div>
                                </div>
                            )
                        })}
                    </div>
                )}
            </div>
        </div>
    )
}
