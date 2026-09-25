-- ============================================================
-- Valaria Cinema Archive — Seed Data
-- ============================================================

-- -------------------------------------------------------
-- TASTE MOODS
-- -------------------------------------------------------
INSERT INTO taste_moods (id, label, tagline, accent_hue, match_genre_keys) VALUES
  ('dystopian-solitude',     'Dystopian Solitude',     'Expansive brutalist landscapes, cold synthesizers, and cosmic isolation.',             '#E5A93C', ARRAY['Sci-Fi & Speculative', 'Auteur Vision']),
  ('neo-noir-melancholy',    'Neo-Noir Melancholy',    'Rain-soaked asphalt, neon diffraction, moral ambiguity, and stoic heroes.',            '#E5A93C', ARRAY['Neo-Noir', 'Psychological Thriller']),
  ('sensory-euphoria',       'Sensory Euphoria',       'Hypnotic cinematography, intoxicating color palettes, and romantic longing.',           '#E5A93C', ARRAY['Poetic Romance', 'Auteur Vision']),
  ('architectural-tension',  'Architectural Tension',  'Surgical precision, geometric framing, domestic dread, and razor dialogue.',            '#E5A93C', ARRAY['Psychological Thriller', 'Auteur Vision']),
  ('existential-slow-cinema','Existential Poetics',    'Philosophical reverence, meditative tracking shots, and spatial mystery.',              '#E5A93C', ARRAY['Auteur Vision', 'Documentary & Essay']);

