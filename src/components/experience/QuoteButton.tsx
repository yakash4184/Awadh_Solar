'use client'
import { ArrowUpRight } from 'lucide-react'
import { T } from '@/components/language/LanguageProvider'
export function QuoteButton() { return <button className="primary-cta" onClick={() => window.dispatchEvent(new Event('awadh-enquire'))}><T hi="सोलर कोटेशन पाएं">Get a Solar Quote</T><ArrowUpRight size={19}/></button> }
