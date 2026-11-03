'use client'

import { useEffect, useState } from 'react'
import { ExternalLink, LockKeyhole, Save, Sheet } from 'lucide-react'
import { T, useLanguage } from '@/components/language/LanguageProvider'

type PopupCopy = { badgeEn: string; badgeHi: string; headingEn: string; headingHi: string; introEn: string; introHi: string; submitEn: string; submitHi: string }
type Settings = { enabled: boolean; formUrl?: string; sheetUrl?: string; endpoint: string; hasToken: boolean; popup: PopupCopy }
const defaultPopup: PopupCopy = {
  badgeEn: 'Govt. Subsidy Up to ₹78,000', badgeHi: 'सरकारी सब्सिडी ₹78,000 तक',
  headingEn: 'Get a Free Solar Rooftop Quote', headingHi: 'मुफ्त सोलर साइट सर्वे एवं कोटेशन',
  introEn: 'Fill out this quick form. Our local solar engineers will estimate your savings and guide you step-by-step.',
  introHi: 'अपनी आवश्यकता बताएं। हमारे विशेषज्ञ आपकी छत का आकलन कर सही समाधान देंगे।',
  submitEn: 'Get Free Quote & Site Survey', submitHi: 'मुफ्त कोटेशन और साइट सर्वे पाएं',
}

