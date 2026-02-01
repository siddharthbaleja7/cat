'use client'

import Link from 'next/link'
import {
    CalendarDaysIcon,
    ClockIcon,
    VideoCameraIcon,
    CreditCardIcon,
    LinkIcon,
    ShieldCheckIcon,
    LanguageIcon,
    CodeBracketIcon,
    Squares2X2Icon,
    AdjustmentsHorizontalIcon
} from '@heroicons/react/24/outline'

export default function Home() {
    return (
        <div className="min-h-screen bg-white text-black font-sans selection:bg-black selection:text-white">
            {/* Navbar */}
            <nav className="fixed w-full z-50 bg-white/80 backdrop-blur-md border-b border-gray-100">
                <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <div className="text-2xl font-bold tracking-tighter">Cal.com</div>
                        <span className="px-2 py-0.5 rounded-full bg-gray-100 text-[10px] font-bold uppercase tracking-wide text-gray-500 border border-gray-200">
                            Clone Demo
                        </span>
                    </div>

                    <div className="hidden md:flex gap-8 text-sm font-medium text-gray-600">
                        <Link href="#" className="hover:text-black">Solutions</Link>
                        <Link href="#" className="hover:text-black">Enterprise</Link>
                        <Link href="#" className="hover:text-black">Developers</Link>
                        <Link href="#" className="hover:text-black">Resources</Link>
                        <Link href="#" className="hover:text-black">Pricing</Link>
                    </div>

                    <div className="flex gap-4 items-center">
                        <Link href="/login" className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-black">
                            Log in
                        </Link>
                        <Link href="/signup" className="px-5 py-2.5 text-sm font-medium bg-black text-white rounded-full hover:bg-gray-800 transition-all shadow-lg hover:shadow-black/20">
                            Sign up free
                        </Link>
                    </div>
                </div>
            </nav>

            {/* Hero Section */}
            <main className="pt-40 pb-20 px-6">
                <div className="max-w-7xl mx-auto text-center">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-gray-50 border border-gray-200 text-sm font-medium mb-8 text-gray-600">
                        <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
                        v3.0 is now live
                    </div>

                    <h1 className="text-6xl md:text-8xl font-bold tracking-tight text-black mb-8 leading-[1.1]">
                        Scheduling
                        <span className="block text-gray-400">infrastructure</span>
                        <span className="block">for everyone.</span>
                    </h1>

                    <p className="text-xl text-gray-600 max-w-2xl mx-auto mb-12 leading-relaxed">
                        Cal.com is the open source scheduling infrastructure for everyone.
                        From individual usage to enterprise-grade complexity.
                    </p>

                    <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                        <Link
                            href="/signup"
                            className="px-8 py-4 bg-black text-white text-lg font-medium rounded-full hover:bg-gray-900 transition-all shadow-xl hover:shadow-2xl hover:-translate-y-1"
                        >
                            Start for free
                        </Link>
                        <Link
                            href="/booking/30min"
                            className="px-8 py-4 bg-white text-black text-lg font-medium rounded-full border border-gray-200 hover:bg-gray-50 transition-all hover:border-black"
                        >
                            Contact Sales
                        </Link>
                    </div>
                </div>

                {/* How it works */}
                <section className="max-w-7xl mx-auto mt-40">
                    <div className="text-center mb-16">
                        <div className="inline-block px-3 py-1 rounded-full bg-gray-100 text-xs font-semibold uppercase tracking-wider text-gray-600 mb-4">How it works</div>
                        <h2 className="text-4xl md:text-5xl font-bold tracking-tight mb-4">With us, appointment scheduling is easy</h2>
                        <p className="text-xl text-gray-600 max-w-2xl mx-auto">Effortless scheduling for business and individuals.</p>
                    </div>

                    <div className="grid md:grid-cols-3 gap-8">
                        {/* Card 1 */}
                        <div className="bg-gray-50 rounded-3xl p-8 border border-gray-100">
                            <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center mb-6 shadow-sm font-bold text-lg">01</div>
                            <h3 className="text-2xl font-bold mb-3">Connect your calendar</h3>
                            <p className="text-gray-600 mb-8">We'll handle all the cross-referencing, so you don't have to worry about double bookings.</p>
                            <div className="aspect-square bg-white rounded-2xl shadow-sm border border-gray-100 flex items-center justify-center">
                                <CalendarDaysIcon className="w-16 h-16 text-gray-300" />
                            </div>
                        </div>

                        {/* Card 2 */}
                        <div className="bg-gray-50 rounded-3xl p-8 border border-gray-100">
                            <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center mb-6 shadow-sm font-bold text-lg">02</div>
                            <h3 className="text-2xl font-bold mb-3">Set your availability</h3>
                            <p className="text-gray-600 mb-8">Want to block off weekends? Set up any buffers? We make that easy.</p>
                            <div className="aspect-square bg-white rounded-2xl shadow-sm border border-gray-100 flex items-center justify-center">
                                <ClockIcon className="w-16 h-16 text-gray-300" />
                            </div>
                        </div>

                        {/* Card 3 */}
                        <div className="bg-gray-50 rounded-3xl p-8 border border-gray-100">
                            <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center mb-6 shadow-sm font-bold text-lg">03</div>
                            <h3 className="text-2xl font-bold mb-3">Choose how to meet</h3>
                            <p className="text-gray-600 mb-8">It could be a video chat, phone call, or a walk in the park!</p>
                            <div className="aspect-square bg-white rounded-2xl shadow-sm border border-gray-100 flex items-center justify-center">
                                <VideoCameraIcon className="w-16 h-16 text-gray-300" />
                            </div>
                        </div>
                    </div>
                </section>

                {/* Feature Grid */}
                <section className="max-w-7xl mx-auto mt-40">
                    <h2 className="text-4xl md:text-5xl font-bold tracking-tight text-center mb-16">...and so much more!</h2>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                        {[
                            { icon: CreditCardIcon, title: 'Accept payments' },
                            { icon: VideoCameraIcon, title: 'Built-in video conferencing' },
                            { icon: LinkIcon, title: 'Short booking links' },
                            { icon: ShieldCheckIcon, title: 'Privacy first' },
                            { icon: LanguageIcon, title: '65+ languages' },
                            { icon: CodeBracketIcon, title: 'Easy embeds' },
                            { icon: Squares2X2Icon, title: 'All your favorite apps' },
                            { icon: AdjustmentsHorizontalIcon, title: 'Simple customization' },
                        ].map((feat, i) => (
                            <div key={i} className="aspect-square rounded-3xl bg-gray-50 hover:bg-white hover:shadow-xl transition-all duration-300 flex flex-col items-center justify-center p-6 text-center border border-transparent hover:border-gray-100 group">
                                <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center mb-4 shadow-sm group-hover:scale-110 transition-transform">
                                    <feat.icon className="w-8 h-8 text-black" />
                                </div>
                                <h4 className="font-semibold text-sm">{feat.title}</h4>
                            </div>
                        ))}
                    </div>
                </section>

                {/* Testimonials */}
                <section className="max-w-7xl mx-auto mt-40 mb-20">
                    <div className="text-center mb-16">
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white border border-gray-200 text-sm font-medium mb-4 shadow-sm">
                            Wall of love
                        </div>
                        <h2 className="text-4xl md:text-5xl font-bold tracking-tight">See why our users love Cal.com</h2>
                    </div>

                    <div className="grid md:grid-cols-3 gap-6">
                        {[
                            { name: 'Guillermo Rauch', role: '@rauchg', text: 'Coolest domain. Check. Coolest mission. Check. Coolest product. Check.' },
                            { name: 'Peer Richelsen', role: '@peer_rich', text: 'The open source scheduling infrastructure for everyone.' },
                            { name: 'Naval Ravikant', role: '@naval', text: 'Automation is the key to scaling your time and effectiveness.' },
                        ].map((t, i) => (
                            <div key={i} className="bg-gray-50 p-8 rounded-3xl border border-gray-100">
                                <div className="flex items-center gap-4 mb-4">
                                    <div className="w-10 h-10 bg-black rounded-full"></div>
                                    <div>
                                        <div className="font-bold">{t.name}</div>
                                        <div className="text-sm text-gray-500">{t.role}</div>
                                    </div>
                                </div>
                                <p className="text-gray-700 leading-relaxed">"{t.text}"</p>
                            </div>
                        ))}
                    </div>
                </section>
            </main>

            {/* Footer */}
            <footer className="bg-white border-t border-gray-200 py-20 px-6">
                <div className="max-w-7xl mx-auto grid md:grid-cols-5 gap-12">
                    <div className="col-span-2">
                        <div className="text-2xl font-bold mb-6">Cal.com</div>
                        <p className="text-gray-500 max-w-xs mb-8">
                            Our mission is to connect a billion people by 2031 through calendar scheduling.
                        </p>
                        <div className="flex gap-2 text-xs font-mono text-gray-400">
                            <span className="w-2 h-2 rounded-full bg-green-500"></span>
                            All Systems Operational
                        </div>
                    </div>

                    <div>
                        <h4 className="font-bold mb-6">Solutions</h4>
                        <ul className="space-y-4 text-sm text-gray-600">
                            <li><Link href="#" className="hover:text-black">Self-hosted</Link></li>
                            <li><Link href="#" className="hover:text-black">SaaS Hosting</Link></li>
                            <li><Link href="#" className="hover:text-black">Platform</Link></li>
                            <li><Link href="#" className="hover:text-black">SaaS</Link></li>
                        </ul>
                    </div>

                    <div>
                        <h4 className="font-bold mb-6">Resources</h4>
                        <ul className="space-y-4 text-sm text-gray-600">
                            <li><Link href="#" className="hover:text-black">About</Link></li>
                            <li><Link href="#" className="hover:text-black">Docs</Link></li>
                            <li><Link href="#" className="hover:text-black">Blog</Link></li>
                            <li><Link href="#" className="hover:text-black">Changelog</Link></li>
                        </ul>
                    </div>

                    <div>
                        <h4 className="font-bold mb-6">Legal</h4>
                        <ul className="space-y-4 text-sm text-gray-600">
                            <li><Link href="#" className="hover:text-black">Privacy</Link></li>
                            <li><Link href="#" className="hover:text-black">Terms</Link></li>
                            <li><Link href="#" className="hover:text-black">License</Link></li>
                            <li><Link href="#" className="hover:text-black">Security</Link></li>
                        </ul>
                    </div>
                </div>
                <div className="max-w-7xl mx-auto mt-20 pt-8 border-t border-gray-100 flex justify-between text-sm text-gray-500">
                    <div>© 2026 Cal.com, Inc.</div>
                    <div>Designed with ♥️ by Siddharth Baleja</div>
                </div>
            </footer>
        </div>
    )
}
