import { SchemeDeadline } from '@/components/experience/SchemeDeadline'
import { access } from 'node:fs/promises'
import path from 'node:path'
import { Countdown } from '@/components/experience/Countdown'
import { ShopVideo } from '@/components/experience/ShopVideo'
import { EnergyStory } from '@/components/experience/EnergyStory'
import { SunJourney } from '@/components/experience/SunJourney'
import { EnquiryPopup } from '@/components/enquiry/EnquiryPopup'
import Link from 'next/link'
import {
  ArrowRight,
  BadgeCheck,
  BatteryCharging,
  Building2,
  CheckCircle2,
  Factory,
  Headset,
  House,
  IndianRupee,
  MapPin,
  ShieldCheck,
  PanelsTopLeft,
  Sparkles,
  Sun,
  Wrench,
  Wallet,
  Zap,
  type LucideIcon,
} from 'lucide-react'
import { Hero } from '@/components/hero/Hero'
import { BrandTrustStrip } from '@/components/hero/BrandTrustStrip'
import { ProjectShowcase } from '@/components/projects/ProjectShowcase'
import { Navigation } from '@/components/navigation/Navigation'
import { getSiteContent } from '@/lib/site-content'
import { SolarCalculator } from '@/components/solar/SolarCalculator'
import { Footer } from '@/components/footer/Footer'
import type { Metadata } from 'next'
import { T } from '@/components/language/LanguageProvider'
import { SitePhoto } from '@/components/ui/SitePhoto'
import { EnquiryTriggerButton } from '@/components/ui/EnquiryTriggerButton'
import { isAdminAuthenticated } from '@/lib/admin-auth'
import { AdminTabSessionGuard } from '@/components/admin/AdminTabSessionGuard'
import { defaultEnquirySettings, getEnquirySettings } from '@/lib/enquiry-settings'

