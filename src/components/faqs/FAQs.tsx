'use client'

import { useState } from 'react'
import { ChevronDown, ChevronUp, Sun, Zap, Shield, Battery, Calculator, Truck, Clock, Users, ArrowRight } from 'lucide-react'

const faqs = [
  {
    category: 'General',
    icon: Sun,
    questions: [
      {
        question: 'How much does a rooftop solar system cost?',
        answer: 'A typical 3-5 kW residential system costs ₹1.8-3.5 lakhs before subsidy. After PM Surya Ghar subsidy (up to ₹78,000), the net cost reduces significantly. Commercial systems vary by capacity. We provide free, itemized quotes after site survey.',
      },
      {
        question: 'How much can I save on my electricity bill?',
        answer: 'Most homeowners save 70-90% on monthly bills. A 5 kW system generating ~600 units/month can save ₹5,000-6,000/month at current tariffs. Savings depend on your consumption, tariff slab, and system size. Use our solar calculator for a personalized estimate.',
      },
      {
        question: 'What is the PM Surya Ghar subsidy?',
        answer: 'The PM Surya Ghar: Muft Bijli Yojana provides up to ₹78,000 subsidy for residential rooftop solar (up to 3 kW: ₹30,000/kW; 3-10 kW: ₹18,000/kW additional). We handle the entire application process for you. Subsidy amounts are subject to government policy changes.',
      },
    ],
  },
  {
    category: 'Technical',
    icon: Zap,
    questions: [
      {
        question: 'How long does installation take?',
        answer: 'Residential systems: 3-5 days. Commercial: 2-4 weeks depending on size. The process includes mounting structure, panel placement, inverter installation, wiring, and commissioning. We coordinate all permits and DISCOM approvals.',
      },
      {
        question: 'Do solar panels work during power cuts?',
        answer: 'Standard grid-tied systems shut down during outages for safety (anti-islanding). For backup power, add battery storage with hybrid inverter — this provides seamless UPS-mode switching (<20ms) during grid failures.',
      },
      {
        question: 'What maintenance is required?',
        answer: 'Minimal. Panels need occasional cleaning (dust/leaves) — typically 2-4 times/year. We recommend annual professional inspection (included in AMC). Inverters may need fan/filter cleaning. No moving parts = high reliability.',
      },
      {
        question: 'What happens on cloudy/rainy days?',
        answer: 'Panels still generate 10-25% of rated output in diffuse light. Net metering exports excess on sunny days, imports on cloudy days — you pay only for net consumption. Batteries store surplus for evening/backup use.',
      },
    ],
  },
  {
    category: 'Warranty & Support',
    icon: Shield,
    questions: [
      {
        question: 'What warranties are provided?',
        answer: 'Panels: 25-year performance warranty (80%+ output), 12-15 year product warranty. Inverters: 5-10 years (extendable to 20). Mounting: 10-25 years. Workmanship: 5-10 years. We honor all claims directly.',
      },
      {
        question: 'Is financing/EMI available?',
        answer: 'Yes. We partner with banks and NBFCs for solar loans at 8-11% interest, 5-7 year tenure. Zero down payment options available. Subsidy amount is adjusted in the loan. Commercial projects can avail accelerated depreciation benefits.',
      },
      {
        question: 'What if I move house?',
        answer: 'The system adds property value. You can: (1) Transfer ownership to buyer — they inherit warranties and subsidy benefits, or (2) Relocate the system (cost applies). Most buyers see solar as a premium feature.',
      },
    ],
  },
]

export function FAQs() {
  const [openIndex, setOpenIndex] = useState<number | null>(0)
  const [openCategory, setOpenCategory] = useState<string>('General')

  return (
    <section className="py-20 lg:py-28 bg-white" aria-labelledby="faqs-heading">
      <div className="container-narrow">
        <header className="text-center max-w-3xl mx-auto mb-12">
          <h2 id="faqs-heading" className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold text-navy-900 leading-tight">
            Frequently Asked{' '}
            <span className="gradient-text">Questions</span>
          </h2>
          <p className="mt-4 text-lg text-navy-600 leading-relaxed">
            Everything you need to know before going solar. Can't find your answer? Contact us directly.
          </p>
        </header>

        <div className="grid lg:grid-cols-[280px_1fr] gap-12">
          {/* Category Sidebar */}
          <aside className="lg:sticky lg:top-24 lg:self-start">
            <nav className="bg-navy-50/50 rounded-2xl p-4 space-y-2" aria-label="FAQ categories">
              {faqs.map((category, index) => (
                <button
                  key={category.category}
                  onClick={() => setOpenCategory(category.category)}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-left transition-all duration-300 ${
                    openCategory === category.category
                      ? 'bg-white shadow-md border border-electric-500/20'
                      : 'hover:bg-white/50 hover:border-electric-500/10 border border-transparent'
                  }`}
                  aria-current={openCategory === category.category ? 'true' : 'false'}
                >
                  <div className={`w-10 h-10 rounded-lg flex items-center justify-center transition-colors ${
                    openCategory === category.category
                      ? 'bg-electric-500 text-white'
                      : 'bg-white text-navy-600'
                  }`}>
                    <category.icon className="w-5 h-5" aria-hidden="true" />
                  </div>
                  <span className="font-medium text-navy-900">{category.category}</span>
                </button>
              ))}
            </nav>
          </aside>

          {/* FAQ Content */}
          <div className="space-y-4">
            {faqs.find(c => c.category === openCategory)?.questions.map((faq, index) => (
              <article
                key={faq.question}
                className="bg-white border border-border rounded-2xl overflow-hidden hover:border-electric-500/50 transition-colors duration-300 animate-in"
                style={{ animationDelay: `${index * 50}ms` }}
              >
                <button
                  onClick={() => setOpenIndex(openIndex === index ? null : index)}
                  className="w-full px-6 py-5 flex items-center justify-between gap-4 text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
                  aria-expanded={openIndex === index}
                >
                  <h3 className="font-semibold text-navy-900 pr-4 leading-relaxed">{faq.question}</h3>
                  <div className="flex-shrink-0 w-8 h-8 rounded-lg bg-electric-500/10 flex items-center justify-center transition-all duration-300">
                    {openIndex === index ? (
                      <ChevronUp className="w-5 h-5 text-electric-500" aria-hidden="true" />
                    ) : (
                      <ChevronDown className="w-5 h-5 text-navy-500" aria-hidden="true" />
                    )}
                  </div>
                </button>
                {openIndex === index && (
                  <div className="px-6 pb-6 border-t border-border animate-in" style={{ animationDelay: '50ms' }}>
                    <p className="text-navy-600 leading-relaxed">{faq.answer}</p>
                  </div>
                )}
              </article>
            ))}
          </div>
        </div>

        <div className="text-center mt-12">
          <p className="text-navy-600 mb-4">Still have questions? Our experts are here to help.</p>
          <a href="/contact" className="inline-flex items-center gap-2 px-6 py-3 text-navy-700 font-medium hover:text-electric-500 transition-colors">
            Contact Us <ArrowRight className="w-5 h-5" aria-hidden="true" />
          </a>
        </div>
      </div>
    </section>
  )
}