'use client'

import { useState, useEffect } from 'react'
import { api } from '@/lib/api'
import {
    format, addMonths, subMonths, startOfMonth, endOfMonth,
    startOfWeek, endOfWeek, eachDayOfInterval, isSameMonth,
    isSameDay, isToday, addDays
} from 'date-fns'
import { Clock, Globe, ChevronLeft, ChevronRight, Video, Calendar as CalendarIcon } from 'lucide-react'

export default function BookingPage({ params }) {
    // Params handling
    const [slug, setSlug] = useState(null)
    useEffect(() => {
        if (params && typeof params.then === 'function') {
            params.then(p => setSlug(p.slug))
        } else {
            setSlug(params.slug)
        }
    }, [params])

    // State
    const [eventType, setEventType] = useState(null)
    const [currentMonth, setCurrentMonth] = useState(new Date())
    const [selectedDate, setSelectedDate] = useState(null)
    const [selectedSlot, setSelectedSlot] = useState(null)
    const [slots, setSlots] = useState([])
    const [loadingSlots, setLoadingSlots] = useState(false)
    const [step, setStep] = useState('date') // 'date' | 'time' | 'form'

    // Form State
    const [formData, setFormData] = useState({
        guestName: '',
        guestEmail: '',
        guestPhone: '',
        notes: ''
    })

    // Load Event Type
    useEffect(() => {
        if (!slug) return
        async function load() {
            try {
                const res = await api.public.getEvent(slug)
                setEventType(res.data)
            } catch (err) {
                console.error(err)
            }
        }
        load()
    }, [slug])

    // Load Slots when date selected
    useEffect(() => {
        if (!selectedDate || !slug) return

        async function fetchSlots() {
            setLoadingSlots(true)
            try {
                const dateStr = format(selectedDate, 'yyyy-MM-dd')
                const res = await api.public.getSlots(slug, dateStr)
                setSlots(res.slots || [])
            } catch (err) {
                console.error(err)
            } finally {
                setLoadingSlots(false)
            }
        }
        fetchSlots()
    }, [selectedDate, slug])

    // Calendar Helpers
    const nextMonth = () => setCurrentMonth(addMonths(currentMonth, 1))
    const prevMonth = () => setCurrentMonth(subMonths(currentMonth, 1))

    const renderCalendarDays = () => {
        const monthStart = startOfMonth(currentMonth)
        const monthEnd = endOfMonth(monthStart)
        const startDate = startOfWeek(monthStart)
        const endDate = endOfWeek(monthEnd)

        const dateFormat = "d"
        const rows = []
        let days = []
        let day = startDate
        let formattedDate = ""

        const dayDays = eachDayOfInterval({
            start: startDate,
            end: endDate
        })

        return (
            <div className="grid grid-cols-7 gap-1 text-center">
                {['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'].map(d => (
                    <div key={d} className="text-[11px] font-medium text-gray-500 py-2 tracking-wider">
                        {d}
                    </div>
                ))}
                {dayDays.map((date, i) => {
                    const isSelected = selectedDate && isSameDay(date, selectedDate)
                    const isCurrentMonth = isSameMonth(date, monthStart)

                    return (
                        <button
                            key={i}
                            onClick={() => {
                                setSelectedDate(date)
                                setStep('date') // Stay on date view but show slots column
                                setSelectedSlot(null)
                            }}
                            disabled={!isCurrentMonth}
                            className={`
                                h-10 w-full rounded-md flex items-center justify-center text-sm font-medium transition-colors
                                ${!isCurrentMonth ? 'text-gray-700 cursor-default' : 'text-gray-300 hover:bg-[#2C2C2C] hover:text-white'}
                                ${isSelected ? 'bg-white text-black hover:bg-white hover:text-black font-bold' : ''}
                                ${isToday(date) && !isSelected ? 'text-white font-bold' : ''} 
                            `}
                        >
                            {format(date, dateFormat)}
                            {isToday(date) && !isSelected && (
                                <div className="absolute mb-[-18px] w-1 h-1 rounded-full bg-white"></div>
                            )}
                        </button>
                    )
                })}
            </div>
        )
    }

    const handleBook = async (e) => {
        e.preventDefault()
        if (!selectedDate || !selectedSlot) return

        const startTime = new Date(selectedDate)
        const [h, m] = selectedSlot.split(':')
        startTime.setHours(parseInt(h), parseInt(m))

        const endTime = new Date(startTime.getTime() + (eventType?.duration || 15) * 60000)

        // Assuming eventType contains user details or we need to adjust API to support this
        // For public booking, we just need eventTypeId

        try {
            const res = await api.bookings.create({
                eventTypeId: eventType.id,
                guestName: formData.guestName,
                guestEmail: formData.guestEmail,
                guestPhone: formData.guestPhone,
                startTime: startTime.toISOString(),
                endTime: endTime.toISOString(),
                notes: formData.notes
            })

            if (res.error) throw new Error(res.error)
            alert('Booking confirmed!')
            window.location.reload() // Simple reset
        } catch (err) {
            alert(err.message)
        }
    }

    if (!eventType) return <div className="min-h-screen bg-black text-white flex items-center justify-center">Loading...</div>

    // Layout
    return (
        <div className="min-h-screen bg-[#050505] flex items-center justify-center p-4">
            <div className={`
                bg-[#101010] border border-[#2C2C2C] rounded-2xl shadow-2xl overflow-hidden flex flex-col md:flex-row
                max-w-5xl w-full transition-all duration-300
                ${step === 'form' ? 'max-w-2xl' : selectedDate ? 'max-w-5xl' : 'max-w-3xl'}
            `}>

                {/* Left Column: Event Info */}
                {step !== 'form' && (
                    <div className="w-full md:w-1/3 p-6 border-b md:border-b-0 md:border-r border-[#2C2C2C] flex flex-col">
                        <div className="mb-4">
                            <div className="w-12 h-12 rounded-full bg-[#1C1C1C] text-white flex items-center justify-center text-lg font-bold border border-[#2C2C2C] mb-4">
                                {eventType.title.charAt(0)}
                            </div>
                            <span className="text-gray-400 font-medium text-sm">Siddharth Baleja</span>
                            <h1 className="text-2xl font-bold text-white mt-1 mb-4">{eventType.title}</h1>
                        </div>

                        <div className="space-y-3 text-gray-400 text-sm">
                            <div className="flex items-center gap-3">
                                <Clock size={16} />
                                <span>{eventType.duration}m</span>
                            </div>
                            <div className="flex items-center gap-3">
                                <Video size={16} />
                                <span>Cal Video</span>
                            </div>
                            <div className="flex items-center gap-3">
                                <Globe size={16} />
                                <span>Asia/Kolkata</span>
                            </div>
                        </div>

                        <div className="mt-8 text-gray-400 text-sm leading-relaxed">
                            {eventType.description || 'Schedule a meeting to discuss your requirements.'}
                        </div>

                        <div className="flex-1"></div>

                        <div className="mt-8 flex items-center justify-center">
                            <span className="text-xs font-semibold text-white">Cal.com</span>
                        </div>
                    </div>
                )}

                {/* Middle Column: Calendar */}
                {step !== 'form' && (
                    <div className={`
                        p-6 flex-1 flex flex-col items-center border-b md:border-b-0 border-[#2C2C2C]
                        ${selectedDate ? 'md:border-r' : ''}
                    `}>
                        <h2 className="text-lg font-semibold text-white mb-6 w-full text-left md:text-center mt-2">
                            Select a Date
                        </h2>

                        <div className="w-full max-w-sm">
                            <div className="flex items-center justify-between mb-6">
                                <span className="text-sm font-medium text-white">
                                    {format(currentMonth, 'MMMM yyyy')}
                                </span>
                                <div className="flex gap-2">
                                    <button onClick={prevMonth} className="p-2 hover:bg-[#1C1C1C] rounded-md text-gray-400 hover:text-white transition-colors">
                                        <ChevronLeft size={16} />
                                    </button>
                                    <button onClick={nextMonth} className="p-2 hover:bg-[#1C1C1C] rounded-md text-gray-400 hover:text-white transition-colors">
                                        <ChevronRight size={16} />
                                    </button>
                                </div>
                            </div>

                            {renderCalendarDays()}
                        </div>
                    </div>
                )}

                {/* Right Column: Time Slots */}
                {selectedDate && step !== 'form' && (
                    <div className="w-full md:w-[280px] p-6 flex flex-col h-[500px] overflow-hidden animate-in slide-in-from-left-4 fade-in duration-300">
                        <h2 className="text-sm font-semibold text-gray-400 mb-6 uppercase tracking-wider">
                            {format(selectedDate, 'EEEE d')}
                        </h2>

                        <div className="flex-1 overflow-y-auto space-y-2 pr-2 custom-scrollbar">
                            {loadingSlots ? (
                                <div className="text-center text-gray-500 text-sm py-8">Loading...</div>
                            ) : slots.length === 0 ? (
                                <div className="text-center text-gray-500 text-sm py-8">No slots available</div>
                            ) : (
                                slots.map((slot) => (
                                    <div key={slot.time} className="flex gap-2 group">
                                        <button
                                            onClick={() => {
                                                setSelectedSlot(slot.time)
                                                // If we want immediate modal/form slide-over, we can setStep('form') here
                                                // Or keep it expandable like Cal.com's new UI (screenshot 1 shows simple list)
                                                // Let's implement the expansion logic:
                                            }}
                                            className={`
                                                flex-1 py-2.5 px-4 rounded-md text-sm font-medium border transition-all duration-200
                                                ${selectedSlot === slot.time
                                                    ? 'w-1/2 bg-[#1C1C1C] border-white text-white'
                                                    : 'w-full bg-[#101010] border-[#2C2C2C] text-white hover:border-gray-500'
                                                }
                                            `}
                                        >
                                            {slot.time}
                                        </button>
                                        {selectedSlot === slot.time && (
                                            <button
                                                onClick={() => setStep('form')}
                                                className="flex-1 bg-white text-black rounded-md font-medium text-sm hover:bg-gray-200 transition-colors"
                                            >
                                                Next
                                            </button>
                                        )}
                                    </div>
                                ))
                            )}
                        </div>
                    </div>
                )}

                {/* Form Step */}
                {step === 'form' && (
                    <div className="w-full flex">
                        {/* Summary Column */}
                        <div className="w-1/3 border-r border-[#2C2C2C] p-6 hidden md:block">
                            <button onClick={() => setStep('date')} className="mb-6 p-2 -ml-2 hover:bg-[#1C1C1C] rounded-full text-gray-400 hover:text-white transition-colors">
                                <ChevronLeft size={20} />
                            </button>
                            <span className="text-gray-400 font-medium text-sm block mb-1">Siddharth Baleja</span>
                            <h2 className="text-xl font-bold text-white mb-6">{eventType.title}</h2>

                            <div className="space-y-4 text-gray-400 text-sm">
                                <div className="flex items-center gap-3 text-white">
                                    <CalendarIcon size={16} className="text-gray-400" />
                                    <span>{format(selectedDate, 'EEEE, MMMM d, yyyy')}</span>
                                </div>
                                <div className="flex items-center gap-3 text-white">
                                    <Clock size={16} className="text-gray-400" />
                                    <span>{selectedSlot} - {selectedSlot && format(new Date(new Date().setHours(...selectedSlot.split(':')) + eventType.duration * 60000), 'HH:mm')}</span>
                                </div>
                                <div className="flex items-center gap-3">
                                    <Video size={16} />
                                    <span>Cal Video</span>
                                </div>
                                <div className="flex items-center gap-3">
                                    <Globe size={16} />
                                    <span>Asia/Kolkata</span>
                                </div>
                            </div>
                        </div>

                        {/* Form Column */}
                        <div className="flex-1 p-8">
                            <div className="md:hidden mb-6">
                                <button onClick={() => setStep('date')} className="text-gray-400 hover:text-white flex items-center gap-2">
                                    <ChevronLeft size={16} /> Back
                                </button>
                            </div>
                            <h2 className="text-xl font-semibold text-white mb-6">Enter Details</h2>
                            <form onSubmit={handleBook} className="space-y-4 max-w-md">
                                <div>
                                    <label className="block text-sm font-medium text-gray-300 mb-1.5">Your Name</label>
                                    <input
                                        required
                                        className="w-full bg-[#1C1C1C] border border-[#2C2C2C] rounded-md px-3 py-2 text-white placeholder:text-gray-600 focus:outline-none focus:border-gray-500 transition-colors"
                                        value={formData.guestName}
                                        onChange={e => setFormData({ ...formData, guestName: e.target.value })}
                                        placeholder="John Doe"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-300 mb-1.5">Email Address</label>
                                    <input
                                        required
                                        type="email"
                                        className="w-full bg-[#1C1C1C] border border-[#2C2C2C] rounded-md px-3 py-2 text-white placeholder:text-gray-600 focus:outline-none focus:border-gray-500 transition-colors"
                                        value={formData.guestEmail}
                                        onChange={e => setFormData({ ...formData, guestEmail: e.target.value })}
                                        placeholder="you@example.com"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-300 mb-1.5">Additional Notes</label>
                                    <textarea
                                        rows={3}
                                        className="w-full bg-[#1C1C1C] border border-[#2C2C2C] rounded-md px-3 py-2 text-white placeholder:text-gray-600 focus:outline-none focus:border-gray-500 transition-colors"
                                        value={formData.notes}
                                        onChange={e => setFormData({ ...formData, notes: e.target.value })}
                                        placeholder="Please share anything that will help prepare for our meeting."
                                    />
                                </div>

                                <div className="pt-4">
                                    <button type="submit" className="w-full bg-white text-black font-semibold py-2.5 rounded-md hover:bg-gray-200 transition-colors">
                                        Confirm Details
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}
