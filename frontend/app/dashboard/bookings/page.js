'use client'

import { useState, useEffect } from 'react'
import { api } from '@/lib/api'

export default function BookingsDashboard() {
    const [bookings, setBookings] = useState([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        async function load() {
            const res = await api.bookings.getAll()
            setBookings(res.data || [])
            setLoading(false)
        }
        load()
    }, [])

    const upcomingBookings = bookings.filter(b => new Date(b.startTime) > new Date() && b.status === 'confirmed')
    const pastBookings = bookings.filter(b => new Date(b.startTime) <= new Date() && b.status === 'confirmed')

    return (
        <div>
            <div className="sticky top-0 bg-white border-b border-gray-200 px-8 py-6 mb-8">
                <h1 className="text-3xl font-bold">Bookings</h1>
                <p className="text-gray-600 mt-2">See upcoming and past events</p>
            </div>

            <div className="px-8 pb-8">
                {loading ? (
                    <div>Loading...</div>
                ) : (
                    <>
                        <div className="mb-8">
                            <h2 className="text-xl font-semibold mb-4">Upcoming</h2>
                            {upcomingBookings.length === 0 ? (
                                <p className="text-gray-600">No upcoming bookings</p>
                            ) : (
                                <div className="space-y-4">
                                    {upcomingBookings.map(booking => (
                                        <div key={booking.id} className="card p-6 hover:shadow-lg hover:border-gray-300 transition-all duration-200">
                                            <div className="flex items-start justify-between">
                                                <div>
                                                    <h3 className="font-semibold">{booking.guestName}</h3>
                                                    <p className="text-sm text-gray-600">{booking.guestEmail}</p>
                                                    <p className="text-sm mt-2">
                                                        {new Date(booking.startTime).toLocaleString()}
                                                    </p>
                                                </div>
                                                <button
                                                    onClick={async () => {
                                                        await api.bookings.cancel(booking.id)
                                                        setBookings(bookings.filter(b => b.id !== booking.id))
                                                    }}
                                                    className="btn text-sm text-red-600 hover:bg-red-50"
                                                >
                                                    Cancel
                                                </button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>

                        <div>
                            <h2 className="text-xl font-semibold mb-4">Past</h2>
                            {pastBookings.length === 0 ? (
                                <p className="text-gray-600">No past bookings</p>
                            ) : (
                                <div className="space-y-4">
                                    {pastBookings.map(booking => (
                                        <div key={booking.id} className="card p-6 opacity-75">
                                            <h3 className="font-semibold">{booking.guestName}</h3>
                                            <p className="text-sm text-gray-600">{booking.guestEmail}</p>
                                            <p className="text-sm mt-2">
                                                {new Date(booking.startTime).toLocaleString()}
                                            </p>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </>
                )}
            </div>
        </div>
    )
}
