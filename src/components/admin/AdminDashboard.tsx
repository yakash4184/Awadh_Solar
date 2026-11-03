'use client'

import { EnquiryManager } from './EnquiryManager'
import { ExperienceEditor } from './ExperienceEditor'
import { LanguageSwitcher } from '@/components/language/LanguageProvider'
import { useMemo, useState } from 'react'
import { useRouter } from 'next/navigation'
import { ArrowDown, ArrowDownToLine, ArrowRight, ArrowUp, Banknote, Boxes, Check, ChevronRight, CircleHelp, House, ImagePlus, LayoutDashboard, LockKeyhole, LogOut, MapPin, Package, Plus, Save, Settings2, ShieldCheck, ShoppingBag, Store, Trash2, Upload, WalletCards } from 'lucide-react'
import type { Product, Project, ProjectCategory, SiteContent, Solution } from '@/lib/site-content'

type Section = 'enquiries' | 'overview' | 'brand' | 'media' | 'calculator' | 'contact'
const nav: { id: Section; label: string; icon: typeof LayoutDashboard; hint?: string }[] = [
  { id: 'enquiries', label: 'Enquiries / पूछताछ', icon: Settings2 },
  { id: 'overview', label: 'Overview', icon: LayoutDashboard },
  { id: 'brand', label: 'Website content', icon: Store, hint: 'Brand & hero' },
  { id: 'media', label: 'Photos & products', icon: ImagePlus },
  { id: 'calculator', label: 'Solar costing', icon: Banknote },
  { id: 'contact', label: 'Store profile', icon: Settings2 },
]

