import express from 'express';
import http from 'http';
import { createServer as createViteServer } from 'vite';
import fs from 'fs';
import path from 'path';
import crypto from 'crypto';
import { fileURLToPath } from 'url';

// In AI Studio, HMR is disabled to avoid WebSocket errors across the cloud proxy
process.env.DISABLE_HMR = 'true';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PORT = 3000;
const DB_DIR = path.resolve(__dirname, 'data');
const DB_FILE = path.join(DB_DIR, 'cinebook-db.json');

// Strict 5-Minute Seat Hold Policy (Source of truth: exactly 300 seconds / 300,000 ms)
export const HOLD_DURATION_SECONDS = 300;
export const HOLD_DURATION_MS = HOLD_DURATION_SECONDS * 1000;

// Interface for DB
interface SeatHold {
  holdToken: string;
  showKey: string;
  seats: string[];
  expiresAt: number;
  userId?: string;
  createdAt: number;
}

interface ServerBooking {
  id: string;
  movie: any;
  theatre: any;
  date: string;
  time: string;
  seats: string[];
  categoryBreakdown: any[];
  subtotal: number;
  convenienceFee: number;
  gst: number;
  totalAmount: number;
  bookedAt: string;
  paymentMethod: string;
  customerName?: string;
  customerEmail?: string;
  customerPhone?: string;
  canteenItems?: any[];
  canteenTotal?: number;
  appliedOffer?: any;
  unlockedRewards?: any[];
  isWatched?: boolean;
  status: 'confirmed' | 'cancelled' | 'checked_in';
  verificationHash: string;
  tokenHash?: string;
}

interface CineBookDatabase {
  confirmedBookings: ServerBooking[];
  seats: Record<string, string[]>; // showKey -> seatIds[]
  holds: SeatHold[];
}

// Ensure data directory exists
if (!fs.existsSync(DB_DIR)) {
  fs.mkdirSync(DB_DIR, { recursive: true });
}

// Initial DB state
function getInitialDb(): CineBookDatabase {
  return {
    confirmedBookings: [
      {
        id: 'CB-GAT-942180',
        movie: {
          id: 'gatta-kusthi-2',
          title: 'Gatta Kusthi 2',
          displayLanguage: 'Tamil',
          languages: ['Tamil', 'Telugu'],
          genres: ['Sports', 'Comedy', 'Drama'],
          duration: '2h 28m',
          certificate: 'U',
          rating: 8.9,
          votes: '42.8K',
          releaseYear: 2026,
          synopsis: 'Following his eye-opening journey in the first chapter, Veera has proudly embraced life managing household chores and cheering on his superstar wrestler wife, Keerthi. When Keerthi qualifies for the high-stakes World Wrestling Championship in Dubai, the couple faces meddling village traditionalists, comical family turmoil, and ruthless international opponents in an entertaining blend of rural humor and arena action.',
          cast: ['Vishnu Vishal', 'Aishwarya Lekshmi', 'Karunas'],
          director: 'Chella Ayyavu',
          accentColor: '#f59e0b',
          bgGradient: 'from-amber-600/30 via-zinc-900 to-zinc-950',
          accentBadgeColor: 'bg-amber-500/20 text-amber-300 border-amber-500/30',
          themeSymbol: '🤼'
        },
        theatre: {
          id: 'th-1',
          name: 'PVR INOX Grand Mall',
          location: 'Velachery, Chennai',
          screen: 'Audi 1 (4K Laser Dolby Atmos)',
          soundSystem: 'Dolby Atmos 7.1.4',
          shows: ['10:30 AM', '02:00 PM', '06:30 PM', '10:00 PM']
        },
        date: 'Yesterday',
        time: '06:30 PM',
        seats: ['F4', 'F5'],
        categoryBreakdown: [
          { category: 'Regular', count: 2, price: 190, subtotal: 380 }
        ],
        subtotal: 380,
        convenienceFee: 38,
        gst: 7,
        totalAmount: 425,
        bookedAt: new Date(Date.now() - 86400000).toISOString(),
        paymentMethod: 'UPI (GPay)',
        isWatched: true,
        status: 'confirmed',
        verificationHash: crypto.createHash('sha256').update('CB-GAT-942180::confirmed').digest('hex').substring(0, 16),
        tokenHash: '70f274aae0415ea824223aa15f87bb5b1dd90e8a992a5a914ac9f49ca75f495e'
      }
    ],
    seats: {
      'gatta-kusthi-2::th-1::Yesterday::06:30 PM': ['F4', 'F5']
    },
    holds: []
  };
}

