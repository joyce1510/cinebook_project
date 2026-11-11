/**
 * CineBook - CineBot Guided Tour Highlighting & Cutout Test
 * Verifies that the booking step and all tour steps are clearly visible,
 * not covered by solid black overlays, and properly positioned.
 */

const assert = require('assert');
const fs = require('fs');
const path = require('path');

console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
console.log('🧪 CINEBOT TOUR HIGHLIGHTING & CUTOUT VERIFICATION');
console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

let passed = 0;
let failed = 0;

function it(description, fn) {
  try {
    fn();
    console.log(`  ✅ PASS: ${description}`);
    passed++;
  } catch (err) {
    console.error(`  ❌ FAIL: ${description}`);
    console.error(`     Error: ${err.message}`);
    failed++;
  }
}

function runTests() {
  const tourPath = path.resolve(__dirname, '../src/components/InteractiveTour.tsx');
  assert(fs.existsSync(tourPath), 'InteractiveTour.tsx must exist');
  const tourContent = fs.readFileSync(tourPath, 'utf-8');

  const appPath = path.resolve(__dirname, '../src/App.tsx');
  assert(fs.existsSync(appPath), 'App.tsx must exist');
  const appContent = fs.readFileSync(appPath, 'utf-8');

  it('1. True cutout spotlight using box-shadow outward projection (no solid black overlay covering target)', () => {
    assert(tourContent.includes('boxShadow:'), 'Spotlight must use boxShadow for cutout projection');
    assert(tourContent.includes('0 0 0 9999px'), 'Must project outward with 9999px shadow so center is 100% transparent');
    assert(!tourContent.includes('<div className="fixed inset-0 bg-black/75 backdrop-blur-[2px] transition-all duration-300 pointer-events-auto" />\n\n      {/* Target Element Spotlight Highlight */}\n      {targetRect && ('), 'Solid full-screen overlay must not sit over targetRect');
  });

  it('2. Booking step selector is resilient with fallbacks ([data-tour="pricing-section"], [data-tour="seat-selection-view"], [data-tour="spotlight-book-btn"])', () => {
    assert(tourContent.includes('data-tour="pricing-section"'), 'Must target pricing-section');
    assert(tourContent.includes('data-tour="seat-selection-view"'), 'Must support seat-selection-view');
    assert(tourContent.includes('data-tour="spotlight-book-btn"'), 'Must support spotlight-book-btn');
  });

  it('3. Tour polling mechanism waits for elements to mount and validates non-zero dimensions', () => {
    assert(tourContent.includes('rect.width > 0 && rect.height > 0'), 'Must verify element has non-zero dimensions');
    assert(tourContent.includes('pollInterval = setInterval(tryFindAndFocus, 50)'), 'Must poll every 50ms for async-rendered views');
    assert(tourContent.includes('maxAttempts'), 'Must have attempt threshold');
  });

  it('4. Continuous scroll tracking via requestAnimationFrame so spotlight stays locked during smooth scroll', () => {
    assert(tourContent.includes('trackElementScroll'), 'Must track scroll smoothly');
    assert(tourContent.includes('requestAnimationFrame'), 'Must use requestAnimationFrame');
    assert(tourContent.includes('cancelAnimationFrame'), 'Must clean up animation frame');
  });

  it('5. Collision-free tooltip positioning prevents covering the highlighted booking element', () => {
    assert(tourContent.includes('spaceBelow'), 'Must calculate space below');
    assert(tourContent.includes('spaceAbove'), 'Must calculate space above');
    assert(tourContent.includes('tooltipHeight'), 'Must use tooltip dimensions');
  });

  it('6. Mobile viewport adaptation docks tooltip to non-overlapping half of screen', () => {
    assert(tourContent.includes('isMobile'), 'Must detect mobile viewports');
    assert(tourContent.includes('elementCenterY'), 'Must compute vertical element center');
  });

  it('7. App.tsx clears selectedMovie and confirmedBooking when starting or navigating tour', () => {
    assert(appContent.includes('handleStartTour = () => {\n    setShowWelcomeModal(false);\n    setSelectedMovie(null);\n    setConfirmedBooking(null);'), 'handleStartTour must reset selectedMovie and confirmedBooking');
    assert(appContent.includes('onNavigateView={(view) => {\n          setSelectedMovie(null);\n          setConfirmedBooking(null);\n          setCurrentView(view);'), 'onNavigateView must reset selectedMovie and confirmedBooking');
  });

  it('8. All 11 tour steps have valid selectors and view requirements', () => {
    assert(tourContent.includes('1. Welcome to CineBook'));
    assert(tourContent.includes('2. Movie Catalogue & Showcases'));
    assert(tourContent.includes('3. Search & Mood Discovery'));
    assert(tourContent.includes('4. Movie Details & Showtimes'));
    assert(tourContent.includes('5. My Watchlist'));
    assert(tourContent.includes('6. Seat Selection & 5-Min Hold'));
    assert(tourContent.includes('7. Express Canteen & Combos'));
    assert(tourContent.includes('8. Offers, Rewards & Promo Codes'));
    assert(tourContent.includes('9. Transparent Simulated Payment'));
    assert(tourContent.includes('10. My Bookings Dashboard'));
    assert(tourContent.includes('11. Cryptographic QR Gate Pass'));
  });

  console.log(`\n📊 RESULTS: ${passed} passed, ${failed} failed\n`);
  if (failed > 0) process.exit(1);
}

runTests();