export const dynamic = 'force-dynamic'
type SolarService = {
  icon: LucideIcon
  title: string
  titleHi: string
  description: string
  descriptionHi: string
  range: string
  rangeHi?: string
  action: string
  actionHi: string
}
const services: SolarService[] = [
  { icon: House, title: 'Residential Solar', titleHi: 'आवासीय सोलर', description: 'On-grid and hybrid rooftop systems, with help navigating eligible subsidy applications.', descriptionHi: 'ऑन-ग्रिड और हाइब्रिड रूफटॉप सिस्टम, पात्र सब्सिडी आवेदन में सहायता के साथ।', range: '1–10 kW', action: 'Get Quote', actionHi: 'कोटेशन पाएं' },
  { icon: Building2, title: 'Commercial Solar', titleHi: 'कमर्शियल सोलर', description: 'Efficient solar systems designed for shops, offices, schools and hospitals.', descriptionHi: 'दुकानों, ऑफिस, स्कूलों और अस्पतालों के लिए ऊर्जा-कुशल सोलर सिस्टम।', range: '10–100 kW', action: 'Get Quote', actionHi: 'कोटेशन पाएं' },
  { icon: Factory, title: 'Industrial Solar', titleHi: 'इंडस्ट्रियल सोलर', description: 'Custom system planning for factories and larger industrial sites.', descriptionHi: 'फैक्ट्रियों और बड़े औद्योगिक परिसरों के लिए कस्टम सिस्टम योजना।', range: '100 kW–1 MW+', action: 'Get Quote', actionHi: 'कोटेशन पाएं' },
  { icon: Sun, title: 'Agricultural Solar', titleHi: 'कृषि सोलर', description: 'Solar pump and irrigation options that can reduce dependence on grid power.', descriptionHi: 'ग्रिड बिजली पर निर्भरता घटाने के लिए सोलर पंप और सिंचाई विकल्प।', range: '3–15 kW', action: 'Get Quote', actionHi: 'कोटेशन पाएं' },
  { icon: Zap, title: 'Off-Grid Systems', titleHi: 'ऑफ-ग्रिड सिस्टम', description: 'Independent solar and storage solutions for sites with limited grid access.', descriptionHi: 'जहां ग्रिड की सुविधा सीमित हो, वहां के लिए स्वतंत्र सोलर और स्टोरेज समाधान।', range: '1–50 kW', action: 'Get Quote', actionHi: 'कोटेशन पाएं' },
  { icon: BatteryCharging, title: 'Battery & Storage', titleHi: 'बैटरी और स्टोरेज', description: 'Backup options from compatible brands such as UTL, Luminous and Exide; availability varies.', descriptionHi: 'UTL, Luminous और Exide जैसे संगत ब्रांड के बैकअप विकल्प; उपलब्धता अलग-अलग हो सकती है।', range: 'All capacities', rangeHi: 'सभी क्षमताएं', action: 'Get Quote', actionHi: 'कोटेशन पाएं' },
  { icon: Wallet, title: 'PM Surya Ghar Subsidy', titleHi: 'पीएम सूर्य घर सब्सिडी', description: 'Application and document assistance. Subsidy is up to ₹78,000, subject to eligibility and scheme rules.', descriptionHi: 'आवेदन और दस्तावेज़ों में सहायता। पात्रता और योजना के नियमों के अनुसार ₹78,000 तक सब्सिडी।', range: 'Application support', rangeHi: 'आवेदन सहायता', action: 'Apply Now', actionHi: 'आवेदन करें' },
  { icon: Wrench, title: 'AMC & Maintenance', titleHi: 'AMC और मेंटेनेंस', description: 'Cleaning, inspection, repairs and upgrades for existing solar systems.', descriptionHi: 'मौजूदा सोलर सिस्टम की सफाई, जांच, मरम्मत और अपग्रेड।', range: 'All compatible brands', rangeHi: 'संगत ब्रांड', action: 'Book Service', actionHi: 'सर्विस बुक करें' },
]
const reasons = [
  { icon: MapPin, number: '01', title: "Mirzapur's Solar Team", titleHi: 'मिर्ज़ापुर का अपना सोलर साथी', description: '2,000+ installations across Mirzapur and Eastern Uttar Pradesh.', descriptionHi: 'मिर्ज़ापुर और पूर्वी उत्तर प्रदेश में 2,000+ इंस्टॉलेशन।' },
  { icon: BadgeCheck, number: '02', title: 'UPNEDA Listed Vendor', titleHi: 'UPNEDA सूचीबद्ध वेंडर', description: 'Awadh Enterprises is listed for Mirzapur on the UPNEDA approved-firms directory.', descriptionHi: 'अवध एंटरप्राइजेज़ UPNEDA की approved-firms सूची में मिर्ज़ापुर के लिए दर्ज है।', link: 'https://upnedasolarrooftopportal.com/Approved-Firms' },
  { icon: PanelsTopLeft, number: '03', title: 'Authorized Brand Distribution', titleHi: 'अधिकृत ब्रांड डिस्ट्रीब्यूशन', description: 'WAAREE, UTL and Havells product range, with availability confirmed for your project.', descriptionHi: 'WAAREE, UTL और Havells की उत्पाद रेंज; आपके प्रोजेक्ट के लिए उपलब्धता की पुष्टि के साथ।' },
  { icon: ShieldCheck, number: '04', title: '25-Year Panel Warranty', titleHi: '25 वर्ष की पैनल वारंटी', description: 'Long-term panel output warranty, as per the manufacturer’s terms.', descriptionHi: 'निर्माता की शर्तों के अनुसार लंबे समय की पैनल आउटपुट वारंटी।' },
  { icon: IndianRupee, number: '05', title: 'Direct Manufacturer Pricing', titleHi: 'निर्माता से सीधी कीमत', description: 'Transparent, project-based pricing on your selected system and equipment.', descriptionHi: 'आपके चुने हुए सिस्टम और उपकरण पर स्पष्ट, प्रोजेक्ट-आधारित कीमत।' },
  { icon: Headset, number: '06', title: '24/7 Support', titleHi: '24/7 सहायता', description: 'Reach our support team for urgent help, service and maintenance coordination.', descriptionHi: 'तत्काल सहायता, सर्विस और मेंटेनेंस समन्वय के लिए हमारी टीम से संपर्क करें।' },
]

export async function generateMetadata(): Promise<Metadata> {
  const content = await getSiteContent()
  return {
    title: `${content.brand} | Premium Solar Energy Solutions in Mirzapur & UP`,
    description: content.heroDescription,
    openGraph: {
      title: `${content.brand} | Solar Solutions in Mirzapur & UP`,
      description: content.heroDescription,
      siteName: content.brand,
    },
  }
}