export function AdminDashboard({ initialContent, adminId }: { initialContent: SiteContent; adminId: string }) {
  const [content, setContent] = useState(initialContent)
  const [section, setSection] = useState<Section>('overview')
  const [dirty, setDirty] = useState(false)
  const [saving, setSaving] = useState(false)
  const [uploading, setUploading] = useState<string | null>(null)
  const [notice, setNotice] = useState<{ kind: 'success' | 'error'; text: string } | null>(null)
  const router = useRouter()

  const update = <K extends keyof SiteContent>(key: K, value: SiteContent[K]) => { setContent(current => ({ ...current, [key]: value })); setDirty(true); setNotice(null) }
  const updateSolution = (id: string, key: keyof Solution, value: string) => { setContent(current => ({ ...current, solutions: current.solutions.map(item => item.id === id ? { ...item, [key]: value } : item) })); setDirty(true); setNotice(null) }
  const updateProduct = (id: string, key: keyof Product, value: string) => { setContent(current => ({ ...current, products: current.products.map(item => item.id === id ? { ...item, [key]: value } : item) })); setDirty(true); setNotice(null) }
  const updateProject = <K extends keyof Project,>(id: string, key: K, value: Project[K]) => { setContent(current => ({ ...current, projects: current.projects.map(item => item.id === id ? { ...item, [key]: value } : item) })); setDirty(true); setNotice(null) }
  const moveSolutions = (index: number, delta: number) => update('solutions', moveItem(content.solutions, index, delta))
  const moveProducts = (index: number, delta: number) => update('products', moveItem(content.products, index, delta))
  const imageCount = useMemo(() => [content.heroPhoto, content.showroomPhoto, ...content.projects.map(x => x.image), ...content.solutions.map(x => x.image), ...content.products.map(x => x.image)].filter(Boolean).length, [content])

  async function upload(file: File | undefined, apply: (url: string) => void, key: string) {
    if (!file) return
    setUploading(key); setNotice(null)
    try {
      const form = new FormData(); form.set('file', file)
      const response = await fetch('/api/admin/upload', { method: 'POST', body: form })
      const result = await response.json() as { url?: string; error?: string }
      if (!response.ok || !result.url) throw new Error(result.error ?? 'Upload failed.')
      apply(result.url); setNotice({ kind: 'success', text: `${file.name} uploaded. Save & publish to put it on the website.` })
    } catch (error) { setNotice({ kind: 'error', text: error instanceof Error ? error.message : 'Could not upload that image.' }) }
    finally { setUploading(null) }
  }

  async function save() {
    setSaving(true); setNotice(null)
    try {
      const response = await fetch('/api/admin/content', { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(content) })
      const result = await response.json() as { error?: string }
      if (!response.ok) throw new Error(result.error ?? 'Could not save changes.')
      setDirty(false); setNotice({ kind: 'success', text: 'Changes published to the public website.' })
      return true
    } catch (error) { setNotice({ kind: 'error', text: error instanceof Error ? error.message : 'Could not save changes.' }) }
    finally { setSaving(false) }
    return false
  }

  async function logout() {
    sessionStorage.removeItem('awadh-admin-tab-session')
    await fetch('/api/admin/logout', { method: 'POST' })
    router.replace('/admin/login'); router.refresh()
  }

  async function saveAndLock() {
    if (uploading) return
    if (dirty && !await save()) return
    await logout()
  }

  const selected = nav.find(item => item.id === section)!
  return <div className="admin-shell">
    <aside className="admin-sidebar">
      <a href="/" className="admin-brand"><span className="admin-brand-icon">☀</span><span><b>AWADH</b><small>ENTERPRISES</small></span></a>
      <div className="admin-workspace-label">WORKSPACE</div>
      <nav className="admin-side-nav" aria-label="Dashboard sections">{nav.map(({ id, label, icon: Icon, hint }) => <button type="button" key={id} className={section === id ? 'selected' : ''} onClick={() => { setSection(id); setNotice(null) }}><Icon size={18}/><span>{label}{hint && <small>{hint}</small>}</span>{section === id && <ChevronRight className="nav-chevron" size={15}/>}</button>)}</nav>
      <div className="sidebar-spacer"/>
      <a className="admin-view-site" href="/" target="_blank" rel="noreferrer"><ArrowDownToLine size={16}/> View public website <ArrowRight size={14}/></a>
      <button type="button" className="admin-logout" onClick={logout}><LogOut size={17}/> Sign out</button>
      <div className="admin-user"><span>{adminId.slice(0,1).toUpperCase()}</span><div><b>{adminId}</b><small>Website administrator</small></div><ShieldCheck size={16}/></div>
    </aside>
    <main className="admin-main">
      <header className="admin-topbar"><div><div className="admin-crumb">Awadh workspace <ChevronRight size={14}/><b>{selected.label}</b></div><p>Manage what your customers see on the {content.brand} website.</p></div><div className="admin-header-actions"><LanguageSwitcher/><span className="admin-live"><i/> Dashboard secure</span><button type="button" className="publish-button" onClick={save} disabled={!dirty || saving || Boolean(uploading)}><Save size={16}/>{saving ? 'Publishing…' : 'Save & publish'}</button><button type="button" className="admin-lock-button" onClick={() => void saveAndLock()} disabled={saving || Boolean(uploading)}><LockKeyhole size={16}/><span>{dirty ? 'Save & lock' : 'Lock dashboard'}</span></button></div></header>
      <div className="admin-content">
        {notice && <div className={`admin-notice ${notice.kind}`} role="status">{notice.kind === 'success' ? <Check size={17}/> : <CircleHelp size={17}/>} {notice.text}<button type="button" onClick={() => setNotice(null)} aria-label="Dismiss notification">×</button></div>}
        {section === 'enquiries' && <EnquiryManager/>}
        {section === 'overview' && <Overview content={content} imageCount={imageCount} onSelect={setSection}/>}
        {section === 'brand' && <ExperienceEditor content={content} update={update}/>}
        {section === 'brand' && <BrandEditor content={content} update={update} upload={upload} uploading={uploading}/>}
        {section === 'media' && <MediaEditor content={content} update={update} updateSolution={updateSolution} updateProduct={updateProduct} updateProject={updateProject} moveSolutions={moveSolutions} moveProducts={moveProducts} upload={upload} uploading={uploading}/>}
        {section === 'calculator' && <CalculatorEditor content={content} update={update}/>}
        {section === 'contact' && <ContactEditor content={content} update={update}/>}
      </div>
      <footer className="admin-footer"><span>Changes are saved on this website’s server.</span><span>Signed in as <b>{adminId}</b></span></footer>
    </main>
  </div>
}

