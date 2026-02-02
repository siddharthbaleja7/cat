'use client'

import { useState, useEffect } from 'react'
import { Plus, Clock, MoreHorizontal, Globe, Trash2 } from 'lucide-react'
import { api } from '@/lib/api'
import AvailabilityModal from '@/components/AvailabilityModal'

export default function Availability() {
    const [schedules, setSchedules] = useState([])
    const [loading, setLoading] = useState(true)
    const [isModalOpen, setIsModalOpen] = useState(false)

    useEffect(() => {
        loadSchedules()
    }, [])

    async function loadSchedules() {
        try {
            const res = await api.availability.getAll()
            setSchedules(res.data || [])
        } catch (error) {
            console.error(error)
        } finally {
            setLoading(false)
        }
    }

    const handleCreate = async (data) => {
        await api.availability.create(data)
        loadSchedules()
    }

    const handleDelete = async (id) => {
        if (!confirm('Are you sure you want to delete this schedule?')) return
        try {
            await api.availability.delete(id)
            loadSchedules()
        } catch (error) {
            console.error(error)
            alert('Failed to delete')
        }
    }

    return (
        <div className="max-w-5xl mx-auto h-full flex flex-col">
            <AvailabilityModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onCreate={handleCreate}
            />

            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8 pt-6 px-6">
                <div>
                    <h1 className="text-xl font-semibold text-white">Availability</h1>
                    <p className="text-gray-400 text-sm mt-1">Configure times when you are available for bookings.</p>
                </div>
                <div className="flex items-center gap-3">
                    <button
                        onClick={() => setIsModalOpen(true)}
                        className="bg-white text-black text-sm font-medium px-4 py-1.5 rounded-md hover:bg-gray-200 transition-colors flex items-center gap-2"
                    >
                        <Plus size={16} />
                        New
                    </button>
                </div>
            </div>

            {/* Content Area */}
            <div className="flex-1 px-6 pb-12">
                {loading ? (
                    <div className="text-gray-400 text-sm">Loading...</div>
                ) : schedules.length === 0 ? (
                    <div className="border border-[#2C2C2C] border-dashed rounded-lg bg-[#101010] h-[400px] flex flex-col items-center justify-center text-center">
                        <div className="w-16 h-16 rounded-full bg-[#1C1C1C] flex items-center justify-center mb-4">
                            <Clock size={32} className="text-gray-400" strokeWidth={1.5} />
                        </div>
                        <h3 className="text-white font-semibold text-lg mb-2">Create an availability schedule</h3>
                        <p className="text-gray-400 text-sm max-w-sm mb-6">
                            Creating availability schedules allows you to manage availability across event types.
                        </p>
                        <button
                            onClick={() => setIsModalOpen(true)}
                            className="bg-white text-black text-sm font-medium px-4 py-2 rounded-md hover:bg-gray-200 transition-colors flex items-center gap-2"
                        >
                            <Plus size={16} />
                            New
                        </button>
                    </div>
                ) : (
                    <div className="border border-[#2C2C2C] rounded-lg divide-y divide-[#2C2C2C] bg-[#101010] overflow-hidden">
                        {schedules.map(schedule => (
                            <div key={schedule.id} className="group flex items-center justify-between p-4 hover:bg-[#1C1C1C]/50 transition-colors">
                                <div className="flex flex-col gap-1">
                                    <div className="flex items-center gap-2">
                                        <h3 className="text-sm font-semibold text-white">{schedule.name}</h3>
                                        {schedule.isDefault && (
                                            <span className="text-[10px] font-medium bg-green-900/40 text-green-400 px-1.5 py-0.5 rounded border border-green-900">
                                                Default
                                            </span>
                                        )}
                                    </div>
                                    <div className="flex items-center gap-4 text-xs text-gray-400">
                                        <div className="flex items-center gap-1.5">
                                            <Globe size={12} />
                                            Asia/Kolkata
                                        </div>
                                    </div>
                                </div>

                                <div className="flex items-center gap-2">
                                    <button
                                        onClick={() => handleDelete(schedule.id)}
                                        className="p-2 text-gray-400 hover:text-red-400 hover:bg-[#2C2C2C] rounded-md transition-colors"
                                        title="Delete Schedule"
                                    >
                                        <Trash2 size={16} />
                                    </button>
                                    <button className="p-2 text-gray-400 hover:text-white hover:bg-[#2C2C2C] rounded-md transition-colors">
                                        <MoreHorizontal size={16} />
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    )
}
