import { ArrowRight, BadgeCheck, CircleDollarSign, Grid2x2, Sun } from 'lucide-react'
import { T } from '@/components/language/LanguageProvider'
import { EnquiryTriggerButton } from '@/components/ui/EnquiryTriggerButton'

const brands = ['WAAREE', 'HAVELLS', 'UTL', 'LOOM', 'DURSOLE', 'PAHAL', 'V SOLE']

export function BrandTrustStrip() {
  return (
    <section className="brand-trust-section" aria-labelledby="brand-trust-heading">
      <div className="brand-trust-inner">
        <div className="brand-trust-copy">
          <span className="brand-trust-eyebrow"><BadgeCheck size={15} aria-hidden="true" /><T hi="प्रीमियम सोलर ब्रांड्स के अधिकृत वितरक">Authorized Distributor of Premium Solar Brands</T></span>
          <h2 id="brand-trust-heading"><T hi="बिजली बिल घटाएं — सोलर अपनाएं">Reduce your power bill. Switch to solar.</T></h2>
          <p><T hi="On-Grid, Off-Grid और Hybrid — हर जरूरत के लिए सही समाधान।">On-Grid, Off-Grid and Hybrid systems, matched to your needs.</T></p>
          <div className="brand-trust-benefits">
            <span><Grid2x2 size={16} aria-hidden="true" /><T hi="एक ही छत के नीचे सभी ब्रांड">All brands under one roof</T></span>
            <span><CircleDollarSign size={16} aria-hidden="true" /><T hi="समान सिस्टम पर Best Price Guarantee">Best Price Guarantee on like-for-like systems</T></span>
            <span><Sun size={16} aria-hidden="true" /><T hi="अनुमानित 3–4 साल में लागत वापसी, फिर कई वर्षों तक सोलर उत्पादन; वास्तविक परिणाम सिस्टम और साइट पर निर्भर।">Indicative 3–4 year payback, followed by years of solar generation; actual results depend on your system and site.</T></span>
          </div>
        </div>

        <div className="brand-trust-panel">
          <span className="brand-trust-label"><T hi="हमारे प्रीमियम ब्रांड">OUR PREMIUM BRANDS</T></span>
          <ul className="brand-trust-list" aria-label="WAAREE, Havells, UTL, Loom, Dursole, Pahal and V Sole">
            {brands.map((brand) => <li key={brand}>{brand}</li>)}
          </ul>
          <p className="brand-trust-note"><T hi="उपलब्धता और अधिकृत उत्पाद विकल्प की पुष्टि कोटेशन के समय करें। बिजली बिल में बचत और लागत वापसी सिस्टम, उपयोग, टैरिफ और साइट पर निर्भर है।">Confirm product availability and authorized options at quotation. Bill savings and payback depend on system design, usage, tariffs and site conditions.</T></p>
          <EnquiryTriggerButton className="brand-trust-cta">
            <T hi="अपनी साइट के लिए कोटेशन पाएं">Get a site-specific quote</T><ArrowRight size={16} aria-hidden="true" />
          </EnquiryTriggerButton>
        </div>
      </div>
    </section>
  )
}
