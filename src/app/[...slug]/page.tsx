import type { Metadata } from 'next'
import Link from 'next/link'
import { ArrowRight, MapPin, Phone } from 'lucide-react'
import { Navigation } from '@/components/navigation/Navigation'
import { SolarCalculator } from '@/components/solar/SolarCalculator'
import { ContactForm } from '@/components/contact/ContactForm'
import { Footer } from '@/components/footer/Footer'
import { T } from '@/components/language/LanguageProvider'
import { getSiteContent } from '@/lib/site-content'
import { SitePhoto } from '@/components/ui/SitePhoto'

const pages: Record<string, { title: string; intro: string; body: string[] }> = {
  about: { title: 'Solar solutions, rooted in Mirzapur.', intro: 'Awadh Enterprises helps homes, businesses and institutions explore solar energy with local guidance.', body: ['We are based in Bari Basahi, Mirzapur, Uttar Pradesh.', 'Talk with our team about your property, electricity needs and the options available for your site.'] },
  products: { title: 'Solar products', intro: 'Explore the main components used in rooftop solar systems.', body: ['Solar panels convert sunlight into electricity.', 'Inverters convert solar power for use in your building and manage the system.', 'Batteries can store energy for compatible systems. Product availability and specifications are confirmed during consultation.'] },
  services: { title: 'Solar services', intro: 'Get help exploring a solar system from the first site conversation through installation planning.', body: ['Residential and commercial solar consultation', 'System planning and installation coordination', 'Product guidance and post-installation support'] },
  projects: { title: 'Solar projects', intro: 'Every rooftop and site has different requirements.', body: ['Project examples and customer installations will be added here as verified photographs and project details are approved for publication.', 'Contact us to discuss a property in Mirzapur and nearby areas.'] },
  'solar-solutions': { title: 'Solar solutions for every site', intro: 'The right solar system depends on your roof, electricity use and goals.', body: ['Residential: explore rooftop solar for your home.', 'Commercial: discuss the energy requirements of your shop, office or facility.', 'Institutional: plan a site assessment for a campus or public-serving institution.', 'The final system size, equipment and economics require a site-specific assessment.'] },
  'solar-calculator': { title: 'Get an indicative solar estimate', intro: 'Use your monthly electricity bill to get a rough system-size estimate.', body: [] },
  'pm-surya-ghar': { title: 'PM Surya Ghar', intro: 'The PM Surya Ghar: Muft Bijli Yojana is a Government of India programme for residential rooftop solar.', body: ['Eligibility, application steps and assistance amounts are set by the programme and can change. Check the official portal for current details.', 'Awadh Enterprises can help you discuss rooftop solar options and understand what information to prepare.'] },
  contact: { title: 'Let’s talk solar', intro: 'Share your requirements with Awadh Enterprises. Continue your enquiry directly in WhatsApp.', body: [] },
  'privacy-policy': { title: 'Privacy policy', intro: 'We respect the information you choose to share with us.', body: ['If you contact us by phone or WhatsApp, the details you provide are used to respond to your enquiry.', 'We do not claim to collect website enquiry forms in a database at this time. Contact us if you have a question about information you have shared.'] },
  terms: { title: 'Terms of use', intro: 'Information on this website is provided as a general introduction to solar options.', body: ['System sizing, pricing, availability, timelines and savings depend on a site assessment and final written proposal.', 'Programme rules and eligibility are governed by the relevant official sources.'] },
}

function titleCase(value: string) { return value.replace(/-/g, ' ').replace(/\b\w/g, letter => letter.toUpperCase()) }

export async function generateMetadata({ params }: { params: Promise<{ slug: string[] }> }): Promise<Metadata> {
  const { slug } = await params
  const route = slug.join('/')
  const site = await getSiteContent()
  const page = pages[slug[0]]
  const product = slug[0] === 'products' ? site.products.find(item => item.id === slug.at(-1) || item.name.toLowerCase().replace(/[^a-z0-9]+/g, '-') === slug.at(-1)) : undefined
  const title = product?.name ?? page?.title ?? `${titleCase(slug[0])} | ${site.brand}`
  return { title, description: product?.description ?? page?.intro ?? `Explore ${titleCase(route)} with ${site.brand} in Mirzapur.` }
}

