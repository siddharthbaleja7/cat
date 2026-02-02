'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { api } from '@/lib/api'
import { Search, Plus, ExternalLink, Link as LinkIcon, MoreHorizontal, Clock } from 'lucide-react'
import EventTypesModal from '@/components/EventTypesModal'

export default function EventTypesDashboard() {
    const [eventTypes, setEventTypes] = useState([])
    const [loading, setLoading] = useState(true)
    const [isModalOpen, setIsModalOpen] = useState(false)

    useEffect(() => {
        loadData()
    }, [])

    async function loadData() {
        try {
            const res = await api.eventTypes.getAll()
            setEventTypes(res.data || [])
        } catch (error) {
            console.error(error)
        } finally {
            setLoading(false)
        }
    }

    const handleCreate = async (data) => {
        await api.eventTypes.create(data)
        await loadData() // Refresh list
    }

    return (
        <div className="max-w-5xl mx-auto">
            <EventTypesModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onCreate={handleCreate}
            />

            {/* Header Section */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8 pt-6 px-6">
                <div>
                    <h1 className="text-xl font-semibold text-white">Event types</h1>
                    <p className="text-gray-400 text-sm mt-1">Configure different events for people to book on your calendar.</p>
                </div>
                <div className="flex items-center gap-3">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={16} />
                        <input
                            type="text"
                            placeholder="Search"
                            className="bg-transparent border border-[#2C2C2C] text-sm rounded-md pl-9 pr-4 py-1.5 text-white placeholder:text-gray-500 w-full md:w-64 focus:outline-none focus:border-gray-500 transition-colors"
                        />
                    </div>
                    <button
                        onClick={() => setIsModalOpen(true)}
                        className="bg-white text-black text-sm font-medium px-4 py-1.5 rounded-md hover:bg-gray-200 transition-colors flex items-center gap-2"
                    >
                        <Plus size={16} />
                        New
                    </button>
                </div>
            </div>

            {/* Event Types List */}
            <div className="px-6 pb-12">
                {loading ? (
                    <div className="text-gray-400 text-sm">Loading...</div>
                ) : eventTypes.length === 0 ? (
                    <div className="border border-[#2C2C2C] rounded-lg p-12 text-center bg-[#101010]">
                        <div className="w-12 h-12 rounded-full bg-[#1C1C1C] flex items-center justify-center mx-auto mb-4">
                            <LinkIcon size={24} className="text-gray-400" />
                        </div>
                        <h3 className="text-white font-medium mb-2">No event types</h3>
                        <p className="text-gray-400 text-sm mb-6">Create your first event type to get started.</p>
                        <button onClick={() => setIsModalOpen(true)} className="btn btn-primary">
                            Create event type
                        </button>
                    </div>
                ) : (
                    <div className="border border-[#2C2C2C] rounded-lg divide-y divide-[#2C2C2C] bg-[#101010] overflow-hidden">
                        {eventTypes.map(et => (
                            <div key={et.id} className="group flex flex-col md:flex-row md:items-center justify-between p-4 hover:bg-[#1C1C1C]/50 transition-colors gap-4">
                                {/* Left Info */}
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center gap-2 mb-1">
                                        <h3 className="text-sm font-semibold text-white truncate">{et.title}</h3>
                                        <span className="text-xs text-gray-500 font-normal hidden sm:inline-block">/siddharth-baleja/{et.slug}</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <div className="flex items-center gap-1 bg-[#1C1C1C] text-gray-400 px-2 py-0.5 rounded text-xs border border-[#2C2C2C]">
                                            <Clock size={12} />
                                            <span>{et.duration}m</span>
                                        </div>
                                        <span className="text-xs text-gray-500 truncate sm:hidden">/{et.slug}</span>
                                    </div>
                                </div>

                                {/* Right Actions */}
                                <div className="flex items-center gap-4 self-start md:self-center">
                                    <div className="flex items-center gap-2 text-sm text-gray-400 mr-2">
                                        <span className="hidden md:inline">Hidden</span>
                                        <button className="switch" data-state="unchecked">
                                            <span className="switch-thumb" />
                                        </button>
                                    </div>

                                    <div className="flex items-center gap-2 sm:opacity-0 group-hover:opacity-100 transition-opacity">
                                        <a
                                            href={`${window.location.origin}/booking/${et.slug}`}
                                            target="_blank"
                                            className="p-2 text-gray-400 hover:text-white hover:bg-[#2C2C2C] rounded-md transition-colors border border-[#2C2C2C]"
                                            title="Preview"
                                        >
                                            <ExternalLink size={14} />
                                        </a>
                                        <button
                                            onClick={() => {
                                                navigator.clipboard.writeText(`${window.location.origin}/booking/${et.slug}`)
                                                alert('Copied!')
                                            }}
                                            className="p-2 text-gray-400 hover:text-white hover:bg-[#2C2C2C] rounded-md transition-colors border border-[#2C2C2C]"
                                            title="Copy Link"
                                        >
                                            <LinkIcon size={14} />
                                        </button>
                                        <button className="p-2 text-gray-400 hover:text-white hover:bg-[#2C2C2C] rounded-md transition-colors border border-[#2C2C2C]">
                                            <MoreHorizontal size={14} />
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
