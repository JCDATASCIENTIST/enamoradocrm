export const site = {
  name: 'Enamorado Insurance Company',
  shortName: 'Enamorado Insurance',
  tagline: 'Medicare & health insurance guidance you can trust',
  description:
    'Enamorado Insurance Company helps families and seniors navigate Medicare, Medicaid, and supplemental health coverage with clear advice and ongoing support.',
  url: 'https://enamoradoinsurancefl.com',
  crmUrl: 'https://crm.enamoradoinsurancefl.com',
  phone: '(561) 969-9198',
  email: 'hello@enamoradoinsurancefl.com',
  address: {
    line1: '4645 Gun Club Rd, Suite 13',
    city: 'West Palm Beach',
    state: 'FL',
    zip: '33415',
  },
} as const;

export const navLinks = [
  { href: '/services', label: 'Services' },
  { href: '/about', label: 'About' },
  { href: '/contact', label: 'Contact' },
] as const;