-- -------------------------------------------------------
-- MOVIES
-- -------------------------------------------------------
INSERT INTO movies (id, title, tagline, director, year, runtime, rating, imdb_score, curator_score, match_score, genres, moods, synopsis, curator_note, backdrop, poster, trailer_id, trailer_embed_url, featured_spotlight) VALUES
(
  'dune-part-two',
  'Dune: Part Two',
  'Long live the fighters.',
  'Denis Villeneuve',
  2024, '2h 46m', 'PG-13', '8.6', 99, 98,
  ARRAY['Sci-Fi & Speculative', 'Auteur Vision'],
  ARRAY['dystopian-solitude', 'sensory-euphoria'],
  'Paul Atreides unites with Chani and the Fremen while seeking revenge against the conspirators who destroyed his family. Facing a choice between the love of his life and the fate of the known universe, he endeavors to prevent a terrible future only he can foresee.',
  E'Villeneuve reaches the zenith of modern blockbuster auteurism. Greig Fraser\u2019s infrared photography and Hans Zimmer\u2019s brass-laden microtonal sonic tapestry elevate Arrakis into an unforgettable liturgical landscape.',
  'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?auto=format&fit=crop&w=2000&q=85',
  'https://images.unsplash.com/photo-1534447677768-be436bb09401?auto=format&fit=crop&w=800&q=85',
  'Way9Dexny3w',
  'https://www.youtube.com/embed/Way9Dexny3w',
  true
),
(
  'blade-runner-2049',
  'Blade Runner 2049',
  'The key to the future is finally unearthed.',
  'Denis Villeneuve',
  2017, '2h 44m', 'R', '8.0', 98, 97,
  ARRAY['Sci-Fi & Speculative', 'Neo-Noir'],
  ARRAY['dystopian-solitude', 'neo-noir-melancholy'],
  E'Thirty years after the events of the first film, a new Blade Runner, LAPD Officer K, unearths a long-buried secret that has the potential to plunge what is left of society into chaos. K\u2019s discovery leads him on a quest to find Rick Deckard, a former LAPD Blade Runner who has been missing for three decades.',
  E'Roger Deakins\u2019 Oscar-winning masterwork. An operatic meditation on artificial souls and human solitude framed in sulfur-orange dust storms and laser-lit misty downpours.',
  'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=2000&q=85',
  'https://images.unsplash.com/photo-1508739773434-c26b3d09e071?auto=format&fit=crop&w=800&q=85',
  'gCcx85zbxz4',
  'https://www.youtube.com/embed/gCcx85zbxz4',
  true
),
(
  'past-lives',
  'Past Lives',
  'Inyeon binds what time separates.',
  'Celine Song',
  2023, '1h 45m', 'PG-13', '7.8', 97, 95,
  ARRAY['Poetic Romance', 'Auteur Vision'],
  ARRAY['sensory-euphoria', 'existential-slow-cinema'],
  E'Nora and Hae Sung, two deeply connected childhood friends, are wrested apart after Nora\u2019s family emigrates from South Korea. Two decades later, they are reunited in New York for one fateful week as they confront notions of destiny, love, and the choices that make a life.',
  E'Celine Song\u2019s debut is a masterclass in unspoken restraint. Shot in luscious 35mm, the film lets silence speak louder than confessions across the East River.',
  'https://images.unsplash.com/photo-1514565131-fce0801e5785?auto=format&fit=crop&w=2000&q=85',
  'https://images.unsplash.com/photo-1485846234645-a62644f84728?auto=format&fit=crop&w=800&q=85',
  'kA244xewjcI',
  'https://www.youtube.com/embed/kA244xewjcI',
  true
),
(
  'in-the-mood-for-love',
  'In the Mood for Love',
  'He remembers those vanished years.',
  'Wong Kar-wai',
  2000, '1h 38m', 'PG', '8.1', 100, 99,
  ARRAY['Poetic Romance', 'Auteur Vision'],
  ARRAY['sensory-euphoria', 'existential-slow-cinema'],
  'Two neighbors, a woman and a man, form a strong bond after both suspect extramarital activities of their spouses. However, they agree to keep their bond platonic so as not to commit similar wrongs.',
  E'Christopher Doyle and Mark Lee Ping-bin\u2019s sublime cinematography paired with Michael Galasso\u2019s haunting waltz. Every frame is a museum-grade painting of unfulfilled desire.',
  'https://images.unsplash.com/photo-1517604931442-7e0c8ed2963c?auto=format&fit=crop&w=2000&q=85',
  'https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?auto=format&fit=crop&w=800&q=85',
  'ba_Xo5f4jG0',
  'https://www.youtube.com/embed/ba_Xo5f4jG0',
  false
),
(
  'parasite',
  'Parasite',
  'Act like you own the place.',
  'Bong Joon-ho',
  2019, '2h 12m', 'R', '8.5', 99, 96,
  ARRAY['Psychological Thriller', 'Auteur Vision'],
  ARRAY['architectural-tension', 'neo-noir-melancholy'],
  'Greed and class discrimination threaten the newly formed symbiotic relationship between the wealthy Park family and the destitute Kim clan.',
  E'The modern architectural house as an allegorical guillotine. Bong\u2019s pacing is mathematical perfection, traversing from sharp black comedy into terrifying social horror with breathtaking agility.',
  'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=2000&q=85',
  'https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=800&q=85',
  '5xH0R_uie1U',
  'https://www.youtube.com/embed/5xH0R_uie1U',
  false
),
(
  'oppenheimer',
  'Oppenheimer',
  'The world forever changes.',
  'Christopher Nolan',
  2023, '3h 00m', 'R', '8.9', 98, 94,
  ARRAY['Auteur Vision', 'Psychological Thriller'],
  ARRAY['architectural-tension', 'dystopian-solitude'],
  'The story of American scientist J. Robert Oppenheimer and his role in the development of the atomic bomb during World War II, culminating in the Trinity test and subsequent security clearance hearings.',
  E'Hoyte van Hoytema\u2019s 65mm and IMAX black-and-white film stocks create an overwhelming tactile intimacy. Ludwig G\u00f6ransson\u2019s violin-driven score induces pure psychological vertigo.',
  'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=2000&q=85',
  'https://images.unsplash.com/photo-1446776811953-b23d57bd21aa?auto=format&fit=crop&w=800&q=85',
  'uYPbbksJxIg',
  'https://www.youtube.com/embed/uYPbbksJxIg',
  false
),
(
  'anatomy-of-a-fall',
  'Anatomy of a Fall',
  'Did he fall or was he pushed?',
  'Justine Triet',
  2023, '2h 31m', 'R', '7.7', 96, 93,
  ARRAY['Psychological Thriller', 'Auteur Vision'],
  ARRAY['architectural-tension', 'neo-noir-melancholy'],
  E'A woman is suspected of murder after her husband\u2019s death in the snow outside their secluded chalet, and their half-blind son faces a moral dilemma as the sole witness.',
  E'Sandra H\u00fcller delivers an incandescent, enigmatic performance. Triet dismantles the language of truth and marital memory with microscopic psychological savagery.',
  'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=2000&q=85',
  'https://images.unsplash.com/photo-1517760444937-f6397edcbbcd?auto=format&fit=crop&w=800&q=85',
  'fTrsp5BMloA',
  'https://www.youtube.com/embed/fTrsp5BMloA',
  false
),
(
  'the-zone-of-interest',
  'The Zone of Interest',
  'The banality of horror.',
  'Jonathan Glazer',
  2023, '1h 45m', 'PG-13', '7.4', 99, 92,
  ARRAY['Auteur Vision', 'Documentary & Essay'],
  ARRAY['architectural-tension', 'existential-slow-cinema'],
  E'Auschwitz commandant Rudolf H\u00f6ss and his wife Hedwig strive to build a dream life for their family in a house and garden right next to the concentration camp.',
  E'\u0141ukasz \u017bal\u2019s hidden-camera surveillance aesthetic combined with Johnnie Burn\u2019s staggering soundscape creates the most harrowing and formally daring film of the 21st century.',
  'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?auto=format&fit=crop&w=2000&q=85',
  'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=800&q=85',
  'r-vfg3KkV54',
  'https://www.youtube.com/embed/r-vfg3KkV54',
  false
),
(
  'drive',
  'Drive',
  'There are no clean getaways.',
  'Nicolas Winding Refn',
  2011, '1h 40m', 'R', '7.8', 95, 94,
  ARRAY['Neo-Noir', 'Psychological Thriller'],
  ARRAY['neo-noir-melancholy', 'sensory-euphoria'],
  'A mysterious Hollywood stuntman and mechanic moonlights as a getaway driver and finds himself in trouble when he helps out his neighbor.',
  E'Cliff Martinez\u2019s synth-wave pulse and Newton Thomas Sigel\u2019s magenta-tinted night photography forged an entire generation of modern neon cinema.',
  'https://images.unsplash.com/photo-1519501025264-65ba15a82390?auto=format&fit=crop&w=2000&q=85',
  'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=800&q=85',
  'KBiOF3y1W0Y',
  'https://www.youtube.com/embed/KBiOF3y1W0Y',
  false
),
(
  'portrait-of-a-lady-on-fire',
  'Portrait of a Lady on Fire',
  E'Do all lovers feel like they\u2019re inventing something?',
  E'C\u00e9line Sciamma',
  2019, '2h 02m', 'R', '8.1', 99, 96,
  ARRAY['Poetic Romance', 'Auteur Vision'],
  ARRAY['sensory-euphoria', 'existential-slow-cinema'],
  'On an isolated island in Brittany at the end of the eighteenth century, a female painter is obliged to paint a wedding portrait of a young woman in secret.',
  E'Claire Mathon\u2019s lighting is pure oil paint on canvas. Without traditional film score until the shattering finale of Vivaldi\u2019s Summer, every ocean breeze carries overwhelming emotional charge.',
  'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=2000&q=85',
  'https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?auto=format&fit=crop&w=800&q=85',
  'R-fQPT4mcJU',
  'https://www.youtube.com/embed/R-fQPT4mcJU',
  false
),
(
  'solaris',
  'Solaris',
  'Science has transformed into a nightmare.',
  'Andrei Tarkovsky',
  1972, '2h 47m', 'PG', '8.0', 99, 91,
  ARRAY['Sci-Fi & Speculative', 'Auteur Vision'],
  ARRAY['existential-slow-cinema', 'dystopian-solitude'],
  E'A psychologist is sent to a space station orbiting a mysterious planet to investigate the emotional breakdown of the crew and the mysterious hallucinations caused by the planet\u2019s ocean.',
  E'Tarkovsky\u2019s philosophical antidote to western hard sci-fi. The Earth prologue and the mysterious living ocean of Solaris remain the most profound cinematic meditations on human consciousness.',
  'https://images.unsplash.com/photo-1446776811953-b23d57bd21aa?auto=format&fit=crop&w=2000&q=85',
  'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=800&q=85',
  '6-4KydP92ss',
  'https://www.youtube.com/embed/6-4KydP92ss',
  false
),
(
  'everything-everywhere',
  'Everything Everywhere All at Once',
  'The universe is so much bigger than your imagination.',
  'Daniel Kwan & Daniel Scheinert',
  2022, '2h 19m', 'R', '7.8', 96, 93,
  ARRAY['Sci-Fi & Speculative', 'Auteur Vision'],
  ARRAY['sensory-euphoria', 'architectural-tension'],
  'A middle-aged Chinese immigrant is swept up into an insane adventure in which she alone can save existence by exploring other universes and connecting with the lives she could have led.',
  'A kinetic, maximalist masterpiece that channels nihilism into fierce, tearful humanistic love. Michelle Yeoh and Ke Huy Quan deliver career-defining emotional alchemy.',
  'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=2000&q=85',
  'https://images.unsplash.com/photo-1534447677768-be436bb09401?auto=format&fit=crop&w=800&q=85',
  'wxN1T1uxQ2g',
  'https://www.youtube.com/embed/wxN1T1uxQ2g',
  false
);

