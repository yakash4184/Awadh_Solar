'use client'

import { CheckCircle, Sun, Zap, Shield, Leaf, Truck, Users, Clock } from 'lucide-react'

const benefits = [
  {
    icon: Sun,
    title: 'Reduce Electricity Bills',
    description: 'Save up to 90% on monthly electricity bills with a properly sized solar system.',
    highlight: 'Up to 90% savings',
  },
  {
    icon: Zap,
    title: 'Energy Independence',
    description: 'Generate your own clean power and reduce dependence on the grid and rising tariffs.',
    highlight: 'Self-reliant power',
  },
  {
    icon: Shield,
    title: '25+ Year Warranty',
    description: 'Industry-leading warranties on panels, inverters, and workmanship for complete peace of mind.',
    highlight: 'Long-term protection',
  },
  {
    icon: Leaf,
    title: 'Eco-Friendly Impact',
    description: 'Each kW of solar prevents ~1.5 tons of CO₂ annually. Equivalent to planting 40+ trees.',
    highlight: 'Green footprint',
  },
  {
    icon: Truck,
    title: 'Free Site Survey',
    description: 'Our experts visit within 48 hours to assess your roof, shading, and optimal system design.',
    highlight: 'No obligation',
  },
  {
    icon: Users,
    title: '2,000+ Installations',
    description: 'Trusted by homeowners and businesses across Uttar Pradesh and NCR since 2015.',
    highlight: 'Proven track record',
  },
  {
    icon: Clock,
    title: 'Fast Installation',
    description: 'Typical residential systems installed in 3-5 days. Commercial projects scaled accordingly.',
    highlight: 'Quick turnaround',
  },
  {
    icon: CheckCircle,
    title: 'Subsidy Assistance',
    description: 'End-to-end help with PM Surya Ghar subsidy application, paperwork, and approvals.',
    highlight: 'Up to ₹78,000',
  },
]

export function Benefits() {
  return (
    <section className="py-20 lg:py-28 bg-white" aria-labelledby="benefits-heading">
      <div className="container-narrow">
        <header className="text-center max-w-3xl mx-auto mb-16">
          <h2 id="benefits-heading" className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold text-navy-900 leading-tight">
            Why Choose{' '}
            <span className="gradient-text">Solar with Us</span>
          </h2>
          <p className="mt-4 text-lg text-navy-600 leading-relaxed">
            Premium quality, expert installation, and lifetime support — making your switch to solar seamless.
          </p>
        </header>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {benefits.map((benefit, index) => (
            <article
              key={benefit.title}
              className="group relative p-6 bg-white border border-border rounded-2xl hover:border-electric-500/50 hover:shadow-lg transition-all duration-500 animate-in"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <div className="absolute inset-0 bg-gradient-to-br from-electric-500/5 via-transparent to-amber-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-2xl" />
              <div className="relative z-10">
                <div className="w-12 h-12 rounded-xl bg-electric-500/10 flex items-center justify-center mb-4 group-hover:bg-electric-500/20 transition-colors duration-300">
                  <benefit.icon className="w-6 h-6 text-electric-500" aria-hidden="true" />
                </div>
                <h3 className="text-xl font-semibold text-navy-900 mb-2">{benefit.title}</h3>
                <p className="text-navy-600 text-sm leading-relaxed mb-3">{benefit.description}</p>
                <span className="inline-flex items-center gap-1.5 text-xs font-medium text-electric-500">
                  <CheckCircle className="w-3.5 h-3.5" aria-hidden="true" />
                  {benefit.highlight}
                </span>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}
