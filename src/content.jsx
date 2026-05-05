// All copy for the site. Placeholders, but written in Sungwoo's voice.

const CONTENT = {
  name: 'Sungwoo Cho',
  role: 'AI @ UC San Diego',
  address: [
    'UC San Diego',
    '9500 Gilman Drive',
    'La Jolla, CA 92093',
  ],
  email: 'solomon@ucsd.edu',
  emailAlt: 'suc035@ucsd.edu',
  phone: '279.264.3977',

  about: [
    'I am a 1st-year undergraduate at UC San Diego studying for a bachelors in Artificial Intelligence, with a minor in Math. I think about the intuition of deep learning, geometric deep learning, and mechanistic interpretability.',
    'Most days I am studying for classes and reading fun papers. I also like to learn about new topics that excite me which are in a broad range of possible subjects.',
    'I am loosely part of Sicun Gao\'s lab through Tao Wang, and am also part of Pengtao Xie\'s lab.',
    'Feel free to reach out if you are interested in what I do / want to work together!'
  ],

  research: [
    {
      authors: 'S. Cho, Tao Wang',
      title: '[WIP]',
      venue: 'In preparation',
      links: [['draft', '#'], ['code', '#']],
    },
    {
      authors: 'S. Cho',
      title: '[WIP]',
      venue: 'In preparation',
      links: [['arxiv', '#'], ['poster', '#']],
    },
  ],

  now: [
    `Reading: Bronstein for Geometric Deep Learning, Papers for RL.`,
    `Coding: a project with a friend for more efficient emotional vector steering.`,
    `Taking: CSE151A, CSE100R, and CSE101.`,
    `Around campus: Reading about AI Safety (AIA@UCSD), Working as a Dev for Triton Software Engineering`,
    `Last updated April 2026!`,
  ],

  funFacts: [
    'I am originally from South Korea, but was raised in the US.',
    'I love playing the clarinet! My favorite piece is the Poulenc Sonata.',
    'I am from the Changyeong Cho clan, and am closely related to Cho-Man-Sik.',
    'I love reading Marxist theory, my favorite author probably being Bordiga.',
  ],

  // Blog posts (newest first). `slug` must match a file at posts/<slug>.md
  // (use only letters, digits, dashes, underscores). Omit `slug` to render
  // the title as plain text instead of a link.
  blog: [
    { date: '2026-05-04', title: 'welcome to site',           slug: '2026-05-04-welcome' }
  ],

  // Footer quote. Edit text/author to swap. Set text to '' to hide entirely.
  // imageLeft / imageRight: paths or URLs for decorative images flanking the
  // quote. Use 'uploads/your-file.jpg' for local files. Set to '' to hide.
  // Defaults below are inline SVG placeholders so you can see the layout.
  quote: {
    text: 'The philosophers have only interpreted the world, in various ways; the point, however, is to change it',
    author: 'Karl Marx',
    imageLeft:
      'uploads/leftimage.png', 
    imageRight:
      'uploads/rightimage.png'
  },
};

window.CONTENT = CONTENT;