export default async function HomePage() {
  const content = await getSiteContent()
  const enquirySettings = await getEnquirySettings().catch(() => defaultEnquirySettings)
  const canEditProjects = await isAdminAuthenticated()
  const localVideoExists = await access(path.join(process.cwd(), 'public/videos/shop.mp4'))
    .then(() => true)
    .catch(() => false)

  return (
    <>
      {canEditProjects && <AdminTabSessionGuard />}
      <Countdown settings={content.countdown} />
      <SunJourney />
      <EnquiryPopup phone={content.phone} copy={enquirySettings.popup} />
      <Navigation brand={content.brand} phone={content.phone} address={content.address} />

      <main id="main-content">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'LocalBusiness',
              name: content.brand,
              telephone: content.phone,
              address: {
                '@type': 'PostalAddress',
                streetAddress: 'Bari Basahi',
                addressLocality: 'Mirzapur',
                addressRegion: 'Uttar Pradesh',
                postalCode: '231001',
                addressCountry: 'IN',
              },
            }).replace(/</g, '\\u003c'),
          }}
        />

        {/* Hero Section */}
        <Hero content={content} />

        <BrandTrustStrip />

        <SchemeDeadline />

        <ProjectShowcase projects={content.projects} heading={content.projectsHeading} subheading={content.projectsSubheading} canEdit={canEditProjects} />

        {/* Solar Solutions Grid */}
        <section id="solutions" className="solutions-section" aria-labelledby="solutions-heading">
          <div className="section-heading">
            <span className="eyebrow"><T hi="⚙️ हमारी सेवाएं">OUR SERVICES</T></span>
            <h2 id="solutions-heading"><T hi="Complete Solar Solutions">Complete Solar Solutions</T></h2>
            <p><T hi="घर से लेकर उद्योग तक — हर जगह के लिए सोलर समाधान। नीचे दी गई क्षमता अनुमानित है; सही सिस्टम साइट सर्वे के बाद तय होगा।">From homes to industry, solar solutions for every site. Capacity ranges are indicative; final system sizing follows a site survey.</T></p>
          </div>
          <div className="services-grid">
            {services.map(({ icon: Icon, title, titleHi, description, descriptionHi, range, rangeHi, action, actionHi }) => (
              <article
                className="service-card"
                id={title === 'Residential Solar' ? 'service-residential' : title === 'Commercial Solar' ? 'service-commercial' : title === 'Industrial Solar' ? 'service-industrial' : title === 'PM Surya Ghar Subsidy' ? 'pm-surya-ghar' : undefined}
                key={title}
              >
                <div className="service-card-icon"><Icon size={22} strokeWidth={2} aria-hidden="true" /></div>
                <h3><T hi={titleHi}>{title}</T></h3>
                <p><T hi={descriptionHi}>{description}</T></p>
                <span className="service-card-range"><T hi={rangeHi ?? range}>{range}</T></span>
                <EnquiryTriggerButton className="service-card-cta">
                  <T hi={actionHi}>{action}</T><ArrowRight size={15} aria-hidden="true" />
                </EnquiryTriggerButton>
              </article>
            ))}
          </div>
        </section>

        <section className="why-awadh-section" aria-labelledby="why-awadh-heading">
          <div className="section-heading">
            <span className="eyebrow"><T hi="अवध सोलर ही क्यों?">WHY AWADH SOLAR?</T></span>
            <h2 id="why-awadh-heading"><T hi="सोलर के लिए अवध को चुनें">Why Choose Awadh Solar?</T></h2>
            <p><T hi="स्थानीय अनुभव, सही उत्पाद और इंस्टॉलेशन के बाद भी साथ देने वाली टीम।">Local experience, well-matched products and a team that stays available after installation.</T></p>
          </div>
          <div className="why-awadh-grid">
            {reasons.map(({ icon: Icon, number, title, titleHi, description, descriptionHi, link }) => (
              <article className="why-awadh-card" key={number}>
                <div className="why-awadh-card-top">
                  <span>{number}</span>
                  <Icon size={25} strokeWidth={1.9} aria-hidden="true" />
                </div>
                <h3><T hi={titleHi}>{title}</T></h3>
                <p><T hi={descriptionHi}>{description}</T></p>
                {link && (
                  <a href={link} target="_blank" rel="noreferrer" className="why-awadh-proof-link">
                    <T hi="UPNEDA सूची देखें">View UPNEDA listing</T><ArrowRight size={14} aria-hidden="true" />
                  </a>
                )}
              </article>
            ))}
          </div>
        </section>

        {/* Certified On-Site Solar Engineering Showcase */}
        <section className="local-team-section" id="about" aria-labelledby="team-heading">
          <div className="local-team-grid">
            <figure className="local-team-photo-wrap">
              <SitePhoto
                src="/images/projects/residential-rooftop-growatt.jpg"
                alt="Certified On-Site Solar Rooftop Installation by Awadh Enterprises"
                sizes="(max-width: 768px) 100vw, 50vw"
              />
              <figcaption>
                <MapPin size={15} />
                <T hi="ऑन-साइट सोलर प्लांट इंस्टॉलेशन • अवध एंटरप्राइजेज़, मिर्ज़ापुर">
                  On-Site Solar Rooftop Installation • Awadh Enterprises, Mirzapur
                </T>
              </figcaption>
            </figure>

            <div className="local-team-copy">
              <span className="eyebrow">
                <Sparkles size={14} className="text-amber-500 inline mr-1" />
                <T hi="मिर्ज़ापुर का अपना सोलर ब्रांड • स्थानीय विशेषज्ञता">
                  MIRZAPUR&apos;S TRUSTED SOLAR ENERGY PARTNER
                </T>
              </span>
              <h2 id="team-heading">
                <T hi="मिर्ज़ापुर की मिट्टी से जुड़े।">Rooted in Mirzapur.</T>
                <br />
                <span><T hi="हर छत को रोशन करने का संकल्प।">Powering Purvanchal with Clean Solar Energy.</T></span>
              </h2>
              <p>
                <T hi="अवध एंटरप्राइजेज़ (Awadh Enterprises) मिर्ज़ापुर की अपनी पंजीकृत एवं विश्वसनीय सोलर कंपनी है। बाड़ी बसही स्थित हमारे प्रधान कार्यालय से हमारी प्रमाणित इंजीनियर्स की टीम आपकी छत की माप से लेकर सरकारी सब्सिडी (PM Surya Ghar) स्वीकृति, UPPCL नेट-मीटरिंग और 25 वर्षों के मेंटेनेंस तक हर कदम पर आपके साथ खड़ी रहती है।">
                  We are not an anonymous online middleman. Awadh Enterprises is Mirzapur&apos;s own registered solar solutions partner headquartered at Bari Basahi. Our certified in-house technical team personally manages every roof survey, net-metering liaison with UPPCL, PM Surya Ghar subsidy approvals, and 25-year lifetime service support.
                </T>
              </p>

              <div className="team-badges-row">
                <div className="team-badge-item">
                  <ShieldCheck size={20} className="text-blue-600" />
                  <div>
                    <strong><T hi="सरकारी पंजीकृत सोलर पार्टनर">Govt. Registered Partner</T></strong>
                    <small><T hi="UPPCL नेट-मीटरिंग अनुमोदित">UPPCL Net-Metering Approved</T></small>
                  </div>
                </div>
                <div className="team-badge-item">
                  <CheckCircle2 size={20} className="text-emerald-600" />
                  <div>
                    <strong><T hi="2,000+ सफल सोलर प्लांट">2,000+ Installed Plants</T></strong>
                    <small><T hi="मिर्ज़ापुर एवं पूर्वांचल में">Across Mirzapur & Eastern UP</T></small>
                  </div>
                </div>
                <div className="team-badge-item">
                  <Wrench size={20} className="text-blue-600" />
                  <div>
                    <strong><T hi="स्थानीय सर्विस हब (बाड़ी बसही)">Local Service Hub</T></strong>
                    <small><T hi="24 घंटे में ऑन-साइट सहायता">24h Rapid On-Site Support</T></small>
                  </div>
                </div>
              </div>

              <div className="team-actions">
                <EnquiryTriggerButton className="primary-cta">
                  <T hi="हमारे ऑफिस आएं या परामर्श लें">Meet Our Team / Book Site Visit</T>
                  <ArrowRight size={17} />
                </EnquiryTriggerButton>
                <a href={`tel:${content.phone.replace(/\D/g, '')}`} className="secondary-cta">
                  <T hi="कॉल करें">Call</T> {content.phone}
                </a>
              </div>
            </div>
          </div>
        </section>

        {/* Video Reel Experience */}
        <ShopVideo content={content} localVideoExists={localVideoExists} />

        {/* Energy Story with High Contrast */}
        <EnergyStory />

        {/* Products Section */}
        <section className="products-section" id="products">
          <div className="section-heading">
            <span className="eyebrow"><T>TIER-1 SOLAR HARDWARE</T></span>
            <h2>
              <T>Choose the right products for your</T> <span><T>solar setup.</T></span>
            </h2>
            <p><T>Tested for extreme temperatures, high durability and guaranteed 25-year performance.</T></p>
          </div>
          <div className="product-grid">
            {content.products.map((product) => (
              <article className="public-product-card" id={`product-${product.id}`} key={product.id}>
                <div className="public-product-image">
                  <SitePhoto
                    src={product.image}
                    alt=""
                    sizes="(max-width: 600px) 90vw, (max-width: 920px) 45vw, (max-width: 1250px) 30vw, 350px"
                  />
                  <span><T>{product.category}</T></span>
                </div>
                <div className="public-product-copy">
                  <h3><T>{product.name}</T></h3>
                  <p><T>{product.description}</T></p>
                  <Link href="#contact">
                    <T>View details / enquiry</T> <ArrowRight size={15} />
                  </Link>
                </div>
              </article>
            ))}
          </div>
        </section>

        {/* Process Section with High-Contrast Royal Navy Blue Theme */}
        <section className="process-section" id="process" aria-labelledby="process-heading">
          <div className="process-inner">
            <div className="process-intro">
              <span className="process-eyebrow">
                <Sun size={15} className="inline mr-1" />
                <T hi="सोलर की ओर कदम">THE SOLAR JOURNEY</T>
              </span>
              <h2 id="process-heading">
                <T hi="सोलर अपनाना हुआ बेहद आसान।">A Crystal-Clear Path to Solar.</T>
              </h2>
              <p>
                <T hi="हर छत और बिजली खपत का पैटर्न अलग होता है। हम आपकी ज़रूरत को समझकर सब्सिडी आवेदन से लेकर ग्रिड मीटरिंग तक का पूरा काम संभालते हैं।">
                  Every site and power load is unique. From free rooftop feasibility analysis to seamless net-metering approvals and subsidy credit, we handle everything end-to-end.
                </T>
              </p>
              <EnquiryTriggerButton className="process-cta-btn">
                <T hi="अपनी योजना पर बात करें">Discuss Your Project</T> <ArrowRight size={17} />
              </EnquiryTriggerButton>
            </div>

            <div className="process-steps">
              <article className="process-step-card">
                <span className="step-num">01</span>
                <div className="step-body">
                  <h3><T hi="नि:शुल्क साइट सर्वे">Free Roof Feasibility Survey</T></h3>
                  <p>
                    <T hi="हम आपकी छत का छाया-मुक्त क्षेत्र, बिजली का लोड और वार्षिक सौर क्षमता मापते हैं।">
                      Our engineers evaluate shadow-free area, existing monthly electricity bills, and optimal panel tilt.
                    </T>
                  </p>
                </div>
              </article>

              <article className="process-step-card">
                <span className="step-num">02</span>
                <div className="step-body">
                  <h3><T hi="सब्सिडी एवं सिस्टम डिज़ाइन">Custom Design & Subsidy Approval</T></h3>
                  <p>
                    <T hi="पीएम सूर्य घर योजना के तहत ₹78,000 तक की सब्सिडी का आवेदन और 3D लेआउट तैयार करना।">
                      Get full transparency on equipment selection, ROI timeline, and government subsidy registration.
                    </T>
                  </p>
                </div>
              </article>

              <article className="process-step-card">
                <span className="step-num">03</span>
                <div className="step-body">
                  <h3><T hi="इंस्टॉलेशन एवं नेट-मीटरिंग">Rapid Installation & Net-Metering</T></h3>
                  <p>
                    <T hi="प्रमाणित सोलर स्ट्रक्चर इंस्टॉलेशन, UPPCL बायो-डायरेक्शनल मीटर टेस्टिंग और लाइफटाइम सपोर्ट।">
                      Complete rooftop mounting within 48 hours, net-metering commissioning, and app synchronization.
                    </T>
                  </p>
                </div>
              </article>
            </div>
          </div>
        </section>

        {/* Solar Calculator */}
        <section id="calculator" className="home-calculator">
          <div className="home-calculator-intro">
            <span className="eyebrow"><T>PLAN YOUR SOLAR SYSTEM</T></span>
            <h2>
              <T>Start with your</T> <span><T>monthly bill.</T></span>
            </h2>
            <p>
              <T hi="अपने मासिक बिजली बिल से सिस्टम की अनुमानित क्षमता, पैनलों की संख्या और लागत जानें।">
                Use your monthly bill to get an initial estimate of system size, panel count and cost.
              </T>
            </p>
            <Link href="#pm-surya-ghar" className="text-link">
              <T>Read about PM Surya Ghar</T> <ArrowRight size={16} />
            </Link>
          </div>
          <SolarCalculator assumptions={content.calculator} />
        </section>

        {/* Service Strip */}
        <section className="service-strip">
          <div>
            <Wrench />
            <span>
              <b><T>Installation guidance</T></b>
              <small><T>Planned for your site</T></small>
            </span>
          </div>
          <div>
            <Sun />
            <span>
              <b><T>Solar consultation</T></b>
              <small><T>Options for your needs</T></small>
            </span>
          </div>
          <div>
            <MapPin />
            <span>
              <b><T>Based in Mirzapur</T></b>
              <small>{content.address}</small>
            </span>
          </div>
          <EnquiryTriggerButton className="service-strip-cta">
            <T hi="साइट विज़िट बुक करें">Book Site Visit</T> <ArrowRight size={15} />
          </EnquiryTriggerButton>
        </section>

        {/* FAQ Section */}
        <section className="faq-section" id="faq" aria-labelledby="home-faq-heading">
          <div>
            <span className="eyebrow"><T hi="अक्सर पूछे जाने वाले सवाल">FREQUENTLY ASKED QUESTIONS</T></span>
            <h2 id="home-faq-heading">
              <T hi="सोलर के बारे में सवाल?">Got Questions About Solar?</T>
            </h2>
            <p>
              <T hi="सही विकल्प आपकी जगह और बिजली की ज़रूरतों पर निर्भर करता है। हम समझने में आपकी पूरी मदद करेंगे।">
                The right choice depends on your site and electricity needs. Our Mirzapur team is always ready to guide you.
              </T>
            </p>
            <EnquiryTriggerButton className="text-link">
              <T hi="हमारे सोलर इंजीनियर से पूछें">Ask our solar engineer</T> <ArrowRight size={16} />
            </EnquiryTriggerButton>
          </div>
          <div className="faq-list">
            <details>
              <summary>
                <T hi="पीएम सूर्य घर योजना में कितनी सब्सिडी मिलती है?">
                  How much subsidy is provided under PM Surya Ghar Yojana?
                </T>
              </summary>
              <p>
                <T hi="1kW के लिए ₹30,000, 2kW के लिए ₹60,000, और 3kW या अधिक के लिए ₹78,000 की सीधी केंद्र सरकारी सब्सिडी सीधे आपके बैंक खाते में ट्रांसफर की जाती है।">
                  Under PM Surya Ghar, eligible residential installations receive up to ₹30,000 for 1kW, ₹60,000 for 2kW, and ₹78,000 for 3kW and above, credited directly to the beneficiary&apos;s bank account.
                </T>
              </p>
            </details>
            <details>
              <summary>
                <T hi="क्या रात में या बादल होने पर भी बिजली मिलेगी?">
                  Will I have electricity during night time or cloudy weather?
                </T>
              </summary>
              <p>
                <T hi="हाँ! ग्रिड-टाइड सिस्टम नेट-मीटरिंग के माध्यम से दिन में अतिरिक्त बिजली ग्रिड को भेजता है और रात में वहीं से वापस लेता है। वहीं हाइब्रिड सिस्टम में बैटरी बैकअप रहता है जिससे 24 घंटे निर्बाध बिजली मिलती है।">
                  Yes. Grid-tied systems export surplus daytime solar to UPPCL grid via net-metering and draw it back at night. Hybrid systems feature lithium/tubular batteries for seamless 24×7 backup during power cuts.
                </T>
              </p>
            </details>
            <details>
              <summary>
                <T hi="सोलर पैनल की लाइफ और वारंटी कितनी होती है?">
                  What is the operational lifespan and warranty of solar panels?
                </T>
              </summary>
              <p>
                <T hi="हमारे सभी टियर-1 मोनोक्रिस्टलाइन पैनल्स पर 25 साल की लीनियर परफॉर्मेंस वारंटी और इन्वर्टर पर 5-10 साल की मैन्युफैक्चरर वारंटी मिलती है।">
                  All our Tier-1 Mono PERC / Bifacial panels come with a 25-year performance warranty ensuring consistent generation, while inverters carry 5 to 10 years manufacturer warranty.
                </T>
              </p>
            </details>
          </div>
        </section>
      </main>

      <Footer brand={content.brand} phone={content.phone} address={content.address} />
    </>
  )
}
