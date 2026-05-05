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

  about: [
    'I am a 1st-year undergraduate at UC San Diego studying for a bachelors in Artificial Intelligence and a Minor in Pure Mathematics. I enjoy thinking about the intuition of deep learning, geometric deep learning, and mechanistic interpretability.',
    'Most days I am studying for classes and reading fun papers. I also like to learn about new topics that excite me which individually occupy a broad domain of distinct subjects.',
    'Right now I am working with Tao Wang under Sicun Gao\'s group, and also used to work in Pengtao Xie\'s lab.',
    'Feel free to reach out if you are interested in what I do / want to work together!'
  ],

  research: [
    {
      authors: 'S. Cho, Tao Wang',
      title: 'MOO in RL is determined by only the value function',
      venue: 'ICLR MAIN 2027',
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
    `Reading: There will be a scientific theory of deep learning.`,
    `Coding: some scripts for our paper`,
    `Taking: CSE30, CSE100R, CSE101, and CSE151A. `,
    `Last updated May 2026!`,
  ],

  funFacts: [
    'I am originally from South Korea, but was raised in the US.',
    'I love playing the clarinet! My favorite piece is the Poulenc Sonata.',
    'I like to learn about esoteric knowledge specifically related to Judaism.',
    'I enjoy reading books about contemporary and political philosophy.',
  ],

  // Blog posts (newest first). `slug` must match a file at posts/<slug>.md
  // (use only letters, digits, dashes, underscores). Omit `slug` to render
  // the title as plain text instead of a link.
  blog: [
    { date: '2026-05-04', title: 'greetings', slug: '2026-05-04-welcome' }
  ],

  // Footer quote. Edit text/author to swap. Set text to '' to hide entirely.
  // imageLeft / imageRight: paths or URLs for decorative images flanking the
  // quote. Use 'uploads/your-file.jpg' for local files. Set to '' to hide.
  // Defaults below are inline SVG placeholders so you can see the layout.
  quote: {
    text: 'Everything in the world depends on desire',
    author: 'Moses de León',
    imageLeft:
      'uploads/leftimage.png', 
    imageRight:
      'uploads/rightimage.png'
  },
};

window.CONTENT = CONTENT;
