'use client'

import { useMemo, useState } from 'react'
import type { SiteContent } from '@/lib/site-content'
import { T } from '@/components/language/LanguageProvider'

export function SolarCalculator({ assumptions }: { assumptions: SiteContent['calculator'] }) {
  const [bill, setBill] = useState(4000)
  const result = useMemo(() => {
    const monthlyUnits = bill / assumptions.rupeesPerUnit
    const systemKw = Math.max(1, Math.ceil(monthlyUnits / assumptions.monthlyUnitsPerKw))
    const panels = Math.ceil(systemKw * 1000 / assumptions.panelWatts)
    return { systemKw, panels, minCost: systemKw * assumptions.costPerKwMin, maxCost: systemKw * assumptions.costPerKwMax }
  }, [bill, assumptions])

  return <div className="calculator-card">
    <label htmlFor="monthly-bill"><T>Average monthly electricity bill</T></label>
    <div className="bill-value"><span className="money-emphasis">₹{bill.toLocaleString('en-IN')}</span> <small>/ <T>month</T></small></div>
    <input id="monthly-bill" type="range" min="1000" max="25000" step="500" value={bill} onChange={e => setBill(Number(e.target.value))} />
    <div className="range-labels"><span>₹1,000</span><span>₹25,000</span></div>
    <div className="estimate-results"><div><b>~{result.systemKw} kW</b><small><T>Indicative system size</T></small></div><div><b>~{result.panels} <T>panels</T></b><small><T>At around</T> {assumptions.panelWatts} W <T>each</T></small></div><div className="estimate-cost"><b className="money-emphasis">₹{(result.minCost / 100000).toFixed(2)}–{(result.maxCost / 100000).toFixed(2)} <T>lakh</T></b><small><T>Indicative installed cost range</T></small></div></div>
    <p className="estimate-note"><T hi={`केवल योजना के लिए अनुमान। आधार: ₹${assumptions.rupeesPerUnit} प्रति यूनिट, लगभग ${assumptions.monthlyUnitsPerKw} यूनिट प्रति kW प्रति माह और अनुमानित ₹${assumptions.costPerKwMin.toLocaleString('en-IN')}–₹${assumptions.costPerKwMax.toLocaleString('en-IN')} प्रति kW। वास्तविक उत्पादन, डिज़ाइन और कोटेशन साइट, छत, उपकरण और टैरिफ के अनुसार बदलेंगे। इसमें सब्सिडी शामिल नहीं है; बचत की गारंटी नहीं है।`}>{`Planning estimate only. Based on ₹${assumptions.rupeesPerUnit} per unit, about ${assumptions.monthlyUnitsPerKw} units per kW monthly, and an indicative ₹${assumptions.costPerKwMin.toLocaleString('en-IN')}–₹${assumptions.costPerKwMax.toLocaleString('en-IN')} per kW. Actual output, design and quote vary by site, roof, equipment and tariff. Subsidies are not included; no savings are guaranteed.`}</T></p>
  </div>
}
