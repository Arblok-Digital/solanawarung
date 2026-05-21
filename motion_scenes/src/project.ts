import {makeProject} from '@motion-canvas/core';
import LogoTransform from './scenes/logo_transform';
import AIProductListing from './scenes/ai_product_listing';
import EscrowFlow from './scenes/escrow_flow';
import AIAnalytics from './scenes/ai_analytics';
import ClosingCTA from './scenes/closing_cta';

export default makeProject({
  scenes: [
    LogoTransform,
    AIProductListing,
    EscrowFlow,
    AIAnalytics,
    ClosingCTA,
  ],
} as any);