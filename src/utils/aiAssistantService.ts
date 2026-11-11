import { Movie, Booking, CanteenOrder } from '../types';
import { MOVIES, THEATRES, TICKET_PRICING } from '../data/movies';
import { CANTEEN_FOOD_MENU } from '../data/canteenMenu';
import { CINEBOOK_OFFERS } from '../data/offers';
import { MOOD_OPTIONS } from './recommendations';

export interface AssistantAction {
  type:
    | 'select_movie'
    | 'open_canteen'
    | 'open_offers'
    | 'open_insights'
    | 'open_my_bookings'
    | 'rate_movie'
    | 'set_mood'
    | 'start_tour'
    | 'open_watchlist'
    | 'open_movies';
  label: string;
  movieId?: string;
  moodId?: string;
  bookingId?: string;
}

export interface AssistantResponse {
  text: string;
  recommendedMovies?: Movie[];
  actions?: AssistantAction[];
  isReminder?: boolean;
}

export interface AssistantMessage {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  timestamp: string;
  recommendedMovies?: Movie[];
  actions?: AssistantAction[];
}

/**
 * Checks if the user has any watched movie waiting for a rating.
 */
export function getUnratedWatchedBooking(bookings: Booking[]): Booking | null {
  if (!bookings || bookings.length === 0) return null;
  const unrated = bookings.find(
    (b) => Boolean(b.isWatched) && (!b.rating || b.rating === 0)
  );
  return unrated || null;
}

/**
 * Modular AI Assistant Service for CineBook.
 * Designed to connect to a backend Gemini/AI API when configured,
 * while providing an instant, accurate, rich rule-based conversational engine
 * grounded entirely in CineBook's real catalogue, bookings, pricing, and offers.
 */
