import { useState } from 'react'
import { MdPhone, MdEmail, MdLocationOn, MdAccessTime } from 'react-icons/md'
import { FaWhatsapp } from 'react-icons/fa'
import Seo from '../components/Seo'

export default function Contact() {
  const [form, setForm] = useState({ name: '', email: '', phone: '', subject: '', message: '' })
  const [sent, setSent] = useState(false)

  function handleChange(e) {
    setForm(f => ({ ...f, [e.target.name]: e.target.value }))
  }

  function handleSubmit(e) {
    e.preventDefault()
    const msg = encodeURIComponent(
      `Bonjour,\n\nNom: ${form.name}\nEmail: ${form.email}\nTél: ${form.phone}\nSujet: ${form.subject}\n\nMessage:\n${form.message}`
    )
    window.open(`https://wa.me/212663432716?text=${msg}`, '_blank')
    setSent(true)
  }

  return (
    <>
      <Seo title="Contact" description="Contactez notre parfumerie en ligne à Casablanca par téléphone, WhatsApp ou email. Réponse garantie en 2h. Conseils personnalisés sur nos parfums et cosmétiques." keywords="contact parfumerie maroc, whatsapp parfumerie, service client parfum maroc" />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({
        '@context': 'https://schema.org',
        '@type': 'ContactPage',
        'name': 'Contactez Selective Market',
        'url': 'https://selective-market.com/contact',
        'description': 'Contactez notre parfumerie en ligne à Casablanca par téléphone, WhatsApp ou email.',
        'mainEntity': {
          '@type': 'LocalBusiness',
          'name': 'Selective Market',
          'telephone': '+212-663-432716',
          'email': 'contact@selective-market.com',
          'address': { '@type': 'PostalAddress', 'addressLocality': 'Casablanca', 'addressCountry': 'MA' },
          'openingHoursSpecification': {
            '@type': 'OpeningHoursSpecification',
            'dayOfWeek': ['Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'],
            'opens': '09:00',
            'closes': '21:00',
          },
        },
      })}} />

      <div className="about-hero" style={{ padding: 'var(--space-16) 0' }}>
        <div className="container" style={{ textAlign: 'center' }}>
          <span className="section-label">Nous Contacter</span>
          <h1 className="about-hero-title" style={{ fontSize: 'clamp(1.8rem, 4vw, 3rem)' }}>
            Parlons <em>Beauté</em>
          </h1>
          <p className="about-hero-sub">
            Notre équipe est disponible pour répondre à toutes vos questions.
          </p>
        </div>
      </div>

      <section className="section">
        <div className="container">
          <div className="contact-layout">
            {/* Info */}
            <div>
              <h2 className="section-title" style={{ textAlign: 'left', fontSize: '1.6rem', marginBottom: 'var(--space-6)' }}>
                Nos Coordonnées
              </h2>

              {[
                { icon: MdPhone, label: 'Téléphone', value: '+212 663-432716', href: 'tel:+212663432716' },
                { icon: FaWhatsapp, label: 'WhatsApp', value: '+212 663-432716', href: 'https://wa.me/212663432716' },
                { icon: MdEmail, label: 'Email', value: 'contact@selective-market.com', href: 'mailto:contact@selective-market.com' },
                { icon: MdLocationOn, label: 'Adresse', value: 'Casablanca, Maroc', href: null },
                { icon: MdAccessTime, label: 'Horaires', value: 'Lun–Sam : 9h00 – 21h00', href: null },
              ].map(({ icon: Icon, label, value, href }) => (
                <div key={label} className="contact-info-item">
                  <div className="contact-info-icon"><Icon size={18} /></div>
                  <div>
                    <div className="contact-info-label">{label}</div>
                    {href ? (
                      <a href={href} className="contact-info-value" target={href.startsWith('http') ? '_blank' : undefined} rel="noopener noreferrer">
                        {value}
                      </a>
                    ) : (
                      <div className="contact-info-value">{value}</div>
                    )}
                  </div>
                </div>
              ))}

              <div style={{ marginTop: 'var(--space-6)', padding: 'var(--space-5)', background: 'var(--color-accent-bg)', borderRadius: 'var(--radius-md)' }}>
                <p style={{ fontSize: '0.875rem', color: 'var(--color-text-muted)', lineHeight: 1.7 }}>
                  <strong style={{ color: 'var(--color-accent)' }}>Réponse rapide garantie.</strong> Nous répondons généralement dans les 2 heures via WhatsApp. Pour les commandes urgentes, n'hésitez pas à nous appeler directement.
                </p>
              </div>
            </div>

            {/* Form */}
            <div className="contact-form-card">
              <h2 className="checkout-section-title">Envoyer un Message</h2>

              {sent ? (
                <div className="alert alert-success">
                  ✅ Votre message a été envoyé via WhatsApp. Nous vous répondrons très bientôt !
                </div>
              ) : (
                <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
                  <div className="contact-form-grid">
                    <div className="form-group">
                      <label className="form-label">Nom <span className="form-required">*</span></label>
                      <input className="form-control" name="name" value={form.name} onChange={handleChange} placeholder="Votre nom" required />
                    </div>
                    <div className="form-group">
                      <label className="form-label">Téléphone</label>
                      <input className="form-control" name="phone" value={form.phone} onChange={handleChange} placeholder="+212 6XX XXX XXX" />
                    </div>
                  </div>
                  <div className="form-group">
                    <label className="form-label">Email</label>
                    <input className="form-control" type="email" name="email" value={form.email} onChange={handleChange} placeholder="votre@email.com" />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Sujet <span className="form-required">*</span></label>
                    <input className="form-control" name="subject" value={form.subject} onChange={handleChange} placeholder="Ex: Question sur un parfum" required />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Message <span className="form-required">*</span></label>
                    <textarea className="form-control" name="message" value={form.message} onChange={handleChange} rows={5} placeholder="Décrivez votre demande..." required />
                  </div>
                  <button type="submit" className="btn btn-primary btn-lg" style={{ justifyContent: 'center' }}>
                    Envoyer via WhatsApp
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