export function EnquiryManager() {
  const [formUrl, setFormUrl] = useState('')
  const [sheetUrl, setSheetUrl] = useState('')
  const [enabled, setEnabled] = useState(false)
  const [endpoint, setEndpoint] = useState('')
  const [token, setToken] = useState('')
  const [hasToken, setHasToken] = useState(false)
  const [popup, setPopup] = useState<PopupCopy>(defaultPopup)
  const [status, setStatus] = useState('')
  const [busy, setBusy] = useState(false)
  const { language } = useLanguage()
  const hi = language === 'hi'

  useEffect(() => {
    fetch('/api/admin/enquiry-settings')
      .then(response => {
        if (!response.ok) throw new Error('Settings unavailable')
        return response.json() as Promise<Settings>
      })
      .then(settings => {
        setEnabled(settings.enabled)
        setFormUrl(settings.formUrl || '')
        setSheetUrl(settings.sheetUrl || '')
        setEndpoint(settings.endpoint)
        setHasToken(settings.hasToken)
        setPopup({ ...defaultPopup, ...settings.popup })
      })
      .catch(() => setStatus(hi ? 'सेटिंग लोड नहीं हुई।' : 'Could not load settings.'))
  }, [hi])

  async function save() {
    setBusy(true)
    setStatus('')
    try {
      const response = await fetch('/api/admin/enquiry-settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ enabled, endpoint, token, popup, formUrl, sheetUrl }),
      })
      const data = await response.json() as { error?: string }
      if (!response.ok) throw new Error(data.error)
      setHasToken(Boolean(token) || hasToken)
      setToken('')
      setStatus(hi ? 'सेटिंग सेव हो गई।' : 'Settings saved.')
    } catch {
      setStatus(hi ? 'URL और कम से कम 24 अक्षरों वाला सीक्रेट जाँचें।' : 'Could not save. Check the URL and 24+ character secret.')
    } finally {
      setBusy(false)
    }
  }

  return (
    <section className="admin-panel editor-panel">
      <h2><T hi="पूछताछ प्रबंधन · Google Sheets">Popup enquiries · Google Sheets</T></h2>
      <p>
        <T hi="वेबसाइट पॉपअप की हर पूछताछ आपकी Google Sheet में सेव होगी। चाहें तो उस Sheet को Google Form से लिंक कर सकते हैं।">
          Send website popup enquiries to your Google Sheet. You can link that Sheet to a Google Form if you want to collect responses there too.
        </T>
      </p>

      <div className="google-setup-links">
        <a href="https://forms.new" target="_blank" rel="noreferrer">
          <ExternalLink size={16} />
          <span><b><T hi="Google Form बनाएं">Create a Google Form</T></b><small>forms.new</small></span>
        </a>
        <a href="https://sheets.new" target="_blank" rel="noreferrer">
          <Sheet size={17} />
          <span><b><T hi="Google Sheet बनाएं">Create a Google Sheet</T></b><small>sheets.new</small></span>
        </a>
      </div>

      <div className="popup-copy-editor">
        <h3><T hi="पॉपअप का टेक्स्ट">Popup wording</T></h3>
        <div className="admin-fields popup-copy-fields">
          <label>Offer badge — English<input maxLength={100} value={popup.badgeEn} onChange={event => setPopup(current => ({ ...current, badgeEn: event.target.value }))} /></label>
          <label>Offer badge — हिन्दी<input maxLength={100} value={popup.badgeHi} onChange={event => setPopup(current => ({ ...current, badgeHi: event.target.value }))} /></label>
          <label>Popup heading — English<input maxLength={140} value={popup.headingEn} onChange={event => setPopup(current => ({ ...current, headingEn: event.target.value }))} /></label>
          <label>Popup heading — हिन्दी<input maxLength={140} value={popup.headingHi} onChange={event => setPopup(current => ({ ...current, headingHi: event.target.value }))} /></label>
          <label>Description — English<textarea rows={3} maxLength={400} value={popup.introEn} onChange={event => setPopup(current => ({ ...current, introEn: event.target.value }))} /></label>
          <label>Description — हिन्दी<textarea rows={3} maxLength={400} value={popup.introHi} onChange={event => setPopup(current => ({ ...current, introHi: event.target.value }))} /></label>
          <label>Submit button — English<input maxLength={80} value={popup.submitEn} onChange={event => setPopup(current => ({ ...current, submitEn: event.target.value }))} /></label>
          <label>Submit button — हिन्दी<input maxLength={80} value={popup.submitHi} onChange={event => setPopup(current => ({ ...current, submitHi: event.target.value }))} /></label>
        </div>
      </div>

      <div className="admin-fields">
        <label>Google Form link<input type="url" value={formUrl} onChange={e => setFormUrl(e.target.value)} placeholder="https://docs.google.com/forms/d/…/viewform" /></label>
        <label>Google Sheet link<input type="url" value={sheetUrl} onChange={e => setSheetUrl(e.target.value)} placeholder="https://docs.google.com/spreadsheets/d/…/edit" /></label>
        <p className="google-setup-note">These links are saved for your reference. Website enquiries reach the Sheet through the Apps Script URL below; a Form or Sheet link alone cannot receive website submissions.</p>
        <label>
          <span><input type="checkbox" checked={enabled} onChange={event => setEnabled(event.target.checked)} />{' '}
            <T hi="Google Sheets में पूछताछ सेव करें">Enable Google Sheets enquiries</T>
          </span>
        </label>
        <label>
          <T hi="Apps Script का deployed URL">Apps Script web app URL</T>
          <input type="url" value={endpoint} onChange={event => setEndpoint(event.target.value)} placeholder="https://script.google.com/macros/s/…/exec" />
        </label>
        <label>
          <T hi="साझा सीक्रेट (कम से कम 24 अक्षर)">Shared secret (at least 24 characters)</T>
          <input type="password" autoComplete="new-password" value={token} onChange={event => setToken(event.target.value)} />
          <small>{hasToken
            ? <T hi="सीक्रेट सेव है। बदलना न हो तो खाली छोड़ें।">A secret is saved. Leave blank to keep it.</T>
            : <T hi="यही सीक्रेट Apps Script properties में भी डालें।">Use the same secret in Apps Script properties.</T>}
          </small>
        </label>
        <button type="button" className="publish-button" disabled={busy} onClick={() => void save()}>
          <Save size={16} /><T hi="सेटिंग सेव करें">Save destination</T>
        </button>
        {status && <p role="status">{status}</p>}
        <p className="google-setup-note"><LockKeyhole size={15} /><T hi="गोपनीय सीक्रेट सुरक्षित रखा जाता है। सेटअप गाइड में पूरा तरीका देखें।">Your secret stays private. Follow the guide to finish setup.</T></p>
        <a href="/guides/google-sheets-setup.txt" target="_blank" rel="noreferrer" className="text-link">
          <T hi="सेटअप गाइड खोलें">Open setup guide</T> ↗
        </a>
      </div>
    </section>
  )
}