-- -------------------------------------------------------
-- TECHNICAL SPECS
-- -------------------------------------------------------
INSERT INTO technical_specs (movie_id, resolution, aspect_ratio, audio, color_grade, fps) VALUES
  ('dune-part-two',              '4K ULTRA HD REMASTER',            '1.43:1 & 1.90:1 IMAX Scope',      'Dolby Atmos 7.1.4 Object Audio',       'Native Photochemical Color Timing',       '24.000 fps Native'),
  ('blade-runner-2049',          '4K DIGITAL MASTER',               '2.39:1 Anamorphic Scope',          'Dolby Atmos Master Audio',              'Dual Tone Cyan & Tangerine Grade',        '23.976 fps'),
  ('past-lives',                 '4K 35mm Scan',                    '1.85:1 Academy Flat',              '5.1 Uncompressed Surround',             'Eastman Kodak 35mm Stock',                '24.000 fps'),
  ('in-the-mood-for-love',       '4K UHD Criterion Restoration',    '1.66:1 European Widescreen',       'DTS-HD Master Audio 5.1',               E'L\u2019Immagine Ritrovata Laboratory 4K Timing', '24.000 fps'),
  ('parasite',                   '4K HDR10+ Master',                '2.39:1 CinemaScope',               'Dolby Atmos',                           'Supervised by Bong Joon-ho',              '24.000 fps'),
  ('oppenheimer',                '4K Native IMAX 65mm',             '1.78:1 IMAX / 2.20:1 70mm',        'DTS:X 7.1 Master Audio',                'Photochemical 70mm Print Transfer',       '24.000 fps'),
  ('anatomy-of-a-fall',          '4K Master',                       '1.85:1 European Flat',             '5.1 Uncompressed',                      'Alpine Natural Light Phototiming',        '24.000 fps'),
  ('the-zone-of-interest',       '4K Sony CineAlta Venice Raw',     '1.78:1 Widescreen',                'Dolby Atmos Multitrack Acoustic Design', 'Natural Daylight Neutral Timing',         '24.000 fps'),
  ('drive',                      '4K HDR10 Master',                 '2.39:1 CinemaScope',               'DTS-HD Master Audio 5.1',               'High-Saturation Synth Color Space',       '23.976 fps'),
  ('portrait-of-a-lady-on-fire', '4K Digital Cinema Package',       '1.85:1 Academy Flat',              '5.1 Surround',                          'RED Monstro 8K Sensor Grade',             '24.000 fps'),
  ('solaris',                    '4K Restoration Mosfilm',           '2.35:1 Sovscope Widescreen',       'Mono Uncompressed LPCM',                'Photochemical Color Timing Restored',     '24.000 fps'),
  ('everything-everywhere',      '4K HDR10+ Master',                'Variable Aspect Ratio 1.85:1 / 2.39:1', 'Dolby Atmos Spatial Mix',          'Multiverse Color Palette Separation',     '24.000 fps');