export default async function ContentPage({ params }: { params: Promise<{ slug: string[] }> }) {
  const { slug } = await params
  const site = await getSiteContent()
  const route = slug.join('/')
  const page = pages[slug[0]]
  const product = slug[0] === 'products' ? site.products.find(item => item.id === slug.at(-1) || item.name.toLowerCase().replace(/[^a-z0-9]+/g, '-') === slug.at(-1)) : undefined
  const title = product?.name ?? (slug[0] === 'solar-solutions' && slug.length > 1 ? `${titleCase(slug.at(-1) ?? '')} Solar` : page?.title ?? titleCase(slug.at(-1) ?? 'Solar'))
  const isContact = slug[0] === 'contact'
  const isCalculator = slug[0] === 'solar-calculator'
  const isPm = slug[0] === 'pm-surya-ghar'
  const isProductsIndex = slug[0] === 'products' && slug.length === 1
  const nestedType = slug.length > 1 ? (slug[0] === 'products' ? 'Product category' : slug[0] === 'projects' ? 'Project details' : null) : null

  return <><Navigation brand={site.brand} phone={site.phone} address={site.address} /><main className="content-page"><div className="content-wrap">
      <div className="breadcrumb"><Link href="/"><T>Home</T></Link><span>/</span><span><T>{titleCase(route)}</T></span></div>
    <div className="content-grid"><section className="content-copy"><span className="eyebrow">{site.brand.toUpperCase()} · MIRZAPUR</span><h1><T>{product ? product.name : nestedType ? `${titleCase(slug.at(-1) ?? '')} ${nestedType.toLowerCase()}` : title}</T></h1><p className="page-intro"><T>{product?.description ?? (nestedType ? 'Details depend on product availability or verified project information. Contact our team to learn more.' : page?.intro ?? 'Contact our team to discuss solar options for your property.')}</T></p>
      {product && <div className="content-product"><SitePhoto src={product.image} sizes="(max-width: 950px) 90vw, 570px" alt={product.image.startsWith('/images/products/') ? `${product.name} category illustration` : undefined} /><div><b>{product.category}</b><p>{product.detail}</p>{product.quote && <p className="product-quote">{product.quote}</p>}<Link href="/contact" className="text-link">Enquire about this product <ArrowRight size={15}/></Link></div></div>}
      {isProductsIndex && <div className="route-product-grid">{site.products.map(item => <article key={item.id}><Link href={item.href} className="route-product-image" aria-label={`Open ${item.name}`}><SitePhoto src={item.image} alt="" sizes="(max-width: 720px) 90vw, 280px" /></Link><div><small>{item.category}</small><h2>{item.name}</h2><p>{item.description}</p>{item.quote && <p className="product-quote">{item.quote}</p>}<Link href={`/products/${item.id}`}>Product details <ArrowRight size={15}/></Link></div></article>)}</div>}
      {!isContact && !isCalculator && !product && <div className="content-details">{(page?.body ?? ['Ask us about your requirements and options for a site assessment.']).map(item => <p key={item}><T>{item}</T></p>)}{isPm && <a className="official-link" href="https://pmsuryaghar.gov.in/" target="_blank" rel="noreferrer"><T>Open the official PM Surya Ghar portal</T> <ArrowRight size={16} /></a>}</div>}
      {isContact && <><address className="contact-address"><MapPin size={18} /> {site.address}</address><a className="contact-phone" href={`tel:${site.phone.replace(/\D/g, '')}`}><Phone size={17} /> {site.phone}</a><ContactForm brand={site.brand}/></>}
      {isCalculator && <SolarCalculator assumptions={site.calculator}/>}
      {!isContact && !isCalculator && <Link href="/contact" className="primary-cta page-cta"><T>Talk to our team</T> <ArrowRight size={17} /></Link>}
    </section><aside className="content-aside"><span className="aside-sun">☀</span><h2><T>Sunlight today.</T><br /><T>Brighter tomorrow.</T></h2><p><T>Local solar guidance from</T> {site.brand} in Mirzapur.</p><Link href="/solar-solutions" className="text-link"><T>Explore solar solutions</T> <ArrowRight size={17} /></Link></aside></div>
  </div></main><Footer brand={site.brand} phone={site.phone} address={site.address} /></>
}
