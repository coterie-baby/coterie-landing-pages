import { product } from './product';
import { landingPage } from './landingPage';
import { blockContent } from './blockContent';
import { titleBanner } from './components/titleBanner';
import { productCardHero } from './components/productCardHero';
import { comparisonTable } from './components/comparisonTable';
import { diptychMediaTitle } from './components/diptychMediaTitle';
import { safetyStandards } from './components/safetyStandards';

export const schemaTypes = [
  // Document types
  product,
  landingPage,
  
  // Content types
  blockContent,

  // Component types
  titleBanner,
  productCardHero,
  comparisonTable,
  diptychMediaTitle,
  safetyStandards,
];