-- -------------------------------------------------------
-- CAST
-- -------------------------------------------------------
INSERT INTO movie_cast (movie_id, name, position) VALUES
  ('dune-part-two', 'Timothée Chalamet', 0), ('dune-part-two', 'Zendaya', 1), ('dune-part-two', 'Rebecca Ferguson', 2), ('dune-part-two', 'Javier Bardem', 3), ('dune-part-two', 'Austin Butler', 4),
  ('blade-runner-2049', 'Ryan Gosling', 0), ('blade-runner-2049', 'Harrison Ford', 1), ('blade-runner-2049', 'Ana de Armas', 2), ('blade-runner-2049', 'Sylvia Hoeks', 3), ('blade-runner-2049', 'Robin Wright', 4),
  ('past-lives', 'Greta Lee', 0), ('past-lives', 'Teo Yoo', 1), ('past-lives', 'John Magaro', 2),
  ('in-the-mood-for-love', 'Tony Leung Chiu-wai', 0), ('in-the-mood-for-love', 'Maggie Cheung', 1),
  ('parasite', 'Song Kang-ho', 0), ('parasite', 'Lee Sun-kyun', 1), ('parasite', 'Cho Yeo-jeong', 2), ('parasite', 'Choi Woo-shik', 3), ('parasite', 'Park So-dam', 4),
  ('oppenheimer', 'Cillian Murphy', 0), ('oppenheimer', 'Emily Blunt', 1), ('oppenheimer', 'Matt Damon', 2), ('oppenheimer', 'Robert Downey Jr.', 3), ('oppenheimer', 'Florence Pugh', 4),
  ('anatomy-of-a-fall', 'Sandra Hüller', 0), ('anatomy-of-a-fall', 'Swann Arlaud', 1), ('anatomy-of-a-fall', 'Milo Machado-Graner', 2), ('anatomy-of-a-fall', 'Antoine Reinartz', 3),
  ('the-zone-of-interest', 'Christian Friedel', 0), ('the-zone-of-interest', 'Sandra Hüller', 1),
  ('drive', 'Ryan Gosling', 0), ('drive', 'Carey Mulligan', 1), ('drive', 'Bryan Cranston', 2), ('drive', 'Albert Brooks', 3), ('drive', 'Oscar Isaac', 4),
  ('portrait-of-a-lady-on-fire', 'Noémie Merlant', 0), ('portrait-of-a-lady-on-fire', 'Adèle Haenel', 1), ('portrait-of-a-lady-on-fire', 'Luàna Bajrami', 2), ('portrait-of-a-lady-on-fire', 'Valeria Golino', 3),
  ('solaris', 'Donatas Banionis', 0), ('solaris', 'Natalya Bondarchuk', 1), ('solaris', 'Jüri Järvet', 2),
  ('everything-everywhere', 'Michelle Yeoh', 0), ('everything-everywhere', 'Ke Huy Quan', 1), ('everything-everywhere', 'Stephanie Hsu', 2), ('everything-everywhere', 'Jamie Lee Curtis', 3);

