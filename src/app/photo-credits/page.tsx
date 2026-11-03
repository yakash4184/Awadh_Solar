import type { Metadata } from 'next'
import Link from 'next/link'
import { ArrowLeft, ArrowUpRight } from 'lucide-react'
import { Navigation } from '@/components/navigation/Navigation'
import { Footer } from '@/components/footer/Footer'
import { T } from '@/components/language/LanguageProvider'
import { SitePhoto } from '@/components/ui/SitePhoto'
import { getSiteContent } from '@/lib/site-content'
import { sitePhotos } from '@/lib/site-photos'

export const metadata: Metadata = { title: 'Photo credits' }
export const dynamic = 'force-dynamic'

export default async function PhotoCreditsPage() {
  const site = await getSiteContent()
  return <>
    <Navigation brand={site.brand} phone={site.phone} address={site.address} />
    <main className="photo-credits-page">
      <Link className="text-link" href="/"><ArrowLeft size={16} /><T hi="होम पर वापस जाएं">Back to home</T></Link>
      <span className="eyebrow"><T hi="भारत की तस्वीरें">PHOTOGRAPHED IN INDIA</T></span>
      <h1><T hi="तस्वीरों का श्रेय">Photo credits</T></h1>
      <p className="credits-intro"><T hi="उत्तर प्रदेश के गाँव और भारत की सोलर तस्वीरें। ये क्षेत्र और सोलर के उदाहरण हैं; इन्हें अवध एंटरप्राइज़ेज़ के किए हुए प्रोजेक्ट के रूप में प्रस्तुत नहीं किया गया है।">Real places in Uttar Pradesh and solar photography from India. These images illustrate the region and solar use; they are not presented as installations completed by Awadh Enterprises.</T></p>
      <div className="photo-credits-grid">
        {sitePhotos.map(photo => <article key={photo.src}>
          <div className="credit-photo"><SitePhoto src={photo.src} sizes="(max-width: 720px) 90vw, 43vw" /></div>
          <div className="credit-copy"><small>{photo.location}</small><h2>{photo.title}</h2><p>© {photo.author}</p>
            <p><a href={photo.source} target="_blank" rel="noreferrer"><T hi="मूल तस्वीर">Original photograph</T><ArrowUpRight size={14}/></a> · <a href={photo.licenseUrl} target="_blank" rel="noreferrer">{photo.license}</a></p>
            <a href={photo.src} className="text-link"><T hi="4K तस्वीर देखें">View 4K image</T><ArrowUpRight size={15}/></a>
          </div>
        </article>)}
      </div>
      <p className="credits-note"><T hi="तस्वीरों को अलग-अलग स्क्रीन के लिए छोटा करके WebP में बदला गया है। दिखाने के लिए किनारे कट सकते हैं। बदली हुई फाइलें भी बताई गई लाइसेंस शर्तों के अंतर्गत हैं। दुकान की तस्वीर व्यवसाय द्वारा दी गई है। उत्पादों के चित्र केवल श्रेणी समझाने के लिए हैं।">Photographs have been resized and compressed to WebP. Display crops vary by screen. These adapted image files remain available under their respective licenses above. The showroom photograph is supplied by the business. Product illustrations represent categories, not specific models.</T></p>
    </main>
    <Footer brand={site.brand} phone={site.phone} address={site.address} />
  </>
}
