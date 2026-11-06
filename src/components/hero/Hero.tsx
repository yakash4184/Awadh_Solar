import { HeroImageSlider } from '@/components/hero/HeroImageSlider'
import { QuoteButton } from '@/components/experience/QuoteButton'
import { GreetingClock } from '@/components/ui/GreetingClock'
import Link from 'next/link'
import {
  ArrowRight,
  BadgeCheck,
  Leaf,
  Shield,
  Sparkles,
  Sun,
  Wallet,
  Zap,
} from 'lucide-react'
import type { SiteContent } from '@/lib/site-content'
import { getWhatsAppUrl } from '@/lib/whatsapp'
import { T } from '@/components/language/LanguageProvider'
import { EnquiryTriggerButton } from '@/components/ui/EnquiryTriggerButton'
import { RotatingHeroTagline } from '@/components/hero/RotatingHeroTagline'

const benefits = [
  {
    icon: Wallet,
    label: 'Lower Electricity Bills',
    labelHi: 'बिजली बिल में भारी बचत',
    sub: 'Save up to 90% monthly',
    subHi: 'मासिक बिल में 90% तक कटौती',
  },
  {
    icon: Leaf,
    label: 'Clean Energy',
    labelHi: '100% स्वच्छ सौर ऊर्जा',
    sub: 'Eco-friendly power',
    subHi: 'प्रदूषण मुक्त निर्बाध बिजली',
  },
  {
    icon: Shield,
    label: 'Panel Warranty',
    labelHi: '25 वर्ष की वारंटी',
    sub: '25-year guaranteed output',
    subHi: 'टियर-1 दीर्घकालिक परफॉर्मेंस',
  },
  {
    icon: BadgeCheck,
    label: 'Subsidy Assistance',
    labelHi: 'सब्सिडी सहायता',
    sub: 'PM Surya Ghar up to ₹78,000',
    subHi: '₹78,000 तक सीधी सरकारी मदद',
  },
]

export function Hero({ content }: { content: SiteContent }) {
  return (
    <section className="hero" aria-labelledby="hero-heading">
      <div className="hero-sun-disc" aria-hidden="true" />
      <div className="hero-content">
        <div className="hero-copy">
          {/* PM Surya Ghar Yojna Live Watch & Subsidy Banner */}
          <div className="surya-ghar-watch-banner">
            <div className="sgw-left">
              <span className="sgw-icon-wrap">
                <Sun size={17} className="sgw-sun-icon" />
              </span>
              <div className="sgw-info">
                <strong className="sgw-title">
                  <T hi="पीएम सूर्य घर योजना">PM Surya Ghar Yojna</T>
                </strong>
                <span className="sgw-subtitle">
                  <T hi="₹78,000 तक सीधी सब्सिडी • आवेदन व तकनीकी स्वीकृति">
                    Up to ₹78,000 Direct Subsidy • On-Site Survey & Approvals
                  </T>
                </span>
              </div>
            </div>
            <div className="sgw-right">
              <Link href="/pm-surya-ghar" className="sgw-check-link">
                <T hi="पात्रता देखें">Check Eligibility</T>
                <ArrowRight size={14} />
              </Link>
            </div>
          </div>

          {/* Clean Balanced Heading with Zero Overlap */}
          <h1 id="hero-heading" className="hero-shimmer-title">
            <span className="title-lead">
              <T hi="मिर्ज़ापुर में सोलर समाधान, उत्पाद और सर्विस">Solar Solutions, Products & Service in Mirzapur</T>
            </span>
            <RotatingHeroTagline />
          </h1>

          <p className="hero-description">
            <T hi="घरों, व्यवसायों और कारखानों के लिए विश्वसनीय सोलर समाधान। प्रीमियम सोलर पैनल्स से लेकर पेशेवर इंस्टॉलेशन और नेट-मीटरिंग तक, हम स्वच्छ ऊर्जा को सरल और किफायती बनाते हैं।">
              {content.heroDescription}
            </T>
          </p>

          {/* 4 Verified Feature Cards */}
          <div className="hero-highlights">
            {benefits.map(({ icon: Icon, label, labelHi, sub, subHi }) => (
              <div key={label} className="hero-highlight">
                <span className="highlight-icon-wrap">
                  <Icon size={18} />
                </span>
                <div className="highlight-text">
                  <b><T hi={labelHi}>{label}</T></b>
                  <small><T hi={subHi}>{sub}</T></small>
                </div>
              </div>
            ))}
          </div>

          {/* Prominent High-Conversion CTAs */}
          <div className="hero-ctas">
            <EnquiryTriggerButton className="primary-cta">
              <T hi="मुफ़्त साइट सर्वे बुक करें">Get Free Site Survey</T>
              <ArrowRight size={17} />
            </EnquiryTriggerButton>
            <Link href="#solutions" className="secondary-cta">
              <T hi="सोलर समाधान देखें">Explore Solar Solutions</T>
              <ArrowRight size={16} />
            </Link>
          </div>

          <div className="hero-trust-row">
            <a
              className="hero-whatsapp"
              href={getWhatsAppUrl(
                'Hello! I would like to inquire about solar rooftop installation and PM Surya Ghar subsidy in Mirzapur/UP.'
              )}
              target="_blank"
              rel="noreferrer"
            >
              <span className="whatsapp-dot" />
              <T hi="इंजीनियर से WhatsApp पर बात करें">Chat with Solar Specialist on WhatsApp</T>
              <ArrowRight size={14} />
            </a>
          </div>
        </div>

        <aside className="hero-note">
          <div className="hero-note-icon">☀</div>
          <div>
            <b><T hi="25 वर्ष की गारंटी">25-Year Performance Guarantee</T></b>
            <small><T hi="मिर्ज़ापुर और पूर्वांचल का नंबर 1 सोलर पार्टनर">Eastern UP&apos;s Trusted Solar Provider</T></small>
          </div>
        </aside>

      </div>
      <HeroImageSlider />
    </section>
  )
}
