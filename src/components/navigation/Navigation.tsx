'use client'

import Link from 'next/link'
import { useState } from 'react'
import { usePathname } from 'next/navigation'
import {
  ArrowRight,
  ChevronDown,
  LockKeyhole,
  MapPin,
  Menu,
  Phone,
  ShieldCheck,
  X,
} from 'lucide-react'
import { LanguageSwitcher, T } from '@/components/language/LanguageProvider'
import { GreetingClock } from '@/components/ui/GreetingClock'

const navItems = [
  { href: '#about', label: 'About Us' },
  { href: '#solutions', label: 'Solar Solutions', menu: true },
  { href: '#pm-surya-ghar', label: 'PM Surya Ghar' },
  { href: '#products', label: 'Products', menu: true },
  { href: '#calculator', label: 'Calculator' },
  { href: '#projects-showcase', label: 'Projects' },
  { href: '#contact', label: 'Contact' },
]

export function Navigation({
  brand = 'Over The Top Solar',
  phone = '89530 69011',
  address = 'Bari Basahi, Mirzapur, UP 231001',
}: {
  brand?: string
  phone?: string
  address?: string
}) {
  const [open, setOpen] = useState(false)
  const pathname = usePathname()
  const homeSection = (href: string) => pathname === '/' ? href : `/${href}`

  const openEnquiry = () => {
    window.dispatchEvent(new Event('awadh-enquire'))
  }

  return (
    <>
      <div className="topbar">
        <div className="topbar-inner">
          <div className="topbar-left">
            <GreetingClock variant="topbar" />
            <span className="topbar-location hidden lg:flex">
              <MapPin size={13} /> {address}
            </span>
          </div>

          <div className="topbar-right">
            <span className="topbar-badge">
              <ShieldCheck size={13} />
              <T hi="सरकारी पंजीकृत सोलर पार्टनर">Govt. Registered Solar Partner</T>
            </span>
            <Link href="/admin/login" className="admin-access-link">
              <LockKeyhole size={12} /> <T hi="एडमिन">Admin</T>
            </Link>
          </div>
        </div>
      </div>

      <header className="site-header">
        <div className="nav-inner">
          <Link href="/" className="brand" aria-label={`${brand} home`}>
            <img
              src="/images/awadh-logo.jpg"
              alt="Awadh Enterprises Logo"
              className="brand-logo-img"
              width={220}
              height={56}
            />
          </Link>

          <nav className="desktop-nav" aria-label="Main navigation">
            <Link href="/" className={`nav-link${pathname === '/' ? ' active' : ''}`}>
              <T>Home</T>
            </Link>
            {navItems.map((item) =>
              item.menu ? (
                <div key={item.href} className="nav-dropdown">
                  <Link
                    href={homeSection(item.href)}
                    className="nav-link"
                  >
                    <T>{item.label}</T>
                    <ChevronDown size={14} />
                  </Link>
                  <div className="dropdown-menu">
                    <Link href={homeSection(item.href)}>
                      <T>{`${item.label} overview`}</T>
                    </Link>
                    {item.href === '#products' ? (
                      <>
                        <Link href={homeSection('#product-panels')}>
                          <T>Solar panels</T>
                        </Link>
                        <Link href={homeSection('#product-inverters')}>
                          <T>Inverters</T>
                        </Link>
                        <Link href={homeSection('#product-batteries')}>
                          <T>Batteries</T>
                        </Link>
                      </>
                    ) : (
                      <>
                        <Link href={homeSection('#service-residential')}>
                          <T>Residential</T>
                        </Link>
                        <Link href={homeSection('#service-commercial')}>
                          <T>Commercial</T>
                        </Link>
                        <Link href={homeSection('#service-industrial')}>
                          <T>Industrial</T>
                        </Link>
                        <Link href={homeSection('#calculator')}>
                          <T>Solar calculator</T>
                        </Link>
                        <Link href={homeSection('#pm-surya-ghar')}>
                          <T>PM Surya Ghar</T>
                        </Link>
                      </>
                    )}
                  </div>
                </div>
              ) : (
                <Link
                  key={item.href}
                  href={homeSection(item.href)}
                  className="nav-link"
                >
                  <T>{item.label}</T>
                </Link>
              )
            )}
          </nav>

          <div className="nav-actions">
            <a className="call-button" href={`tel:${phone.replace(/\D/g, '')}`}>
              <Phone size={15} />
              <span>
                <small><T>Call Specialist</T></small>
                <b>{phone}</b>
              </span>
            </a>
            <button className="quote-button" onClick={openEnquiry} type="button">
              <T hi="कोटेशन पाएं">Get a Quote</T> <ArrowRight size={15} />
            </button>
          </div>

          <LanguageSwitcher className="nav-language" />

          <button
            className="mobile-toggle"
            aria-label={open ? 'Close menu' : 'Open menu'}
            aria-expanded={open}
            onClick={() => setOpen(!open)}
          >
            {open ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>

        {open && (
          <nav className="mobile-nav" aria-label="Mobile navigation">
            <Link href="/" onClick={() => setOpen(false)}>
              <T>Home</T>
            </Link>
            {navItems.map((item) => (
              <Link key={item.href} href={homeSection(item.href)} onClick={() => setOpen(false)}>
                <T>{item.label}</T>
              </Link>
            ))}
            <button
              className="mobile-quote"
              onClick={() => {
                setOpen(false)
                openEnquiry()
              }}
              type="button"
            >
              <T hi="मुफ्त सोलर कोटेशन पाएं">Get Free Solar Quote</T> <ArrowRight size={16} />
            </button>
            <div className="mobile-contact-strip">
              <a href={`tel:${phone.replace(/\D/g, '')}`} className="mobile-phone-link">
                <Phone size={16} /> <T>Call</T> {phone}
              </a>
              <Link href="/admin/login" onClick={() => setOpen(false)} className="mobile-admin-link">
                <LockKeyhole size={14} /> <T>Admin</T>
              </Link>
            </div>
          </nav>
        )}
      </header>
    </>
  )
}
