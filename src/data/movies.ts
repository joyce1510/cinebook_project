import { Movie, Theatre } from '../types';

export const MOVIES: Movie[] = [
  {
    id: 'elemental',
    title: 'Elemental',
    subtitle: 'Opposites React in Element City',
    languages: ['English', 'Tamil', 'Telugu'],
    displayLanguage: 'English / Tamil / Telugu',
    genres: ['Animation', 'Adventure', 'Comedy', 'Family', 'Romance'],
    duration: '1h 41m',
    certificate: 'U',
    rating: 8.8,
    votes: '320K votes',
    releaseYear: 2023,
    synopsis: 'In Element City, where residents of fire, water, land, and air coexist under the fundamental rule that elements do not mix, Ember Lumen is a passionate and fiery young woman preparing to take over her immigrant family\'s convenience shop. When a plumbing malfunction causes her to cross paths with Wade Ripple, a sentimental and empathetic water element city inspector, their unexpected friendship challenges Ember\'s perceptions about her destiny, family obligations, and the miraculous sparks that fly when opposites connect.',
    cast: ['Leah Lewis', 'Mamoudou Athie', 'Ronnie del Carmen', 'Shila Ommi', 'Catherine O\'Hara'],
    director: 'Peter Sohn',
    musicDirector: 'Thomas Newman',
    accentColor: '#F97316',
    bgGradient: 'from-orange-950/40 via-cyan-950/50 to-zinc-950',
    accentBadgeColor: 'bg-orange-500/20 text-orange-400 border-orange-500/30',
    themeSymbol: 'sparkles',
    posterUrl: '/posters/elemental.jpg'
  },
  {
    id: 'avengers-age-of-ultron',
    title: 'Avengers: Age of Ultron',
    subtitle: 'No strings on me',
    languages: ['English', 'Tamil', 'Telugu'],
    displayLanguage: 'English / Tamil / Telugu',
    genres: ['Action', 'Sci-Fi', 'Adventure'],
    duration: '2h 21m',
    certificate: 'U/A',
    rating: 8.7,
    votes: '980K votes',
    releaseYear: 2015,
    synopsis: "When Tony Stark's well-intentioned global peacekeeping program inadvertently unleashes Ultron, a formidable artificial intelligence obsessed with wiping out humanity, Earth's Mightiest Heroes—Iron Man, Captain America, Thor, the Hulk, Black Widow, and Hawkeye—must reassemble to stop the mechanical threat and protect the planet.",
    cast: ['Robert Downey Jr.', 'Chris Evans', 'Mark Ruffalo', 'Chris Hemsworth', 'Scarlett Johansson', 'James Spader'],
    director: 'Joss Whedon',
    musicDirector: 'Brian Tyler and Danny Elfman',
    accentColor: '#DC2626',
    bgGradient: 'from-red-950/40 via-zinc-900 to-zinc-950',
    accentBadgeColor: 'bg-red-500/20 text-red-400 border-red-500/30',
    themeSymbol: 'shield',
    posterUrl: '/posters/avengers-age-of-ultron.jpg'
  },
  {
    id: 'doctor-strange-multiverse',
    title: 'Doctor Strange in the Multiverse of Madness',
    subtitle: 'Enter a new dimension of Strange',
    languages: ['English', 'Tamil', 'Telugu'],
    displayLanguage: 'English / Tamil / Telugu',
    genres: ['Action', 'Adventure', 'Fantasy', 'Horror'],
    duration: '2h 06m',
    certificate: 'U/A',
    rating: 8.5,
    votes: '670K votes',
    releaseYear: 2022,
    synopsis: 'Dr. Stephen Strange teams up with America Chavez, a mysterious teenager capable of opening portals across parallel universes, and journeys deep into the perilous Multiverse to confront enigmatic threats and restore balance across fractured dimensions.',
    cast: ['Benedict Cumberbatch', 'Elizabeth Olsen', 'Chiwetel Ejiofor', 'Benedict Wong', 'Xochitl Gomez', 'Rachel McAdams'],
    director: 'Sam Raimi',
    musicDirector: 'Danny Elfman',
    accentColor: '#9333EA',
    bgGradient: 'from-purple-950/40 via-red-950/40 to-zinc-950',
    accentBadgeColor: 'bg-purple-500/20 text-purple-400 border-purple-500/30',
    themeSymbol: 'sparkles',
    posterUrl: '/posters/doctor-strange-multiverse.jpg'
  },
  {
    id: 'spiderman-no-way-home',
    title: 'Spider-Man: No Way Home',
    subtitle: 'The Multiverse Unleashed',
    languages: ['English', 'Tamil', 'Telugu'],
    displayLanguage: 'English / Tamil / Telugu',
    genres: ['Action', 'Adventure', 'Sci-Fi'],
    duration: '2h 28m',
    certificate: 'U/A',
    rating: 9.3,
    votes: '1.1M votes',
    releaseYear: 2021,
    synopsis: "With Spider-Man's secret identity revealed to the world, Peter Parker seeks help from Doctor Strange to restore his anonymity. But when the spell goes wrong, the multiverse fractures, unleashing dangerous villains from alternate realities that Peter must overcome.",
    cast: ['Tom Holland', 'Zendaya', 'Benedict Cumberbatch', 'Jacob Batalon', 'Willem Dafoe', 'Alfred Molina'],
    director: 'Jon Watts',
    musicDirector: 'Michael Giacchino',
    accentColor: '#2563EB',
    bgGradient: 'from-red-950/40 via-blue-950/40 to-zinc-950',
    accentBadgeColor: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
    themeSymbol: 'zap',
    posterUrl: '/posters/spiderman-no-way-home.jpg'
  },
  {
    id: 'doraemon-art-world-tales',
    title: 'Doraemon: Nobita\'s Art World Tales',
    subtitle: 'Eiga Doraemon: Nobita no Esekai Monogatari · 45th Anniversary Feature',
    languages: ['Japanese', 'English', 'Tamil'],
    displayLanguage: 'English / Tamil',
    genres: ['Animation', 'Adventure', 'Family', 'Fantasy'],
    duration: '1h 48m',
    certificate: 'U',
    rating: 8.9,
    votes: '88K votes',
    releaseYear: 2025,
    synopsis: "Using one of Doraemon's secret gadgets to step inside a mysterious medieval painting, Nobita and his friends enter the enchanted realm of Artelia where art comes alive with magical power. Alongside a spirited young painter named Claire, they embark on a colorful adventure to save the realm from a shadowy entity and restore light and creativity.",
    cast: ['Wasabi Mizuta', 'Megumi Ohara', 'Yumi Kakazu', 'Subaru Kimura', 'Tomokazu Seki'],
    director: 'Yukiyo Teramoto',
    musicDirector: 'Takayuki Hattori',
    accentColor: '#0EA5E9',
    bgGradient: 'from-sky-950/40 via-blue-950/40 to-zinc-950',
    accentBadgeColor: 'bg-sky-500/20 text-sky-400 border-sky-500/30',
    themeSymbol: 'sparkles',
    posterUrl: '/posters/doraemon-art-world-tales.jpg'
  },
  {
    id: 'the-chosen',
    title: 'The Chosen',
    subtitle: 'TV Series · 4 Seasons · The Life of Jesus',
    languages: ['English', 'Tamil', 'Telugu'],
    displayLanguage: 'English / Tamil / Telugu',
    genres: ['Drama', 'Historical'],
    duration: '4 Seasons · 32 Eps',
    certificate: 'U',
    rating: 9.3,
    votes: '165K votes',
    releaseYear: 2019,
    synopsis: 'An acclaimed historical drama television series presenting an intimate and human perspective on the life and revolutionary teachings of Jesus of Nazareth through the eyes of those who met, walked with, and followed him in first-century Galilee and Judea.',
    cast: ['Jonathan Roumie', 'Shahar Isaac', 'Elizabeth Tabish', 'Paras Patel', 'Noah James'],
    director: 'Dallas Jenkins',
    musicDirector: 'Dan Haseltine & Matthew S. Nelson',
    accentColor: '#D97706',
    bgGradient: 'from-amber-950/40 via-stone-900 to-zinc-950',
    accentBadgeColor: 'bg-amber-500/20 text-amber-400 border-amber-500/30',
    themeSymbol: 'sun',
    posterUrl: '/posters/the-chosen.jpg'
  },
  {
    id: 'the-conjuring',
    title: 'The Conjuring',
    subtitle: 'Based on the true case files of the Warrens',
    languages: ['English', 'Tamil'],
    displayLanguage: 'English / Tamil',
    genres: ['Horror', 'Mystery', 'Thriller'],
    duration: '1h 52m',
    certificate: 'A',
    rating: 9.1,
    votes: '490K votes',
    releaseYear: 2013,
    synopsis: 'Based on the horrifying true case files of renowned paranormal researchers Ed and Lorraine Warren. In 1971, Carolyn and Roger Perron relocate their family of five daughters to a secluded 18th-century Rhode Island farmhouse, only to be tormented by violent nocturnal assaults, clock stoppages, and demonic apparitions. Desperate for salvation, the Warrens are summoned into the darkest and most perilous exorcism battle of their careers.',
    cast: ['Vera Farmiga', 'Patrick Wilson', 'Lili Taylor', 'Ron Livingston', 'Mackenzie Foy'],
    director: 'James Wan',
    musicDirector: 'Joseph Bishara',
    accentColor: '#B45309',
    bgGradient: 'from-amber-950/40 via-stone-950/60 to-zinc-950',
    accentBadgeColor: 'bg-amber-500/20 text-amber-400 border-amber-500/30',
    themeSymbol: 'ghost',
    posterUrl: '/posters/the-conjuring.jpg'
  },
  {
    id: 'amaran',
    title: 'Amaran',
    subtitle: 'The story of an immortal soldier',
    languages: ['Tamil', 'Telugu'],
    displayLanguage: 'Tamil / Telugu',
    genres: ['Action', 'Biography', 'Drama'],
    duration: '2h 47m',
    certificate: 'U/A',
    rating: 9.2,
    votes: '210K votes',
    releaseYear: 2024,
    synopsis: 'Adapted from the inspiring true accounts in Shiv Aroor and Rahul Singh’s \'India’s Most Fearless\', this biographical war epic celebrates Major Mukund Varadarajan AC, the valiant commander of the Indian Army\'s 44 Rashtriya Rifles. The film powerfully dramatizes his daring tactical leadership in high-risk counter-terrorism operations across Shopian, Kashmir, framed by his unbreakable bond with his steadfast wife, Indhu Rebecca Varghese.',
    cast: ['Sivakarthikeyan', 'Sai Pallavi', 'Bhuvan Arora', 'Rahul Bose'],
    director: 'Rajkumar Periasamy',
    musicDirector: 'G. V. Prakash Kumar',
    accentColor: '#DC2626',
    bgGradient: 'from-red-950/40 via-stone-950/60 to-zinc-950',
    accentBadgeColor: 'bg-red-500/20 text-red-400 border-red-500/30',
    themeSymbol: 'award',
    posterUrl: '/posters/amaran.jpg'
  },
  {
    id: 'remo',
    title: 'Remo',
    subtitle: 'A romantic comedy tale',
    languages: ['Tamil'],
    displayLanguage: 'Tamil',
    genres: ['Romance', 'Comedy'],
    duration: '2h 30m',
    certificate: 'U',
    rating: 8.4,
    votes: '94K votes',
    releaseYear: 2016,
    synopsis: 'SK is a spirited, middle-class theater performer whose dream of becoming a big-screen leading man is thwarted when a prominent director demands an actress who can captivate with feminine charm. Taking matters into his own hands, SK transforms into \'Regina Motwani\' (Remo), an alluring nurse. But when he falls head-over-heels for Dr. Kavya, an already-engaged doctor, his double life sparks a whirlwind of romantic deceptions and uproarious hospital escapades.',
    cast: ['Sivakarthikeyan', 'Keerthy Suresh', 'Sathish', 'K. S. Ravikumar'],
    director: 'Bakkiyaraj Kannan',
    musicDirector: 'Anirudh Ravichander',
    accentColor: '#EC4899',
    bgGradient: 'from-pink-900/40 via-purple-950/60 to-zinc-950',
    accentBadgeColor: 'bg-pink-500/20 text-pink-400 border-pink-500/30',
    themeSymbol: 'heart',
    posterUrl: '/posters/remo.jpg'
  },
  {
    id: 'sita-ramam',
    title: 'Sita Ramam',
    subtitle: 'A love written across borders',
    languages: ['Telugu', 'Tamil'],
    displayLanguage: 'Telugu / Tamil',
    genres: ['Romance', 'Period Drama', 'Mystery'],
    duration: '2h 43m',
    certificate: 'U',
    rating: 9.1,
    votes: '185K votes',
    releaseYear: 2022,
    synopsis: 'In 1965, Lieutenant Ram, an orphaned Indian soldier posted at the snow-laden Kashmir frontier, receives widespread national acclaim that brings unexpected anonymous letters from a woman signing as his wife, Sita Mahalakshmi. As their tender, soul-stirring romance deepens through letters, Ram is dispatched on a covert mission behind enemy lines. Twenty years later, Pakistani student Afreen must deliver Ram\'s final unsent letter, unveiling an epic saga of timeless love and patriotic devotion.',
    cast: ['Dulquer Salmaan', 'Mrunal Thakur', 'Rashmika Mandanna', 'Sumanth'],
    director: 'Hanu Raghavapudi',
    musicDirector: 'Vishal Chandrashekhar',
    accentColor: '#E11D48',
    bgGradient: 'from-rose-900/40 via-red-950/60 to-zinc-950',
    accentBadgeColor: 'bg-rose-500/20 text-rose-400 border-rose-500/30',
    themeSymbol: 'mail',
    posterUrl: '/posters/sita-ramam.jpg'
  },
  {
    id: 'hi-nanna',
    title: 'Hi Nanna',
    subtitle: 'A heartwarming story of love & fatherhood',
    languages: ['Telugu', 'Tamil'],
    displayLanguage: 'Telugu / Tamil',
    genres: ['Family', 'Drama', 'Romance'],
    duration: '2h 35m',
    certificate: 'U',
    rating: 8.9,
    votes: '110K votes',
    releaseYear: 2023,
    synopsis: 'Viraj is a talented commercial photographer in Mumbai whose life revolves entirely around his spirited six-year-old daughter Mahi, who courageously lives with cystic fibrosis. While Viraj invents whimsical bedtime stories to shield Mahi from knowing about her absent mother, a chance encounter with a gentle stranger named Yashna alters their lives. As Yashna forms an instant connection with Mahi, hidden secrets, memory loss, and forgotten sacrifices come to light in an emotionally uplifting journey.',
    cast: ['Nani', 'Mrunal Thakur', 'Baby Kiara Khanna', 'Jayaram'],
    director: 'Shouryuv',
    musicDirector: 'Hesham Abdul Wahab',
    accentColor: '#0EA5E9',
    bgGradient: 'from-sky-900/40 via-blue-950/60 to-zinc-950',
    accentBadgeColor: 'bg-sky-500/20 text-sky-400 border-sky-500/30',
    themeSymbol: 'sparkles',
    posterUrl: '/posters/hi-nanna.jpg'
  },
  {
    id: 'minmini',
    title: 'Minmini',
    subtitle: 'Journey of friendship and self-discovery',
    languages: ['Tamil'],
    displayLanguage: 'Tamil',
    genres: ['Drama', 'Coming of Age'],
    duration: '2h 18m',
    certificate: 'U',
    rating: 8.5,
    votes: '42K votes',
    releaseYear: 2024,
    synopsis: 'Filmed across an authentic eight-year span as its child actors grew into adulthood, this introspective coming-of-age drama traces Pari and Praveena, two classmates from an Ooty boarding school. Both carry the weight of survivor\'s guilt following the untimely death of an exceptionally gifted friend who inspired them. Reconnecting as young adults, they embark on an expansive motorcycle expedition across the tranquil Himalayan vistas of Ladakh to confront their unresolved emotions and embrace self-forgiveness.',
    cast: ['Esther Anil', 'Pravin Kishore', 'Gaurav Kalai', 'Halitha Shameem'],
    director: 'Halitha Shameem',
    musicDirector: 'Khatija Rahman',
    accentColor: '#10B981',
    bgGradient: 'from-emerald-900/40 via-teal-950/60 to-zinc-950',
    accentBadgeColor: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30',
    themeSymbol: 'mountain',
    posterUrl: '/posters/minmini.jpg'
  },
  {
    id: 'geetha-govindam',
    title: 'Geetha Govindam',
    subtitle: 'Sparks fly between opposites',
    languages: ['Telugu'],
    displayLanguage: 'Telugu',
    genres: ['Romance', 'Comedy', 'Drama'],
    duration: '2h 22m',
    certificate: 'U/A',
    rating: 8.3,
    votes: '135K votes',
    releaseYear: 2018,
    synopsis: 'Vijay Govind is an earnest, traditional young lecturer with dreams of an ideal, harmonious arranged marriage. On an overnight bus journey, an awkward misunderstanding causes the independent, sharp-tongued Geetha to brand him as a pervert. In a chaotic twist of fate, Govind\'s sister is arranged to marry Geetha\'s brother. Desperate to protect his sister\'s happiness and clear his tarnished name, Govind must endure Geetha’s constant suspicion and win over her family through a comedy of errors.',
    cast: ['Vijay Deverakonda', 'Rashmika Mandanna', 'Subbaraju', 'Mouryani'],
    director: 'Parasuram',
    musicDirector: 'Gopi Sundar',
    accentColor: '#F97316',
    bgGradient: 'from-amber-900/40 via-orange-950/60 to-zinc-950',
    accentBadgeColor: 'bg-orange-500/20 text-orange-400 border-orange-500/30',
    themeSymbol: 'smile',
    posterUrl: '/posters/geetha-govindam.jpg'
  },
  {
    id: 'avengers-endgame',
    title: 'Avengers: Endgame',
    subtitle: 'Part of the journey is the end',
    languages: ['English'],
    displayLanguage: 'English',
    genres: ['Action', 'Sci-Fi', 'Adventure'],
    duration: '3h 01m',
    certificate: 'U/A',
    rating: 9.4,
    votes: '1.2M votes',
    releaseYear: 2019,
    synopsis: 'After the devastating cosmic snap by Thanos wipes out half of all life across the universe, the shattered and grieving Avengers are left grappling with monumental loss. When Scott Lang re-emerges from the Quantum Realm with a theoretical path through the temporal continuum, Iron Man, Captain America, and their remaining allies reunite for a daring \'Time Heist\' through their past to retrieve the Infinity Stones, culminating in the ultimate cosmic battle to resurrect their fallen comrades.',
    cast: ['Robert Downey Jr.', 'Chris Evans', 'Mark Ruffalo', 'Chris Hemsworth', 'Scarlett Johansson'],
    director: 'Anthony and Joe Russo',
    musicDirector: 'Alan Silvestri',
    accentColor: '#8B5CF6',
    bgGradient: 'from-purple-900/40 via-indigo-950/60 to-zinc-950',
    accentBadgeColor: 'bg-purple-500/20 text-purple-400 border-purple-500/30',
    themeSymbol: 'shield',
    posterUrl: '/posters/avengers-endgame.jpg'
  },
  {
    id: 'tangled',
    title: 'Tangled (Rapunzel)',
    subtitle: 'Best day ever begins here',
    languages: ['English'],
    displayLanguage: 'English',
    genres: ['Animation', 'Adventure', 'Family', 'Musical'],
    duration: '1h 40m',
    certificate: 'U',
    rating: 8.8,
    votes: '520K votes',
    releaseYear: 2010,
    synopsis: 'Princess Rapunzel has spent eighteen years secluded high inside an enchanted tower, her miraculous seventy feet of golden locks possessing the power to heal and bestow eternal youth for Mother Gothel. Yearning to see the mesmerizing floating lanterns released every year on her birthday, Rapunzel strikes a bargain with Flynn Rider, an arrogant yet charming thief who takes refuge in her tower. Together with a spirited horse named Maximus and a loyal chameleon, they embark on a whimsical, musical adventure into the kingdom.',
    cast: ['Mandy Moore', 'Zachary Levi', 'Donna Murphy', 'Ron Perlman'],
    director: 'Nathan Greno, Byron Howard',
    musicDirector: 'Alan Menken',
    accentColor: '#FBBF24',
    bgGradient: 'from-amber-800/40 via-yellow-950/60 to-zinc-950',
    accentBadgeColor: 'bg-amber-400/20 text-amber-300 border-amber-400/30',
    themeSymbol: 'sun',
    posterUrl: '/posters/tangled.jpg'
  },
  {
    id: 'vaaranam-aayiram',
    title: 'Vaaranam Aayiram',
    subtitle: 'A son’s tribute to his father',
    languages: ['Tamil'],
    displayLanguage: 'Tamil',
    genres: ['Drama', 'Romance', 'Musical'],
    duration: '2h 48m',
    certificate: 'U',
    rating: 9.2,
    votes: '190K votes',
    releaseYear: 2008,
    synopsis: 'En route to a daring airborne counter-terrorism operation, Major Surya receives the devastating news of his father Krishnan’s passing. Deep in grief, Surya journeys back through the defining chapters of his life and the unforgettable relationship he shared with his progressive, loving father. From his passionate whirlwind romance with Meghna across San Francisco to the depths of grief, substance addiction, and his eventual rebirth into a decorated soldier, Surya honors the timeless guidance of a father who taught him to never surrender.',
    cast: ['Suriya', 'Simran', 'Ramya', 'Sameera Reddy'],
    director: 'Gautham Vasudev Menon',
    musicDirector: 'Harris Jayaraj',
    accentColor: '#06B6D4',
    bgGradient: 'from-cyan-900/40 via-teal-950/60 to-zinc-950',
    accentBadgeColor: 'bg-cyan-500/20 text-cyan-400 border-cyan-500/30',
    themeSymbol: 'music',
    posterUrl: '/posters/vaaranam-aayiram.jpg'
  }
];

