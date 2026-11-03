'use client'

import { useState, useEffect, useRef } from 'react'
import {
  X,
  Phone,
  MessageCircle,
  CheckCircle2,
  Zap,
  ShieldCheck,
  ArrowRight,
  Clock,
  Sparkles,
  Building,
  User,
} from 'lucide-react'
import { T, useLanguage } from '@/components/language/LanguageProvider'

const requirements = [
  { en: 'PM Surya Ghar Yojana (Up to ₹78,000 Subsidy)', hi: 'पीएम सूर्य घर मुफ्त बिजली योजना (₹78,000 सब्सिडी)' },
  { en: 'Residential Rooftop Solar (1kW - 10kW)', hi: 'घरेलू रूफटॉप सोलर सिस्टम (1kW - 10kW)' },
  { en: 'Commercial & Industrial Solar (10kW+)', hi: 'व्यावसायिक एवं औद्योगिक सोलर (10kW+)' },
  { en: 'Solar Inverter & Battery Storage', hi: 'सोलर इन्वर्टर एवं लिथियम/ट्यूबलर बैटरी' },
  { en: 'Solar Water Pump / Agricultural', hi: 'सोलर वाटर पंप एवं कृषि समाधान' },
  { en: 'System Maintenance & Repair', hi: 'सोलर सर्विसिंग, रिपेयर एवं मेंटेनेंस' },
]

const billRanges = [
  { en: '₹1,000 - ₹3,000 / month', hi: '₹1,000 - ₹3,000 / माह' },
  { en: '₹3,000 - ₹6,000 / month', hi: '₹3,000 - ₹6,000 / माह' },
  { en: '₹6,000 - ₹12,000 / month', hi: '₹6,000 - ₹12,000 / माह' },
  { en: 'Above ₹12,000 / month', hi: '₹12,000 से अधिक / माह' },
]

type PopupCopy = { badgeEn: string; badgeHi: string; headingEn: string; headingHi: string; introEn: string; introHi: string; submitEn: string; submitHi: string }
const defaultCopy: PopupCopy = {
  badgeEn: 'Govt. Subsidy Up to ₹78,000', badgeHi: 'सरकारी सब्सिडी ₹78,000 तक',
  headingEn: 'Get a Free Solar Rooftop Quote', headingHi: 'मुफ्त सोलर साइट सर्वे एवं कोटेशन',
  introEn: 'Fill out this quick form. Our local solar engineers will estimate your savings and guide you step-by-step.',
  introHi: 'अपनी आवश्यकता बताएं। हमारे विशेषज्ञ आपकी छत का आकलन कर सही समाधान देंगे।',
  submitEn: 'Get Free Quote & Site Survey', submitHi: 'मुफ्त कोटेशन और साइट सर्वे पाएं',
}