// Operational database state flags
let isDbCorrupted = false;
let dbCorruptionError: string | null = null;

// Load DB with safe error handling and corruption backups
function loadDb(): CineBookDatabase {
  if (fs.existsSync(DB_FILE)) {
    try {
      const data = fs.readFileSync(DB_FILE, 'utf-8');
      const parsed = JSON.parse(data);
      if (!Array.isArray(parsed.confirmedBookings) || typeof parsed.seats !== 'object' || !Array.isArray(parsed.holds)) {
        throw new Error('Database schema integrity validation failed (missing confirmedBookings, seats, or holds)');
      }
      return parsed;
    } catch (err: any) {
      console.error('CRITICAL: Database file exists but is corrupted or cannot be parsed:', err);
      // Create a timestamped backup of the corrupted file before any recovery attempt
      const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
      const backupPath = path.join(DB_DIR, `cinebook-db.corrupted.${timestamp}.json`);
      try {
        fs.copyFileSync(DB_FILE, backupPath);
        console.error(`Preserved corrupted database backup at ${backupPath}`);
      } catch (backupErr) {
        console.error('Failed to create backup of corrupted database:', backupErr);
      }

      // Flag database as corrupted. DO NOT silently overwrite DB_FILE!
      isDbCorrupted = true;
      dbCorruptionError = `Database corruption detected: ${err.message}. Mutating operations disabled to prevent data loss. Corrupted file preserved at ${path.basename(backupPath)}.`;

      return {
        confirmedBookings: [],
        seats: {},
        holds: []
      };
    }
  }

  // File does not exist yet: Clean initial state
  const initial = getInitialDb();
  saveDb(initial);
  return initial;
}

// Save DB with safe atomic write and corruption safeguard
function saveDb(db: CineBookDatabase): void {
  if (isDbCorrupted) {
    console.error('Database write aborted: DB is flagged as corrupted. Existing files will not be overwritten.');
    return;
  }
  const tmpFile = `${DB_FILE}.${Date.now()}.${Math.random().toString(36).slice(2)}.tmp`;
  try {
    fs.writeFileSync(tmpFile, JSON.stringify(db, null, 2), 'utf-8');
    fs.renameSync(tmpFile, DB_FILE);
  } catch (err) {
    console.error('Failed to write database file:', err);
    try {
      if (fs.existsSync(tmpFile)) fs.unlinkSync(tmpFile);
    } catch {
      // Ignore
    }
  }
}

// In-memory reference synchronised with persistent disk
let db = loadDb();

// Simple in-process mutex to protect critical concurrency operations
let operationQueue: Promise<unknown> = Promise.resolve();
function withLock<T>(fn: () => T | Promise<T>): Promise<T> {
  const next = operationQueue.then(async () => {
    return await fn();
  });
  operationQueue = next.catch(() => {});
  return next;
}

// Clean up expired holds helper
function pruneExpiredHolds() {
  const now = Date.now();
  const initialCount = db.holds.length;
  db.holds = db.holds.filter(h => h.expiresAt > now);
  if (db.holds.length !== initialCount) {
    saveDb(db);
  }
}

// Run prune periodically within mutex lock to avoid race conditions
setInterval(() => {
  withLock(() => {
    if (!isDbCorrupted) {
      pruneExpiredHolds();
    }
  }).catch((err) => {
    console.error('Error during periodic hold pruning:', err);
  });
}, 10000);

