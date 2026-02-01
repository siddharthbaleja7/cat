'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { api } from '@/lib/api'

export default function EditEventType({ params }) {
    const router = useRouter()
    const [id, setId] = useState(null)
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        duration: 30,
        slug: '',
        color: '#000000'
    })
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        if (params) {
            Promise.resolve(params).then(p => {
                setId(p.id)
            })
        }
    }, [params])

    useEffect(() => {
        if (!id) return

        async function load() {
            try {
                const res = await api.eventTypes.get(id)
                if (res.data) {
                    setFormData({
                        title: res.data.title,
                        description: res.data.description || '',
                        duration: res.data.duration,
                        slug: res.data.slug,
                        color: res.data.color
                    })
                }
            } catch (err) {
                console.error(err)
                alert('Failed to load event type')
                router.push('/dashboard')
            } finally {
                setLoading(false)
            }
        }
        load()
    }, [id, router])

    const handleSubmit = async (e) => {
        e.preventDefault()
        try {
            await api.eventTypes.update(id, formData)
            router.push('/dashboard')
        } catch (error) {
            alert('Error updating event type')
        }
    }

    const handleDelete = async () => {
        if (!confirm('Are you sure you want to delete this event type?')) return
        try {
            await api.eventTypes.delete(id)
            router.push('/dashboard')
        } catch (error) {
            alert('Error deleting event type')
        }
    }

    if (loading) return <div className="p-8">Loading...</div>

    return (
        <div>
            <div className="sticky top-0 bg-white border-b border-gray-200 px-4 md:px-8 py-6 mb-8 flex flex-col md:flex-row md:justify-between md:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-bold">Edit Event Type</h1>
                    <p className="text-gray-600 mt-2">Manage your meeting details</p>
                </div>
                <button
                    onClick={handleDelete}
                    className="btn bg-red-50 text-red-600 hover:bg-red-100 hover:text-red-700 border-red-200 w-full md:w-auto justify-center"
                >
                    Delete Event Type
                </button>
            </div>

            <div className="px-8 pb-8">
                <form onSubmit={handleSubmit} className="max-w-2xl card p-8 space-y-6">
                    <div>
                        <label className="form-label">Event Title *</label>
                        <input
                            type="text"
                            required
                            value={formData.title}
                            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                            className="form-input"
                        />
                    </div>

                    <div>
                        <label className="form-label">Description</label>
                        <textarea
                            value={formData.description}
                            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                            className="form-input"
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
                            Save Changes
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