export function EnquiryPopup({ phone = '89530 69011', copy = defaultCopy }: { phone?: string; copy?: PopupCopy }) {
  const [open, setOpen] = useState(false)
  const [busy, setBusy] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [leadId, setLeadId] = useState('')
  const [waLink, setWaLink] = useState('')
  const [errorMessage, setErrorMessage] = useState('')

  const ref = useRef<HTMLDivElement>(null)
  const { language } = useLanguage()
  const hi = language === 'hi'

  const digits = phone.replace(/\D/g, '')
  const waNumber = digits.length === 10 ? `91${digits}` : digits

  // Listen for 'awadh-enquire' custom events
  useEffect(() => {
    const handleOpen = () => {
      setSubmitted(false)
      setErrorMessage('')
      setOpen(true)
    }
    window.addEventListener('awadh-enquire', handleOpen)

    // Open shortly after the page becomes interactive.
    const timer = setTimeout(() => {
      try {
        {
          setOpen(true)
        }
      } catch {}
    }, 350)

    return () => {
      window.removeEventListener('awadh-enquire', handleOpen)
      clearTimeout(timer)
    }
  }, [])

  const handleClose = () => {
    setOpen(false)
    try {
      sessionStorage.setItem('awadh-enquiry-dismissed', 'true')
    } catch {}
  }

  // Keyboard accessibility & focus trapping
  useEffect(() => {
    if (!open) return
    const prevFocus = document.activeElement as HTMLElement
    const prevOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    ref.current?.querySelector<HTMLButtonElement>('button')?.focus()

    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') handleClose()
      if (e.key === 'Tab') {
        const items = ref.current?.querySelectorAll<HTMLElement>('button, a[href], input:not([tabindex="-1"]), select')
        if (!items?.length) return
        const first = items[0], last = items[items.length - 1]
        if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus() }
        else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus() }
      }
    }
    document.addEventListener('keydown', handleKey)

    return () => {
      document.body.style.overflow = prevOverflow
      document.removeEventListener('keydown', handleKey)
      prevFocus?.focus()
    }
  }, [open])

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setBusy(true)
    setErrorMessage('')

    const form = new FormData(e.currentTarget)
    const payload = {
      name: String(form.get('name') || '').trim(),
      phone: String(form.get('phone') || '').trim(),
      requirement: String(form.get('requirement') || ''),
      billRange: String(form.get('billRange') || ''),
      locality: String(form.get('locality') || 'Mirzapur'),
      consent: form.get('consent') === 'on',
      website: String(form.get('website') || ''), // honeypot
    }

    try {
      const res = await fetch('/api/enquiry', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })

      const data = await res.json()
      if (!res.ok || !data.ok) {
        throw new Error(data.error || 'Submission failed')
      }

      setLeadId(data.leadId || '')
      setWaLink(data.whatsappUrl || `https://wa.me/${waNumber}`)
      setSubmitted(true)
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Network error. Please try again or message via WhatsApp.'
      setErrorMessage(msg)
    } finally {
      setBusy(false)
    }
  }

  return (
    <>
      {/* Floating Action Buttons (Clean & Modern) */}
      <div className="floating-contact" aria-label="Quick contact links">
        <a
          href={`https://wa.me/${waNumber}?text=${encodeURIComponent(
            'Hello! I want a free solar consultation and subsidy check for my property in Mirzapur/UP.'
          )}`}
          target="_blank"
          rel="noreferrer"
          className="floating-wa"
          title={hi ? 'WhatsApp पर तुरंत चैट करें' : 'Chat on WhatsApp'}
        >
          <MessageCircle size={22} />
        </a>
        <a
          href={`tel:${digits}`}
          className="floating-phone"
          title={hi ? 'सीधे कॉल करें' : 'Call our specialist'}
        >
          <Phone size={20} />
        </a>
      </div>

      {/* Modal Backdrop & Dialog */}
      {open && (
        <div
          className="enquiry-backdrop"
          onClick={(e) => {
            if (e.target === e.currentTarget) handleClose()
          }}
        >
          <div
            className="enquiry-dialog"
            role="dialog"
            aria-modal="true"
            aria-labelledby="enquiry-dialog-title"
            ref={ref}
          >
            <button
              className="dialog-close"
              onClick={handleClose}
              aria-label={hi ? 'बंद करें' : 'Close'}
              type="button"
            >
              <X size={20} />
            </button>

            {submitted ? (
              <div className="enquiry-success-view">
                <div className="success-icon-wrap">
                  <CheckCircle2 size={48} className="text-emerald-500" />
                </div>
                <h3>
                  <T hi="आपकी पूछताछ सफलतापूर्वक प्राप्त हो गई!">Enquiry Received Successfully!</T>
                </h3>
                <p className="success-sub">
                  <T hi="हमारी सोलर तकनीकी टीम आपसे जल्द ही संपर्क करेगी। आपकी लीड आईडी है:">
                    Our solar technical team will reach out to you shortly. Your reference Lead ID is:
                  </T>
                </p>
                <div className="lead-id-badge">
                  <span>{leadId}</span>
                </div>

                <div className="success-actions">
                  <a
                    href={waLink}
                    target="_blank"
                    rel="noreferrer"
                    className="wa-confirm-btn"
                  >
                    <MessageCircle size={18} />
                    <T hi="WhatsApp पर तुरंत पुष्टि करें">Instant WhatsApp Confirmation</T>
                  </a>

                  <button
                    type="button"
                    className="modal-done-btn"
                    onClick={handleClose}
                  >
                    <T hi="ठीक है, धन्यवाद">Done, Thank You</T>
                  </button>
                </div>
              </div>
            ) : (
              <>
                <div className="solar-buddy-intro">
                  <div><span className="buddy-eyebrow"><span className="buddy-brand">AWADH SOLAR</span><span className="buddy-brand-caption">YOUR SOLAR PARTNER</span></span>
                    <h2 id="enquiry-dialog-title"><T hi="मिलिए आपके सोलर साथी से">Meet Your Solar Buddy</T><strong>SUNtosh</strong></h2>
                    <p className="buddy-assistant-copy">Your <em>Virtual</em> assistant for all things</p>
                    <b className="buddy-scheme-name">PM Surya Ghar!</b>
                  </div>
                  <div className="solar-buddy-art"><img src="/images/solar-buddy.png" alt="SUNtosh, your friendly solar panel buddy" width={414} height={404} /></div>
                </div>
                {/* Header Badge */}
                <div className="enquiry-modal-header">
                  <span className="modal-subsidy-badge">
                    <Zap size={13} className="text-amber-500" />
                    <T hi={copy.badgeHi}>{copy.badgeEn}</T>
                  </span>
                  <h3><T hi={copy.headingHi}>{copy.headingEn}</T></h3>
                  <p>
                    <T hi={copy.introHi}>{copy.introEn}</T>
                  </p>
                </div>

                <form onSubmit={handleSubmit} className="enquiry-form-grid">
                  {/* Honeypot field for anti-spam */}
                  <input
                    type="text"
                    name="website"
                    className="enquiry-honeypot"
                    tabIndex={-1}
                    autoComplete="off"
                  />

                  {/* Name Field */}
                  <div className="form-field">
                    <label htmlFor="modal-name">
                      <T hi="आपका पूरा नाम">Full Name</T> <span className="req">*</span>
                    </label>
                    <div className="input-wrap">
                      <User size={16} className="input-icon" />
                      <input
                        id="modal-name"
                        name="name"
                        type="text"
                        required
                        minLength={2}
                        maxLength={80}
                        placeholder={hi ? 'उदा. राजेश कुमार' : 'e.g. Rajesh Kumar'}
                        autoComplete="name"
                      />
                    </div>
                  </div>

                  {/* Phone Field */}
                  <div className="form-field">
                    <label htmlFor="modal-phone">
                      <T hi="मोबाइल नंबर">Phone Number</T> <span className="req">*</span>
                    </label>
                    <div className="input-wrap phone-input-wrap">
                      <span className="country-code">+91</span>
                      <input
                        id="modal-phone"
                        name="phone"
                        type="tel"
                        required
                        pattern="[6-9][0-9]{9}"
                        maxLength={10}
                        placeholder={hi ? '9876543210 (10 अंक)' : '9876543210 (10 digits)'}
                        autoComplete="tel-national"
                      />
                    </div>
                  </div>

                  {/* Solar Requirement Dropdown */}
                  <div className="form-field">
                    <label htmlFor="modal-req">
                      <T hi="सोलर आवश्यकता">Solar Requirement</T> <span className="req">*</span>
                    </label>
                    <select id="modal-req" name="requirement" required defaultValue={requirements[0].en}>
                      {requirements.map((r) => (
                        <option key={r.en} value={r.en}>
                          {hi ? r.hi : r.en}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Monthly Bill Range */}
                  <div className="form-field">
                    <label htmlFor="modal-bill">
                      <T hi="मासिक बिजली का बिल">Average Monthly Electricity Bill</T>
                    </label>
                    <select id="modal-bill" name="billRange" defaultValue={billRanges[1].en}>
                      {billRanges.map((b) => (
                        <option key={b.en} value={b.en}>
                          {hi ? b.hi : b.en}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Locality / City */}
                  <div className="form-field">
                    <label htmlFor="modal-loc">
                      <T hi="शहर / इलाका">City / Locality in UP</T>
                    </label>
                    <div className="input-wrap">
                      <Building size={16} className="input-icon" />
                      <input
                        id="modal-loc"
                        name="locality"
                        type="text"
                        placeholder={hi ? 'मिर्ज़ापुर / विंध्याचल / सोनभद्र आदि' : 'Mirzapur / Vindhyachal / Varanasi etc.'}
                        defaultValue="Mirzapur"
                      />
                    </div>
                  </div>

                  {/* Consent Checkbox */}
                  <label className="consent-checkbox">
                    <input name="consent" type="checkbox" required />
                    <span>
                      <T hi="मैं नि:शुल्क सोलर परामर्श एवं साइट सर्वे के लिए फोन या WhatsApp पर संपर्क करने की अनुमति देता/देती हूँ।">
                        I agree to receive a free solar rooftop quote & site survey call or WhatsApp.
                      </T>
                    </span>
                  </label>

                  {/* Error display */}
                  {errorMessage && (
                    <div className="form-error-banner" role="alert">
                      {errorMessage}
                    </div>
                  )}

                  {/* Submit Button */}
                  <button
                    type="submit"
                    className="modal-submit-btn"
                    disabled={busy}
                  >
                    {busy ? (
                      <span><T hi="भेज रहे हैं…">Submitting Request…</T></span>
                    ) : (
                      <>
                        <Sparkles size={17} />
                        <T hi={copy.submitHi}>{copy.submitEn}</T>
                        <ArrowRight size={17} />
                      </>
                    )}
                  </button>

                  {/* Trust Footer */}
                  <div className="modal-trust-footer">
                    <span>
                      <ShieldCheck size={13} className="text-blue-600 inline mr-1" />
                      <T hi="गोपनीयता सुरक्षित • कोई स्पैम नहीं">100% Privacy Protected • Zero Spam</T>
                    </span>
                    <span>
                      <Clock size={13} className="text-blue-600 inline mr-1" />
                      <T hi="24 घंटे में तकनीकी संपर्क">Response within 24 Hours</T>
                    </span>
                  </div>
                </form>
              </>
            )}
            <div className="buddy-security"><ShieldCheck size={24}/><T hi="भरोसेमंद। सुरक्षित। हमेशा आपकी मदद के लिए।">Trusted. Secure. Always Here To Help.</T></div>
          </div>
        </div>
      )}
    </>
  )
}