// Archived catalogue: Removed from active listings and search, but preserved for
// historical booking resolution, ratings, invoices, and ticket verification.
export const ARCHIVED_MOVIES: Movie[] = [
  {
    id: 'gatta-kushti-2',
    title: 'Gatta Kusthi 2',
    subtitle: 'Gatta Kushti 2 · The Champions Return to the Ring',
    languages: ['Tamil', 'Telugu'],
    displayLanguage: 'Tamil / Telugu',
    genres: ['Sports', 'Comedy', 'Drama'],
    duration: '2h 25m',
    certificate: 'U',
    rating: 8.7,
    votes: '118K votes',
    releaseYear: 2026,
    synopsis: 'Following his eye-opening journey in the first chapter, Veera has proudly embraced life managing household chores and cheering on his superstar wrestler wife, Keerthi. When Keerthi qualifies for the high-stakes World Wrestling Championship in Dubai, the couple faces meddling village traditionalists, comical family turmoil, and ruthless international opponents in an entertaining blend of rural humor and arena action.',
    cast: ['Vishnu Vishal', 'Aishwarya Lekshmi', 'Karunas', 'Munishkanth', 'Kaali Venkat', 'Zara Zyanna'],
    director: 'Chella Ayyavu',
    musicDirector: 'Justin Prabhakaran',
    accentColor: '#EA580C',
    bgGradient: 'from-orange-950/40 via-amber-950/60 to-zinc-950',
    accentBadgeColor: 'bg-orange-500/20 text-orange-400 border-orange-500/30',
    themeSymbol: 'trophy',
    posterUrl: '/posters/gatta-kushti-2.jpg'
  },
  {
    id: 'mandaadi',
    title: 'Mandaadi',
    subtitle: 'Mandhady · Coastal Sailboat Racing Legend',
    languages: ['Tamil', 'Telugu'],
    displayLanguage: 'Tamil / Telugu',
    genres: ['Action', 'Sports', 'Drama'],
    duration: '2h 38m',
    certificate: 'U/A',
    rating: 8.9,
    votes: '145K votes',
    releaseYear: 2026,
    synopsis: 'Set against the rugged, sun-drenched coastline of southern Tamil Nadu, Muthukaali is an esteemed master of the traditional catamaran sailboat racing heritage known as Mandaadi. Driven out of quiet retirement by cutthroat corporate interests and a bitter inter-village rivalry threatening his coastal community\'s livelihood, Muthukaali rallies an underdog six-man crew to brave perilous oceanic swells and reclaim their maritime honor.',
    cast: ['Soori', 'Mahima Nambiar', 'Suhas', 'Sathyaraj', 'Ravindra Vijay', 'Bala Saravanan'],
    director: 'Mathimaran Pugazhendhi',
    musicDirector: 'G. V. Prakash Kumar',
    accentColor: '#0284C7',
    bgGradient: 'from-sky-950/40 via-cyan-950/60 to-zinc-950',
    accentBadgeColor: 'bg-cyan-500/20 text-cyan-400 border-cyan-500/30',
    themeSymbol: 'anchor',
    posterUrl: '/posters/mandaadi.jpg'
  },
  {
    id: 'd-block',
    title: 'D Block',
    subtitle: 'Mystery beyond the women hostel gate',
    languages: ['Tamil'],
    displayLanguage: 'Tamil',
    genres: ['Mystery', 'Thriller', 'Horror'],
    duration: '2h 12m',
    certificate: 'U/A',
    rating: 8.4,
    votes: '85K votes',
    releaseYear: 2022,
    synopsis: 'Inspired by chilling real-life campus urban legends, first-year engineering student Velu arrives at an isolated, forest-bordered college outside Coimbatore. When multiple female students mysteriously vanish under eerie circumstances near D-Block—the strictly forbidden, locked-down women’s hostel wing—Velu and his friends breach the perimeter after nightfall to confront a terrifying nocturnal predator lurking in the dense wilderness.',
    cast: ['Arulnithi', 'Avantika Mishra', 'Charandeep', 'Vijay Kumar Rajendran', 'Karunakaran'],
    director: 'Vijay Kumar Rajendran',
    musicDirector: 'Ron Ethan Yohann',
    accentColor: '#7C3AED',
    bgGradient: 'from-purple-950/40 via-violet-950/60 to-zinc-950',
    accentBadgeColor: 'bg-purple-500/20 text-purple-400 border-purple-500/30',
    themeSymbol: 'lock',
    posterUrl: '/posters/d-block.jpg'
  },
  {
    id: 'ghilli',
    title: 'Ghilli',
    subtitle: 'The timeless blockbuster',
    languages: ['Tamil'],
    displayLanguage: 'Tamil',
    genres: ['Action', 'Sports', 'Romance'],
    duration: '2h 45m',
    certificate: 'U',
    rating: 9.3,
    votes: '240K votes',
    releaseYear: 2004,
    synopsis: 'Saravanavelu \'Velu\', an energetic Chennai college student and formidable Kabaddi raider, travels to Madurai for a pivotal state championship without his strict police officer father’s consent. In Madurai, he boldly rescues Dhanalakshmi from Muthupandi, an all-powerful factionalist obsessed with marrying her by force. Velu smuggles her into Chennai and hides her right inside his home, staying steps ahead of Muthupandi\'s ruthless henchmen while chasing victory in the national finals.',
    cast: ['Thalapathy Vijay', 'Trisha Krishnan', 'Prakash Raj', 'Ashish Vidyarthi'],
    director: 'Dharani',
    musicDirector: 'Vidyasagar',
    accentColor: '#F59E0B',
    bgGradient: 'from-amber-900/40 via-orange-950/60 to-zinc-950',
    accentBadgeColor: 'bg-amber-500/20 text-amber-400 border-amber-500/30',
    themeSymbol: 'zap',
    posterUrl: '/posters/ghilli.jpg'
  }
];

