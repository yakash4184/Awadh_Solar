'use client'

import { useEffect, useMemo, useState } from 'react'
import type { ChangeEvent } from 'react'
import { useRouter } from 'next/navigation'
import { ArrowDown, ArrowRight, ArrowUp, Check, ImagePlus, LockKeyhole, MapPin, Pencil, Plus, Save, Trash2, X, Zap } from 'lucide-react'
import { T, useLanguage } from '@/components/language/LanguageProvider'
import type { Project } from '@/lib/site-content'
import { ADMIN_TAB_SESSION_KEY } from '@/components/admin/AdminTabSessionGuard'

const categories = ['All Projects', 'Residential', 'Commercial', 'Industrial'] as const
type Filter = (typeof categories)[number]
const demoProjects: Project[] = [
  { id: 'demo-residential', title: 'DEMO — Residential Rooftop Solar', description: 'Sample project details. Replace this text and photo with your completed home installation.', category: 'Residential', location: 'Mirzapur (demo)', capacity: '5 kW (demo)', image: '/images/projects/residential-rooftop-growatt.jpg' },
  { id: 'solar-panel-stock', title: 'Solar Panels Ready for Installation', description: 'Solar panels stacked and ready for upcoming rooftop installations. Talk to our team about panel selection and a system tailored to your property.', category: 'Commercial', location: '', capacity: '', image: '/images/projects/solar-panel-stock.png' },
  { id: 'farmhouse-rooftop', title: 'Farmhouse Rooftop Solar', description: 'Elevated rooftop solar panels on a rural home, with farmland surrounding the property. Explore a solar setup designed for your roof and energy needs.', category: 'Residential', location: '', capacity: '', image: '/images/projects/farmhouse-rooftop-solar.png' },
]
function updateFarmhouseProject(project: Project): Project {
  if (project.id === 'demo-commercial' || project.title === 'DEMO — Commercial Solar Installation') {
    return { ...project, title: 'Solar Panels Ready for Installation', description: 'Solar panels stacked and ready for upcoming rooftop installations. Talk to our team about panel selection and a system tailored to your property.', category: 'Commercial', location: '', capacity: '', image: '/images/projects/solar-panel-stock.png' }
  }
  if (project.id === 'demo-industrial' || project.title === 'DEMO — Institutional Solar System') {
    return { ...project, title: 'Farmhouse Rooftop Solar', description: 'Elevated rooftop solar panels on a rural home, with farmland surrounding the property. Explore a solar setup designed for your roof and energy needs.', category: 'Residential', location: '', capacity: '', image: '/images/projects/farmhouse-rooftop-solar.png' }
  }
  return project
}
function isDemoProject(project: Project) {
  return project.id.startsWith('demo-') || /^demo\s*[—-]/i.test(project.title) || /\(demo\)/i.test(`${project.location} ${project.capacity}`) || /sample project/i.test(project.description)
}

