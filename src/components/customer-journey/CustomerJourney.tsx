'use client'

import { Button } from '@/components/ui/Button'
import Link from 'next/link'
import {
  Phone,
  Calendar,
  Truck,
  Wrench,
  CheckCircle,
  Sparkles,
  ArrowRight,
} from 'lucide-react'

const journeySteps = [
  {
    step: '01',
    icon: Phone,
    title: 'Free Consultation',
    description: 'Call or enquire online. Our solar advisor understands your needs, explains options, and answers all questions.',
    duration: '15-30 min',
    details: ['Energy usage analysis', 'Roof suitability check', 'Subsidy eligibility'],
  },
  {
    step: '02',
    icon: Calendar,
    title: 'Site Survey & Design',
    description: 'Our engineer visits within 48 hours for detailed measurements, shading analysis, and custom system design.',
    duration: '1-2 hours',
    details: ['3D roof modeling', 'Shading simulation', 'Performance projection'],
  },
  {
    step: '03',
    icon: Truck,
    title: 'Proposal & Approval',
    description: 'Receive detailed proposal with costs, savings, timeline, and subsidy application. Approve to proceed.',
    duration: '2-3 days',
    details: ['Itemized quote', 'ROI calculation', 'Subsidy paperwork'],
  },
  {
    step: '04',
    icon: Wrench,
    title: 'Installation',
    description: 'Certified team installs your system in 3-5 days (residential). Minimal disruption, maximum safety standards.',
    duration: '3-5 days',
    details: ['Mounting structure', 'Panel & inverter install', 'Electrical connection'],
  },
  {
    step: '05',
    icon: CheckCircle,
    title: 'Inspection & Commissioning',
    description: 'DISCOM inspection, net meter installation, and system commissioning. Your solar journey goes live!',
    duration: '7-15 days',
    details: ['Safety certification', 'Net meter setup', 'Monitoring activation'],
  },
  {
    step: '06',
    icon: Sparkles,
    title: 'Lifetime Support',
    description: '25-year performance warranty, annual maintenance visits, remote monitoring, and dedicated support.',
    duration: 'Ongoing',
    details: ['Annual checkups', 'App monitoring', 'Priority support'],
  },
]

export function CustomerJourney() {
  return (
    <section className="py-20 lg:py-28 bg-navy-50/50" aria-labelledby="journey-heading">
      <div className="container-narrow">
        <header className="text-center max-w-3xl mx-auto mb-16">
          <h2 id="journey-heading" className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold text-navy-900 leading-tight">
            Your Solar{' '}
            <span className="gradient-text">Journey</span>
          </h2>
          <p className="mt-4 text-lg text-navy-600 leading-relaxed">
            From first call to 25 years of clean energy — we handle everything so you don't have to.
          </p>
        </header>

        <div className="relative">
          {/* Connecting line */}
          <div className="hidden lg:block absolute left-1/2 top-0 bottom-0 w-0.5 bg-gradient-to-b from-electric-500/30 via-electric-500 to-amber-500/30 -translate-x-1/2" aria-hidden="true" />

          <div className="space-y-12 lg:space-y-16">
            {journeySteps.map((step, index) => (
              <article
                key={step.step}
                className={`relative flex gap-6 animate-in ${index % 2 === 0 ? 'lg:flex-row' : 'lg:flex-row-reverse'}`}
                style={{ animationDelay: `${index * 150}ms` }}
              >
                {/* Step content */}
                <div className={`flex-1 lg:w-5/12 ${index % 2 === 0 ? 'lg:pr-12 text-right' : 'lg:pl-12'}`}>
                  <div className={`relative ${index % 2 === 0 ? 'lg:text-right' : ''}`}>
                    <span className="inline-block font-display font-bold text-4xl lg:text-5xl text-electric-500/20 mb-2">{step.step}</span>
                    <h3 className="text-xl lg:text-2xl font-semibold text-navy-900 mb-3">{step.title}</h3>
                    <p className="text-navy-600 leading-relaxed mb-4">{step.description}</p>
                    <div className="flex flex-wrap gap-2 justify-end lg:justify-end">
                      {step.details.map((detail, i) => (
                        <span
                          key={i}
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium bg-white/80 backdrop-blur border border-border rounded-full text-navy-700"
                        >
                          <CheckCircle className="w-3.5 h-3.5 text-electric-500" aria-hidden="true" />
                          {detail}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Center circle on the line */}
                <div className="hidden lg:block lg:w-12 lg:flex lg:items-center lg:justify-center relative z-10">
                  <div className="relative">
                    <div className="w-4 h-4 bg-electric-500 rounded-full border-4 border-white shadow-lg" aria-hidden="true" />
                    <div className="absolute inset-0 w-4 h-4 bg-electric-500 rounded-full animate-ping opacity-75" aria-hidden="true" />
                  </div>
                </div>

                {/* Icon card */}
                <div className={`flex-1 lg:w-5/12 flex items-center justify-center ${index % 2 === 0 ? 'lg:pl-12' : 'lg:pr-12'}`}>
                  <div className="w-24 h-24 lg:w-32 lg:h-32 rounded-2xl bg-white border border-border flex items-center justify-center shadow-lg relative overflow-hidden group">
                    <div className="absolute inset-0 bg-gradient-to-br from-electric-500/10 to-amber-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                    <step.icon className="w-10 h-10 lg:w-12 lg:h-12 text-electric-500 relative z-10" aria-hidden="true" />
                    <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-electric-500 to-amber-500 transform scale-x-0 group-hover:scale-x-100 origin-left transition-transform duration-500" aria-hidden="true" />
                  </div>
                </div>
              </article>
            ))}
          </div>

          {/* Mobile connecting dots */}
          <div className="lg:hidden flex flex-col items-center gap-4 mt-8">
            {journeySteps.map((_, index) => (
              <div key={index} className="w-3 h-3 bg-electric-500 rounded-full" aria-hidden="true" />
            ))}
          </div>
        </div>

        <div className="text-center mt-16">
          <Link href="/contact" className="inline-block">
            <Button size="lg" className="gap-2 px-8 py-3.5">
              Start Your Journey <ArrowRight className="w-5 h-5" aria-hidden="true" />
            </Button>
          </Link>
        </div>
      </div>
    </section>
  )
}