export const ALL_MOVIES: Movie[] = [...MOVIES, ...ARCHIVED_MOVIES];

export function getMovieById(id: string): Movie | undefined {
  return MOVIES.find((m) => m.id === id) || ARCHIVED_MOVIES.find((m) => m.id === id);
}

export const THEATRES: Theatre[] = [
  {
    id: 'th-1',
    name: 'PVR INOX Luxe Multiplex',
    location: 'Phoenix Marketcity, Velachery',
    screen: 'Screen 1 — Dolby Atmos 4K Laser',
    soundSystem: 'Dolby Atmos 64-Channel',
    shows: ['10:15 AM', '01:45 PM', '05:30 PM', '09:15 PM']
  },
  {
    id: 'th-2',
    name: 'SPI Cinemas (Palazzo)',
    location: 'Forum Vijaya Mall, Vadapalani',
    screen: 'Screen 3 — IMAX with Laser',
    soundSystem: '12-Channel IMAX Immersive Audio',
    shows: ['11:00 AM', '02:30 PM', '06:45 PM', '10:30 PM']
  },
  {
    id: 'th-3',
    name: 'Cinepolis Grand Mall',
    location: 'OMR Road, Sholinganallur',
    screen: 'Screen 2 — 4K Barco Laser',
    soundSystem: 'Aura 3D Sound 11.1',
    shows: ['10:45 AM', '02:00 PM', '06:00 PM', '09:45 PM']
  }
];

