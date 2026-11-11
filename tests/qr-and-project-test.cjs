/**
 * Comprehensive CineBook End-to-End Test Suite
 * Tests all QR Scenarios, Security Token Validation, Booking Workflows, and Regression Points.
 */

const http = require('http');
const fs = require('fs');
const crypto = require('crypto');

function makeRequest(method, path, body = null, headers = {}) {
  return new Promise((resolve, reject) => {
    const postData = body ? JSON.stringify(body) : null;
    const reqHeaders = {
      ...headers
    };
    if (postData) {
      reqHeaders['Content-Type'] = 'application/json';
      reqHeaders['Content-Length'] = Buffer.byteLength(postData);
    }

    const options = {
      hostname: '127.0.0.1',
      port: 3000,
      path,
      method,
      headers: reqHeaders
    };

    const req = http.request(options, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          const json = JSON.parse(data);
          resolve({ status: res.statusCode, headers: res.headers, body: json, raw: data });
        } catch {
          resolve({ status: res.statusCode, headers: res.headers, body: data, raw: data });
        }
      });
    });

    req.on('error', (err) => reject(err));
    if (postData) {
      req.write(postData);
    }
    req.end();
  });
}

async function runTests() {
  console.log('=====================================================');
  console.log('🎬 CINEBOOK COMPREHENSIVE PROJECT & QR TEST SUITE 🎬');
  console.log('=====================================================\n');

  let passedCount = 0;
  let failedCount = 0;

  function assert(condition, message) {
    if (condition) {
      console.log(`  ✅ PASS: ${message}`);
      passedCount++;
    } else {
      console.error(`  ❌ FAIL: ${message}`);
      failedCount++;
    }
  }

  // TEST 1: Historical Booking Data Protection
  console.log('--- TEST GROUP 1: Historical Database Safety ---');
  const dbData = JSON.parse(fs.readFileSync('data/cinebook-db.json', 'utf8'));
  const histBooking = (dbData.confirmedBookings || []).find(b => b.id === 'CB-GAT-942180');
  assert(histBooking !== undefined, 'Historical booking CB-GAT-942180 exists in DB');
  assert(histBooking.seats.join(',') === 'F4,F5', 'Historical seats are preserved (F4, F5)');
  assert(histBooking.status === 'confirmed', 'Historical booking status is confirmed');
  assert(typeof histBooking.tokenHash === 'string' && histBooking.tokenHash.length === 64, 'Historical booking has secure SHA-256 tokenHash');

  // TEST 2: Historical Booking Verification with Valid Legacy Token
  console.log('\n--- TEST GROUP 2: Historical Booking Verification ---');
  const histRes = await makeRequest('GET', `/api/bookings/verify/CB-GAT-942180?token=cb_tok_gat942180_3556f8a3d55f2d31`);
  assert(histRes.status === 200, 'CB-GAT-942180 returns HTTP 200 with valid token');
  assert(histRes.body.valid === true, 'CB-GAT-942180 is verified as valid: true');
  assert(histRes.body.movieTitle === 'Gatta Kusthi 2', 'Movie title matches Gatta Kusthi 2');
  assert(histRes.body.seats.includes('F4') && histRes.body.seats.includes('F5'), 'Confirmed seats returned in verification payload');
  assert(histRes.body.totalAmount === 425, 'Total amount returned');

  // TEST 3: Verification Security & Attack Scenario Rejections
  console.log('\n--- TEST GROUP 3: Security & Rejection Scenarios ---');

  // Scenario 3a: Missing verification token (trusting booking ID alone rejected)
  const noTokenRes = await makeRequest('GET', `/api/bookings/verify/CB-GAT-942180`);
  assert(noTokenRes.status === 401, 'Missing token returns HTTP 401 Unauthorized');
  assert(noTokenRes.body.valid === false, 'Missing token returns valid: false');

  // Scenario 3b: Modified / Tampered token rejected
  const modifiedTokenRes = await makeRequest('GET', `/api/bookings/verify/CB-GAT-942180?token=cb_tok_gat942180_tampered_fake`);
  assert(modifiedTokenRes.status === 403, 'Tampered token returns HTTP 403 Forbidden');
  assert(modifiedTokenRes.body.valid === false, 'Tampered token returns valid: false');

  // Scenario 3c: Unknown / Non-existent booking ID rejected
  const unknownIdRes = await makeRequest('GET', `/api/bookings/verify/CB-FAKE-999999?token=any_token`);
  assert(unknownIdRes.status === 404, 'Unknown booking ID returns HTTP 404 Not Found');
  assert(unknownIdRes.body.valid === false, 'Unknown booking ID returns valid: false');

  // TEST 4: Full Booking Workflow with 5-Minute Hold & QR Generation
  console.log('\n--- TEST GROUP 4: Seat Hold, Conflict & Booking Workflow ---');
  const testMovieId = 'amaran';
  const testTheatreId = 'th-1';
  const testDate = 'TestDate_' + Date.now();
  const testTime = '06:30 PM';
  const testSeats = ['H1', 'H2'];

  // Step 4a: Create 5-minute hold
  const holdRes = await makeRequest('POST', '/api/holds', {
    movieId: testMovieId,
    theatreId: testTheatreId,
    date: testDate,
    time: testTime,
    seats: testSeats
  });
  assert(holdRes.status === 200, 'Seat reservation hold created with HTTP 200');
  assert(typeof holdRes.body.holdToken === 'string', 'Hold token issued by server');
  assert(holdRes.body.expiresInSeconds === 300, 'Hold expires in exactly 300 seconds (5 minutes)');
  const holdToken = holdRes.body.holdToken;

  // Step 4b: Duplicate seat reservation attempt while hold is active
  const duplicateHoldRes = await makeRequest('POST', '/api/holds', {
    movieId: testMovieId,
    theatreId: testTheatreId,
    date: testDate,
    time: testTime,
    seats: ['H1', 'H3']
  });
  assert(duplicateHoldRes.status === 409, 'Duplicate reservation conflict rejected with HTTP 409');
  assert(duplicateHoldRes.body.conflictHeld && duplicateHoldRes.body.conflictHeld.includes('H1'), 'Conflicting seat H1 identified');

  // Step 4c: Confirm booking with invalid hold token
  const fakeHoldBooking = await makeRequest('POST', '/api/bookings/confirm', {
    holdToken: 'fake_hold_token_123',
    booking: {
      movie: { id: testMovieId, title: 'Amaran' },
      theatre: { id: testTheatreId, name: 'PVR INOX Grand Mall', screen: 'Audi 1' },
      date: testDate,
      time: testTime,
      seats: testSeats,
      totalAmount: 380
    }
  });
  assert(fakeHoldBooking.status === 400 || fakeHoldBooking.status === 410, 'Invalid hold token rejected for booking confirmation');

  // Step 4d: Confirm booking with the valid hold token
  const confirmRes = await makeRequest('POST', '/api/bookings/confirm', {
    holdToken,
    booking: {
      movie: { id: testMovieId, title: 'Amaran' },
      theatre: { id: testTheatreId, name: 'PVR INOX Grand Mall', screen: 'Audi 1' },
      date: testDate,
      time: testTime,
      seats: testSeats,
      categoryBreakdown: [{ category: 'Regular', count: 2, price: 190, subtotal: 380 }],
      subtotal: 380,
      convenienceFee: 38,
      gst: 7,
      totalAmount: 425,
      paymentMethod: 'UPI (GPay)'
    }
  });

  assert(confirmRes.status === 200, 'Booking confirmed successfully with HTTP 200');
  assert(confirmRes.body.success === true, 'Confirmation payload has success: true');
  assert(typeof confirmRes.body.verificationToken === 'string', 'Server returned unpredictable verificationToken');
  assert(typeof confirmRes.body.bookingId === 'string', 'Server assigned bookingId');
  const newBookingId = confirmRes.body.bookingId;
  const newVerificationToken = confirmRes.body.verificationToken;

  // Step 4e: Verify newly confirmed booking using its genuine verification token
  console.log('\n--- TEST GROUP 5: Verify Newly Created Booking ---');
  const newVerifyRes = await makeRequest('GET', `/api/bookings/verify/${newBookingId}?token=${newVerificationToken}`);
  assert(newVerifyRes.status === 200, 'New booking verifies with HTTP 200');
  assert(newVerifyRes.body.valid === true, 'New booking verifies as valid: true');
  assert(newVerifyRes.body.movieTitle === 'Amaran', 'Verified movie title matches Amaran');
  assert(newVerifyRes.body.seats.join(',') === 'H1,H2', 'Verified seats match H1, H2');

  // Step 4f: Cross-booking token attack (using another booking token)
  const crossTokenRes = await makeRequest('GET', `/api/bookings/verify/${newBookingId}?token=cb_tok_gat942180_3556f8a3d55f2d31`);
  assert(crossTokenRes.status === 403, 'Cross-booking token rejected with HTTP 403');
  assert(crossTokenRes.body.valid === false, 'Cross-booking token returns valid: false');

  // Step 4g: Hold token consumed check (replay attack prevention)
  const replayConfirm = await makeRequest('POST', '/api/bookings/confirm', {
    holdToken,
    booking: {
      movie: { id: testMovieId, title: 'Amaran' },
      theatre: { id: testTheatreId, name: 'PVR INOX Grand Mall', screen: 'Audi 1' },
      date: testDate,
      time: testTime,
      seats: testSeats,
      totalAmount: 425
    }
  });
  assert(replayConfirm.status === 400 || replayConfirm.status === 410, 'Replay of consumed hold token rejected');

  // TEST 5: QR Code Generation Compatibility
  console.log('\n--- TEST GROUP 6: QR Code Library & Scannable URL ---');
  const QRCode = require('qrcode');
  const publicUrl = `https://ais-pre-2l5nugll5rgum3y4yrhvtd-126430505601.asia-east1.run.app/#verify?id=${encodeURIComponent(newBookingId)}&token=${encodeURIComponent(newVerificationToken)}`;
  const qrDataUrl = await QRCode.toDataURL(publicUrl, {
    errorCorrectionLevel: 'M',
    margin: 2,
    width: 280,
    color: { dark: '#09090b', light: '#ffffff' }
  });
  assert(qrDataUrl.startsWith('data:image/png;base64,'), 'QR Code generated as standard PNG base64 Data URL');
  assert(qrDataUrl.length > 500, 'QR Code Data URL has valid image density (>500 bytes)');

  // TEST 6: Clean up only test record created by tests
  console.log('\n--- TEST GROUP 7: Test Cleanup & Database Safety ---');
  const dbAfter = JSON.parse(fs.readFileSync('data/cinebook-db.json', 'utf8'));
  // Remove only the newly created test booking from test run
  dbAfter.confirmedBookings = dbAfter.confirmedBookings.filter(b => b.id !== newBookingId);
  const showKey = `${testMovieId}::${testTheatreId}::${testDate}::${testTime}`;
  if (dbAfter.seats[showKey]) {
    dbAfter.seats[showKey] = dbAfter.seats[showKey].filter(s => !testSeats.includes(s));
    if (dbAfter.seats[showKey].length === 0) delete dbAfter.seats[showKey];
  }
  fs.writeFileSync('data/cinebook-db.json', JSON.stringify(dbAfter, null, 2), 'utf8');

  // Verify historical record is still intact
  const finalDb = JSON.parse(fs.readFileSync('data/cinebook-db.json', 'utf8'));
  const finalHist = finalDb.confirmedBookings.find(b => b.id === 'CB-GAT-942180');
  assert(finalHist !== undefined, 'CB-GAT-942180 fully preserved after test cleanup');

  console.log('\n=====================================================');
  console.log(`TEST SUMMARY: ${passedCount} PASSED, ${failedCount} FAILED`);
  console.log('=====================================================');

  if (failedCount > 0) {
    process.exit(1);
  }
}

runTests().catch(err => {
  console.error('Fatal test runner failure:', err);
  process.exit(1);
});
