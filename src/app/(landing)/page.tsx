// app/page.tsx
'use client'

import { Target, BookOpen, TrendingUp, Award, Users, Smartphone, CheckCircle, Rocket, Pencil, Check, PartyPopper } from 'lucide-react';

export default function LandingPage() {
    const scrollToSection = (id: string) => {
        const element = document.getElementById(id);
        if (element) {
            element.scrollIntoView({ behavior: 'smooth' });
        }
    };

    return (
        <div className="min-h-screen">
            {/* Hero Section */}
            <section id="hero" className="relative overflow-hidden">
                <div className="max-w-7xl mx-auto px-6 py-24 md:py-32">
                    <div className="text-center space-y-8">
                        <div className="space-y-4">
                            <div className="inline-block animate-bounce">
                                <Target className="w-20 h-20 md:w-28 md:h-28 mx-auto text-neutral-800 dark:text-neutral-200" />
                            </div>
                            <h1 className="text-5xl md:text-7xl font-bold bg-gradient-to-r from-neutral-900 via-neutral-700 to-neutral-900 dark:from-neutral-100 dark:via-neutral-300 dark:to-neutral-100 bg-clip-text text-transparent leading-tight">
                                Bangun Kebiasaan<br />yang Bertahan
                            </h1>
                            <p className="text-xl md:text-2xl text-neutral-600 dark:text-neutral-400 max-w-2xl mx-auto">
                                Lacak, tingkatkan, dan capai target harianmu dengan cara yang sederhana dan menyenangkan
                            </p>
                        </div>

                        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                            <a
                                href="/login"
                                className="inline-flex items-center justify-center gap-2 rounded-2xl border-transparent bg-gradient-to-r from-neutral-800 to-neutral-900 dark:from-white dark:to-neutral-100 text-white dark:text-neutral-900 px-8 py-4 text-lg font-medium shadow-xl hover:shadow-2xl transition-all duration-200 active:scale-95 hover:scale-105"
                            >
                                <Rocket className="w-5 h-5" />
                                Mulai Gratis
                            </a>
                            <button
                                onClick={() => scrollToSection('how-it-works')}
                                className="inline-flex items-center justify-center gap-2 rounded-2xl border border-neutral-300/80 dark:border-neutral-700/80 px-8 py-4 text-lg font-medium bg-transparent hover:bg-neutral-100/80 dark:hover:bg-neutral-800/80 transition-all duration-200 active:scale-95"
                            >
                                <BookOpen className="w-5 h-5" />
                                Pelajari Lebih Lanjut
                            </button>
                        </div>

                        {/* Stats */}
                        <div className="grid grid-cols-3 gap-8 max-w-3xl mx-auto pt-12">
                            <div className="space-y-2">
                                <div className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-neutral-900 to-neutral-700 dark:from-neutral-100 dark:to-neutral-300 bg-clip-text text-transparent">
                                    10K+
                                </div>
                                <div className="text-sm text-neutral-600 dark:text-neutral-400">Pengguna Aktif</div>
                            </div>
                            <div className="space-y-2">
                                <div className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-neutral-900 to-neutral-700 dark:from-neutral-100 dark:to-neutral-300 bg-clip-text text-transparent">
                                    85%
                                </div>
                                <div className="text-sm text-neutral-600 dark:text-neutral-400">Tingkat Konsistensi</div>
                            </div>
                            <div className="space-y-2">
                                <div className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-neutral-900 to-neutral-700 dark:from-neutral-100 dark:to-neutral-300 bg-clip-text text-transparent">
                                    50K+
                                </div>
                                <div className="text-sm text-neutral-600 dark:text-neutral-400">Habit Tercapai</div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Decorative elements */}
                <div className="absolute top-20 left-10 w-72 h-72 bg-neutral-300/20 dark:bg-neutral-700/20 rounded-full blur-3xl -z-10"></div>
                <div className="absolute bottom-20 right-10 w-96 h-96 bg-neutral-400/20 dark:bg-neutral-600/20 rounded-full blur-3xl -z-10"></div>
            </section>

            {/* Features Section */}
            <section id="features" className="py-24 bg-white/50 dark:bg-neutral-900/50">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="text-center space-y-4 mb-16">
                        <h2 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-neutral-900 to-neutral-700 dark:from-neutral-100 dark:to-neutral-300 bg-clip-text text-transparent">
                            Fitur Unggulan
                        </h2>
                        <p className="text-lg text-neutral-600 dark:text-neutral-400 max-w-2xl mx-auto">
                            Semua yang kamu butuhkan untuk membangun kebiasaan yang konsisten
                        </p>
                    </div>

                    <div className="grid md:grid-cols-3 gap-8">
                        {[
                            {
                                icon: TrendingUp,
                                title: 'Visualisasi Progress',
                                description: 'Lihat perkembangan kebiasaanmu dalam grafik yang indah dan mudah dipahami'
                            },
                            {
                                icon: Target,
                                title: 'Target Fleksibel',
                                description: 'Atur target harian, mingguan, atau bulanan sesuai kebutuhanmu'
                            },
                            {
                                icon: CheckCircle,
                                title: 'Pengingat Cerdas',
                                description: 'Notifikasi yang membantu tanpa mengganggu aktivitas harianmu'
                            },
                            {
                                icon: Award,
                                title: 'Sistem Reward',
                                description: 'Dapatkan pencapaian dan hadiah saat mencapai milestone tertentu'
                            },
                            {
                                icon: Users,
                                title: 'Komunitas Supportif',
                                description: 'Terhubung dengan teman dan saling mendukung dalam perjalanan habit'
                            },
                            {
                                icon: Smartphone,
                                title: 'Sync Multi-Device',
                                description: 'Akses dari mana saja, datamu selalu tersinkronisasi dengan aman'
                            }
                        ].map((feature, idx) => (
                            <div
                                key={idx}
                                className="group rounded-3xl border border-neutral-200/50 dark:border-neutral-800/50 p-8 bg-white/80 dark:bg-neutral-900/80 backdrop-blur-xl hover:shadow-2xl hover:-translate-y-1 transition-all duration-300"
                            >
                                <feature.icon className="w-12 h-12 mb-4 text-neutral-800 dark:text-neutral-200 group-hover:scale-110 transition-transform duration-300" />
                                <h3 className="text-xl font-bold mb-3 text-neutral-900 dark:text-neutral-100">
                                    {feature.title}
                                </h3>
                                <p className="text-neutral-600 dark:text-neutral-400">
                                    {feature.description}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* How It Works */}
            <section id="how-it-works" className="py-24">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="text-center space-y-4 mb-16">
                        <h2 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-neutral-900 to-neutral-700 dark:from-neutral-100 dark:to-neutral-300 bg-clip-text text-transparent">
                            Cara Kerja
                        </h2>
                        <p className="text-lg text-neutral-600 dark:text-neutral-400 max-w-2xl mx-auto">
                            Tiga langkah sederhana untuk memulai perjalanan habit-mu
                        </p>
                    </div>

                    <div className="grid md:grid-cols-3 gap-12 max-w-5xl mx-auto">
                        {[
                            {
                                step: '01',
                                icon: Pencil,
                                title: 'Tentukan Habit',
                                description: 'Pilih kebiasaan yang ingin kamu bangun dan atur target yang realistis'
                            },
                            {
                                step: '02',
                                icon: Check,
                                title: 'Lacak Setiap Hari',
                                description: 'Tandai habit-mu setiap hari dan lihat streak-mu bertambah'
                            },
                            {
                                step: '03',
                                icon: PartyPopper,
                                title: 'Rayakan Pencapaian',
                                description: 'Nikmati reward dan lihat transformasi dirimu dari waktu ke waktu'
                            }
                        ].map((step, idx) => (
                            <div key={idx} className="text-center space-y-4">
                                <div className="relative">
                                    <div className="text-8xl font-bold text-neutral-200 dark:text-neutral-800 absolute top-0 left-1/2 -translate-x-1/2 -z-10">
                                        {step.step}
                                    </div>
                                    <div className="pt-8">
                                        <step.icon className="w-16 h-16 mx-auto text-neutral-800 dark:text-neutral-200" />
                                    </div>
                                </div>
                                <h3 className="text-2xl font-bold text-neutral-900 dark:text-neutral-100">
                                    {step.title}
                                </h3>
                                <p className="text-neutral-600 dark:text-neutral-400">
                                    {step.description}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Testimonials */}
            <section id="testimonials" className="py-24 bg-white/50 dark:bg-neutral-900/50">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="text-center space-y-4 mb-16">
                        <h2 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-neutral-900 to-neutral-700 dark:from-neutral-100 dark:to-neutral-300 bg-clip-text text-transparent">
                            Apa Kata Mereka
                        </h2>
                        <p className="text-lg text-neutral-600 dark:text-neutral-400 max-w-2xl mx-auto">
                            Ribuan orang telah bertransformasi dengan Habit Tracker
                        </p>
                    </div>

                    <div className="grid md:grid-cols-3 gap-8">
                        {[
                            {
                                name: 'Sarah',
                                role: 'Mahasiswa',
                                text: 'Aplikasi ini benar-benar mengubah hidupku. Sekarang aku bisa konsisten olahraga setiap hari!',
                                rating: 5
                            },
                            {
                                name: 'Budi',
                                role: 'Software Engineer',
                                text: 'Interface-nya sangat intuitif dan clean. Membuat tracking habit jadi menyenangkan.',
                                rating: 5
                            },
                            {
                                name: 'Rina',
                                role: 'Entrepreneur',
                                text: 'Sistem reward-nya sangat memotivasi. Sudah 3 bulan streak dan tidak ingin berhenti!',
                                rating: 5
                            }
                        ].map((testimonial, idx) => (
                            <div
                                key={idx}
                                className="rounded-3xl border border-neutral-200/50 dark:border-neutral-800/50 p-8 bg-white/80 dark:bg-neutral-900/80 backdrop-blur-xl space-y-4"
                            >
                                <div className="flex gap-1">
                                    {Array.from({ length: testimonial.rating }).map((_, i) => (
                                        <Award key={i} className="w-5 h-5 text-neutral-800 dark:text-neutral-200 fill-neutral-800 dark:fill-neutral-200" />
                                    ))}
                                </div>
                                <p className="text-neutral-700 dark:text-neutral-300 text-lg italic">
                                    &quot;{testimonial.text}&quot;
                                </p>
                                <div>
                                    <div className="font-bold text-neutral-900 dark:text-neutral-100">
                                        {testimonial.name}
                                    </div>
                                    <div className="text-sm text-neutral-500 dark:text-neutral-500">
                                        {testimonial.role}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-24">
                <div className="max-w-4xl mx-auto px-6 text-center">
                    <div className="rounded-3xl border border-neutral-200/50 dark:border-neutral-800/50 p-12 md:p-16 bg-gradient-to-br from-white to-neutral-100 dark:from-neutral-900 dark:to-neutral-950 backdrop-blur-xl shadow-2xl space-y-8">
                        <Rocket className="w-20 h-20 mx-auto text-neutral-800 dark:text-neutral-200" />
                        <h2 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-neutral-900 to-neutral-700 dark:from-neutral-100 dark:to-neutral-300 bg-clip-text text-transparent">
                            Siap Memulai Perubahan?
                        </h2>
                        <p className="text-xl text-neutral-600 dark:text-neutral-400">
                            Bergabunglah dengan ribuan orang yang sudah membangun kebiasaan positif
                        </p>
                        <a
                            href="/login"
                            className="inline-flex items-center justify-center gap-2 rounded-2xl border-transparent bg-gradient-to-r from-neutral-800 to-neutral-900 dark:from-white dark:to-neutral-100 text-white dark:text-neutral-900 px-10 py-5 text-xl font-medium shadow-xl hover:shadow-2xl transition-all duration-200 active:scale-95 hover:scale-105"
                        >
                            <Rocket className="w-6 h-6" />
                            Mulai Sekarang - Gratis
                        </a>
                        <p className="text-sm text-neutral-500 dark:text-neutral-500">
                            Tidak perlu kartu kredit • Gratis selamanya
                        </p>
                    </div>
                </div>
            </section>
        </div>
    );
}
