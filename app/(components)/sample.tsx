'use client';
import AwardSlideshow from '@/components/award-slideshow';
const awards = [
  {
    id: 'overnight-diaper-2024',
    heroText: '"Overnight Diaper Product of the Year 2024"',
    subText: 'Baby Innovation Awards',
    backgroundImage:
      'https://cdn.sanity.io/images/e4q6bkl9/production/b5abe843879e377543e14e433d23f194ffbcd5d3-2560x1440.jpg?w=2400&h=1350&q=100&fit=crop&auto=format',
    backgroundAlt: 'Happy baby holding blue ball',
  },
  {
    id: 'bump-best-diaper-2024',
    heroText: '"The Bump Best of Baby Award for Best Diaper 2024"',
    subText: 'The Bump',
    backgroundImage:
      'https://cdn.sanity.io/images/e4q6bkl9/production/8a2cfdc1cc49bc789c06ef598b2412a9354d9049-2560x1440.jpg?w=2400&h=1350&q=100&fit=crop&auto=format',
    backgroundAlt: 'Baby playing with toys',
  },
  {
    id: 'parenthood-award-wipe',
    heroText: '“Parenthood Award Winner for Best Wipe”',
    subText: 'Healthline Awards',
    backgroundImage:
      'https://cdn.sanity.io/images/e4q6bkl9/production/1cdfdbb34682b9defdb1ae88d985a323bf26835f-2560x1440.jpg?w=2400&h=1350&q=100&fit=crop&auto=format',
    backgroundAlt: 'Baby in natural setting',
  },
  {
    id: 'eco-friendly-2025',
    heroText: '"Best Eco-Friendly Diapers of 2025"',
    subText: 'Babylist',
    backgroundImage:
      'https://cdn.sanity.io/images/e4q6bkl9/production/f791aefa05c69535c0cf41b2349fd5e73d80230e-2560x1440.jpg?w=2400&h=1350&q=100&fit=crop&auto=format',
    backgroundAlt: 'Baby sitting',
  },
  {
    id: 'good-housekeeping-wipe-2024',
    heroText: '"Good Housekeeping Award for Best Wipe 2024"',
    subText: 'Good Housekeeping',
    backgroundImage:
      'https://cdn.sanity.io/images/e4q6bkl9/production/ca73b67c725c98634790c95bc09735f707790969-2560x1440.jpg?w=2400&h=1350&q=100&fit=crop&auto=format',
    backgroundAlt: 'Girl dancing',
  },
  {
    id: 'parents-kids-sleep',
    heroText: '“The Parents Kids’ Sleep Awards for Best Diaper 2024”',
    subText: "Parents' Pick Award",
    backgroundImage:
      'https://cdn.sanity.io/images/e4q6bkl9/production/3e77e78c4978de612f45aee3d5a4c4c3a3059326-2560x1440.jpg?w=2400&h=1350&q=100&fit=crop&auto=format',
    backgroundAlt: 'Baby crawling',
  },
];

const awardIcons = [
  'https://cdn.sanity.io/images/e4q6bkl9/production/5f62b56e566c013140db3a82f1a99d65f48826a3-1650x1500.png?rect=75,0,1500,1500&w=160&h=160&q=100&fit=crop&auto=format',
  'https://cdn.sanity.io/images/e4q6bkl9/production/e29b57c295ec4246a353162cf7217121a40cfb81-1000x1000.png?w=160&h=160&q=100&fit=crop&auto=format',
  'https://cdn.sanity.io/images/e4q6bkl9/production/110fa389cf8d3d058b513a0b30f66cd34bb98f7b-413x406.png?rect=4,0,406,406&w=160&h=160&q=100&fit=crop&auto=format',
  'https://cdn.sanity.io/images/e4q6bkl9/production/ffd65e08946d2ed85ef345ad39563ae35cfbd835-2700x2700.png?w=160&h=160&q=100&fit=crop&auto=format',
  'https://cdn.sanity.io/images/e4q6bkl9/production/997e44cb4c0cb9fcb6b2ac1217e78b65ca265ca5-415x415.png?w=160&h=160&q=100&fit=crop&auto=format',
  'https://cdn.sanity.io/images/e4q6bkl9/production/a7cfd286b963998f183a720a99deb9d58d84445d-1376x1418.png?rect=0,21,1376,1376&w=160&h=160&q=100&fit=crop&auto=format',
];
export default function ComponentsPage() {
  return (
    <div>
      <AwardSlideshow
        awards={awards}
        autoPlayInterval={6000}
        eyebrowText="Award-winning diapering solutions"
        awardIcons={awardIcons}
      />
    </div>
  );
}