function moveItem<T,>(items: T[], index: number, delta: number): T[] {
  const target = index + delta
  if (target < 0 || target >= items.length) return items
  const reordered = [...items]
  ;[reordered[index], reordered[target]] = [reordered[target], reordered[index]]
  return reordered
}

function SectionIntro({ eyebrow, title, text }: { eyebrow: string; title: string; text: string }) { return <div className="admin-section-intro"><span>{eyebrow}</span><h1>{title}</h1><p>{text}</p></div> }

function Overview({ content, imageCount, onSelect }: { content: SiteContent; imageCount: number; onSelect: (s: Section) => void }) {
  return <><div className="admin-welcome"><div><span className="welcome-label">YOUR BUSINESS · YOUR WEBSITE</span><h1>Good day. Let’s make your storefront shine.</h1><p>Update your store photo, solar products and customer-facing details in one place.</p></div><span className="welcome-sun">☀</span></div>
    <div className="admin-stat-grid"><Stat icon={ImagePlus} label="Website images" value={imageCount.toString()} foot="Ready to manage"/><Stat icon={ShoppingBag} label="Products listed" value={content.products.length.toString()} foot="Shown on your website"/><Stat icon={House} label="Solar solutions" value={content.solutions.length.toString()} foot="Customer categories"/><Stat icon={WalletCards} label="Costing assumptions" value="5" foot="Editable estimate inputs"/></div>
    <div className="overview-grid"><section className="admin-panel preview-panel"><div className="panel-heading"><div><span>LIVE BRAND PREVIEW</span><h2>Your storefront photo</h2></div><button type="button" className="subtle-link" onClick={() => onSelect('media')}>Manage photos <ArrowRight size={15}/></button></div><div className="storefront-preview"><img src={content.showroomPhoto} alt="Current Awadh Enterprises storefront"/><div><span>AWADH ENTERPRISES · MIRZAPUR</span><b>{content.address}</b><small>{content.phone}</small></div></div><p className="preview-caption">This is the real storefront photo you shared. Replace it whenever you have a new one.</p></section>
    <section className="admin-panel quick-panel"><div className="panel-heading"><div><span>QUICK ACCESS</span><h2>What would you like to update?</h2></div></div><div className="quick-actions"><Quick icon={Store} title="Homepage copy & hero" desc="Edit headline, introduction and hero photo" onClick={() => onSelect('brand')}/><Quick icon={Boxes} title="Products & photos" desc="Change images, names and descriptions" onClick={() => onSelect('media')}/><Quick icon={Banknote} title="Solar estimate settings" desc="Tune panel, output and cost assumptions" onClick={() => onSelect('calculator')}/><Quick icon={MapPin} title="Store contact details" desc="Keep your phone and location current" onClick={() => onSelect('contact')}/></div></section></div>
    <div className="admin-persistence-note"><ShieldCheck size={19}/><span><b>Private dashboard · signed-in admin only</b><small>Photo uploads and saved edits live in the app’s data folder. Keep this folder on persistent storage when hosting or moving the website.</small></span></div>
  </>
}
function Stat({ icon: Icon, label, value, foot }: { icon: typeof Package; label: string; value: string; foot: string }) { return <div className="admin-stat"><span className="stat-icon"><Icon size={17}/></span><span className="stat-label">{label}</span><b>{value}</b><small>{foot}</small></div> }
function Quick({ icon: Icon, title, desc, onClick }: { icon: typeof Store; title: string; desc: string; onClick: () => void }) { return <button type="button" onClick={onClick}><span><Icon size={18}/></span><span><b>{title}</b><small>{desc}</small></span><ChevronRight size={16}/></button> }