-- -------------------------------------------------------
-- AWARDS
-- -------------------------------------------------------
INSERT INTO movie_awards (movie_id, award) VALUES
  ('dune-part-two', 'Academy Award Winner: Sound & Visual Effects'),
  ('dune-part-two', 'Venice Film Festival Special Screening'),
  ('blade-runner-2049', 'Academy Award Winner: Best Cinematography'),
  ('blade-runner-2049', 'Academy Award Winner: Best Visual Effects'),
  ('past-lives', 'Sundance Film Festival Premiere'),
  ('past-lives', 'Academy Award Nominee: Best Picture'),
  ('in-the-mood-for-love', 'Cannes Film Festival: Best Actor (Tony Leung)'),
  ('in-the-mood-for-love', 'Cannes Film Festival: Technical Grand Prize'),
  ('parasite', E'Cannes Palme d\u2019Or (Unanimous)'),
  ('parasite', 'Academy Award Winner: Best Picture & Best Director'),
  ('oppenheimer', '7 Academy Awards including Best Picture & Director'),
  ('oppenheimer', 'BAFTA Winner: Best Film'),
  ('anatomy-of-a-fall', E'Cannes Palme d\u2019Or Winner'),
  ('anatomy-of-a-fall', 'Academy Award Winner: Best Original Screenplay'),
  ('the-zone-of-interest', 'Academy Award Winner: Best International Feature & Best Sound'),
  ('the-zone-of-interest', 'Cannes Grand Prix'),
  ('drive', 'Cannes Film Festival: Best Director (Nicolas Winding Refn)'),
  ('portrait-of-a-lady-on-fire', 'Cannes Film Festival: Best Screenplay & Queer Palm'),
  ('portrait-of-a-lady-on-fire', E'C\u00e9sar Award Winner: Best Cinematography'),
  ('solaris', E'Cannes Film Festival: Grand Prix Sp\u00e9cial du Jury'),
  ('everything-everywhere', '7 Academy Awards including Best Picture, Director, Actress');

