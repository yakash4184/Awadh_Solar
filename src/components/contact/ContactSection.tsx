'use client'

import { Button } from '@/components/ui/Button'
import Link from 'next/link'
import { MapPin, Phone, Mail, Clock, Send } from 'lucide-react'

const contactInfo = [
  {
    icon: MapPin,
    title: 'Visit Us',
    details: ['Over The Top Solar', 'Near District Hospital', 'Mirzapur, Uttar Pradesh 231001'],
    link: { href: 'https://maps.google.com', label: 'Open in Maps' },
  },
  {
    icon: Phone,
    title: 'Call Us',
    details: ['+91 98765 43210', '+91 87654 32109'],
    link: { href: 'tel:+919876543210', label: 'Call Now' },
  },
  {
    icon: Mail,
    title: 'Email Us',
    details: ['info@overthetopsolar.com', 'sales@overthetopsolar.com'],
    link: { href: 'mailto:info@overthetopsolar.com', label: 'Send Email' },
  },
  {
    icon: Clock,
    title: 'Business Hours',
    details: ['Mon - Sat: 9:00 AM - 7:00 PM', 'Sunday: 10:00 AM - 4:00 PM', 'Emergency: 24/7 Support'],
    link: null,
  },
]

export function ContactSection() {
  return (
    <section className="py-20 lg:py-28 bg-navy-900 text-white" aria-labelledby="contact-heading">
      <div className="container-narrow">
        <header className="text-center max-w-3xl mx-auto mb-16">
          <h2 id="contact-heading" className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold leading-tight">
            Get Your Free{' '}
            <span className="gradient-text">Solar Quote</span>
          </h2>
          <p className="mt-4 text-lg text-navy-200 leading-relaxed">
            Ready to start saving? Our experts will design a custom system for your home or business.
            No obligation, just honest advice.
          </p>
        </header>

        <div className="grid lg:grid-cols-[1fr_1.2fr] gap-12 lg:gap-16">
          {/* Contact Info Cards */}
          <div className="space-y-6">
            {contactInfo.map((item, index) => (
              <article
                key={item.title}
                className="group bg-navy-800/50 border border-white/10 rounded-2xl p-6 hover:border-electric-500/30 transition-all duration-300 animate-in"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-electric-500/10 flex items-center justify-center group-hover:bg-electric-500/20 transition-colors duration-300">
                    <item.icon className="w-6 h-6 text-electric-500" aria-hidden="true" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold mb-2">{item.title}</h3>
                    <div className="space-y-1 text-navy-300">
                      {item.details.map((detail, i) => (
                        <p key={i} className="text-sm">{detail}</p>
                      ))}
                    </div>
                    {item.link && (
                      <a
                        href={item.link.href}
                        target={item.link.href.startsWith('http') ? '_blank' : undefined}
                        rel={item.link.href.startsWith('http') ? 'noopener noreferrer' : undefined}
                        className="mt-3 inline-flex items-center gap-1.5 text-sm font-medium text-electric-400 hover:text-electric-300 transition-colors"
                      >
                        {item.link.label} <Send className="w-4 h-4" aria-hidden="true" />
                      </a>
                    )}
                  </div>
                </div>
              </article>
            ))}
          </div>

          {/* Contact Form / CTA */}
          <div className="bg-navy-800/50 border border-white/10 rounded-3xl p-8 lg:p-12">
            <div className="text-center">
              <div className="w-16 h-16 mx-auto mb-6 rounded-2xl bg-electric-500/10 flex items-center justify-center">
                <Send className="w-8 h-8 text-electric-500" aria-hidden="true" />
              </div>
              <h3 className="text-2xl lg:text-3xl font-bold mb-3">Start Your Solar Journey</h3>
              <p className="text-navy-300 mb-8 max-w-md mx-auto leading-relaxed">
                Fill out a quick form and our solar advisor will call you within 2 hours to discuss your needs and provide a free preliminary design.
              </p>
              <Link href="/contact" className="inline-block w-full sm:w-auto">
                <Button size="lg" className="gap-2 px-10 py-4 text-lg w-full sm:w-auto">
                  Get Free Quote <Send className="w-5 h-5" aria-hidden="true" />
                </Button>
              </Link>
              <p className="mt-6 text-sm text-navy-500">
                Or call us directly: <a href="tel:+919876543210" className="text-electric-400 hover:text-electric-300 underline">+91 98765 43210</a>
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}