import Link from 'next/link'
import {
  ArrowUp,
  Award,
  BadgeCheck,
  Building,
  CheckCircle2,
  Clock,
  FileText,
  Mail,
  MapPin,
  MessageCircle,
  Phone,
  ShieldCheck,
  Zap,
} from 'lucide-react'
import { T } from '@/components/language/LanguageProvider'
import { EnquiryTriggerButton } from '@/components/ui/EnquiryTriggerButton'
import { getWhatsAppUrl } from '@/lib/whatsapp'

type FooterProps = { brand: string; phone: string; address: string }

export function Footer({ brand = 'Over The Top Solar', phone = '89530 69011', address }: FooterProps) {
  const digits = phone.replace(/\D/g, '')

  return (
    <footer className="site-footer" role="contentinfo" id="contact">
      {/* Trust & Guarantee Banner */}
      <div className="footer-trust-strip">
        <div className="trust-strip-inner">
          <div className="trust-strip-item">
            <ShieldCheck size={22} className="text-amber-400" />
            <div>
              <strong><T hi="सरकारी पंजीकृत वेंडर">Govt. Registered Partner</T></strong>
              <small><T hi="पीएम सूर्य घर योजना अनुमोदित">PM Surya Ghar Authorized</T></small>
            </div>
          </div>
          <div className="trust-strip-item">
            <Award size={22} className="text-blue-400" />
            <div>
              <strong><T hi="25 वर्ष पैनल वारंटी">25-Year Panel Warranty</T></strong>
              <small><T hi="टियर-1 मोनोक्रिस्टलाइन पैनल्स">Tier-1 Guaranteed Generation</T></small>
            </div>
          </div>
          <div className="trust-strip-item">
            <CheckCircle2 size={22} className="text-emerald-400" />
            <div>
              <strong><T hi="2,000+ सफल प्रोजेक्ट्स">2,000+ Projects Completed</T></strong>
              <small><T hi="मिर्ज़ापुर एवं पूर्वांचल में">Across Mirzapur & UP</T></small>
            </div>
          </div>
          <div className="trust-strip-item">
            <Zap size={22} className="text-amber-400" />
            <div>
              <strong><T hi="90% तक बिजली बिल बचत">Up to 90% Bill Savings</T></strong>
              <small><T hi="स्मार्ट नेट-मीटरिंग तकनीक">Smart Net-Metering Tech</T></small>
            </div>
          </div>
        </div>
      </div>

      {/* Main 4-Column Footer */}
      <div className="footer-main-grid">
        {/* Col 1: Brand & Bio */}
        <div className="footer-col brand-col">
          <Link href="/" className="footer-brand-link" aria-label={`${brand} home`}>
            <img
              src="/images/awadh-logo.jpg"
              alt="Awadh Enterprises Logo"
              className="footer-brand-logo-img"
              width={180}
              height={48}
            />
          </Link>
          <p className="footer-bio-text">
            <T hi="मिर्ज़ापुर और पूर्वांचल का विश्वसनीय सोलर समाधान प्रदाता। हम आवासीय छतों, वाणिज्यिक कारखानों और संस्थानों के लिए उच्च गुणवत्ता वाले सोलर प्लांट्स स्थापित करते हैं।">
              Eastern Uttar Pradesh&apos;s leading clean energy contractor. We engineer, install, and service high-yield rooftop solar arrays with government subsidy facilitation and lifetime support.
            </T>
          </p>
          <div className="footer-hours-box">
            <Clock size={15} className="text-blue-400 flex-none" />
            <div>
              <strong>Office Hours:</strong> Mon – Sat: 9:30 AM – 7:00 PM
            </div>
          </div>
        </div>

        {/* Col 2: Solar Solutions */}
        <div className="footer-col">
          <h3><T hi="सोलर समाधान">Solar Solutions</T></h3>
          <ul className="footer-link-list">
            <li>
              <Link href="/#service-residential">
                <T hi="आवासीय रूफटॉप सोलर">Residential Rooftop Solar</T>
              </Link>
            </li>
            <li>
              <Link href="/#service-commercial">
                <T hi="कमर्शियल एवं इंडस्ट्रियल सोलर">Commercial & Factory Solar</T>
              </Link>
            </li>
            <li>
              <Link href="/#pm-surya-ghar">
                <span className="subsidy-tag">₹78k Subsidy</span>
                <T hi="पीएम सूर्य घर योजना">PM Surya Ghar Yojana</T>
              </Link>
            </li>
            <li>
              <Link href="/#calculator">
                <T hi="सोलर बचत कैलकुलेटर">Solar Bill Calculator</T>
              </Link>
            </li>
            <li>
              <Link href="/#solutions">
                <T hi="सोलर वाटर पंप (कृषि)">Solar Water Pumps</T>
              </Link>
            </li>
          </ul>
        </div>

        {/* Col 3: Hardware & Products */}
        <div className="footer-col">
          <h3><T hi="उपकरण एवं उत्पाद">Hardware & Tech</T></h3>
          <ul className="footer-link-list">
            <li>
              <Link href="/#product-panels">
                <T hi="मोनोक्रिस्टलाइन सोलर पैनल्स">Mono PERC Solar Panels</T>
              </Link>
            </li>
            <li>
              <Link href="/#product-inverters">
                <T hi="ग्रिवाट एवं स्मार्ट इन्वर्टर्स">Growatt Smart Inverters</T>
              </Link>
            </li>
            <li>
              <Link href="/#product-batteries">
                <T hi="सोलर लिथियम एवं ट्यूबलर बैटरी">Solar Batteries & Storage</T>
              </Link>
            </li>
            <li>
              <Link href="/#projects-showcase">
                <T hi="पूर्ण प्रोजेक्ट गैलरी">Installation Gallery</T>
              </Link>
            </li>
            <li>
              <Link href="/#about">
                <T hi="हमारे बारे में">About Our Company</T>
              </Link>
            </li>
          </ul>
        </div>

        {/* Col 4: Quick Contact & Direct Action */}
        <div className="footer-col contact-col">
          <h3><T hi="संपर्क एवं सहायता">Connect with Us</T></h3>
          <address className="footer-address">
            <MapPin size={17} className="text-amber-400 flex-none" />
            <span>{address}</span>
          </address>

          <div className="footer-actions">
            <a href={`tel:${digits}`} className="footer-action-call">
              <Phone size={16} />
              <div>
                <small><T hi="कॉल करें">Call Solar Engineer</T></small>
                <strong>{phone}</strong>
              </div>
            </a>

            <a
              href={getWhatsAppUrl(
                'Hello! I would like to get a free solar quote for my property.'
              )}
              target="_blank"
              rel="noreferrer"
              className="footer-action-wa"
            >
              <MessageCircle size={17} />
              <span><T hi="WhatsApp पर चैट करें">Chat on WhatsApp</T></span>
            </a>

            <EnquiryTriggerButton className="footer-action-quote">
              <Zap size={15} />
              <span><T hi="मुफ्त साइट सर्वे बुक करें">Book Free Site Survey</T></span>
            </EnquiryTriggerButton>
          </div>
        </div>
      </div>

      {/* Bottom Legal & Copyright Bar */}
      <div className="footer-bottom-bar">
        <div className="bottom-bar-inner">
          <p>© {new Date().getFullYear()} Over The Top Solar (Awadh Enterprises). <T>All rights reserved.</T></p>
          <div className="footer-legal-links">
            <Link href="/privacy-policy"><T>Privacy Policy</T></Link>
            <span className="dot">•</span>
            <Link href="/terms"><T>Terms of Service</T></Link>
            <span className="dot">•</span>
            <Link href="/admin/login"><T>Admin Login</T></Link>
          </div>
          <a href="#main-content" className="back-to-top-btn" aria-label="Back to top">
            <span><T>Back to top</T></span>
            <ArrowUp size={15} />
          </a>
        </div>
      </div>
    </footer>
  )
}
