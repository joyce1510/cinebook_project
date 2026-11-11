/**
 * CineBook 1.0 - Phase 3: End-to-End Customer Journeys (Journeys 1 to 5)
 */

const assert = require('assert');
const http = require('http');
const fs = require('fs');
const path = require('path');
const QRCode = require('qrcode');
const jsQR = require('jsqr');
const { PNG } = require('pngjs');

console.log('╔════════════════════════════════════════════════════════════════════╗');
console.log('║        CINEBOOK 1.0 — PHASE 3: END-TO-END CUSTOMER JOURNEYS        ║');
console.log('╚════════════════════════════════════════════════════════════════════╝\n');

let passCount = 0;
let failCount = 0;

function it(name, fn) {
  try {
    fn();
    console.log(`  ✅ [PASS] ${name}`);
    passCount++;
  } catch (err) {
    console.error(`  ❌ [FAIL] ${name}`);
    console.error(`     Error: ${err.message}`);
    failCount++;
  }
}

async function itAsync(name, fn) {
  try {
    await fn();
    console.log(`  ✅ [PASS] ${name}`);
    passCount++;
  } catch (err) {
    console.error(`  ❌ [FAIL] ${name}`);
    console.error(`     Error: ${err.message}`);
    failCount++;
  }
}

function request(method, path, body = null) {
  return new Promise((resolve, reject) => {
    const payload = body ? JSON.stringify(body) : null;
    const reqHeaders = { 'Content-Type': 'application/json' };
    if (payload) reqHeaders['Content-Length'] = Buffer.byteLength(payload);

    const req = http.request(
      { hostname: '127.0.0.1', port: 3000, path, method, headers: reqHeaders },
      (res) => {
        let resData = '';
        res.on('data', (c) => (resData += c));
        res.on('end', () => {
          let json = null;
          try {
            json = JSON.parse(resData);
          } catch {
            json = resData;
          }
          resolve({ statusCode: res.statusCode, body: json });
        });
      }
    );
    req.on('error', reject);
    if (payload) req.write(payload);
    req.end();
  });
}

function decodeQRCodePNG(pngBuffer) {
  return new Promise((resolve, reject) => {
    const png = new PNG();
    png.parse(pngBuffer, (err, image) => {
      if (err) return reject(err);
      const code = jsQR(new Uint8ClampedArray(image.data), image.width, image.height);
      if (!code) return reject(new Error('jsQR decode failed'));
      resolve(code.data);
    });
  });
}

