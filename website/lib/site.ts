export const site = {
  name: 'Enamorado Insurance Company',
  shortName: 'Enamorado Insurance',
  tagline: 'Medicare & health insurance guidance you can trust',
  description:
    'Enamorado Insurance Company helps families and seniors navigate Medicare, Medicaid, and supplemental health coverage with clear advice and ongoing support.',
  url: 'https://enamoradoinsurancecompany.com',
  crmUrl: 'https://crm.enamoradoinsurancecompany.com',
  phone: '(555) 555-0100',
  email: 'hello@enamoradoinsurancecompany.com',
  address: {
    line1: 'Your office address',
    city: 'City',
    state: 'FL',
    zip: '00000',
  },
} as const;

export const navLinks = [
  { href: '/services', label: 'Services' },
  { href: '/about', label: 'About' },
  { href: '/contact', label: 'Contact' },
] as const;
