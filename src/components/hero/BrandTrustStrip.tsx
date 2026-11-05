import { BadgeCheck, CircleDollarSign, Grid2x2, Sun } from 'lucide-react'
import { T } from '@/components/language/LanguageProvider'

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

      </div>
    </section>
  )
}