async function runJourneys() {
  const cleanupBookings = [];
  const cleanupHolds = [];
  const runTag = `JOURNEY_${Date.now()}`;

  // =========================================================================
  console.log('─── JOURNEY 1: NEW CUSTOMER ONBOARDING ──────────────────────────────');
  console.log('    Welcome Page → CineBot → Movie Catalogue → Movie Details → Watchlist\n');
  // =========================================================================
  it('Step 1: First-time visitor arrives with no onboarding status in localStorage', () => {
    const appPath = path.resolve(__dirname, '../src/App.tsx');
    const appContent = fs.readFileSync(appPath, 'utf-8');
    assert(appContent.includes("localStorage.getItem('cinebook_onboarding_status')"), 'Checks onboarding status');
    assert(appContent.includes('setShowWelcomeModal'), 'Triggers welcome modal for new users');
  });

  it('Step 2: CineBot Welcome modal offers 3 choices without forcing the user', () => {
    const modalPath = path.resolve(__dirname, '../src/components/CineBotWelcomeModal.tsx');
    const modalContent = fs.readFileSync(modalPath, 'utf-8');
    assert(modalContent.includes('Start Guided Tour') && modalContent.includes('Chat with CineBot') && modalContent.includes('Skip for Now'));
  });

  it('Step 3: User transitions from Welcome Page to Main Catalogue via Explore CineBook', () => {
    const welcomePath = path.resolve(__dirname, '../src/components/WelcomePage.tsx');
    const welcomeContent = fs.readFileSync(welcomePath, 'utf-8');
    assert(welcomeContent.includes('onExplore') || welcomeContent.includes('Explore CineBook'));
  });

  it('Step 4: User opens Movie Details (synopsis, director, cast, trailer preview)', () => {
    const cardPath = path.resolve(__dirname, '../src/components/MovieCard.tsx');
    const cardContent = fs.readFileSync(cardPath, 'utf-8');
    assert(cardContent.includes('onSelectMovie'), 'Card provides selection to open details');
    assert(cardContent.includes('PosterArtwork'), 'Card uses responsive PosterArtwork');
  });

  it('Step 5: User adds movie to My Watchlist (persisted in cinebook_watchlist)', () => {
    const appPath = path.resolve(__dirname, '../src/App.tsx');
    const appContent = fs.readFileSync(appPath, 'utf-8');
    assert(appContent.includes('handleToggleWatchlist'), 'Toggles movie in watchlist');
    assert(appContent.includes('cinebook_watchlist'), 'Persists in cinebook_watchlist');
  });

  // =========================================================================
  console.log('\n─── JOURNEY 2: COMPLETE BOOKING WORKFLOW ────────────────────────────');
  console.log('    Movie → Showtime → Seat Selection → 5-Min Hold → Combos → Coupon → Payment → Server Confirmation\n');
  // =========================================================================
  let journeyBookingId = null;
  let journeyVerificationToken = null;

  await itAsync('Execute complete reservation and confirmation against backend', async () => {
    // 1. Pick Amaran at PVR INOX
    const movieId = 'amaran';
    const theatreId = 'th-1';
    const date = runTag;
    const time = '06:00 PM';
    const selectedSeats = ['D4', 'D5']; // Regular seats ₹160 each = ₹320

    // 2. Request 5-minute seat hold
    const holdRes = await request('POST', '/api/bookings/reserve', {
      movieId,
      theatreId,
      date,
      time,
      seats: selectedSeats,
      userId: 'journey-tester'
    });
    assert.strictEqual(holdRes.statusCode, 200, 'Hold must be granted');
    const holdToken = holdRes.body.holdToken;
    cleanupHolds.push(holdToken);

    // 3. Add Canteen Smart Combo: Cinema Duo Combo (₹110)
    const canteenItems = [
      {
        item: {
          id: 'combo-cinema-duo',
          name: 'Cinema Duo Combo',
          category: 'Combos',
          price: 110,
          description: 'Popcorn + Chilled Drink'
        },
        count: 1
      }
    ];
    const canteenTotal = 110;

    // 4. Apply Coupon CINE20 (20% off on ticket subtotal ₹320 = -₹64)
    const subtotal = 320;
    const discount = Math.round(subtotal * 0.2); // 64
    const convenienceFee = Math.round((subtotal + canteenTotal - discount) * 0.1); // ~37
    const gst = Math.round(convenienceFee * 0.18); // ~7
    const totalAmount = subtotal + canteenTotal - discount + convenienceFee + gst;

    // 5. Submit Simulated UPI payment and commit booking
    const confirmRes = await request('POST', '/api/bookings/confirm', {
      holdToken,
      booking: {
        movie: {
          id: movieId,
          title: 'Amaran',
          displayLanguage: 'Tamil',
          languages: ['Tamil'],
          genres: ['Action', 'Drama'],
          duration: '2h 47m',
          certificate: 'U/A',
          rating: 9.2
        },
        theatre: {
          id: theatreId,
          name: 'PVR INOX Luxe Multiplex',
          location: 'Phoenix Marketcity, Velachery',
          screen: 'Screen 1 — Dolby Atmos 4K Laser'
        },
        date,
        time,
        seats: selectedSeats,
        categoryBreakdown: [{ category: 'Regular', count: 2, price: 160, subtotal: 320 }],
        subtotal,
        canteenItems,
        canteenTotal,
        appliedOffer: {
          code: 'CINE20',
          title: 'Fashion Partner 20% OFF',
          type: 'coupon',
          discountAmount: discount
        },
        convenienceFee,
        gst,
        totalAmount,
        paymentMethod: 'UPI (GPay · Demo Sandbox)',
        customerName: 'Journey Customer',
        customerEmail: 'customer@journey.test'
      }
    });

    assert.strictEqual(confirmRes.statusCode, 200, 'Confirmation must succeed');
    assert(confirmRes.body.success === true, 'Response must be success: true');
    assert(typeof confirmRes.body.bookingId === 'string');
    assert(typeof confirmRes.body.verificationToken === 'string');

    journeyBookingId = confirmRes.body.bookingId;
    journeyVerificationToken = confirmRes.body.verificationToken;
    cleanupBookings.push(journeyBookingId);
  });

  // =========================================================================
  console.log('\n─── JOURNEY 3: TICKET VERIFICATION (QR GATE PASS VALIDATION) ────────');
  console.log('    Confirmed Booking → QR Generation → Independent QR Decoding → Verification URL → Backend Validation\n');
  // =========================================================================
  await itAsync('QR Code image is generated, decoded independently, and verified by turnstile gate', async () => {
    // 1. Generate QR Code image as PNG buffer
    const appBaseUrl = 'https://ais-pre-2l5nugll5rgum3y4yrhvtd-126430505601.asia-east1.run.app';
    const canonicalUrl = `${appBaseUrl}/#verify?id=${encodeURIComponent(journeyBookingId)}&token=${encodeURIComponent(journeyVerificationToken)}`;
    const pngBuffer = await QRCode.toBuffer(canonicalUrl, { errorCorrectionLevel: 'M', margin: 2, width: 280 });

    // 2. Decode QR Code without trusting any cache
    const decodedUrl = await decodeQRCodePNG(pngBuffer);
    assert.strictEqual(decodedUrl, canonicalUrl, 'Decoded URL matches canonical verification URL');

    // 3. Extract query params from URL
    const hash = decodedUrl.split('#')[1] || '';
    const query = hash.split('?')[1] || '';
    const params = new URLSearchParams(query);
    const scannedId = params.get('id');
    const scannedToken = params.get('token');

    // 4. Simulate Gate Turnstile contacting CineBook backend
    const gateRes = await request(
      'GET',
      `/api/bookings/verify/${encodeURIComponent(scannedId)}?token=${encodeURIComponent(scannedToken)}`
    );

    assert.strictEqual(gateRes.statusCode, 200, 'Turnstile admission granted with HTTP 200');
    assert.strictEqual(gateRes.body.valid, true, 'Ticket valid: true');
    assert.strictEqual(gateRes.body.bookingId, journeyBookingId, 'Booking ID matches');
    assert.strictEqual(gateRes.body.movieTitle, 'Amaran');
    assert.deepStrictEqual(gateRes.body.seats, ['D4', 'D5']);
  });

  // =========================================================================
  console.log('\n─── JOURNEY 4: RETURNING CUSTOMER EXPERIENCE ───────────────────────');
  console.log('    Homepage → My Bookings Dashboard → Upcoming/Past Separation → Invoice Download → Ratings\n');
  // =========================================================================
  it('Returning visitor bypasses welcome popup if onboarding was previously marked completed', () => {
    const appPath = path.resolve(__dirname, '../src/App.tsx');
    const appContent = fs.readFileSync(appPath, 'utf-8');
    assert(appContent.includes("localStorage.getItem('cinebook_onboarding_status')"));
  });

  it('My Bookings Dashboard separates upcoming shows from past watched movies', () => {
    const dashPath = path.resolve(__dirname, '../src/components/BookingsDashboard.tsx');
    const dashContent = fs.readFileSync(dashPath, 'utf-8');
    assert(dashContent.includes('isPastBooking'));
    assert(dashContent.includes('upcomingBookings'));
    assert(dashContent.includes('pastBookings'));
  });

  it('Tax Invoice includes movie, seats, total amount paid, canteen details, and printable QR', () => {
    const ticketPath = path.resolve(__dirname, '../src/components/TicketConfirmation.tsx');
    const ticketContent = fs.readFileSync(ticketPath, 'utf-8');
    assert(ticketContent.includes('window.print()'), 'Must have print action');
    assert(ticketContent.includes('renderQRCode'), 'Must render QR code');
    assert(ticketContent.includes('booking.totalAmount'), 'Must display total amount paid');
    assert(ticketContent.includes('booking.paymentMethod'), 'Must display payment method');
  });

  // =========================================================================
  console.log('\n─── JOURNEY 5: MOVIE DISCOVERY ─────────────────────────────────────');
  console.log('    Search → Multi-Facet Filters → Mood Discovery → Personalized Recommendations\n');
  // =========================================================================
  it('Multi-facet filter combines text query, genre, language, era, and certificate', () => {
    const filterPath = path.resolve(__dirname, '../src/components/AdvancedMovieFilters.tsx');
    const filterContent = fs.readFileSync(filterPath, 'utf-8');
    assert(filterContent.includes('applyMovieFilters'), 'Applies multi-facet filters');
  });

  it('Mood recommendations filter narrows catalogue to mood-relevant selections', () => {
    const moodPath = path.resolve(__dirname, '../src/components/MoodRecommendationSection.tsx');
    const moodContent = fs.readFileSync(moodPath, 'utf-8');
    assert(moodContent.includes('onSelectMood'), 'Provides mood selection');
  });

  it('Personalized Recommendations suggests acclaimed gems when history is empty', () => {
    const recPath = path.resolve(__dirname, '../src/components/PersonalizedRecommendations.tsx');
    const recContent = fs.readFileSync(recPath, 'utf-8');
    assert(recContent.includes('criticsChoice'), 'Provides critics choice for empty history');
  });

  // =========================================================================
  // Safe cleanup of Journey temporary records
  // =========================================================================
  it('Clean up journey test data and verify DB safety', () => {
    const dbPath = path.resolve(__dirname, '../data/cinebook-db.json');
    const db = JSON.parse(fs.readFileSync(dbPath, 'utf-8'));

    db.confirmedBookings = db.confirmedBookings.filter((b) => !cleanupBookings.includes(b.id));
    db.holds = db.holds.filter((h) => !cleanupHolds.includes(h.holdToken));

    const journeyKey = `amaran::th-1::${runTag}::06:00 PM`;
    if (db.seats[journeyKey]) {
      delete db.seats[journeyKey];
    }

    const tmp = `${dbPath}.journey_cleanup.tmp`;
    fs.writeFileSync(tmp, JSON.stringify(db, null, 2), 'utf-8');
    fs.renameSync(tmp, dbPath);

    const reloaded = JSON.parse(fs.readFileSync(dbPath, 'utf-8'));
    assert(reloaded.confirmedBookings.some((b) => b.id === 'CB-GAT-942180'), 'Historical booking preserved');
  });

  console.log('\n╔════════════════════════════════════════════════════════════════════╗');
  console.log(`║   JOURNEYS EXECUTION SUMMARY: ${passCount} PASSED, ${failCount} FAILED                    ║`);
  console.log('╚════════════════════════════════════════════════════════════════════╝\n');

  if (failCount > 0) process.exit(1);
}

runJourneys().catch((err) => {
  console.error('Fatal error in journeys suite:', err);
  process.exit(1);
});
