'use client';

import ValuePropCards from '@/components/value-prop-cards';

const mockData = {
  headline: 'What Makes Coterie Different',
  description:
    'Every detail is engineered to protect your baby and give you peace of mind — day and night.',
  linkUrl: '#',
  cards: [
    {
      title: 'Ultra-Soft Top Sheet',
      subtitle: 'Plant-based fibers',
      label: 'Sustainably sourced',
      modalDescription:
        "Our top sheet is made from sustainably sourced plant-based fibers that feel like the softest cotton against your baby's skin. Unlike conventional diapers that use synthetic polypropylene, Coterie's plant-based layer is gentler, more breathable, and less likely to cause irritation.",
      modalSectionLabel: 'Did You Know',
      modalSectionText:
        "Babies' skin is up to 30% thinner than adult skin, making material choice critical. Our plant-based top sheet is free from synthetic binders and is dermatologist-tested for even the most sensitive skin.",
      modalLinkText: 'Learn more about our materials',
      modalLinkUrl: '#',
    },
    {
      title: '12-Hour Leak Protection',
      subtitle: 'Triple-layer absorbent core',
      label: '3x more absorbent',
      modalDescription:
        "Coterie's triple-layer core locks in moisture up to 3x faster than leading brands, drawing wetness away from your baby's skin the moment it happens. Our core technology keeps the outer layer dry to the touch — even after repeated wetting.",
      modalSectionLabel: 'The Science',
      modalSectionText:
        'Our SAP (super absorbent polymer) core is distributed evenly across all three layers, eliminating the pressure points that cause blowouts at the legs and waist. No bunching. No gaps. No leaks.',
      modalLinkText: 'See how it works',
      modalLinkUrl: '#',
    },
    {
      title: 'Free from 500+ Chemicals',
      subtitle: 'No chlorine, fragrances, or parabens',
      label: 'OEKO-TEX certified',
      modalDescription:
        "We test every diaper against a list of over 500 harmful chemicals — including chlorine bleach, formaldehyde, phthalates, and heavy metals — and exclude every one of them. What you don't put in a diaper matters just as much as what you do.",
      modalSectionLabel: 'Certifications',
      modalSectionText:
        'Every Coterie diaper is OEKO-TEX Standard 100 certified, meaning every component — from the top sheet to the adhesive tabs — has been independently tested and verified safe for your baby.',
      modalLinkText: 'View our full ingredient list',
      modalLinkUrl: '#',
    },
    {
      title: 'Dermatologist Tested',
      subtitle: 'Clinically proven for sensitive skin',
      label: 'Clinically verified',
      modalDescription:
        'Coterie diapers are tested and recommended by board-certified dermatologists. Our clinical trials showed a 97% reduction in diaper rash incidence compared to a leading conventional diaper brand over a 4-week study period.',
      modalSectionLabel: 'Study Results',
      modalSectionText:
        'In an independent 4-week clinical trial with 120 infants aged 0–18 months, 97% of participants using Coterie showed no signs of skin irritation. Parents reported softer, healthier-looking skin within the first week.',
      modalLinkText: 'Read the clinical study',
      modalLinkUrl: '#',
    },
    {
      title: 'Perfect Fit, Every Size',
      subtitle: '360° stretch waistband',
      label: '8 sizes, newborn to 6T',
      modalDescription:
        "Coterie diapers feature a 360° stretch waistband and contoured leg cuffs that move with your baby through every crawl, roll, and sprint. Our fit is engineered to seal without digging in — so there are no red marks, no gaps, and no leaks.",
      modalSectionLabel: 'Size Guide',
      modalSectionText:
        "From our Preemie size starting at 3 lbs all the way through Size 7 for toddlers up to 41+ lbs, we offer more size options than any other premium diaper brand — because the right fit is the foundation of everything else we do.",
      modalLinkText: 'Find your baby\'s size',
      modalLinkUrl: '#',
    },
    {
      title: 'Sustainable by Design',
      subtitle: 'Carbon-neutral shipping & FSC packaging',
      label: 'Climate-conscious',
      modalDescription:
        'We believe taking care of your baby and taking care of the planet should go hand in hand. Our packaging is made from FSC-certified recycled materials, our shipping is fully carbon-neutral, and we\'re actively working to increase the bio-based content of every diaper we make.',
      modalSectionLabel: 'Our Commitment',
      modalSectionText:
        "By 2026, we're committed to making 50% of every diaper from bio-based or recycled materials. We partner with leading environmental certifiers to hold ourselves accountable — and publish our progress annually.",
      modalLinkText: 'Read our sustainability report',
      modalLinkUrl: '#',
    },
  ],
};

export default function ValuePropsTestPage() {
  return <ValuePropCards {...mockData} />;
}
