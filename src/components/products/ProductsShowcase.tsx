'use client'

import { Button } from '@/components/ui/Button'
import Link from 'next/link'
import { ArrowRight, Sun, Battery, Settings, Package } from 'lucide-react'

const productCategories = [
  {
    icon: Sun,
    title: 'Solar Panels',
    slug: 'solar-panels',
    description: 'High-efficiency monocrystalline panels with 25-year performance warranty.',
    specs: ['400W - 550W options', '21-23% efficiency', 'Tier-1 manufacturers'],
    features: ['Anti-reflective glass', 'PID resistant', 'Salt mist certified'],
  },
  {
    icon: Settings,
    title: 'Inverters',
    slug: 'inverters',
    description: 'String and hybrid inverters with smart monitoring and grid-export control.',
    specs: ['3kW - 100kW range', '98%+ efficiency', 'WiFi monitoring'],
    features: ['Zero export option', 'Surge protection', '10-year warranty'],
  },
  {
    icon: Battery,
    title: 'Battery Storage',
    slug: 'battery-storage',
    description: 'Lithium-ion batteries for backup power and maximum self-consumption.',
    specs: ['5kWh - 20kWh modules', '6000+ cycles', 'Modular design'],
    features: ['UPS mode <20ms', 'App monitoring', 'Scalable capacity'],
  },
  {
    icon: Package,
    title: 'Complete Systems',
    slug: 'complete-systems',
    description: 'Turnkey rooftop packages — design, permits, installation, and commissioning.',
    specs: ['3kW - 500kW systems', 'Custom engineering', 'Net metering setup'],
    features: ['Single-point contact', 'Performance guarantee', 'AMC available'],
  },
]

export function ProductsShowcase() {
  return (
    <section className="py-20 lg:py-28 bg-navy-50/50" aria-labelledby="products-heading">
      <div className="container-narrow">
        <header className="text-center max-w-3xl mx-auto mb-16">
          <h2 id="products-heading" className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold text-navy-900 leading-tight">
            Our{' '}
            <span className="gradient-text">Product Range</span>
          </h2>
          <p className="mt-4 text-lg text-navy-600 leading-relaxed">
            Curated selection of premium solar components from globally trusted brands.
            Every product tested for Indian conditions.
          </p>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {productCategories.map((category, index) => (
            <article
              key={category.slug}
              className="group relative bg-white border border-border rounded-2xl overflow-hidden hover:border-electric-500/50 hover:shadow-xl transition-all duration-500 animate-in"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <div className="aspect-[4/3] bg-gradient-to-br from-electric-500/10 to-amber-500/10 relative overflow-hidden">
                <div className="absolute inset-0 flex items-center justify-center">
                  <category.icon className="w-20 h-20 text-electric-500/50 group-hover:text-electric-500 transition-colors duration-500" aria-hidden="true" />
                </div>
                <div className="absolute inset-0 bg-gradient-to-t from-navy-900/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </div>

              <div className="p-6">
                <h3 className="text-xl font-semibold text-navy-900 mb-2">{category.title}</h3>
                <p className="text-navy-600 text-sm leading-relaxed mb-4">{category.description}</p>

                <ul className="space-y-2 mb-4" role="list">
                  {category.specs.map((spec, i) => (
                    <li key={i} className="flex items-center gap-2 text-sm text-navy-700">
                      <span className="w-1.5 h-1.5 rounded-full bg-electric-500 flex-shrink-0" aria-hidden="true" />
                      {spec}
                    </li>
                  ))}
                </ul>

                <Link href={`/products/${category.slug}`} className="block w-full">
                  <Button variant="outline" className="w-full gap-2">
                    View Details <ArrowRight className="w-4 h-4" aria-hidden="true" />
                  </Button>
                </Link>
              </div>
            </article>
          ))}
        </div>

        <div className="text-center mt-12">
          <Link href="/products" className="inline-block">
            <Button size="lg" className="gap-2 px-8 py-3.5">
              View All Products <ArrowRight className="w-5 h-5" aria-hidden="true" />
            </Button>
          </Link>
        </div>
      </div>
    </section>
  )
}