function PhotoField({ label, image, onUpload, uploading, aspect = 'wide' }: { label: string; image: string; onUpload: (file: File | undefined) => void; uploading: boolean; aspect?: 'wide' | 'square' }) { return <div className={`photo-field ${aspect}`}><div className="photo-field-preview">{image ? <img src={image} alt={`${label} preview`}/> : <div className="photo-field-empty"><ImagePlus size={26}/><b>No photo selected</b><small>Choose the real project photo you want to show</small></div>}<span>{label}</span></div><label className="upload-control"><input type="file" accept="image/jpeg,image/png,image/webp,image/avif" disabled={uploading} onChange={e => { onUpload(e.target.files?.[0]); e.currentTarget.value = '' }}/><Upload size={15}/>{uploading ? 'Optimizing photo…' : image ? 'Replace photo' : 'Choose project photo'}<small>JPEG, PNG, WebP or AVIF · up to 8 MB</small></label></div> }

function BrandEditor({ content, update, upload, uploading }: { content: SiteContent; update: <K extends keyof SiteContent>(key: K, value: SiteContent[K]) => void; upload: (file: File | undefined, apply: (url: string) => void, key: string) => void; uploading: string | null }) {
  return <><SectionIntro eyebrow="WEBSITE CONTENT" title="Your homepage, your voice." text="Refresh the first impression customers get when they visit your solar website."/><div className="editor-columns"><section className="admin-panel editor-panel"><div className="panel-heading"><div><span>HOMEPAGE HERO</span><h2>Headline and introduction</h2></div></div><div className="admin-fields"><label>Hindi introduction<input value={content.heroEyebrow} maxLength={140} onChange={e => update('heroEyebrow', e.target.value)}/></label><div className="field-two"><label>Headline — first line<input value={content.heroHeading} maxLength={100} onChange={e => update('heroHeading', e.target.value)}/></label><label>Headline — highlighted line<input value={content.heroHighlight} maxLength={100} onChange={e => update('heroHighlight', e.target.value)}/></label></div><label>Short introduction<textarea rows={3} value={content.heroDescription} maxLength={500} onChange={e => update('heroDescription', e.target.value)}/><small>{content.heroDescription.length}/500 characters</small></label></div></section>
    <section className="admin-panel editor-panel"><div className="panel-heading"><div><span>HERO PHOTOGRAPH</span><h2>The image customers see first</h2></div></div><PhotoField label="Homepage hero" image={content.heroPhoto} uploading={uploading === 'hero'} onUpload={file => upload(file, url => update('heroPhoto', url), 'hero')}/><p className="editor-help">A wide landscape photo works best. We resize uploads and save them as optimized WebP.</p></section></div>
    <section className="admin-panel editor-panel shop-photo-editor"><div className="panel-heading"><div><span>YOUR STORE</span><h2>Shopfront photo</h2><p>Show customers the actual Awadh Enterprises showroom.</p></div></div><div className="shop-photo-layout"><PhotoField label="Shopfront" image={content.showroomPhoto} uploading={uploading === 'shop'} aspect="square" onUpload={file => upload(file, url => update('showroomPhoto', url), 'shop')}/><div><div className="admin-fields"><label>Store name<input value={content.brand} maxLength={120} onChange={e => update('brand', e.target.value)}/></label></div><p className="editor-help">This photo appears on the public homepage in the local showroom section. Add its caption, description and click-through link under Photos & products.</p></div></div></section>
  </>
}

