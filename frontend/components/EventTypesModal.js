'use client'

import { useState } from 'react'
import { X, ExternalLink, Link as LinkIcon, MoreHorizontal } from 'lucide-react'

export default function EventTypesModal({ isOpen, onClose, onCreate }) {
    const [title, setTitle] = useState('')
    const [slug, setSlug] = useState('')
    const [description, setDescription] = useState('')
    const [duration, setDuration] = useState(15)
    const [loading, setLoading] = useState(false)

    if (!isOpen) return null

    const handleSubmit = async (e) => {
        e.preventDefault()
        setLoading(true)
        try {
            await onCreate({ title, slug, description, duration: parseInt(duration) })
            onClose()
            // Reset form
            setTitle('')
            setSlug('')
            setDescription('')
            setDuration(15)
        } catch (error) {
            console.error(error)
            alert('Failed to create event type')
        } finally {
            setLoading(false)
        }
    }

    const handleTitleChange = (e) => {
        const val = e.target.value
        setTitle(val)
        // Auto-generate slug if it hasn't been manually edited (simple check)
        if (!slug || slug === title.toLowerCase().replace(/\s+/g, '-')) {
            setSlug(val.toLowerCase().replace(/\s+/g, '-'))
        }
    }

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm">
            <div className="w-full max-w-2xl transform overflow-hidden rounded-xl bg-[#101010] border border-[#2C2C2C] shadow-2xl transition-all">
                <div className="p-6">
                    <div className="mb-6">
                        <h2 className="text-xl font-semibold text-white">Add a new event type</h2>
                        <p className="text-gray-400 text-sm mt-1">Set up event types to offer different types of meetings.</p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        {/* Title */}
                        <div>
                            <label className="block text-sm font-medium text-white mb-2">Title</label>
                            <input
                                type="text"
                                value={title}
                                onChange={handleTitleChange}
                                placeholder="Quick chat"
                                className="w-full bg-[#1C1C1C] border border-[#2C2C2C] rounded-md px-3 py-2 text-white placeholder:text-gray-500 focus:outline-none focus:border-white/20 transition-colors"
                                required
                            />
                        </div>

                        {/* URL */}
                        <div>
                            <label className="block text-sm font-medium text-white mb-2">URL</label>
                            <div className="flex rounded-md shadow-sm">
                                <span className="inline-flex items-center px-3 rounded-l-md border border-r-0 border-[#2C2C2C] bg-[#1C1C1C] text-gray-500 text-sm">
                                    cal.com/siddharth-baleja/
                                </span>
                                <input
                                    type="text"
                                    value={slug}
                                    onChange={(e) => setSlug(e.target.value)}
                                    className="flex-1 min-w-0 block w-full px-3 py-2 rounded-none rounded-r-md bg-[#1C1C1C] border border-[#2C2C2C] text-white placeholder:text-gray-500 focus:outline-none focus:border-white/20 transition-colors sm:text-sm"
                                    required
                                />
                            </div>
                        </div>

                        {/* Description */}
                        <div>
                            <label className="block text-sm font-medium text-white mb-2">Description</label>
                            <textarea
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                rows={3}
                                placeholder="A quick video meeting."
                                className="w-full bg-[#1C1C1C] border border-[#2C2C2C] rounded-md px-3 py-2 text-white placeholder:text-gray-500 focus:outline-none focus:border-white/20 transition-colors"
                            />
                        </div>

                        {/* Duration */}
                        <div>
                            <label className="block text-sm font-medium text-white mb-2">Duration</label>
                            <div className="relative">
                                <input
                                    type="number"
                                    value={duration}
                                    onChange={(e) => setDuration(e.target.value)}
                                    className="w-full bg-[#1C1C1C] border border-[#2C2C2C] rounded-md px-3 py-2 pr-16 text-white placeholder:text-gray-500 focus:outline-none focus:border-white/20 transition-colors"
                                    required
                                    min="1"
                                />
                                <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                                    <span className="text-gray-500 text-sm">minutes</span>
                                </div>
                            </div>
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
