'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { api } from '@/lib/api'

export default function EventTypesDashboard() {
    const [eventTypes, setEventTypes] = useState([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        async function load() {
            const res = await api.eventTypes.getAll()
            setEventTypes(res.data || [])
            setLoading(false)
        }
        load()
    }, [])

    return (
        <div>
            <div className="sticky top-0 bg-white border-b border-gray-200 px-4 md:px-8 py-6 mb-8">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                        <h1 className="text-3xl font-bold">Event Types</h1>
                        <p className="text-gray-600 mt-2">Create and manage your event types</p>
                    </div>
                    <Link href="/dashboard/event-types/new" className="btn btn-primary w-full md:w-auto text-center justify-center">
                        + New Event Type
                    </Link>
                </div>
            </div>

            <div className="px-8 pb-8">
                {loading ? (
                    <div>Loading...</div>
                ) : eventTypes.length === 0 ? (
                    <div className="card p-12 text-center">
                        <p className="text-gray-600 mb-4">No event types yet</p>
                        <Link href="/dashboard/event-types/new" className="btn btn-primary">
                            Create Your First Event
                        </Link>
                    </div>
                ) : (
                    <div className="grid gap-4">
                        {eventTypes.map(et => (
                            <div key={et.id} className="card p-6 hover:shadow-lg hover:border-gray-300 transition-all duration-200 cursor-pointer">
                                <div className="flex items-start justify-between">
                                    <div className="flex-1">
                                        <h3 className="text-lg font-semibold">{et.title}</h3>
                                        {et.description && (
                                            <p className="text-gray-600 text-sm mt-1">{et.description}</p>
                                        )}
                                        <div className="flex gap-4 mt-3 text-sm text-gray-600">
                                            <span>{et.duration} min</span>
                                            <span>📅 cal.com/{et.slug}</span>
                                        </div>
                                    </div>
                                    <div className="flex gap-2">
                                        <button
                                            onClick={(e) => {
                                                e.stopPropagation()
                                                e.preventDefault()
                                                const url = `${window.location.origin}/booking/${et.slug}`
                                                navigator.clipboard.writeText(url)
                                                alert('Link copied!')
                                            }}
                                            className="btn btn-secondary text-sm"
                                        >
                                            Copy Link
                                        </button>
                                        <Link href={`/dashboard/event-types/${et.id}`} className="btn btn-outline text-sm">
                                            Edit
                                        </Link>
                                        <button
                                            onClick={async (e) => {
                                                e.stopPropagation()
                                                e.preventDefault()
                                                if (confirm('Delete?')) {
                                                    await api.eventTypes.delete(et.id)
                                                    setEventTypes(eventTypes.filter(e => e.id !== et.id))
                                                }
                                            }}
                                            className="btn text-sm text-red-600 hover:bg-red-50"
                                        >
                                            Delete
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    )
}
