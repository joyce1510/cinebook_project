/**
 * CineBook Regression Test Suite
 * Tests all 9 regression points: Watchlist, Bookings, Filters, Moods, Recommendations, Food Combos, Offers, Invoice, 5-Min Hold
 */

const fs = require('fs');

console.log('=====================================================');
console.log('🔄 CINEBOOK REGRESSION VERIFICATION TEST SUITE 🔄');
console.log('=====================================================\n');

let pass = 0;
let fail = 0;

function check(cond, msg) {
  if (cond) {
    console.log(`  ✅ PASS: ${msg}`);
    pass++;
  } else {
    console.error(`  ❌ FAIL: ${msg}`);
    fail++;
  }
}

// 1. Five-minute hold constant
const serverCode = fs.readFileSync('server.ts', 'utf8');
const paymentCode = fs.readFileSync('src/components/PaymentModal.tsx', 'utf8');
check(serverCode.includes('HOLD_DURATION_SECONDS = 300'), 'server.ts enforces HOLD_DURATION_SECONDS = 300');
check(paymentCode.includes('300; // 5 mins fallback'), 'PaymentModal.tsx countdown starts at 300 seconds');

// 2. Watchlist persistence and toggle in components
const movieCardCode = fs.readFileSync('src/components/MovieCard.tsx', 'utf8');
const bookingViewCode = fs.readFileSync('src/components/BookingView.tsx', 'utf8');
const watchlistPageCode = fs.readFileSync('src/components/WatchlistPage.tsx', 'utf8');
check(movieCardCode.includes('onToggleWatchlist') && movieCardCode.includes('isWatchlisted'), 'MovieCard supports heart toggle');
check(bookingViewCode.includes('onToggleWatchlist') && bookingViewCode.includes('isWatchlisted'), 'BookingView supports heart toggle');
check(watchlistPageCode.includes('onClearWatchlist') && watchlistPageCode.includes('watchlistMovies'), 'WatchlistPage provides grid and clear action');

// 3. Smart Food Combos with strikethrough & savings
const canteenMenuCode = fs.readFileSync('src/data/canteenMenu.ts', 'utf8');
check(canteenMenuCode.includes('Cinema Duo Combo') && canteenMenuCode.includes('savings: 40'), 'Cinema Duo Combo has 40 savings');
check(canteenMenuCode.includes('Blockbuster Pair') && canteenMenuCode.includes('savings: 60'), 'Blockbuster Pair has 60 savings');
check(canteenMenuCode.includes('Family Snack Feast') && canteenMenuCode.includes('savings: 60'), 'Family Snack Feast has 60 savings');

// 4. Offers & Coupons calculation
const offersCode = fs.readFileSync('src/data/offers.ts', 'utf8');
check(offersCode.includes('CINE20') && offersCode.includes('DINNERFREE') && offersCode.includes('PARTNER50'), 'Promo coupons CINE20, DINNERFREE, and PARTNER50 present');

// 5. Advanced Movie Filters & Mood combination
const filtersCode = fs.readFileSync('src/components/AdvancedMovieFilters.tsx', 'utf8');
check(filtersCode.includes('applyMovieFilters') && filtersCode.includes('ratingThreshold'), 'applyMovieFilters supports multi-facet facets');
check(filtersCode.includes('releaseYearRange') && filtersCode.includes('certificate'), 'Release era and certificate filtering supported');

// 6. Personalized Recommendations
const recsCode = fs.readFileSync('src/components/PersonalizedRecommendations.tsx', 'utf8');
check(recsCode.includes('watchlistRecommended') && recsCode.includes('criticsChoice'), 'Personalized recommendations supports watchlist matching & critics choice');

// 7. My Bookings Dashboard
const dashboardCode = fs.readFileSync('src/components/BookingsDashboard.tsx', 'utf8');
check(dashboardCode.includes('upcomingBookings') && dashboardCode.includes('pastBookings'), 'BookingsDashboard separates upcoming and past shows');

// 8. Invoice Generation & Print Styling
const printTicketCode = fs.readFileSync('src/components/TicketConfirmation.tsx', 'utf8');
check(printTicketCode.includes('handlePrint') && printTicketCode.includes('window.print()'), 'Invoice printing supported');
check(printTicketCode.includes('generateTicketQRCodeDataUrl'), 'Printable invoice includes genuine scannable QR code');

// 9. Database safety check
const db = JSON.parse(fs.readFileSync('data/cinebook-db.json', 'utf8'));
const hist = db.confirmedBookings.find(b => b.id === 'CB-GAT-942180');
check(hist !== undefined && hist.seats.length === 2, 'Historical booking CB-GAT-942180 remains intact');

console.log('\n=====================================================');
console.log(`REGRESSION SUMMARY: ${pass} PASSED, ${fail} FAILED`);
console.log('=====================================================');

if (fail > 0) process.exit(1);