export function ProjectShowcase({ projects, heading, subheading, canEdit = false }: { projects: Project[]; heading: string; subheading: string; canEdit?: boolean }) {
  const [filter, setFilter] = useState<Filter>('All Projects')
  const [items, setItems] = useState(projects.map(updateFarmhouseProject))
  const [title, setTitle] = useState(heading)
  const [intro, setIntro] = useState(subheading)
  const [editing, setEditing] = useState(false)
  const [saving, setSaving] = useState(false)
  const [notice, setNotice] = useState('')
  const [uploading, setUploading] = useState<string | null>(null)
  const [demoMode, setDemoMode] = useState(projects.some(isDemoProject))
  const [tabSessionActive, setTabSessionActive] = useState(false)
  const { language } = useLanguage()
  const router = useRouter()
  const visibleProjects = useMemo(
    () => {
      const published = items.filter(project => project.title.trim() && project.image.trim())
      return filter === 'All Projects' ? published : published.filter((project) => project.category === filter)
    },
    [filter, items],
  )
  useEffect(() => {
    const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming | undefined
    const sessionIsActive = sessionStorage.getItem(ADMIN_TAB_SESSION_KEY) === 'active' && navigation?.type !== 'reload'
    if (!canEdit || !sessionIsActive) return
    setTabSessionActive(true)
    if (new URLSearchParams(window.location.search).get('edit') === 'projects') {
      if (!projects.length) { setItems(demoProjects); setDemoMode(true) }
      else if (projects.some(isDemoProject)) setDemoMode(true)
      setEditing(true)
      window.history.replaceState(null, '', window.location.pathname)
    }
  }, [canEdit, projects])
  function openEditor() {
    if (!projects.length && !items.length) { setItems(demoProjects); setDemoMode(true) }
    else if (items.some(isDemoProject)) setDemoMode(true)
    setEditing(true)
  }
  function closeEditor() {
    if (demoMode) { setItems(projects.map(updateFarmhouseProject)); setTitle(heading); setIntro(subheading); setDemoMode(false) }
    setEditing(false)
  }
  function addProject() {
    const category = filter === 'All Projects' ? 'Residential' : filter
    setItems(current => [...current, { id: crypto.randomUUID(), title: '', description: '', category, location: '', capacity: '', image: '' }])
  }
  function changeProject(id: string, field: keyof Project, value: string) {
    setItems(current => current.map(item => item.id === id ? { ...item, id: item.id.startsWith('demo-') ? crypto.randomUUID() : item.id, [field]: value } as Project : item))
  }
  async function uploadPhoto(id: string, event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0]
    event.target.value = ''
    if (!file) return
    setUploading(id); setNotice('')
    try {
      const form = new FormData(); form.set('file', file)
      const response = await fetch('/api/admin/upload', { method: 'POST', body: form })
      const data = await response.json() as { url?: string; error?: string }
      if (!response.ok || !data.url) throw new Error(data.error || 'Photo upload failed.')
      changeProject(id, 'image', data.url)
    } catch (error) { setNotice(error instanceof Error ? error.message : 'Photo upload failed.') }
    finally { setUploading(null) }
  }
  async function publish() {
    setSaving(true); setNotice('')
    try {
      const response = await fetch('/api/admin/projects', { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ heading: title, subheading: intro, projects: items }) })
      const data = await response.json() as { error?: string }
      if (!response.ok) throw new Error(data.error || 'Could not publish projects.')
      setNotice('Changes saved and published.'); setDemoMode(items.some(isDemoProject)); setEditing(false)
      return true
    } catch (error) { setNotice(error instanceof Error ? error.message : 'Could not publish projects.') }
    finally { setSaving(false) }
    return false
  }
  async function saveAndLock() {
    if (uploading || saving) return
    if (!await publish()) return
    sessionStorage.removeItem(ADMIN_TAB_SESSION_KEY)
    await fetch('/api/admin/logout', { method: 'POST' })
    router.replace('/admin/login')
  }
  const filterHindi: Record<Filter, string> = {
    'All Projects': 'सभी प्रोजेक्ट',
    Residential: 'आवासीय',
    Commercial: 'कमर्शियल',
    Industrial: 'इंडस्ट्रियल',
  }
  const categoryHindi: Record<Project['category'], string> = {
    Residential: 'आवासीय',
    Commercial: 'कमर्शियल',
    Industrial: 'इंडस्ट्रियल',
  }

  return (
    <section id="projects-showcase" className="projects-showcase-section" aria-labelledby="showcase-heading">
      <div className="section-heading">
        <span className="eyebrow"><Zap size={14} className="text-blue-600 inline mr-1" /><T hi="🏗️ हमारे Projects">OUR PROJECTS</T></span>
        <h2 id="showcase-heading">{title}</h2>
        <p>{intro}</p>
        <div className="project-edit-entry">
          {canEdit && tabSessionActive && <button type="button" onClick={openEditor} aria-label="Edit projects" title="Edit projects"><Pencil size={17}/> <span>Edit projects</span></button>}
        </div>
      </div>

      <div className="project-filters" role="group" aria-label={language === 'hi' ? 'प्रोजेक्ट श्रेणी चुनें' : 'Filter projects by category'}>
        {categories.map((category) => (
          <button
            type="button"
            key={category}
            className={filter === category ? 'active' : ''}
            aria-pressed={filter === category}
            onClick={() => setFilter(category)}
          >
            {language === 'hi' ? filterHindi[category] : category}
          </button>
        ))}
      </div>
      {notice && !editing && <p className="project-editor-published" role="status">{notice}</p>}

      {visibleProjects.length ? (
        <div className="showcase-grid project-gallery-grid" aria-live="polite">
          {visibleProjects.map((project) => (
            <article className="showcase-card project-gallery-card" key={project.id}>
              <div className="showcase-image-wrap">
                <img src={project.image} alt={project.title} loading="lazy" decoding="async" />
                <span className={`showcase-badge ${project.category.toLowerCase()}`}>
                  {language === 'hi' ? categoryHindi[project.category] : project.category}
                </span>
                {(project.location || project.capacity) && (
                  <span className="showcase-location">
                    {project.location && <><MapPin size={12} aria-hidden="true" />{project.location}</>}
                    {project.capacity && <><Zap size={12} aria-hidden="true" />{project.capacity}</>}
                  </span>
                )}
              </div>
              <div className="showcase-content">
                <h3>{project.title}</h3>
                {project.description && <p>{project.description}</p>}
                <a className="project-gallery-link" href="/#contact">
                  <T hi="इसी तरह का प्रोजेक्ट पूछें">Ask about a similar project</T><ArrowRight size={15} aria-hidden="true" />
                </a>
              </div>
            </article>
          ))}
        </div>
      ) : (
        <p className="project-gallery-empty" aria-live="polite">
          <T hi="इस श्रेणी में प्रोजेक्ट जल्द जोड़े जाएंगे।">Projects in this category will be added soon.</T>
        </p>
      )}
      {editing && canEdit && tabSessionActive && <div className="project-editor-backdrop" onMouseDown={event => { if (event.target === event.currentTarget) closeEditor() }}>
        <section className="project-editor-panel" role="dialog" aria-modal="true" aria-labelledby="project-editor-title">
          <header className="project-editor-header"><div><span>HOMEPAGE PROJECTS</span><h2 id="project-editor-title">Manage your projects</h2><p>Add photos and edit the details customers see.</p></div><button type="button" className="project-editor-close" onClick={closeEditor} aria-label="Close editor"><X/></button></header>
          {demoMode && <div className="project-editor-demo-note"><b>Demo content</b><span>These sample cards are visible in the Projects section. Replace their photos and details with your real installation information whenever ready.</span></div>}
          <div className="project-enquiry-settings"><div><b>Google Form &amp; Sheet connection</b><p>Choose where website popup enquiries are saved. Admin login is required to change settings.</p></div><a href="/admin/enquiries"><LockKeyhole size={16}/> Manage enquiry links →</a></div>
          <div className="project-editor-section-fields"><label>Section heading<input value={title} onChange={e => setTitle(e.target.value)} maxLength={140}/></label><label>Section description<textarea value={intro} onChange={e => setIntro(e.target.value)} maxLength={500} rows={2}/></label></div>
          <div className="project-editor-toolbar"><div className="project-editor-tabs">{categories.map(category => <button type="button" key={category} className={filter === category ? 'active' : ''} onClick={() => setFilter(category)}>{category}</button>)}</div><button type="button" className="project-editor-add" onClick={addProject}><Plus size={17}/> Add project</button></div>
          <div className="project-editor-list">{items.map((project, index) => <article className="project-editor-card" key={project.id}>
            <div className="project-editor-card-head"><b>Project {index + 1}</b><div><button type="button" aria-label="Move project up" disabled={index === 0} onClick={() => setItems(current => { const next=[...current]; [next[index-1],next[index]]=[next[index],next[index-1]]; return next })}><ArrowUp size={16}/></button><button type="button" aria-label="Move project down" disabled={index === items.length-1} onClick={() => setItems(current => { const next=[...current]; [next[index+1],next[index]]=[next[index],next[index+1]]; return next })}><ArrowDown size={16}/></button><button type="button" className="delete" onClick={() => setItems(current => current.filter(item => item.id !== project.id))}><Trash2 size={15}/> Delete</button></div></div>
            <div className="project-editor-card-body"><div className="project-editor-photo">{project.image ? <img src={project.image} alt="Project preview"/> : <div><ImagePlus size={25}/><span>No photo selected</span></div>}<label className="project-editor-upload">{uploading === project.id ? 'Uploading…' : project.image ? 'Replace photo' : 'Upload photo'}<input type="file" accept="image/jpeg,image/png,image/webp,image/avif" onChange={event => void uploadPhoto(project.id, event)}/></label></div>
              <div className="project-editor-fields"><label>Project title<input value={project.title} onChange={e => changeProject(project.id,'title',e.target.value)} placeholder="e.g. Rooftop solar installation" maxLength={140}/></label><label>Category<select value={project.category} onChange={e => changeProject(project.id,'category',e.target.value)}><option>Residential</option><option>Commercial</option><option>Industrial</option></select></label><label className="wide">Details<textarea value={project.description} onChange={e => changeProject(project.id,'description',e.target.value)} placeholder="Short project description" maxLength={500} rows={2}/></label><label>Location<input value={project.location} onChange={e => changeProject(project.id,'location',e.target.value)} placeholder="Mirzapur" maxLength={120}/></label><label>Capacity<input value={project.capacity} onChange={e => changeProject(project.id,'capacity',e.target.value)} placeholder="e.g. 5 kW" maxLength={80}/></label></div>
            </div>
          </article>)}{items.length === 0 && <p className="project-editor-empty">No projects added yet. Add your first project and upload its photo.</p>}</div>
          <footer className="project-editor-footer"><span>{items.length} project{items.length === 1 ? '' : 's'}</span>{notice && <p role="status">{notice}</p>}<div className="project-editor-footer-actions"><button type="button" className="project-editor-lock" onClick={() => void saveAndLock()} disabled={saving || Boolean(uploading)}><LockKeyhole size={16}/> Save & lock</button><button type="button" onClick={() => void publish()} disabled={saving || Boolean(uploading)}><Save size={17}/>{saving ? 'Publishing…' : 'Save & publish'} <Check size={16}/></button></div></footer>
        </section>
      </div>}
    </section>
  )
}