export async function generateAssistantResponse(
  userQuery: string,
  context: {
    bookings: Booking[];
    canteenOrders: CanteenOrder[];
    selectedMovie?: Movie | null;
  }
): Promise<AssistantResponse> {
  const query = userQuery.trim().toLowerCase();
  const { bookings, canteenOrders } = context;

  // Check unrated watched booking
  const unratedBooking = getUnratedWatchedBooking(bookings);

  // 1. Rating Reminder query or trigger
  if (
    query.includes('rating reminder') ||
    query.includes('movie waiting') ||
    query.includes('rate movie') ||
    query.includes('pending rating')
  ) {
    if (unratedBooking) {
      return {
        text: `You have a movie waiting for your rating! 🎬⭐\n\nYou recently watched **${unratedBooking.movie.title}**. Sharing your feedback helps personalize your CineBook recommendations!`,
        actions: [
          {
            type: 'rate_movie',
            label: `⭐ Rate "${unratedBooking.movie.title}"`,
            bookingId: unratedBooking.id
          }
        ],
        isReminder: true
      };
    } else {
      return {
        text: `You're all caught up! 🌟 All your watched movies have been rated, or you have no unrated bookings at the moment. Keep enjoying great cinema!`,
        actions: [
          {
            type: 'open_my_bookings',
            label: '🎟️ View My Bookings'
          }
        ]
      };
    }
  }

  // 0. Guided Tour Queries
  if (
    query.includes('guided tour') ||
    query.includes('start tour') ||
    query.includes('restart tour') ||
    query.includes('take a tour') ||
    query.includes('interactive tour') ||
    query.includes('website tour') ||
    query.includes('walk me through') ||
    query.includes('show me around')
  ) {
    return {
      text: `🚀 **CineBook Interactive Guided Tour**:\n\nI can take you on an interactive step-by-step tour highlighting each section of CineBook:\n\n1. Welcome Page & Entrance\n2. Movie Catalogue & Showcases\n3. Search, Filters & Mood Discovery\n4. Movie Details, Ratings & Showtimes\n5. My Watchlist\n6. Seat Selection & 5-Min Hold\n7. Express Canteen & Combos\n8. Offers, Rewards & Promo Codes\n9. Simulated Payment Gateway\n10. My Bookings Dashboard\n11. E-Tickets & Secure QR Verification\n\nReady to get started?`,
      actions: [
        {
          type: 'start_tour',
          label: '🚀 Start Guided Tour'
        },
        {
          type: 'open_movies',
          label: '🎬 Explore Catalogue'
        }
      ]
    };
  }

  // 0.1. How do I book a movie?
  if (
    query.includes('how do i book a movie') ||
    query.includes('how to book a movie') ||
    query.includes('how do i book') ||
    query.includes('booking steps') ||
    query.includes('how to buy a ticket')
  ) {
    return {
      text: `🎫 **How to Book a Movie on CineBook (Simple Step-by-Step)**:\n\n1. **Pick a Movie**: Browse our 16 curated releases on Home or Movies and tap **"Book Seats"**.\n2. **Select Showtime**: Choose your preferred Date, Partner Multiplex, and Show Slot.\n3. **Select Your Seats**: Pick green available seats on the live map (Rows A & B for Premium Recliners, C to H for Regular Executive).\n4. **Add Snacks & Discounts**: Add delicious Canteen combos and apply promo codes like **CINE20** (20% off).\n5. **Instant Confirmation**: Complete checkout via simulated UPI or Card to receive your digital ticket with genuine scannable QR pass!`,
      actions: [
        {
          type: 'open_movies',
          label: '🎬 Browse All Movies'
        },
        {
          type: 'start_tour',
          label: '🚀 Show Me in Guided Tour'
        }
      ]
    };
  }

  // 0.2. How do I select seats?
  if (
    query.includes('how do i select seats') ||
    query.includes('how to select seat') ||
    query.includes('how to pick seat') ||
    query.includes('choose seats')
  ) {
    return {
      text: `💺 **How Seat Selection Works**:\n\n• Select any movie and pick your show date & time.\n• Green seats on the map are **Available**; dark grey seats are already booked.\n• Click any available seat to reserve it (up to 8 seats per booking). Selected seats will glow in vibrant amber.\n• Tap the **"✨ Find My Best Seat"** button above the seat map for automated smart recommendations based on solo or group viewing!\n• Once you proceed, your seats are locked with a **5-minute server hold** so nobody else can take them while you checkout.`,
      actions: [
        {
          type: 'open_movies',
          label: '🎬 Select a Movie & Try Seats'
        }
      ]
    };
  }

  // 0.3. What are premium seats?
  if (
    query.includes('what are premium seats') ||
    query.includes('premium seat') ||
    query.includes('regular seat') ||
    query.includes('difference between premium') ||
    query.includes('recliner')
  ) {
    return {
      text: `💺 **CineBook Seating Categories**:\n\n• **Premium Recliner (Rows A & B) — ₹${TICKET_PRICING.Premium}**:\n  Motorized plush leatherette recliners with prime sightline, personal snack trays, and generous extra legroom.\n\n• **Regular Executive (Rows C to H) — ₹${TICKET_PRICING.Regular}**:\n  Ergonomic stadium cinema seats with wide armrests, dual cup-holders, and direct acoustic alignment with Dolby Atmos sound.\n\nAll ticket tiers include complimentary digital QR gate passes and 3D glasses where applicable!`,
      actions: [
        {
          type: 'open_movies',
          label: '🎬 View Showtimes'
        }
      ]
    };
  }

  // 0.4. How do I use a coupon?
  if (
    query.includes('how do i use a coupon') ||
    query.includes('how to use a coupon') ||
    query.includes('how to apply coupon') ||
    query.includes('how to get discount') ||
    query.includes('where to enter coupon')
  ) {
    return {
      text: `🎁 **How to Use Coupons & Get Discounts**:\n\n1. Select your movie and seats to proceed to the checkout screen.\n2. In the order summary, look for the **"Apply Coupon"** field.\n3. Enter an active coupon code and click **Apply**:\n   • **CINE20** — 20% discount on movie tickets (up to ₹100)\n   • **DINNERFREE** — Free Dinner Voucher for bookings with 5+ seats\n   • **PARTNER50** — 50% discount on convenience fees on HDFC cards\n4. Your discount will be deducted immediately from your total amount before simulated payment!`,
      actions: [
        {
          type: 'open_offers',
          label: '🎁 View Active Offers'
        }
      ]
    };
  }

  // 0.5. How do I add food combos?
  if (
    query.includes('how do i add food combos') ||
    query.includes('how to add food combos') ||
    query.includes('how to add combos') ||
    query.includes('how to order food') ||
    query.includes('smart combo') ||
    query.includes('food combo')
  ) {
    return {
      text: `🍿 **How to Add Food & Smart Combos**:\n\n• **During Ticket Booking**: In the seat selection screen, scroll down to the **Express Canteen** section to add snacks directly to your ticket order.\n• **Dedicated Canteen Tab**: Click **"Canteen"** in the top navigation bar to order anytime for counter pickup.\n• **Smart Combos** save you money:\n   • *Couple Movie Night* (2 Popcorn + 2 Coke) — ₹210 (Save ₹50)\n   • *Family Snack Feast* (2 Popcorn + 2 Coke + 2 Samosas) — ₹420 (Save ₹60)\n• Food orders generate a pickup ticket with an estimated kitchen prep time (10-15 mins).`,
      actions: [
        {
          type: 'open_canteen',
          label: '🍿 Open Canteen Menu'
        }
      ]
    };
  }

  // 0.6. Where can I find my bookings?
  if (
    query.includes('where can i find my bookings') ||
    query.includes('find my bookings') ||
    query.includes('where are my bookings') ||
    query.includes('view my bookings') ||
    query.includes('my booking history') ||
    query.includes('where is my ticket')
  ) {
    const bookingCount = bookings.length;
    return {
      text: `🎟️ **Where to Find Your Bookings**:\n\n• Click **"My Bookings"** in the top navigation bar (it displays a counter badge showing your ${bookingCount} active reservations).\n• The **Bookings Dashboard** organizes your tickets into:\n   • **Upcoming**: Valid showtimes ready for multiplex admission\n   • **Past & Watched**: Historical records where you can rate movies\n   • **Canteen Orders**: Kitchen prep and pickup counter status\n• Tap any card to open the complete digital ticket pass or view invoices!`,
      actions: [
        {
          type: 'open_my_bookings',
          label: '🎟️ Go to My Bookings'
        }
      ]
    };
  }

  // 0.7. How do I download my invoice?
  if (
    query.includes('how do i download my invoice') ||
    query.includes('download invoice') ||
    query.includes('how to get invoice') ||
    query.includes('print invoice') ||
    query.includes('tax invoice') ||
    query.includes('download receipt')
  ) {
    return {
      text: `📄 **How to Download or Print Your Tax Invoice**:\n\n1. Go to **My Bookings** in the navigation bar.\n2. Tap on any booked ticket to open the **Digital Ticket Pass**.\n3. Click the **"Print / Save Invoice"** button.\n4. CineBook formats a complete official Tax Invoice showing:\n   • Ticket breakdown with GST and Convenience Fee\n   • Multiplex name, Audi screen, and showtime\n   • Cryptographic QR pass and Booking Reference ID\n5. Use your browser's Print dialog to save as a clean PDF or print a hard copy!`,
      actions: [
        {
          type: 'open_my_bookings',
          label: '🎟️ View Bookings for Invoices'
        }
      ]
    };
  }

  // 0.8. How does QR verification work?
  if (
    query.includes('how does qr verification work') ||
    query.includes('how does qr work') ||
    query.includes('qr verification') ||
    query.includes('scannable qr') ||
    query.includes('verify ticket') ||
    query.includes('qr code')
  ) {
    return {
      text: `🛡️ **How CineBook Cryptographic QR Verification Works**:\n\n• **Genuine Scannable QR**: Every confirmed ticket displays a dynamic, scannable QR code generated with high error correction.\n• **Cryptographic Token**: When booking, our backend generates an unpredictable, high-entropy verification token and stores only its **SHA-256 hash** on the server.\n• **Multiplex Gate Scanning**: Scanning the QR code opens the live verification page at \`/api/bookings/verify/:id\`.\n• **Timing-Safe Validation**: The server validates the token cryptographically, confirming **ADMITTED** in green or **REJECTED** if counterfeit.\n• This guarantees that tickets cannot be forged, manipulated, or reused!`,
      actions: [
        {
          type: 'open_my_bookings',
          label: '🎟️ View Your QR Tickets'
        }
      ]
    };
  }

  // 0.9. How do I use the watchlist?
  if (
    query.includes('how do i use the watchlist') ||
    query.includes('how to use watchlist') ||
    query.includes('how does watchlist work') ||
    query.includes('add to watchlist') ||
    query.includes('save movie')
  ) {
    return {
      text: `❤️ **How to Use My Watchlist**:\n\n• On any movie card or detail view, tap the **Heart icon (❤️)** to add or remove it from your personal Watchlist.\n• Click **"My Watchlist"** in the top navigation bar to see all your saved blockbusters in one place.\n• Your Watchlist is automatically saved in your browser, so you'll never forget movies you plan to watch later!`,
      actions: [
        {
          type: 'open_watchlist',
          label: '❤️ Open My Watchlist'
        },
        {
          type: 'open_movies',
          label: '🎬 Explore Movies to Watchlist'
        }
      ]
    };
  }

  // 0.10. How do I find movies based on my mood?
  if (
    query.includes('how do i find movies based on my mood') ||
    query.includes('mood based') ||
    query.includes('find movies by mood') ||
    query.includes('how does mood work') ||
    query.includes('mood filter')
  ) {
    return {
      text: `🎭 **How to Find Movies Based on Your Mood**:\n\n• On the CineBook Home page, find the **"What's Your Mood?"** discovery section.\n• Click any mood pill:\n   • 🥹 **Emotional** — Moving dramas & timeless devotion\n   • 😂 **Fun** — Laugh-out-loud family comedies\n   • ⚡ **Excited** — Mass action & electrifying thrills\n   • ❤️ **Romantic** — Heartwarming love stories & poetry\n   • 😱 **Thriller** — Suspense, mystery & edge-of-seat chills\n   • 🧘 **Chill** — Soothing visuals & relaxing cinema\n   • 😊 **Happy** — Uplifting stories with warm smiles\n• The catalogue immediately updates to show movies handpicked for your exact feeling!`,
      actions: [
        {
          type: 'set_mood',
          label: '⚡ Try Excited Mood',
          moodId: 'excited'
        },
        {
          type: 'set_mood',
          label: '❤️ Try Romantic Mood',
          moodId: 'romantic'
        }
      ]
    };
  }

  // 2. Canteen / Food queries
  if (
    query.includes('canteen') ||
    query.includes('food') ||
    query.includes('snack') ||
    query.includes('drink') ||
    query.includes('popcorn') ||
    query.includes('burger') ||
    query.includes('pizza') ||
    query.includes('fries') ||
    query.includes('samosa') ||
    query.includes('under ₹') ||
    query.includes('under rs') ||
    query.includes('under 200') ||
    query.includes('under 100') ||
    query.includes('under 150') ||
    query.includes('under 300') ||
    query.includes('price') ||
    query.includes('menu') ||
    query.includes('hungry') ||
    query.includes('eat')
  ) {
    // Check budget queries e.g. "under 200" or "under 100"
    const budgetMatch = query.match(/(?:under|below|less than|within)\s*(?:₹|rs\.?|inr)?\s*(\d+)/i) ||
                       query.match(/(?:₹|rs\.?)\s*(\d+)/i);
    const budget = budgetMatch ? parseInt(budgetMatch[1], 10) : (query.includes('under 200') ? 200 : null);

    if (budget !== null && budget > 0) {
      const affordable = CANTEEN_FOOD_MENU.filter((item) => item.price <= budget).sort(
        (a, b) => a.price - b.price
      );

      if (affordable.length > 0) {
        const itemLines = affordable.map((item) => {
          const emoji = item.category === 'Drinks' ? '🥤' : item.category === 'Pizza' ? '🍕' : item.category === 'Burger' ? '🍔' : item.id === 'popcorn' ? '🍿' : item.id === 'french-fries' ? '🍟' : '🥟';
          return `${emoji} ${item.name} — ₹${item.price}`;
        });

        return {
          text: `Here are some options under ₹${budget}:\n\n${itemLines.join('\n')}\n\nYou can order snacks during ticket booking or directly at our Express Canteen! 🍿`,
          actions: [
            {
              type: 'open_canteen',
              label: '🍿 Open Canteen Menu'
            }
          ]
        };
      } else {
        return {
          text: `Our most affordable item is packaged mineral water for ₹20 and fresh samosas for ₹30. Explore our full menu for great combos!`,
          actions: [
            {
              type: 'open_canteen',
              label: '🍿 View Canteen Menu'
            }
          ]
        };
      }
    }

    // Specific food item checks
    if (query.includes('popcorn')) {
      return {
        text: `🍿 **CineBook Popcorn Selection**:\n• Fresh Golden Butter Popcorn — ₹80\n• Combo / Gourmet tubs available at checkout!\n\nPro-tip: Adding ₹300+ in snacks unlocks a **FREE Jumbo Popcorn Coupon** on your next visit!`,
        actions: [{ type: 'open_canteen', label: '🍿 Order Popcorn' }]
      };
    }

    if (query.includes('burger') || query.includes('pizza')) {
      return {
        text: `🍔 **Hot Bites & Pizzas**:\n• Veg Burger — ₹90\n• Chicken Burger — ₹120\n• Stone-Baked Veg Pizza — ₹120\n• Loaded Chicken Pizza — ₹150\n\nFreshly prepared and delivered right to your seat or ready at the counter in 10-15 mins!`,
        actions: [{ type: 'open_canteen', label: '🍔 View Hot Meals' }]
      };
    }

    // General canteen menu response
    const sampleHighlights = CANTEEN_FOOD_MENU.slice(0, 5).map(
      (item) => `• ${item.name} — ₹${item.price} (${item.category})`
    ).join('\n');

    return {
      text: `🍿 **CineBook Canteen Highlights**:\n${sampleHighlights}\n\nAsk me for items under a specific budget (e.g., *"What can I get under ₹200?"*) or browse our counter!`,
      actions: [
        {
          type: 'open_canteen',
          label: '🍿 Explore Canteen'
        }
      ]
    };
  }

  // 3. Offers & Rewards queries
  if (
    query.includes('offer') ||
    query.includes('reward') ||
    query.includes('coupon') ||
    query.includes('discount') ||
    query.includes('promo') ||
    query.includes('deal') ||
    query.includes('dinnerfree') ||
    query.includes('cine20') ||
    query.includes('partner50')
  ) {
    // Check user's current eligibility
    const totalBookingsCount = bookings.length;
    const hasGroupBooking = bookings.some((b) => b.seats.length >= 5);
    const hasCanteenSpendReward = bookings.some((b) => (b.canteenTotal || 0) >= 300) ||
                                  canteenOrders.some((o) => o.totalAmount >= 300);

    let personalRewardStatus = '';
    if (hasGroupBooking && hasCanteenSpendReward) {
      personalRewardStatus = `\n\n🎉 **Your Unlocked Rewards**: You have qualified for both the **Free Dinner Voucher** and the **Free Popcorn Coupon**! Check your tickets in My Bookings.`;
    } else if (hasGroupBooking) {
      personalRewardStatus = `\n\n🎉 **Your Unlocked Rewards**: You booked 5+ tickets, unlocking a complimentary **Free Dinner Voucher**!`;
    } else if (hasCanteenSpendReward) {
      personalRewardStatus = `\n\n🎉 **Your Unlocked Rewards**: You spent ₹300+ on cinema snacks, unlocking a **Free Popcorn Coupon**!`;
    } else {
      personalRewardStatus = `\n\n💡 **Your Status**: You currently have ${totalBookingsCount} booking(s). Book 5 or more seats in one reservation to earn a Dinner Coupon, or spend ₹300+ at the canteen for Free Popcorn!`;
    }

    const offersText = CINEBOOK_OFFERS.map(
      (o) => `${o.emoji} **${o.title}** (${o.badge}): ${o.description}${o.couponCode ? ` Use code **${o.couponCode}**.` : ''}`
    ).join('\n\n');

    return {
      text: `🎁 **Active CineBook Offers & Rewards**:\n\n${offersText}${personalRewardStatus}`,
      actions: [
        {
          type: 'open_offers',
          label: '🎁 View Offers & Rewards'
        }
      ]
    };
  }

  // 4. Booking Help / Theatres / Seats / Process queries
  if (
    query.includes('how does booking work') ||
    query.includes('how to book') ||
    query.includes('booking process') ||
    query.includes('seat selection') ||
    query.includes('ticket price') ||
    query.includes('pricing') ||
    query.includes('theatre') ||
    query.includes('theater') ||
    query.includes('screen') ||
    query.includes('sound') ||
    query.includes('dolby') ||
    query.includes('imax') ||
    query.includes('find my best seat') ||
    query.includes('showtime') ||
    query.includes('shows')
  ) {
    if (query.includes('hold') || query.includes('timer') || query.includes('lock seat') || query.includes('reserve')) {
      return {
        text: `⏱️ **CineBook 5-Minute Seat Hold Policy**:\n\n• When you proceed to checkout, your chosen seats are locked in real-time with a secure server hold for exactly **5 minutes** (300 seconds).\n• This prevents other users from booking or colliding with your seats while you enter payment details.\n• If the 5-minute timer expires before confirmation, the hold is safely released back to the general seat pool.`,
        actions: [
          {
            type: 'open_my_bookings',
            label: '🎟️ My Bookings'
          }
        ]
      };
    }

    if (query.includes('seat') || query.includes('pricing') || query.includes('price')) {
      return {
        text: `💺 **CineBook Seating & Pricing**:\n\n• **Premium Recliner** (Rows A & B) — ₹${TICKET_PRICING.Premium}\n  Motorized plush leatherette recliners with prime sightline and personal tray tables.\n\n• **Regular Executive** (Rows C to H) — ₹${TICKET_PRICING.Regular}\n  Ergonomic cinema seating with cup-holders and immersive acoustics.\n\n✨ **Pro Feature**: In the seat selection screen, tap **“✨ Find My Best Seat”** to get smart recommendations tailored to solo or group viewing!`,
        actions: [
          {
            type: 'open_insights',
            label: '📊 View My Movie Insights'
          }
        ]
      };
    }

    if (query.includes('theatre') || query.includes('theater') || query.includes('screen') || query.includes('imax')) {
      const thList = THEATRES.map(
        (t) => `📍 **${t.name}**\n   ${t.location}\n   ${t.screen} (${t.soundSystem})\n   Shows: ${t.shows.join(', ')}`
      ).join('\n\n');

      return {
        text: `🏛️ **Our Partner Theatres & Screens**:\n\n${thList}\n\nSelect any movie to choose your preferred theatre and showtime!`,
      };
    }

    return {
      text: `🎫 **How CineBook Booking Works** (Quick 5-Step Flow):\n\n1. **Select a Movie**: Choose from Tamil, Telugu, or English releases.\n2. **Pick Theatre & Showtime**: Select your preferred theatre, date, and show slot.\n3. **Choose Your Seats**: Pick seats manually or tap **“✨ Find My Best Seat”** for smart placement.\n4. **Add Snacks & Apply Offers**: Optional canteen combos and promo codes (e.g., **CINE20** for 20% off).\n5. **Instant Digital Ticket**: Complete payment via UPI or Cards to get your QR-coded ticket!`,
      actions: [
        {
          type: 'open_my_bookings',
          label: '🎟️ My Bookings'
        }
      ]
    };
  }

  // 5. User Taste / Analytics / Personalized Recommendations from history
  if (
    query.includes('my rating') ||
    query.includes('my taste') ||
    query.includes('matches my ratings') ||
    query.includes('my insight') ||
    query.includes('what i watched') ||
    query.includes('personalized') ||
    query.includes('for me') ||
    query.includes('suggest for me') ||
    query.includes('suggest a movie for me')
  ) {
    const ratedBookings = bookings.filter((b) => typeof b.rating === 'number' && b.rating > 0);
    const watchedBookings = bookings.filter((b) => Boolean(b.isWatched));

    if (ratedBookings.length > 0) {
      // Find highest rated booking
      const topRated = [...ratedBookings].sort((a, b) => (b.rating || 0) - (a.rating || 0))[0];
      const starsStr = '⭐'.repeat(topRated.rating || 5);

      // Find matching movies in catalog
      const matched = MOVIES.filter(
        (m) =>
          m.id !== topRated.movie.id &&
          (m.genres.some((g) => topRated.movie.genres.includes(g)) ||
           m.languages.some((l) => topRated.movie.languages.includes(l)))
      ).slice(0, 3);

      return {
        text: `You rated **${topRated.movie.title}** ${starsStr}, so you may enjoy similar high-rated ${topRated.movie.genres.join('/')} titles!\n\nHere are curated recommendations matching your verified taste:`,
        recommendedMovies: matched.length > 0 ? matched : MOVIES.slice(0, 3),
        actions: [
          {
            type: 'open_insights',
            label: '📊 View Personal Movie Insights'
          }
        ]
      };
    } else if (watchedBookings.length > 0) {
      const watched = watchedBookings[0];
      const matched = MOVIES.filter(
        (m) =>
          m.id !== watched.movie.id &&
          (m.genres.some((g) => watched.movie.genres.includes(g)) ||
           m.languages.some((l) => watched.movie.languages.includes(l)))
      ).slice(0, 3);

      return {
        text: `Based on your recent watch of **${watched.movie.title}**, here are top-rated movies you might enjoy! Remember to rate it to unlock deeper personalized insights. ⭐`,
        recommendedMovies: matched,
        actions: [
          {
            type: 'rate_movie',
            label: `⭐ Rate "${watched.movie.title}"`,
            bookingId: watched.id
          }
        ]
      };
    } else if (bookings.length > 0) {
      const b = bookings[0];
      const matched = MOVIES.filter(
        (m) =>
          m.id !== b.movie.id &&
          m.languages.some((l) => b.movie.languages.includes(l))
      ).slice(0, 3);

      return {
        text: `You booked tickets for **${b.movie.title}**. Here are recommended movies in ${b.movie.displayLanguage} with stellar audience ratings!`,
        recommendedMovies: matched
      };
    } else {
      return {
        text: `Rate a few movies in CineBook to unlock personalized recommendations based on your tastes! In the meantime, here are our highest rated blockbusters:`,
        recommendedMovies: [
          MOVIES.find((m) => m.id === 'spiderman-no-way-home') || MOVIES[0],
          MOVIES.find((m) => m.id === 'amaran') || MOVIES[1],
          MOVIES.find((m) => m.id === 'sita-ramam') || MOVIES[2]
        ]
      };
    }
  }

  // 6. Mood-Based Suggestions
  // Examples: "I am feeling sad", "I want something funny", "I want an exciting movie", "chill", "thriller", "romantic", "happy"
  const isSadOrEmotional =
    query.includes('sad') ||
    query.includes('cry') ||
    query.includes('emotional') ||
    query.includes('touching') ||
    query.includes('heartfelt') ||
    query.includes('tear');

  const isFunny =
    query.includes('funny') ||
    query.includes('laugh') ||
    query.includes('comedy') ||
    query.includes('fun') ||
    query.includes('hilarious') ||
    query.includes('joke');

  const isExcited =
    query.includes('exciting') ||
    query.includes('excited') ||
    query.includes('action') ||
    query.includes('mass') ||
    query.includes('adrenaline') ||
    query.includes('hype') ||
    query.includes('brawl');

  const isRomantic =
    query.includes('romantic') ||
    query.includes('romance') ||
    query.includes('love') ||
    query.includes('couple') ||
    query.includes('date');

  const isThriller =
    query.includes('thriller') ||
    query.includes('horror') ||
    query.includes('scary') ||
    query.includes('mystery') ||
    query.includes('spooky') ||
    query.includes('ghost');

  const isChill =
    query.includes('chill') ||
    query.includes('relax') ||
    query.includes('peaceful') ||
    query.includes('calm') ||
    query.includes('soothing');

  const isHappy =
    query.includes('happy') ||
    query.includes('uplifting') ||
    query.includes('cheerful') ||
    query.includes('joy');

  if (isSadOrEmotional) {
    const mood = MOOD_OPTIONS.find((m) => m.id === 'emotional');
    const movies = MOVIES.filter((m) => mood?.movieIds.includes(m.id)).slice(0, 3);
    return {
      text: `Feeling Emotional? 🥹\n\nHere are deeply moving, heartfelt stories of timeless love, devotion, and courage:`,
      recommendedMovies: movies,
      actions: [
        {
          type: 'set_mood',
          label: '🥹 Filter by Emotional Mood',
          moodId: 'emotional'
        }
      ]
    };
  }

  if (isFunny) {
    const mood = MOOD_OPTIONS.find((m) => m.id === 'fun');
    const movies = MOVIES.filter((m) => mood?.movieIds.includes(m.id)).slice(0, 3);
    return {
      text: `In the mood for Fun & Laughter? 😂\n\nHere are laugh-out-loud comedies packed with family humor and delightful moments:`,
      recommendedMovies: movies,
      actions: [
        {
          type: 'set_mood',
          label: '😂 Filter by Fun Mood',
          moodId: 'fun'
        }
      ]
    };
  }

  if (isExcited) {
    const mood = MOOD_OPTIONS.find((m) => m.id === 'excited');
    const movies = MOVIES.filter((m) => mood?.movieIds.includes(m.id)).slice(0, 3);
    return {
      text: `Pumped Up & Excited? ⚡\n\nGet ready for high-octane mass action, thunderous background scores, and electrifying thrills:`,
      recommendedMovies: movies,
      actions: [
        {
          type: 'set_mood',
          label: '⚡ Filter by Excited Mood',
          moodId: 'excited'
        }
      ]
    };
  }

  if (isRomantic) {
    const mood = MOOD_OPTIONS.find((m) => m.id === 'romantic');
    const movies = MOVIES.filter((m) => mood?.movieIds.includes(m.id)).slice(0, 3);
    return {
      text: `Feeling Romantic? ❤️\n\nHere are enchanting love stories filled with poetic letters, timeless music, and memorable chemistry:`,
      recommendedMovies: movies,
      actions: [
        {
          type: 'set_mood',
          label: '❤️ Filter by Romantic Mood',
          moodId: 'romantic'
        }
      ]
    };
  }

  if (isThriller) {
    const mood = MOOD_OPTIONS.find((m) => m.id === 'thriller');
    const movies = MOVIES.filter((m) => mood?.movieIds.includes(m.id)).slice(0, 3);
    return {
      text: `Craving a Thriller? 😱\n\nNail-biting suspense, isolated mysteries, and spine-chilling paranormal cases await you:`,
      recommendedMovies: movies,
      actions: [
        {
          type: 'set_mood',
          label: '😱 Filter by Thriller Mood',
          moodId: 'thriller'
        }
      ]
    };
  }

  if (isChill) {
    const mood = MOOD_OPTIONS.find((m) => m.id === 'chill');
    const movies = MOVIES.filter((m) => mood?.movieIds.includes(m.id)).slice(0, 3);
    return {
      text: `Looking to Chill? 🧘\n\nScenic mountain roads, comforting animation, and soul-soothing acoustics for a peaceful break:`,
      recommendedMovies: movies,
      actions: [
        {
          type: 'set_mood',
          label: '🧘 Filter by Chill Mood',
          moodId: 'chill'
        }
      ]
    };
  }

  if (isHappy) {
    const mood = MOOD_OPTIONS.find((m) => m.id === 'happy');
    const movies = MOVIES.filter((m) => mood?.movieIds.includes(m.id)).slice(0, 3);
    return {
      text: `Feeling Happy? 😊\n\nUplifting and cheerful stories that will leave a big warm smile on your face:`,
      recommendedMovies: movies,
      actions: [
        {
          type: 'set_mood',
          label: '😊 Filter by Happy Mood',
          moodId: 'happy'
        }
      ]
    };
  }

  // 7. Language-based queries
  // “Suggest a Tamil movie”, “Suggest a Telugu movie”, “Suggest an English movie”
  if (query.includes('tamil')) {
    const tamilMovies = MOVIES.filter((m) => m.languages.includes('Tamil')).sort(
      (a, b) => b.rating - a.rating
    ).slice(0, 3);
    return {
      text: `🎬 **Top Tamil Cinema Releases**:\n\nHere are our highest-rated Tamil movies showing today:`,
      recommendedMovies: tamilMovies
    };
  }

  if (query.includes('telugu')) {
    const teluguMovies = MOVIES.filter((m) => m.languages.includes('Telugu')).sort(
      (a, b) => b.rating - a.rating
    ).slice(0, 3);
    return {
      text: `🎬 **Top Telugu Blockbusters**:\n\nHere are popular Telugu movies with outstanding audience ratings:`,
      recommendedMovies: teluguMovies
    };
  }

  if (query.includes('english') || query.includes('hollywood')) {
    const englishMovies = MOVIES.filter((m) => m.languages.includes('English')).sort(
      (a, b) => b.rating - a.rating
    ).slice(0, 3);
    return {
      text: `🎬 **Top English Cinema Releases**:\n\nGlobal blockbusters featuring breathtaking visual effects and storytelling:`,
      recommendedMovies: englishMovies
    };
  }

  // 8. General movie recommendations:
  // "Suggest a movie", "What should I watch tonight?", "recommend a movie"
  if (
    query.includes('suggest a movie') ||
    query.includes('what should i watch') ||
    query.includes('recommend a movie') ||
    query.includes('recommendation') ||
    query.includes('movie suggestion') ||
    query.includes('watch tonight') ||
    query.includes('best movie')
  ) {
    // Check if user has rated or watched history
    const rated = bookings.find((b) => typeof b.rating === 'number' && b.rating >= 4);
    if (rated) {
      const match = MOVIES.filter(
        (m) =>
          m.id !== rated.movie.id &&
          m.genres.some((g) => rated.movie.genres.includes(g))
      ).slice(0, 3);
      if (match.length > 0) {
        return {
          text: `Since you rated **${rated.movie.title}** highly, here are stellar movies matching your love for ${rated.movie.genres.slice(0, 2).join(' & ')}:`,
          recommendedMovies: match
        };
      }
    }

    // Default top 3 blockbusters
    const topRated = [...MOVIES].sort((a, b) => b.rating - a.rating).slice(0, 3);
    return {
      text: `🎬 **Top Blockbuster Recommendations for Tonight**:\n\nBased on viewer acclaim and packed theatre shows across screens:`,
      recommendedMovies: topRated
    };
  }

  // 9. Specific movie inquiry by title
  const foundMovie = MOVIES.find(
    (m) =>
      query.includes(m.title.toLowerCase()) ||
      query.includes(m.id.replace(/-/g, ' '))
  );
  if (foundMovie) {
    return {
      text: `🎬 **${foundMovie.title}** (${foundMovie.releaseYear})\n⭐ Rating: ${foundMovie.rating}/10 (${foundMovie.votes})\n🗣️ Language: ${foundMovie.displayLanguage}\n🎭 Genres: ${foundMovie.genres.join(', ')}\n⏳ Duration: ${foundMovie.duration} · Certificate: ${foundMovie.certificate}\n\n**Synopsis**: ${foundMovie.synopsis}\n\nStarring: ${foundMovie.cast.slice(0, 4).join(', ')} · Directed by ${foundMovie.director}`,
      recommendedMovies: [foundMovie],
      actions: [
        {
          type: 'select_movie',
          label: `🎟️ Book "${foundMovie.title}"`,
          movieId: foundMovie.id
        }
      ]
    };
  }

  // 10. Unrelated query fallback
  // "If the user asks something unrelated to CineBook, politely say:
  // 'I’m CineBook AI 🤖🎬. I can help you with movies, bookings, seats, ratings, canteen items, and CineBook offers.'"
  const cinemaRelatedKeywords = [
    'cinebook', 'movie', 'film', 'cinema', 'seat', 'ticket', 'theatre',
    'theater', 'show', 'watch', 'book', 'popcorn', 'snack', 'drink',
    'canteen', 'offer', 'coupon', 'rate', 'rating', 'actor', 'director',
    'cast', 'genre', 'mood', 'tamil', 'telugu', 'english', 'screen',
    'imax', 'sound', 'price', 'cost', 'hi', 'hello', 'hey', 'help'
  ];

  const hasCinemaKeyword = cinemaRelatedKeywords.some((k) => query.includes(k));

  if (!hasCinemaKeyword && query.length > 5) {
    return {
      text: `I’m CineBot 🤖🎬, your personal cinema guide! I can help you with movies, seats, booking steps, ratings, canteen items, discounts, and website tours.\n\nTry asking me:\n• *"How do I book a movie?"*\n• *"What are premium seats?"*\n• *"How does QR verification work?"*\n• *"Start guided tour"*`,
      actions: [
        {
          type: 'start_tour',
          label: '🚀 Start Guided Tour'
        },
        {
          type: 'open_offers',
          label: '🎁 Check Offers'
        },
        {
          type: 'open_canteen',
          label: '🍿 Canteen Menu'
        }
      ]
    };
  }

  // Friendly greetings or general cinema assistance
  return {
    text: `Hello! I'm CineBot 🤖🎬, your personal cinema guide. I'm here to assist you with movie discovery, seat selection, canteen snacks, offers, ticket bookings, and interactive tours.\n\nWhat can I help you explore today?`,
    actions: [
      {
        type: 'start_tour',
        label: '🚀 Start Guided Tour'
      },
      {
        type: 'select_movie',
        label: '🎬 Recommend a movie'
      },
      {
        type: 'open_canteen',
        label: '🍿 Canteen menu'
      }
    ]
  };
}
