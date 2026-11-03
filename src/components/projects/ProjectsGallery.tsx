'use client'

import { Button } from '@/components/ui/Button'
import Link from 'next/link'
import { ArrowRight, MapPin, Sun, Building, Home, Zap } from 'lucide-react'

const projects = [
  {
    id: 1,
    title: 'Sharma Residence',
    location: 'Mirzapur, UP',
    type: 'Residential',
    capacity: '5 kW',
    annualSavings: '₹65,000',
    image: '/images/projects/sharma-residence.jpg',
    icon: Home,
  },
  {
    id: 2,
    title: 'Greenfield Industries',
    location: 'Varanasi, UP',
    type: 'Commercial',
    capacity: '50 kW',
    annualSavings: '₹6,20,000',
    image: '/images/projects/greenfield-industries.jpg',
    icon: Building,
  },
  {
    id: 3,
    title: 'Verma Villa',
    location: 'Prayagraj, UP',
    type: 'Residential',
    capacity: '8 kW',
    annualSavings: '₹1,04,000',
    image: '/images/projects/verma-villa.jpg',
    icon: Home,
  },
  {
    id: 4,
    title: 'Surya Mall',
    location: 'Mirzapur, UP',
    type: 'Commercial',
    capacity: '120 kW',
    annualSavings: '₹14,80,000',
    image: '/images/projects/surya-mall.jpg',
    icon: Building,
  },
  {
    id: 5,
    title: 'Gupta Farmhouse',
    location: 'Chunar, UP',
    type: 'Residential',
    capacity: '10 kW',
    annualSavings: '₹1,30,000',
    image: '/images/projects/gupta-farmhouse.jpg',
    icon: Home,
  },
  {
    id: 6,
    title: 'Tech Park Phase 1',
    location: 'Noida, UP',
    type: 'Industrial',
    capacity: '200 kW',
    annualSavings: '₹24,60,000',
    image: '/images/projects/tech-park.jpg',
    icon: Zap,
  },
]

const typeStyles = {
  Residential: 'bg-green-500/10 text-green-700 border-green-500/20',
  Commercial: 'bg-blue-500/10 text-blue-700 border-blue-500/20',
  Industrial: 'bg-amber-500/10 text-amber-700 border-amber-500/20',
}

export function ProjectsGallery() {
  return (
    <section className="py-20 lg:py-28 bg-white" aria-labelledby="projects-heading">
      <div className="container-narrow">
        <header className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-12">
          <div>
            <h2 id="projects-heading" className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold text-navy-900 leading-tight">
              Completed{' '}
              <span className="gradient-text">Installations</span>
            </h2>
            <p className="mt-2 text-lg text-navy-600">Real projects, real savings, real customers.</p>
          </div>
          <Link href="/projects" className="inline-block">
            <Button variant="outline" size="lg" className="gap-2">
              View All Projects <ArrowRight className="w-5 h-5" aria-hidden="true" />
            </Button>
          </Link>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map((project, index) => (
            <article
              key={project.id}
              className="group relative bg-white border border-border rounded-2xl overflow-hidden hover:border-electric-500/50 hover:shadow-xl transition-all duration-500 animate-in"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <div className="aspect-[4/3] relative overflow-hidden bg-gradient-to-br from-navy-500/10 to-amber-500/10">
                {/* Placeholder image - replace with actual images */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <project.icon className="w-16 h-16 text-electric-500/30" aria-hidden="true" />
                </div>
                <div className="absolute inset-0 bg-gradient-to-t from-navy-900/90 via-navy-900/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                {/* Project type badge */}
                <div className="absolute top-4 left-4">
                  <span className={`px-3 py-1 text-xs font-semibold rounded-full border ${typeStyles[project.type as keyof typeof typeStyles] || 'bg-gray-500/10 text-gray-700 border-gray-500/20'}`}>
                    {project.type}
                  </span>
                </div>

                {/* Quick stats overlay */}
                <div className="absolute bottom-4 left-4 right-4 translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                  <div className="bg-white/95 backdrop-blur-lg rounded-xl p-4 shadow-lg">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-xs text-navy-500 uppercase tracking-wider">Capacity</p>
                        <p className="font-semibold text-navy-900">{project.capacity}</p>
                      </div>
                      <div>
                        <p className="text-xs text-navy-500 uppercase tracking-wider">Annual Savings</p>
                        <p className="font-semibold text-electric-500">{project.annualSavings}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="p-6">
                <h3 className="text-xl font-semibold text-navy-900 mb-1">{project.title}</h3>
                <div className="flex items-center gap-2 text-sm text-navy-500 mb-4">
                  <MapPin className="w-4 h-4" aria-hidden="true" />
                  <span>{project.location}</span>
                </div>
                <Link href={`/projects/${project.id}`} className="block w-full">
                  <Button variant="outline" className="w-full gap-2">
                    View Project <ArrowRight className="w-4 h-4" aria-hidden="true" />
                  </Button>
                </Link>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}