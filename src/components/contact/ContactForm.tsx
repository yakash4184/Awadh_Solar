'use client'

import { FormEvent, useState } from 'react'
import { ArrowRight } from 'lucide-react'
import { T, useLanguage } from '@/components/language/LanguageProvider'

export function ContactForm({ phone = '89530 69011', brand = 'Awadh Enterprises' }: { phone?: string; brand?: string }) {
  const [message, setMessage] = useState('')
  const { language } = useLanguage()
  function submit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const data = new FormData(e.currentTarget)
    const name = String(data.get('name') ?? '').trim()
    const customerPhone = String(data.get('phone') ?? '').trim()
    const need = String(data.get('need') ?? '').trim()
    if (!name || !/^[6-9]\d{9}$/.test(customerPhone.replace(/\D/g, '').slice(-10)) || !need) {
      setMessage(language === 'hi' ? 'कृपया अपना नाम, 10 अंकों का सही मोबाइल नंबर और सोलर आवश्यकता भरें।' : 'Please enter your name, a valid 10-digit mobile number and your solar requirement.')
      return
    }
    const hindiNeeds: Record<string, string> = {
      'Residential rooftop solar': 'आवासीय रूफटॉप सोलर', 'Commercial solar': 'व्यावसायिक सोलर', 'Solar panels': 'सोलर पैनल',
      'Inverter or battery': 'इन्वर्टर या बैटरी', 'Maintenance and support': 'रखरखाव और सहायता', Other: 'अन्य',
    }
    const text = encodeURIComponent(language === 'hi'
      ? `नमस्ते ${brand}, मेरा नाम ${name} है। मेरा मोबाइल नंबर ${customerPhone} है। मैं ${hindiNeeds[need] ?? need} के बारे में पूछताछ कर रहा/रही हूं।`
      : `Hello ${brand}, I’m ${name}. My mobile number is ${customerPhone}. I’m enquiring about: ${need}.`)
    setMessage(language === 'hi' ? 'आपकी पूछताछ के साथ व्हाट्सऐप खुल रहा है। अनुरोध पूरा करने के लिए संदेश भेजें।' : 'Opening WhatsApp with your enquiry. Please send the message to complete your request.')
    const digits = phone.replace(/\D/g, '')
    const whatsappNumber = digits.startsWith('91') && digits.length === 12 ? digits : `91${digits}`
    window.open(`https://wa.me/${whatsappNumber}?text=${text}`, '_blank', 'noopener,noreferrer')
  }
  return <form className="contact-form" onSubmit={submit}>
    <label><T>Your name</T><input name="name" autoComplete="name" placeholder={language === 'hi' ? 'अपना नाम लिखें' : 'Enter your name'} required /></label>
    <label><T>Mobile number</T><input name="phone" autoComplete="tel" inputMode="tel" placeholder={language === 'hi' ? '10 अंकों का मोबाइल नंबर' : '10-digit mobile number'} required /></label>
    <label><T>What do you need?</T><select name="need" defaultValue="" required><option value="" disabled><T>Select a requirement</T></option><option value="Residential rooftop solar"><T>Residential rooftop solar</T></option><option value="Commercial solar"><T>Commercial solar</T></option><option value="Solar panels"><T>Solar panels</T></option><option value="Inverter or battery"><T>Inverter or battery</T></option><option value="Maintenance and support"><T>Maintenance and support</T></option><option value="Other"><T>Other</T></option></select></label>
    <button className="primary-cta" type="submit"><T>Continue on WhatsApp</T> <ArrowRight size={17} /></button>
    {message && <p className="form-message" role="status">{message}</p>}
    <small>{language === 'hi' ? 'व्हाट्सऐप में संदेश का ड्राफ्ट खुलेगा। आपका अनुरोध तभी भेजा जाएगा जब आप संदेश भेजेंगे।' : 'WhatsApp opens with a draft message. Your request is sent only when you choose to send it.'}</small>
  </form>
}
