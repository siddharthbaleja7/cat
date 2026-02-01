'use client'

import { useState, useEffect } from 'react'
import { api } from '@/lib/api'
import { format, addDays } from 'date-fns'

export default function BookingPage({ params }) {
    const [unwrappedParams, setUnwrappedParams] = useState(null)
    const [slug, setSlug] = useState(null)

    useEffect(() => {
        // In Next.js 15+, params is a Promise. We need to unwrap it.
        // Or checking if it's already unwrapped just in case.
        // But based on the guide code it treats it as object, but Next.js recently changed this.
        // The user's package.json says next ^16.1.6
        // Next 16 might require waiting for params.
        // I will assume it is a promise.
        if (params && typeof params.then === 'function') {
            params.then(p => {
                setUnwrappedParams(p)
                setSlug(p.slug)
            })
        } else {
            setUnwrappedParams(params)
            setSlug(params.slug)
        }
    }, [params])

    const [eventType, setEventType] = useState(null)
    const [step, setStep] = useState(1)
    const [selectedDate, setSelectedDate] = useState(null)
    const [slots, setSlots] = useState([])
    const [selectedSlot, setSelectedSlot] = useState(null)
    const [formData, setFormData] = useState({
        guestName: '',
        guestEmail: '',
        guestPhone: '',
        notes: ''
    })

    useEffect(() => {
        if (!slug) return
        async function load() {
            const res = await api.public.getEvent(slug)
            setEventType(res.data)
        }
        load()
    }, [slug])

    const handleDateSelect = async (date) => {
        setSelectedDate(date)
        const dateStr = format(date, 'yyyy-MM-dd')
        const res = await api.public.getSlots(slug, dateStr)
        setSlots(res.slots || [])
        setStep(2)
    }

    const handleBook = async (e) => {
        e.preventDefault()

        const startTime = new Date(selectedDate)
        const [h, m] = selectedSlot.split(':')
        startTime.setHours(parseInt(h), parseInt(m))

        const endTime = new Date(startTime.getTime() + eventType.duration * 60000)

        const res = await api.bookings.create({
            eventTypeId: eventType.id,
            guestName: formData.guestName,
            guestEmail: formData.guestEmail,
            guestPhone: formData.guestPhone,
            startTime: startTime.toISOString(),
            endTime: endTime.toISOString(),
            notes: formData.notes
        })

        if (res.error) {
            alert(res.error)
            return
        }

        alert('Booking confirmed!')
        setStep(1)
    }

    if (!eventType) return <div className="p-8">Loading...</div>

    return (
        <div className="min-h-screen bg-white">
            <div className="max-w-2xl mx-auto py-20 px-4">
                <div className="bg-black text-white p-8 rounded-lg mb-8">
                    <h1 className="text-3xl font-bold">{eventType.title}</h1>
                    <p className="text-gray-300 mt-2">{eventType.description || 'Schedule a meeting'}</p>
                </div>

                {step === 1 && (
                    <div className="card p-8">
                        <h2 className="text-xl font-semibold mb-6">Select a Date</h2>
                        <div className="grid grid-cols-7 gap-2">
                            {[...Array(14)].map((_, i) => {
                                const date = addDays(new Date(), i)
                                return (
                                    <button
                                        key={i}
                                        onClick={() => handleDateSelect(date)}
                                        className="p-4 rounded-lg bg-gray-50 hover:bg-gray-100 text-center"
                                    >
                                        <div className="text-xs text-gray-500">{format(date, 'EEE')}</div>
                                        <div className="font-bold text-lg">{format(date, 'd')}</div>
                                    </button>
                                )
                            })}
                        </div>
                    </div>
                )}

                {step === 2 && (
                    <div className="card p-8">
                        <button onClick={() => setStep(1)} className="text-sm text-gray-500 mb-4">← Back</button>
                        <h2 className="text-xl font-semibold mb-6">Select Time for {format(selectedDate, 'PP')}</h2>

                        <div className="grid grid-cols-3 gap-3 mb-8">
                            {slots.length === 0 ? (
                                <p>No slots available</p>
                            ) : (
                                slots.map(slot => (
                                    <button
                                        key={slot.time}
                                        onClick={() => {
                                            setSelectedSlot(slot.time)
                                            setStep(3)
                                        }}
                                        className="py-3 px-4 rounded border border-gray-200 hover:border-black hover:bg-gray-50 text-center"
                                    >
                                        {slot.time}
                                    </button>
                                ))
                            )}
                        </div>
                    </div>
                )}

                {step === 3 && (
                    <form onSubmit={handleBook} className="card p-8 space-y-4">
                        <button type="button" onClick={() => setStep(2)} className="text-sm text-gray-500 mb-4">← Back</button>
                        <h2 className="text-xl font-semibold">Enter Details</h2>

                        <p className="bg-gray-50 p-4 rounded text-sm mb-6">
                            Booking <strong>{eventType.title}</strong><br />
                            {format(selectedDate, 'PP')} at {selectedSlot}
                        </p>

                        <div>
                            <label className="form-label">Name</label>
                            <input
                                required
                                className="form-input"
                                value={formData.guestName}
                                onChange={e => setFormData({ ...formData, guestName: e.target.value })}
                            />
                        </div>
                        <div>
                            <label className="form-label">Email</label>
                            <input
                                required
                                type="email"
                                className="form-input"
                                value={formData.guestEmail}
                                onChange={e => setFormData({ ...formData, guestEmail: e.target.value })}
                            />
                        </div>
                        <div>
                            <label className="form-label">Phone</label>
                            <input
                                className="form-input"
                                value={formData.guestPhone}
                                onChange={e => setFormData({ ...formData, guestPhone: e.target.value })}
                            />
                        </div>
                        <div>
                            <label className="form-label">Notes</label>
                            <textarea
                                className="form-input"
                                value={formData.notes}
                                onChange={e => setFormData({ ...formData, notes: e.target.value })}
                            />
                        </div>

                        <button type="submit" className="btn btn-primary w-full justify-center">
                            Confirm Booking
                        </button>
                    </form>
                )}
            </div>
        </div>
    )
}
