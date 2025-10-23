// config/site.ts
export const siteConfig = {
  name: 'Habit Tracker',
  description: 'Bangun kebiasaan yang bertahan',
  url: 'https://habits.example.com',
  ogImage: 'https://habits.example.com/og.jpg',
  navigation: {
    marketing: [
      { id: 'features', label: 'Fitur' },
      { id: 'how-it-works', label: 'Cara Kerja' },
      { id: 'testimonials', label: 'Testimoni' },
    ],
    dashboard: [
      { href: '/dashboard', label: 'Dashboard', icon: 'LayoutDashboard' },
      { href: '/habits', label: 'Habits', icon: 'Target' },
      { href: '/friends', label: 'Teman', icon: 'Users' },
      { href: '/rewards', label: 'Reward', icon: 'Gift' },
    ],
  },
} as const