function MediaEditor({ content, update, updateSolution, updateProduct, updateProject, moveSolutions, moveProducts, upload, uploading }: { content: SiteContent; update: <K extends keyof SiteContent>(key: K, value: SiteContent[K]) => void; updateSolution: (id: string, key: keyof Solution, value: string) => void; updateProduct: (id: string, key: keyof Product, value: string) => void; updateProject: <K extends keyof Project>(id: string, key: K, value: Project[K]) => void; moveSolutions: (index: number, delta: number) => void; moveProducts: (index: number, delta: number) => void; upload: (file: File | undefined, apply: (url: string) => void, key: string) => void; uploading: string | null }) {
  const addProduct = () => { const id = `product-${Date.now()}`; update('products', [...content.products, { id, name: 'New product', category: 'Solar', description: '', detail: '', quote: '', href: `/products/${id}`, image: content.products[0]?.image ?? content.showroomPhoto }]) }
  const removeProduct = (index: number) => update('products', content.products.filter((_, i) => i !== index))
  const addSolution = () => update('solutions', [...content.solutions, { id: `solution-${Date.now()}`, title: 'New solar solution', description: '', href: '/contact', image: content.solutions[0]?.image ?? content.showroomPhoto }])
  const removeSolution = (index: number) => update('solutions', content.solutions.filter((_, i) => i !== index))
  const addProject = (category: ProjectCategory) => {
    const id = `project-${crypto.randomUUID()}`
    update('projects', [...content.projects, { id, title: `New ${category} Solar Project`, description: '', category, location: '', capacity: '', image: '' }])
  }
  const removeProject = (id: string) => update('projects', content.projects.filter(project => project.id !== id))
  const moveProject = (id: string, delta: number) => {
    const reordered = [...content.projects]
    const projectIndex = reordered.findIndex(project => project.id === id)
    if (projectIndex < 0) return
    const peerIndexes = reordered.map((project, index) => project.category === reordered[projectIndex].category ? index : -1).filter(index => index >= 0)
    const localIndex = peerIndexes.indexOf(projectIndex)
    const targetIndex = peerIndexes[localIndex + delta]
    if (targetIndex === undefined) return
    ;[reordered[projectIndex], reordered[targetIndex]] = [reordered[targetIndex], reordered[projectIndex]]
    update('projects', reordered)
  }
  return <><SectionIntro eyebrow="PHOTOS & PRODUCTS" title="Manage every photo and its link." text="Each numbered item maps to the same position on your public website. Change its photo, caption, quotation and destination, then publish."/>
    <div className="media-section-title"><div><span>SHOWROOM · HOME PAGE</span><h2>Your store photo and its link</h2><p>Set the caption, customer details and page that opens when the storefront photo is clicked.</p></div></div><div className="shop-banner-card"><PhotoField label="Storefront photo" image={content.showroomPhoto} aspect="square" uploading={uploading === 'shop'} onUpload={file => upload(file, url => update('showroomPhoto', url), 'shop')}/><div><span className="admin-tag">PHOTO POSITION · STORE SECTION</span><div className="admin-fields shop-photo-fields"><label>Photo caption<input value={content.showroomTitle} maxLength={140} onChange={e => update('showroomTitle', e.target.value)}/></label><label>Photo detail<textarea rows={2} value={content.showroomDescription} maxLength={500} onChange={e => update('showroomDescription', e.target.value)}/></label><label>Photo hyperlink<input value={content.showroomHref} maxLength={1500} placeholder="/contact or https://…" onChange={e => update('showroomHref', e.target.value)}/><small>Use a website path or a secure https:// URL.</small></label></div></div></div>
    <ProjectEditor content={content} update={update} updateProject={updateProject} addProject={addProject} removeProject={removeProject} moveProject={moveProject} upload={upload} uploading={uploading}/>
    <div className="media-section-title"><div><span>LANDING PAGE CARDS · ORDERED 01, 02, 03…</span><h2>Solar solution photos & details</h2><p>Use the arrows to change the public card position. Set where the card takes a customer when clicked.</p></div><button className="add-product-button" type="button" onClick={addSolution}><Plus size={16}/> Add photo card</button></div>
    {content.solutions.length === 0 ? <div className="empty-products">No solution cards yet. Add a photo card to the homepage.</div> : <div className="admin-card-grid">{content.solutions.map((solution, index) => <article className="admin-media-card" key={solution.id}><PositionControls index={index} total={content.solutions.length} onMove={delta => moveSolutions(index, delta)} onRemove={() => removeSolution(index)} name={solution.title}/><PhotoField label={`Solution photo ${index + 1}`} image={solution.image} aspect="square" uploading={uploading === `solution-${solution.id}`} onUpload={file => upload(file, url => updateSolution(solution.id, 'image', url), `solution-${solution.id}`)}/><div className="admin-fields"><label>Title / photo caption<input value={solution.title} maxLength={120} onChange={e => updateSolution(solution.id, 'title', e.target.value)}/></label><label>Photo detail<textarea rows={2} value={solution.description} maxLength={500} onChange={e => updateSolution(solution.id, 'description', e.target.value)}/></label><label>Photo hyperlink<input value={solution.href} maxLength={1500} placeholder="/solar-solutions/residential or https://…" onChange={e => updateSolution(solution.id, 'href', e.target.value)}/><small>Use a website path or a secure https:// URL.</small></label></div></article>)}</div>}
    <div className="media-section-title product-title"><div><span>PRODUCT CATALOGUE · ORDERED 01, 02, 03…</span><h2>Products shown to customers</h2><p>Photo, caption, product details, quotation note and click-through link stay together as one item.</p></div><button className="add-product-button" type="button" onClick={addProduct}><Plus size={16}/> Add product</button></div>
    {content.products.length === 0 ? <div className="empty-products">Your product list is empty. Add a product to show it on your website.</div> : <div className="admin-product-list">{content.products.map((product, index) => <article className="admin-product-row" key={product.id}><div><PositionControls index={index} total={content.products.length} onMove={delta => moveProducts(index, delta)} onRemove={() => removeProduct(index)} name={product.name}/><PhotoField label={`Product photo ${index + 1}`} image={product.image} aspect="square" uploading={uploading === `product-${product.id}`} onUpload={file => upload(file, url => updateProduct(product.id, 'image', url), `product-${product.id}`)}/></div><div className="admin-fields product-fields"><div className="field-two"><label>Product name<input value={product.name} maxLength={120} onChange={e => updateProduct(product.id, 'name', e.target.value)}/></label><label>Category<input value={product.category} maxLength={80} onChange={e => updateProduct(product.id, 'category', e.target.value)}/></label></div><label>Photo caption / customer-facing description<textarea rows={2} value={product.description} maxLength={500} onChange={e => updateProduct(product.id, 'description', e.target.value)}/></label><label>Product details<textarea rows={2} value={product.detail} maxLength={1000} onChange={e => updateProduct(product.id, 'detail', e.target.value)}/></label><div className="field-two"><label>Quotation / price note<input value={product.quote} maxLength={300} placeholder="Example: Ask us for today’s quote" onChange={e => updateProduct(product.id, 'quote', e.target.value)}/><small>Optional. Shown below the product description.</small></label><label>Product hyperlink<input value={product.href} maxLength={1500} placeholder="/products/panels or https://…" onChange={e => updateProduct(product.id, 'href', e.target.value)}/><small>Use a website path or a secure https:// URL.</small></label></div></div></article>)}</div>}
  </>
}

function ProjectEditor({ content, update, updateProject, addProject, removeProject, moveProject, upload, uploading }: {
  content: SiteContent
  update: <K extends keyof SiteContent>(key: K, value: SiteContent[K]) => void
  updateProject: <K extends keyof Project>(id: string, key: K, value: Project[K]) => void
  addProject: (category: ProjectCategory) => void
  removeProject: (id: string) => void
  moveProject: (id: string, delta: number) => void
  upload: (file: File | undefined, apply: (url: string) => void, key: string) => void
  uploading: string | null
}) {
  const categories = ['Residential', 'Commercial', 'Industrial'] as const
  const [categoryFilter, setCategoryFilter] = useState<'All Projects' | ProjectCategory>('Residential')
  const visibleProjects = content.projects.filter(project => categoryFilter === 'All Projects' || project.category === categoryFilter)
  const addCategory = categoryFilter === 'All Projects' ? 'Residential' : categoryFilter
  const projectGroups = new Map<ProjectCategory, string[]>()
  content.projects.forEach(project => {
    const group = projectGroups.get(project.category) ?? []
    group.push(project.id)
    projectGroups.set(project.category, group)
  })
  const projectPositions = new Map<string, { index: number; total: number }>()
  projectGroups.forEach(ids => ids.forEach((id, index) => projectPositions.set(id, { index, total: ids.length })))

  return <>
    <div className="media-section-title project-editor-heading">
      <div><span>PUBLIC HOME PAGE · PROJECT GALLERY</span><h2>Projects gallery and headline</h2><p>Add as many projects as you need. Photos, titles and details appear in the matching public category after publishing.</p></div>
      <span className="admin-tag">{content.projects.length} {content.projects.length === 1 ? 'PROJECT' : 'PROJECTS'}</span>
    </div>
    <section className="admin-panel editor-panel project-copy-editor">
      <div className="admin-fields field-two">
        <label>Projects headline<input value={content.projectsHeading} maxLength={140} onChange={event => update('projectsHeading', event.target.value)}/></label>
        <label>Projects introduction<input value={content.projectsSubheading} maxLength={500} onChange={event => update('projectsSubheading', event.target.value)}/></label>
      </div>
    </section>
    <div className="admin-project-toolbar">
      <div className="admin-project-tabs" role="group" aria-label="Filter projects by category">
        {(['All Projects', ...categories] as const).map(category => {
          const count = category === 'All Projects' ? content.projects.length : content.projects.filter(project => project.category === category).length
          return <button type="button" aria-pressed={categoryFilter === category} className={categoryFilter === category ? 'selected' : ''} key={category} onClick={() => setCategoryFilter(category)}>{category}<span>{count}</span></button>
        })}
      </div>
      <button className="add-product-button add-project-button" type="button" onClick={() => addProject(addCategory)}><Plus size={16}/> Add {addCategory} project</button>
    </div>
    <div className="admin-project-grid">
      {visibleProjects.map(project => {
        const { index: categoryIndex, total: categoryTotal } = projectPositions.get(project.id)!
        return (
          <article className="admin-media-card admin-project-card" key={project.id}>
            <PositionControls index={categoryIndex} total={categoryTotal} onMove={delta => moveProject(project.id, delta)} name={project.title} showRemove={false}/>
            <div className="admin-project-card-heading"><div className="admin-project-slot-heading"><span>PROJECT PHOTO {String(categoryIndex + 1).padStart(2, '0')}</span><small>{project.category}</small></div><button className="admin-delete-project" type="button" onClick={() => removeProject(project.id)}><Trash2 size={14}/> Delete project</button></div>
            <PhotoField
              label={`Project photo ${categoryIndex + 1}`}
              image={project.image}
              aspect="wide"
              uploading={uploading === `project-${project.id}`}
              onUpload={file => upload(file, url => updateProject(project.id, 'image', url), `project-${project.id}`)}
            />
            <div className="admin-fields">
              <label>Photo heading / project title<input value={project.title} maxLength={140} onChange={event => updateProject(project.id, 'title', event.target.value)}/></label>
              <label>Project details<textarea rows={3} maxLength={500} value={project.description} placeholder="Write a short customer-facing summary" onChange={event => updateProject(project.id, 'description', event.target.value)}/><small>{project.description.length}/500 characters</small></label>
              <label>Project type<select value={project.category} onChange={event => updateProject(project.id, 'category', event.target.value as Project['category'])}><option value="Residential">Residential</option><option value="Commercial">Commercial</option><option value="Industrial">Industrial</option></select></label>
              <div className="field-two">
                <label>Location<input value={project.location} maxLength={120} placeholder="Optional" onChange={event => updateProject(project.id, 'location', event.target.value)}/></label>
                <label>System capacity<input value={project.capacity} maxLength={80} placeholder="Optional" onChange={event => updateProject(project.id, 'capacity', event.target.value)}/></label>
              </div>
            </div>
          </article>
        )
      })}
      {visibleProjects.length === 0 && <div className="admin-project-empty"><ImagePlus size={24}/><b>No {categoryFilter.toLowerCase()} projects yet</b><span>Add a project to show it in this category on the website.</span></div>}
    </div>
  </>
}

function PositionControls({ index, total, onMove, onRemove, name, showRemove = true }: { index: number; total: number; onMove: (delta: number) => void; onRemove?: () => void; name: string; showRemove?: boolean }) {
  return <div className="position-controls"><span>POSITION {String(index + 1).padStart(2, '0')}</span><div><button type="button" disabled={index === 0} onClick={() => onMove(-1)} aria-label={`Move ${name} up`} title="Move up"><ArrowUp size={14}/></button><button type="button" disabled={index === total - 1} onClick={() => onMove(1)} aria-label={`Move ${name} down`} title="Move down"><ArrowDown size={14}/></button>{showRemove && onRemove && <button type="button" className="remove-item" onClick={onRemove} aria-label={`Remove ${name}`} title="Remove item"><Trash2 size={14}/></button>}</div></div>
}

function CalculatorEditor({ content, update }: { content: SiteContent; update: <K extends keyof SiteContent>(key: K, value: SiteContent[K]) => void }) {
  const set = (key: keyof SiteContent['calculator'], value: number) => update('calculator', { ...content.calculator, [key]: value })
  return <><SectionIntro eyebrow="SOLAR COSTING" title="Set honest estimate assumptions." text="These values drive the public solar calculator. They are estimates only; final sizing and pricing need a site assessment."/><div className="calculator-admin-grid"><section className="admin-panel editor-panel"><div className="panel-heading"><div><span>CALCULATOR INPUTS</span><h2>Adjust your costing basis</h2></div></div><div className="admin-fields cost-fields"><label>Indicative electricity rate<input type="number" min={1} max={100} step={0.5} value={content.calculator.rupeesPerUnit} onChange={e => set('rupeesPerUnit', Number(e.target.value))}/><small>₹ per electricity unit (kWh)</small></label><label>Expected monthly output per system kW<input type="number" min={1} max={1000} value={content.calculator.monthlyUnitsPerKw} onChange={e => set('monthlyUnitsPerKw', Number(e.target.value))}/><small>kWh per month for each 1 kW of solar</small></label><label>Typical panel wattage<input type="number" min={100} max={1000} step={10} value={content.calculator.panelWatts} onChange={e => set('panelWatts', Number(e.target.value))}/><small>Used to estimate panel count</small></label><div className="field-two"><label>Indicative cost floor<input type="number" min={10000} step={1000} value={content.calculator.costPerKwMin} onChange={e => set('costPerKwMin', Number(e.target.value))}/><small>₹ per system kW</small></label><label>Indicative cost ceiling<input type="number" min={10000} step={1000} value={content.calculator.costPerKwMax} onChange={e => set('costPerKwMax', Number(e.target.value))}/><small>₹ per system kW</small></label></div></div></section><aside className="cost-preview"><span>PUBLIC ESTIMATE PREVIEW</span><h2>Keep estimates useful and transparent.</h2><p>Customers will see the assumptions and the indicative installation cost band derived from these settings.</p><div className="cost-formula"><span>Monthly bill ÷ rate</span><b>→ estimated monthly units</b><span>Units ÷ output per kW</span><b>→ indicative system size</b><span>Size × cost band per kW</span><b>→ rough cost range</b></div><small>Amounts are editable estimates. No guaranteed savings or fixed quote is shown.</small></aside></div></>
}

function ContactEditor({ content, update }: { content: SiteContent; update: <K extends keyof SiteContent>(key: K, value: SiteContent[K]) => void }) {
  return <><SectionIntro eyebrow="STORE PROFILE" title="Let customers reach you easily." text="Your phone number and store location are shown across the public website. Keep them current."/><div className="editor-columns"><section className="admin-panel editor-panel"><div className="panel-heading"><div><span>CONTACT DETAILS</span><h2>Business information</h2></div></div><div className="admin-fields"><label>Brand name<input value={content.brand} maxLength={120} onChange={e => update('brand', e.target.value)}/></label><label>Public phone number<input inputMode="tel" value={content.phone} maxLength={50} onChange={e => update('phone', e.target.value)}/><small>This number powers the call and WhatsApp buttons.</small></label><label>Store address<textarea rows={3} value={content.address} maxLength={300} onChange={e => update('address', e.target.value)}/></label></div></section><div className="admin-panel profile-preview"><span className="preview-pin"><MapPin size={19}/></span><span>PUBLIC STORE PROFILE</span><h2>{content.brand}</h2><p>{content.address}</p><b>{content.phone}</b><a href="/contact" target="_blank" rel="noreferrer">Open contact page <ArrowRight size={14}/></a></div></div></>
}
