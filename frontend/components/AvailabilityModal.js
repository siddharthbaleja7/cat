'use client'

import { useState } from 'react'

export default function AvailabilityModal({ isOpen, onClose, onCreate }) {
    const [name, setName] = useState('')
    const [loading, setLoading] = useState(false)

    if (!isOpen) return null

    const handleSubmit = async (e) => {
        e.preventDefault()
        setLoading(true)
        try {
            await onCreate({ name })
            onClose()
            setName('')
        } catch (error) {
            console.error(error)
            alert('Failed to create availability schedule')
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm">
            <div className="w-full max-w-md transform overflow-hidden rounded-xl bg-[#101010] border border-[#2C2C2C] shadow-2xl transition-all">
                <div className="p-6">
                    <div className="mb-6">
                        <h2 className="text-xl font-semibold text-white">Add availability schedule</h2>
                        <p className="text-gray-400 text-sm mt-1">Create a new schedule to manage your availability.</p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        {/* Name */}
                        <div>
                            <label className="block text-sm font-medium text-white mb-2">Name</label>
                            <input
                                type="text"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                placeholder="Working Hours"
                                className="w-full bg-[#1C1C1C] border border-[#2C2C2C] rounded-md px-3 py-2 text-white placeholder:text-gray-500 focus:outline-none focus:border-white/20 transition-colors"
                                required
                            />
                        </div>

                        {/* Footer Buttons */}
                        <div className="flex justify-end gap-3 mt-8 pt-4 border-t border-[#2C2C2C]">
                            <button
                                type="button"
                                onClick={onClose}
                                className="px-4 py-2 text-sm font-medium text-gray-300 hover:text-white transition-colors"
                            >
                                Close
                            </button>
                            <button
                                type="submit"
                                disabled={loading}
                                className="px-4 py-2 bg-white text-black text-sm font-medium rounded-md hover:bg-gray-200 transition-colors disabled:opacity-50"
                            >
                                {loading ? 'Saving...' : 'Continue'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    )
}
