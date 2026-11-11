const assert = require('assert');
const fs = require('fs');
const path = require('path');

console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
console.log('🧪 CINEBOT & GUIDED TOUR COMPREHENSIVE TEST SUITE');
console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

let passCount = 0;
let failCount = 0;

function it(description, fn) {
  try {
    fn();
    console.log(`  ✅ PASS: ${description}`);
    passCount++;
  } catch (err) {
    console.error(`  ❌ FAIL: ${description}`);
    console.error(`     Error: ${err.message}`);
    failCount++;
  }
}

async function runTests() {
  console.log('📋 1. CineBot Component & File Architecture');

  it('CineBotWelcomeModal component file exists and exports CineBotWelcomeModal', () => {
    const filePath = path.resolve(__dirname, '../src/components/CineBotWelcomeModal.tsx');
    assert(fs.existsSync(filePath), 'CineBotWelcomeModal.tsx must exist');
    const content = fs.readFileSync(filePath, 'utf-8');
    assert(content.includes('export const CineBotWelcomeModal'), 'Must export CineBotWelcomeModal');
    assert(content.includes('Start Guided Tour'), 'Must have Start Guided Tour button');
    assert(content.includes('Chat with CineBot'), 'Must have Chat with CineBot button');
    assert(content.includes('Skip for Now'), 'Must have Skip for Now button');
    assert(content.includes("Hey there! 👋 Welcome to CineBook! I'm CineBot, your personal cinema guide"), 'Must contain exact welcome copy');
  });

  it('InteractiveTour component file exists and contains all 11 required tour steps', () => {
    const filePath = path.resolve(__dirname, '../src/components/InteractiveTour.tsx');
    assert(fs.existsSync(filePath), 'InteractiveTour.tsx must exist');
    const content = fs.readFileSync(filePath, 'utf-8');
    assert(content.includes('export const InteractiveTour'), 'Must export InteractiveTour');
    assert(content.includes('export const TOUR_STEPS'), 'Must export TOUR_STEPS');

    // Check all 11 steps
    const stepTitles = [
      'Welcome to CineBook',
      'Movie Catalogue',
      'Search & Mood Discovery',
      'Movie Details',
      'My Watchlist',
      'Seat Selection',
      'Express Canteen',
      'Offers, Rewards',
      'Simulated Payment',
      'My Bookings Dashboard',
      'Cryptographic QR Gate Pass'
    ];

    for (const title of stepTitles) {
      assert(content.includes(title), `Tour must contain step for: ${title}`);
    }

    assert(content.includes('Next'), 'Must have Next button');
    assert(content.includes('Back'), 'Must have Back button');
    assert(content.includes('Skip Tour'), 'Must have Skip Tour button');
    assert(content.includes('Finish Tour'), 'Must have Finish Tour button');
  });

  console.log('\n🤖 2. CineBot AI Knowledge Base & Assistant Service');

  it('aiAssistantService handles all 10 required visitor guide questions + guided tour', () => {
    const servicePath = path.resolve(__dirname, '../src/utils/aiAssistantService.ts');
    const content = fs.readFileSync(servicePath, 'utf-8');

    const expectedQueries = [
      'how do i book a movie',
      'how do i select seats',
      'what are premium seats',
      'how do i use a coupon',
      'how do i add food combos',
      'where can i find my bookings',
      'how do i download my invoice',
      'how does qr verification work',
      'how do i use the watchlist',
      'how do i find movies based on my mood',
      'guided tour'
    ];

    for (const query of expectedQueries) {
      assert(content.includes(query), `Service must include handler for: "${query}"`);
    }

    assert(content.includes('start_tour'), 'Must support start_tour action type');
    assert(content.includes('open_watchlist'), 'Must support open_watchlist action type');
    assert(content.includes('open_movies'), 'Must support open_movies action type');
    assert(content.includes("I'm CineBot"), 'Must identify as CineBot');
  });

  console.log('\n🧭 3. Contextual Help Prompts');

  it('BookingView includes "Need help choosing a seat? Ask CineBot"', () => {
    const filePath = path.resolve(__dirname, '../src/components/BookingView.tsx');
    const content = fs.readFileSync(filePath, 'utf-8');
    assert(content.includes('onOpenCineBotHelp'), 'BookingView must accept onOpenCineBotHelp');
    assert(content.includes('Need help choosing a seat?'), 'Must have "Need help choosing a seat?" button');
    assert(content.includes('data-tour="seat-selection-view"'), 'Must have data-tour="seat-selection-view"');
  });

  it('CanteenFoodSection includes "Want to explore our combos? Ask CineBot"', () => {
    const filePath = path.resolve(__dirname, '../src/components/CanteenFoodSection.tsx');
    const content = fs.readFileSync(filePath, 'utf-8');
    assert(content.includes('onOpenCineBotHelp'), 'CanteenFoodSection must accept onOpenCineBotHelp');
    assert(content.includes('Want to explore our combos? Ask CineBot'), 'Must have combos help prompt');
    assert(content.includes('data-tour="canteen-section"'), 'Must have data-tour="canteen-section"');
  });

  it('BookingsDashboard includes "Need help finding your ticket? Ask CineBot"', () => {
    const filePath = path.resolve(__dirname, '../src/components/BookingsDashboard.tsx');
    const content = fs.readFileSync(filePath, 'utf-8');
    assert(content.includes('onOpenCineBotHelp'), 'BookingsDashboard must accept onOpenCineBotHelp');
    assert(content.includes('Need help finding your ticket? Ask CineBot'), 'Must have ticket help prompt');
    assert(content.includes('data-tour="bookings-dashboard"'), 'Must have data-tour="bookings-dashboard"');
  });

  it('TicketConfirmation includes "Ask CineBot" and data-tour="ticket-qr-info"', () => {
    const filePath = path.resolve(__dirname, '../src/components/TicketConfirmation.tsx');
    const content = fs.readFileSync(filePath, 'utf-8');
    assert(content.includes('onOpenCineBotHelp'), 'TicketConfirmation must accept onOpenCineBotHelp');
    assert(content.includes('Ask CineBot'), 'Must have Ask CineBot button');
    assert(content.includes('data-tour="ticket-qr-info"'), 'Must have data-tour="ticket-qr-info"');
  });

  console.log('\n🔒 4. Zero-Regression & Backend Security Verification');

  it('Preserves 5-minute seat hold policy (300 seconds)', () => {
    const serverPath = path.resolve(__dirname, '../server.ts');
    const content = fs.readFileSync(serverPath, 'utf-8');
    assert(content.includes('HOLD_DURATION_SECONDS = 300'), 'Seat hold duration must remain 300 seconds');
  });

  it('Preserves cryptographic SHA-256 token verification on /api/bookings/verify/:bookingId', () => {
    const serverPath = path.resolve(__dirname, '../server.ts');
    const content = fs.readFileSync(serverPath, 'utf-8');
    assert(content.includes('/api/bookings/verify/:bookingId'), 'Must maintain verification endpoint');
    assert(content.includes('crypto.timingSafeEqual'), 'Must use timingSafeEqual for token comparison');
    assert(content.includes('tokenHash'), 'Must compare against server-stored tokenHash');
  });

  it('Preserves historical booking CB-GAT-942180 in database', () => {
    const dbPath = path.resolve(__dirname, '../data/cinebook-db.json');
    assert(fs.existsSync(dbPath), 'cinebook-db.json must exist');
    const db = JSON.parse(fs.readFileSync(dbPath, 'utf-8'));
    const historical = db.confirmedBookings.find(b => b.id === 'CB-GAT-942180');
    assert(historical, 'CB-GAT-942180 must exist in database');
    assert(historical.tokenHash, 'CB-GAT-942180 must have tokenHash');
  });

  it('Navbar contains Guided Tour launcher and all data-tour targets', () => {
    const navbarPath = path.resolve(__dirname, '../src/components/Navbar.tsx');
    const content = fs.readFileSync(navbarPath, 'utf-8');
    assert(content.includes('onStartTour'), 'Navbar must accept onStartTour');
    assert(content.includes('data-tour="navbar-home"'), 'Must have data-tour="navbar-home"');
    assert(content.includes('data-tour="navbar-movies"'), 'Must have data-tour="navbar-movies"');
    assert(content.includes('data-tour="watchlist-nav"'), 'Must have data-tour="watchlist-nav"');
    assert(content.includes('data-tour="my-bookings-nav"'), 'Must have data-tour="my-bookings-nav"');
    assert(content.includes('data-tour="canteen-nav"'), 'Must have data-tour="canteen-nav"');
    assert(content.includes('data-tour="offers-nav"'), 'Must have data-tour="offers-nav"');
  });

  it('App.tsx wires up CineBot welcome modal, tour, and external assistant triggers', () => {
    const appPath = path.resolve(__dirname, '../src/App.tsx');
    const content = fs.readFileSync(appPath, 'utf-8');
    assert(content.includes('<CineBotWelcomeModal'), 'App.tsx must render CineBotWelcomeModal');
    assert(content.includes('<InteractiveTour'), 'App.tsx must render InteractiveTour');
    assert(content.includes('cinebook_onboarding_status'), 'App.tsx must persist onboarding status to localStorage');
    assert(content.includes('onStartTour={handleRestartTour}'), 'App.tsx must pass onStartTour to Navbar and AIAssistant');
    assert(content.includes('externalQuery={cinebotQuery}'), 'App.tsx must pass externalQuery to AIAssistant');
  });

  console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log(`📊 RESULTS: ${passCount} passed, ${failCount} failed`);
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');

  if (failCount > 0) {
    process.exit(1);
  }
}

runTests();
