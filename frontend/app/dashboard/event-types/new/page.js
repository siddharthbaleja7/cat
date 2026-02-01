'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { api } from '@/lib/api'

export default function NewEventType() {
    const router = useRouter()
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        duration: 30,
        slug: '',
        color: '#000000'
    })

    const handleSubmit = async (e) => {
        e.preventDefault()
        try {
            await api.eventTypes.create(formData)
            router.push('/dashboard')
        } catch (error) {
            alert('Error creating event type')
        }
    }

    return (
        <div>
            <div className="sticky top-0 bg-white border-b border-gray-200 px-8 py-6 mb-8">
                <h1 className="text-3xl font-bold">Create Event Type</h1>
                <p className="text-gray-600 mt-2">Add a new meeting type for people to book</p>
            </div>

            <div className="px-8 pb-8">
                <form onSubmit={handleSubmit} className="max-w-2xl card p-8 space-y-6">
                    <div>
                        <label className="form-label">Event Title *</label>
                        <input
                            type="text"
                            required
                            value={formData.title}
                            onChange={(e) => {
                                setFormData({ ...formData, title: e.target.value })
                                if (!formData.slug) {
                                    setFormData(d => ({ ...d, slug: e.target.value.toLowerCase().replace(/\s+/g, '-') }))
                                }
                            }}
                            className="form-input"
                            placeholder="30 Minute Meeting"
                        />
                    </div>

                    <div>
                        <label className="form-label">Description</label>
                        <textarea
                            value={formData.description}
                            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                            className="form-input"
                            placeholder="Describe your meeting"
                            rows="3"
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="form-label">Duration (min) *</label>
                            <input
                                type="number"
                                required
                                value={formData.duration}
                                onChange={(e) => setFormData({ ...formData, duration: parseInt(e.target.value) })}
                                className="form-input"
                                min="15"
                                max="480"
                            />
                        </div>

                        <div>
                            <label className="form-label">URL Slug *</label>
                            <input
                                type="text"
                                required
                                value={formData.slug}
                                onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                                className="form-input"
                                placeholder="30min"
                            />
                        </div>
                    </div>

                    <div>
                        <label className="form-label">Color</label>
                        <input
                            type="color"
                            value={formData.color}
                            onChange={(e) => setFormData({ ...formData, color: e.target.value })}
                            className="w-16 h-10 rounded cursor-pointer"
                        />
                    </div>

                    <div className="flex gap-4">
                        <button type="submit" className="btn btn-primary">
                            Create Event Type
                        </button>
                        <button
                            type="button"
                            onClick={() => router.back()}
                            className="btn btn-secondary"
                        >
                            Cancel
                        </button>
                    </div>
                </form>
            </div>
        </div>
    )
}
