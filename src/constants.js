module.exports = {
  CAROUSEL_HEIGHT: 630,
  CAROUSEL_CONTROL_WIDTH: 48,
  THUMB_VISIBLE_COUNT: 4,
  activatePagination: false,
  artworksPerRow: 4,
  artworkRowsPerPage: 2,
  newsPerPage: 1,
  homeCarouselIntervalMs: 5000,

  // Site-wide contact/social links, referenced from the navbar, footer, and contact page.
  CONTACT_EMAIL: "contact@vb-art.com",
  INSTAGRAM_URL: "https://www.instagram.com/vb.art.gallery/",

  // Artist bio, used to compute the displayed age on the home/about pages.
  ARTIST_BIRTH_DATE: "1995-07-13",
  MS_PER_YEAR: 365.25 * 24 * 60 * 60 * 1000,

  // Matches markdown files under src/assets/artwork/ (as opposed to /news/).
  ARTWORK_PATH_REGEX: "/(artwork)/",

  collections: {
    all: "All images",
    "black-and-white": "Black and White Paintings",
    colorful: "Colorful Paintings",
    sketches: "Sketches",
    // "travel": "Travel Artbook",
    // "digital": "Digital",
    postcards: "Postcards",
  },
  sizes: {
    A2: "A2 (42,0cm × 59,4cm)",
    A3: "A3 (29.7cm x 42.0cm)",
    A4: "A4 (27.5cm x 21.0cm)",
    "40x40": "40 cm x 40 cm",
    "50x70": "50 cm x 70 cm",
    "70x50": "70 cm x 50 cm",
    "50x90": "50 cm x 90 cm",
    "60x80": "60 cm x 80 cm",
    "80x60": "80 cm x 60 cm",
    "60x60": "60 cm x 60 cm",
    "100x70": "100 cm x 70 cm",
    "70x100": "70 cm x 100 cm",
    "80x80": "80 cm x 80 cm",
    "80x100": "80 cm x 100 cm",
    "120x90": "120 cm x 90 cm",
  },
  exhibitions: [
    {
      year: "2026",
      entries: [
        {
          name: "Kunstroute Ehrenfeld",
          place: "Bunker K101, Köln (Germany)",
          date: "01.05. – 12.05.2026",
        },
      ],
    },
    {
      year: "2025",
      entries: [
        {
          name: "Kunstroute Ehrenfeld",
          place: "Bunker K101, Köln (Germany)",
          date: "02.05. – 06.05.2025",
        },
        {
          name: "Kunst mischt mit",
          place: "Galerie Eyegenart, Köln (Germany)",
          date: "13.04. – 11.05.2025",
        },
        { name: "Discovery Art Fair Cologne", place: "XPOST", date: "03.04. – 06.04.2025" },
      ],
    },
    {
      year: "2024",
      entries: [
        {
          name: "III. Kunstsommer/Herbst",
          place: "Galerie Eyegenart, Köln (Germany)",
          date: "26.09. – 03.11.2024",
        },
        {
          name: "Mindful walks — travel sketches by Verena Barth (solo)",
          place: "Kunst- und Kultur Lokal Alte Feuerwache, Köln (Germany)",
          date: "16.02. – 24.03.2024",
        },
      ],
    },
    {
      year: "2023",
      entries: [
        {
          name: "II. Kunstsommer/Herbst",
          place: "Galerie Eyegenart, Köln (Germany)",
          date: "31.08. – 05.10.2023",
        },
      ],
    },
  ],
  livePainting: [
    {
      year: "2024",
      entries: [{ name: "Kunscht im Eck", place: "Dunningen (Germany)", date: "21.09.2024" }],
    },
    {
      year: "2023",
      entries: [
        {
          name: "Solstice Festival",
          place: "Eagle's Nest Atitlán, San Marcos (Guatemala)",
          date: "19.12. – 22.12.2023",
        },
        {
          name: "Kulturrummel",
          place: "viadee Unternehmensberatung, Köln (Germany)",
          date: "14.04.2023",
        },
      ],
    },
  ]
}