-- -------------------------------------------------------
-- STREAMING PLATFORMS
-- -------------------------------------------------------
INSERT INTO stream_platforms (movie_id, name, type, logo_text, badge_color) VALUES
  ('dune-part-two', 'Valaria Premier',   'premiere',      '4K VALARIA DIRECT',        '#E5A93C'),
  ('dune-part-two', 'Apple TV+',         'subscription',  'Apple TV',                   NULL),
  ('dune-part-two', 'Max',               'subscription',  'Max Originals',              NULL),
  ('blade-runner-2049', 'Valaria Direct', 'free_curated', 'VALARIA ARCHIVE',            NULL),
  ('blade-runner-2049', 'Prime Video',    'subscription',  'Prime Video',                NULL),
  ('past-lives', 'Valaria Premier',       'premiere',      'A24 / VALARIA EXCLUSIVE',   '#E5A93C'),
  ('past-lives', 'Apple TV',              'subscription',  'Apple TV',                   NULL),
  ('in-the-mood-for-love', 'Criterion Channel', 'subscription', 'CRITERION ARCHIVE',    NULL),
  ('in-the-mood-for-love', 'Valaria Direct',    'free_curated', 'VALARIA 4K RESTORATION', NULL),
  ('parasite', 'Valaria Direct',          'free_curated',  'VALARIA GOLD',               NULL),
  ('parasite', 'Hulu',                    'subscription',  'Hulu',                       NULL),
  ('oppenheimer', 'Valaria Premier',      'premiere',      'IMAX ENHANCED DIRECT',       NULL),
  ('oppenheimer', 'Peacock',              'subscription',  'Peacock',                    NULL),
  ('anatomy-of-a-fall', 'Valaria Direct', 'free_curated',  'VALARIA SELECTION',          NULL),
  ('anatomy-of-a-fall', 'Hulu',           'subscription',  'Hulu',                       NULL),
  ('the-zone-of-interest', 'Valaria Premier', 'premiere',  'A24 / VALARIA 4K',           NULL),
  ('the-zone-of-interest', 'Max',         'subscription',  'Max',                        NULL),
  ('drive', 'Valaria Direct',             'free_curated',  'VALARIA NEO-NOIR',           NULL),
  ('drive', 'Apple TV',                   'subscription',  'Apple TV',                   NULL),
  ('portrait-of-a-lady-on-fire', 'Criterion Channel', 'subscription', 'CRITERION',       NULL),
  ('portrait-of-a-lady-on-fire', 'Hulu',  'subscription', 'Hulu',                        NULL),
  ('solaris', 'Mosfilm Archive',           'free_curated', 'MOSFILM 4K',                  NULL),
  ('solaris', 'Criterion Channel',         'subscription', 'CRITERION',                   NULL),
  ('everything-everywhere', 'Valaria Premier', 'premiere', 'A24 ULTRA HD',                NULL),
  ('everything-everywhere', 'Apple TV',    'subscription', 'Apple TV',                    NULL);

-- -------------------------------------------------------
-- DEFAULT WATCHLIST (demo session)
-- -------------------------------------------------------
INSERT INTO watchlist (session_id, movie_id) VALUES
  ('demo-session', 'dune-part-two'),
  ('demo-session', 'in-the-mood-for-love'),
  ('demo-session', 'blade-runner-2049');