export const TICKET_PRICING = {
  Premium: 240,
  Regular: 160,
  convenienceFeePercentage: 0.10, // 10%
  gstPercentage: 0.18 // 18% on convenience fee
};

// Generates dates for Today, Tomorrow, and subsequent days
export function getShowDates() {
  const dates = [];
  const today = new Date();
  
  for (let i = 0; i < 5; i++) {
    const d = new Date(today);
    d.setDate(today.getDate() + i);
    
    let label = '';
    if (i === 0) label = 'Today';
    else if (i === 1) label = 'Tomorrow';
    else {
      label = d.toLocaleDateString('en-US', { weekday: 'short' });
    }
    
    const formattedDate = d.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric'
    });
    
    const fullDateString = d.toLocaleDateString('en-US', {
      weekday: 'long',
      month: 'long',
      day: 'numeric',
      year: 'numeric'
    });

    dates.push({
      id: d.toISOString().split('T')[0],
      dayLabel: label,
      dateLabel: formattedDate,
      fullDateString,
      isToday: i === 0
    });
  }
  return dates;
}

// Generate realistic seeded booked seats per show key
export function getInitialBookedSeats(movieKey: string, dateKey: string, timeKey: string): Set<string> {
  const seedString = `${movieKey}-${dateKey}-${timeKey}`;
  let hash = 0;
  for (let i = 0; i < seedString.length; i++) {
    hash = (hash << 5) - hash + seedString.charCodeAt(i);
    hash |= 0;
  }
  
  const booked = new Set<string>();
  const rows = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'];
  const totalCols = 14;
  
  // Choose ~18 to 28 booked seats consistently
  const count = 18 + Math.abs(hash % 10);
  for (let i = 0; i < count; i++) {
    const rowIdx = Math.abs((hash * (i + 13)) % rows.length);
    const colIdx = 1 + Math.abs(((hash >> 2) * (i + 7)) % totalCols);
    booked.add(`${rows[rowIdx]}${colIdx}`);
  }
  
  return booked;
}
