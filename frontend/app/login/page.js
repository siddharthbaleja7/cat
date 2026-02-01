'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { api } from '../../lib/api'

export default function Login() {
    const router = useRouter()
    const [formData, setFormData] = useState({ email: '', password: '' })
    const [error, setError] = useState('')

    const handleSubmit = async (e) => {
        e.preventDefault()
        try {
            const res = await api.auth.login(formData)
            if (res.token) {
                localStorage.setItem('token', res.token)
                localStorage.setItem('user', JSON.stringify(res.user))
                router.push('/dashboard')
            } else {
                const msg = res.errors ? res.errors[0].msg : (res.error || 'Login failed')
                setError(msg)
            }
        } catch (err) {
            setError('Something went wrong')
        }
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
            <div className="bg-white p-8 rounded-xl shadow-lg w-full max-w-md border border-gray-100">
                <h2 className="text-2xl font-bold mb-6 text-center">Login to Cal.com</h2>

                {error && (
                    <div className="bg-red-50 text-red-500 p-3 rounded-lg mb-4 text-sm">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium mb-1">Email</label>
                        <input
                            type="email"
                            required
                            className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent outline-none transition-all"
                            value={formData.email}
                            onChange={(e) => {
                                const val = e.target.value
                                setFormData(prev => ({ ...prev, email: val }))
                            }}
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium mb-1">Password</label>
                        <input
                            type="password"
                            required
                            className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent outline-none transition-all"
                            value={formData.password}
                            onChange={(e) => {
                                const val = e.target.value
                                setFormData(prev => ({ ...prev, password: val }))
                            }}
                        />
                    </div>

                    <button type="submit" className="w-full btn btn-primary py-2.5">
                        Login
                    </button>
                </form>

                <p className="mt-6 text-center text-sm text-gray-600">
                    Don't have an account? {' '}
                    <Link href="/signup" className="text-black font-semibold hover:underline">
                        Sign up
                    </Link>
                </p>
            </div>
        </div>
    )
}
