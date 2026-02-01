'use client'

import { useState, useEffect } from 'react'
import { api } from '@/lib/api'

const DAYS = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']

export default function Availability() {
    const [eventTypes, setEventTypes] = useState([])
    const [selectedId, setSelectedId] = useState('')
    const [availability, setAvailability] = useState([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        async function load() {
            const res = await api.eventTypes.getAll()
            setEventTypes(res.data || [])
            if (res.data?.length > 0) {
                setSelectedId(res.data[0].id)
            }
            setLoading(false)
        }
        load()
    }, [])

    useEffect(() => {
        if (selectedId) {
            async function load() {
                const res = await api.availability.get(selectedId)
                setAvailability(res.data || [])
            }
            load()
        }
    }, [selectedId])

    const handleSave = async (dayOfWeek, startTime, endTime) => {
        await api.availability.create({
            eventTypeId: selectedId,
            dayOfWeek,
            startTime,
            endTime,
            timezone: 'America/New_York'
        })
    }

    if (loading) return <div className="p-8">Loading...</div>

    return (
        <div>
            <div className="sticky top-0 bg-white border-b border-gray-200 px-8 py-6 mb-8">
                <h1 className="text-3xl font-bold">Availability</h1>
                <p className="text-gray-600 mt-2">Configure your weekly schedule</p>
            </div>

            <div className="px-8 pb-8">
                <select
                    value={selectedId}
                    onChange={(e) => setSelectedId(e.target.value)}
                    className="form-select w-64 mb-8"
                >
                    {eventTypes.map(et => (
                        <option key={et.id} value={et.id}>{et.title}</option>
                    ))}
                </select>

                <div className="card p-8">
                    <h2 className="text-xl font-semibold mb-6">Weekly Schedule</h2>
                    <div className="space-y-4">
                        {DAYS.map((day, idx) => {
                            const av = availability.find(a => a.dayOfWeek === idx)
                            return (
                                <div key={idx} className="flex items-center gap-4">
                                    <span className="w-20 font-medium">{day}</span>
                                    <input
                                        type="time"
                                        defaultValue={av?.startTime || '09:00'}
                                        onChange={(e) => {
                                            const endEl = document.getElementById(`end-${idx}`)
                                            handleSave(idx, e.target.value, endEl.value)
                                        }}
                                        className="form-input w-32"
                                    />
                                    <span>to</span>
                                    <input
                                        id={`end-${idx}`}
                                        type="time"
                                        defaultValue={av?.endTime || '17:00'}
                                        onChange={(e) => {
                                            const startEl = document.getElementById(`start-${idx}`)
                                            if (!startEl) return
                                            handleSave(idx, startEl.value, e.target.value)
                                        }}
                                        className="form-input w-32"
                                    />
                                </div>
                            )
                        })}
                    </div>
                </div>
            </div>
        </div>
    )
}