async function startServer() {
  const app = express();
  app.use(express.json());

  // API Route: Health
  app.get('/api/health', (_req, res) => {
    res.json({
      status: isDbCorrupted ? 'degraded' : 'ok',
      service: 'cinebook-backend',
      timestamp: new Date().toISOString(),
      dbHealthy: !isDbCorrupted,
      error: dbCorruptionError,
      activeHolds: db.holds.length,
      totalConfirmedBookings: db.confirmedBookings.length
    });
  });

  // API Route: Get seat status for specific show
  app.get('/api/seats/status', async (req, res) => {
    await withLock(() => {
      if (isDbCorrupted) {
        return res.status(503).json({
          error: 'Database recovery mode active. Seat availability is temporarily paused.',
          details: dbCorruptionError
        });
      }

      pruneExpiredHolds();
      const { movieId, theatreId, date, time } = req.query;
      if (!movieId || !theatreId || !date || !time) {
        return res.status(400).json({ error: 'Missing required query params (movieId, theatreId, date, time)' });
      }

      const showKey = `${movieId}::${theatreId}::${date}::${time}`;
      const booked = db.seats[showKey] || [];
      const held = db.holds
        .filter(h => h.showKey === showKey && h.expiresAt > Date.now())
        .flatMap(h => h.seats);

      res.json({
        showKey,
        bookedSeats: Array.from(new Set(booked)),
        heldSeats: Array.from(new Set(held))
      });
    });
  });

  // Shared Handler: Temporarily reserve seats (Seat Hold - 5 minutes)
  const handleReserveSeats = async (req: express.Request, res: express.Response) => {
    await withLock(() => {
      if (isDbCorrupted) {
        return res.status(503).json({
          error: 'Database recovery mode active. New reservations are paused to protect data integrity.',
          details: dbCorruptionError
        });
      }

      pruneExpiredHolds();
      const { movieId, theatreId, date, time, seats, userId } = req.body;

      if (!movieId || !theatreId || !date || !time || !Array.isArray(seats) || seats.length === 0) {
        return res.status(400).json({ error: 'Invalid reservation payload. Seats must be a non-empty array.' });
      }

      if (seats.length > 8) {
        return res.status(400).json({ error: 'Maximum 8 seats allowed per reservation.' });
      }

      const showKey = `${movieId}::${theatreId}::${date}::${time}`;
      const existingBooked = new Set(db.seats[showKey] || []);
      const activeHolds = db.holds.filter(h => h.showKey === showKey && h.expiresAt > Date.now());
      const existingHeld = new Set(activeHolds.flatMap(h => h.seats));

      const conflictBooked = seats.filter(s => existingBooked.has(s));
      const conflictHeld = seats.filter(s => existingHeld.has(s));

      if (conflictBooked.length > 0 || conflictHeld.length > 0) {
        return res.status(409).json({
          error: 'One or more selected seats are no longer available.',
          conflictBooked,
          conflictHeld
        });
      }

      // Generate secure hold token with exact 5-minute expiry (300 seconds / 300,000 ms)
      const holdToken = `hold_${Date.now()}_${crypto.randomBytes(6).toString('hex')}`;
      const expiresAt = Date.now() + HOLD_DURATION_MS;

      const newHold: SeatHold = {
        holdToken,
        showKey,
        seats,
        expiresAt,
        userId: userId || 'guest',
        createdAt: Date.now()
      };

      db.holds.push(newHold);
      saveDb(db);

      res.status(200).json({
        success: true,
        holdToken,
        expiresAt,
        expiresInSeconds: HOLD_DURATION_SECONDS,
        seats,
        showKey
      });
    });
  };

  // API Routes: Temporarily reserve seats (Supports standard and alias routes)
  app.post('/api/bookings/reserve', handleReserveSeats);
  app.post('/api/holds', handleReserveSeats);
  app.post('/api/holds/request', handleReserveSeats);

  // Shared Handler: Release seat hold
  const handleReleaseHold = async (req: express.Request, res: express.Response) => {
    await withLock(() => {
      if (isDbCorrupted) {
        return res.status(503).json({
          error: 'Database recovery mode active. Hold releases are temporarily paused.',
          details: dbCorruptionError
        });
      }

      const { holdToken } = req.body;
      if (!holdToken || typeof holdToken !== 'string') {
        return res.status(400).json({ error: 'Missing or invalid holdToken' });
      }

      const prevLen = db.holds.length;
      db.holds = db.holds.filter(h => h.holdToken !== holdToken.trim());
      if (db.holds.length !== prevLen) {
        saveDb(db);
      }

      res.json({ success: true, message: 'Hold released successfully' });
    });
  };

  // API Routes: Release seat hold
  app.post('/api/bookings/release', handleReleaseHold);
  app.post('/api/holds/release', handleReleaseHold);

  // API Route: Confirm booking (Server-side validation & permanent persistence)
  app.post('/api/bookings/confirm', async (req, res) => {
    await withLock(() => {
      if (isDbCorrupted) {
        return res.status(503).json({
          error: 'Database recovery mode active. Booking confirmation is paused to protect data integrity.',
          details: dbCorruptionError
        });
      }

      pruneExpiredHolds();
      const { holdToken, booking } = req.body;

      // 1. Mandatory Hold Token Validation (Never allow confirmation to bypass hold validation)
      if (!holdToken || typeof holdToken !== 'string' || !holdToken.trim()) {
        return res.status(400).json({
          error: 'Missing required holdToken. Every booking confirmation requires a valid, active seat reservation hold.'
        });
      }

      if (!booking || !booking.movie || !booking.theatre || !booking.seats || !Array.isArray(booking.seats) || booking.seats.length === 0) {
        return res.status(400).json({ error: 'Invalid booking payload. Movie, theatre, and non-empty seats are required.' });
      }

      const showKey = `${booking.movie.id}::${booking.theatre.id}::${booking.date}::${booking.time}`;
      const normalizedHoldToken = holdToken.trim();

      // 2. Validate hold exists and is active
      const matchingHold = db.holds.find(h => h.holdToken === normalizedHoldToken);
      if (!matchingHold) {
        return res.status(410).json({
          error: 'Seat reservation hold has expired, already been consumed, or is invalid. Please select your seats again.'
        });
      }

      if (matchingHold.expiresAt <= Date.now()) {
        // Remove expired hold
        db.holds = db.holds.filter(h => h.holdToken !== normalizedHoldToken);
        saveDb(db);
        return res.status(410).json({
          error: 'Seat reservation time limit exceeded. Please reselect your seats.'
        });
      }

      // 3. Verify hold belongs to the correct showtime
      if (matchingHold.showKey !== showKey) {
        return res.status(400).json({
          error: 'Reservation mismatch: Showtime or movie does not match the reserved hold.'
        });
      }

      // 4. Verify hold belongs to the exact selected seats
      const heldSeatsSet = new Set(matchingHold.seats);
      const requestedSeatsMatch =
        matchingHold.seats.length === booking.seats.length &&
        booking.seats.every((s: string) => heldSeatsSet.has(s));

      if (!requestedSeatsMatch) {
        return res.status(400).json({
          error: 'Reservation mismatch: Confirmed seats do not match the reserved hold seats.',
          reservedSeats: matchingHold.seats,
          requestedSeats: booking.seats
        });
      }

      // 5. Check if any seats already permanently booked by another confirmed transaction
      const existingBooked = new Set(db.seats[showKey] || []);
      const conflicts = booking.seats.filter((s: string) => existingBooked.has(s));
      if (conflicts.length > 0) {
        return res.status(409).json({
          error: 'Cannot confirm booking: One or more seats have already been booked by another user.',
          conflicts
        });
      }

      // 6. Mark seats permanently booked
      if (!db.seats[showKey]) {
        db.seats[showKey] = [];
      }
      booking.seats.forEach((seat: string) => {
        if (!db.seats[showKey].includes(seat)) {
          db.seats[showKey].push(seat);
        }
      });

      // 7. Consume the hold token so it cannot be reused
      db.holds = db.holds.filter(h => h.holdToken !== normalizedHoldToken);

      // 8. Generate cryptographically unpredictable verification token and hash
      const bookingId = booking.id || `CB-${booking.movie.id.substring(0, 3).toUpperCase()}-${Math.floor(100000 + Math.random() * 900000)}`;

      // Generate unpredictable 192-bit cryptographic verification token
      const rawVerificationToken = crypto.randomBytes(24).toString('base64url');
      // Store ONLY the SHA-256 hash of the verification token in DB for maximum security
      const tokenHash = crypto.createHash('sha256').update(rawVerificationToken).digest('hex');

      const verificationHash = crypto
        .createHash('sha256')
        .update(`${bookingId}::${showKey}::${booking.seats.join(',')}::confirmed`)
        .digest('hex')
        .substring(0, 16);

      const serverBooking: ServerBooking = {
        ...booking,
        id: bookingId,
        status: 'confirmed',
        verificationHash,
        tokenHash,
        bookedAt: booking.bookedAt || new Date().toISOString()
      };

      // Add to confirmed bookings
      db.confirmedBookings.unshift(serverBooking);
      saveDb(db);

      res.status(200).json({
        success: true,
        bookingId,
        verificationHash,
        verificationToken: rawVerificationToken,
        booking: {
          ...serverBooking,
          verificationToken: rawVerificationToken
        },
        message: 'Seat reservation validated and booking permanently confirmed on server.'
      });
    });
  });

  // API Route: Verify ticket cryptographically
  app.get('/api/bookings/verify/:bookingId', (req, res) => {
    const { bookingId } = req.params;
    const token = (req.query.token as string | undefined) || (req.headers['x-verification-token'] as string | undefined);

    const found = db.confirmedBookings.find(b => b.id.toUpperCase() === bookingId.toUpperCase());
    if (!found) {
      return res.status(404).json({
        valid: false,
        status: 'invalid',
        bookingId: bookingId.toUpperCase(),
        error: 'No matching booking found in CineBook verification registry.'
      });
    }

    // Require verification token (prevents trusting booking ID alone)
    if (!token || typeof token !== 'string' || !token.trim()) {
      return res.status(401).json({
        valid: false,
        status: 'rejected',
        bookingId: found.id,
        error: 'Missing verification token. Access denied: Digital tickets require a valid, unpredictable cryptographic token.'
      });
    }

    const trimmedToken = token.trim();
    const providedHash = crypto.createHash('sha256').update(trimmedToken).digest('hex');

    // Resolve expected token hash (including legacy support for CB-GAT-942180)
    let expectedHash = found.tokenHash;
    if (!expectedHash && found.id === 'CB-GAT-942180') {
      expectedHash = '70f274aae0415ea824223aa15f87bb5b1dd90e8a992a5a914ac9f49ca75f495e';
    }

    // Perform timing-safe token hash validation
    let isTokenMatch = false;
    if (expectedHash && expectedHash.length === providedHash.length) {
      try {
        isTokenMatch = crypto.timingSafeEqual(Buffer.from(providedHash, 'hex'), Buffer.from(expectedHash, 'hex'));
      } catch {
        isTokenMatch = false;
      }
    }

    if (!isTokenMatch) {
      return res.status(403).json({
        valid: false,
        status: 'invalid',
        bookingId: found.id,
        error: 'Cryptographic token validation failed. Ticket is invalid, modified, or counterfeit.'
      });
    }

    // Check if show is cancelled
    if (found.status === 'cancelled') {
      return res.status(410).json({
        valid: false,
        status: 'cancelled',
        bookingId: found.id,
        movieTitle: found.movie.title,
        error: 'This booking has been cancelled and cannot be used for cinema admission.'
      });
    }

    // Ticket is authentic, verified, and admitted!
    return res.status(200).json({
      valid: true,
      status: found.status,
      bookingId: found.id,
      movieTitle: found.movie.title,
      theatreName: found.theatre.name,
      screen: found.theatre.screen,
      date: found.date,
      time: found.time,
      seats: found.seats,
      totalAmount: found.totalAmount,
      bookedAt: found.bookedAt,
      verificationHash: found.verificationHash
    });
  });

  // API Route: Get all confirmed bookings
  app.get('/api/bookings', (_req, res) => {
    res.json({
      count: db.confirmedBookings.length,
      bookings: db.confirmedBookings
    });
  });

  // API Route: Clear bookings (RESTRICTED - disabled to protect shared server records)
  app.post('/api/bookings/clear', (_req, res) => {
    return res.status(403).json({
      error: 'Endpoint disabled for security. User booking history clearing is client-local only to protect shared bookings.'
    });
  });

  const httpServer = http.createServer(app);

  // Setup Vite middlewares for dev
  const isProd = process.env.NODE_ENV === 'production';
  if (!isProd) {
    const vite = await createViteServer({
      server: {
        middlewareMode: true,
        ws: { server: httpServer },
      },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (_req, res) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  }

  httpServer.listen(PORT, '0.0.0.0', () => {
    console.log(`CineBook server running on http://0.0.0.0:${PORT}`);
  });
}

startServer().catch(err => {
  console.error('Failed to start CineBook server:', err);
  process.exit(1);
});
