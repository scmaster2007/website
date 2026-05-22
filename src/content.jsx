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
  // CV link. Drop your PDF at the path below (e.g. uploads/cv.pdf).
  // Set to '' to hide the CV link.
  cv: 'uploads/cv.pdf',

  about: [
    'I am a 1st-year undergraduate at UC San Diego studying for a bachelors in Artificial Intelligence and a Minor in Pure Mathematics. I enjoy thinking about the intuition of deep learning, geometric deep learning, and mechanistic interpretability.',
    'Most days I am studying for classes and reading fun papers. I also like to learn about new topics that excite me which oftentimes individually occupy a broad domain of distinct subjects.',
    'Right now I am working with Tao Wang under Sicun Gao\'s group, and also used to work in Pengtao Xie\'s lab.',
    'Feel free to reach out if you are interested in what I do / want to work together!'
  ],

  research: [
    {
      authors: 'S. Cho, Tao Wang, Sicun Gao',
      title: 'In preparation',
      venue: 'In preparation',
      links: [['draft', '#'], ['code', '#']],
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
    'I like to learn about esoteric knowledge specifically related to Judaism and the Gematria.',
    'I enjoy reading books about contemporary and political philosophy.',
  ],

  // Blog posts (newest first). `slug` must match a file at posts/<slug>.md
  // (use only letters, digits, dashes, underscores). Omit `slug` to render
  // the title as plain text instead of a link.
  //
  // To make a post password-protected:
  //   1. Open encrypt.html in your browser.
  //   2. Paste your markdown (with front matter), set the shared password,
  //      click Encrypt, copy the output.
  //   3. Save it as posts/<slug>.md.enc (note the .enc suffix).
  //   4. Add the entry below with `locked: true` — the homepage will show
  //      a lock icon instead of the date, and the link will prompt for
  //      the password before rendering.
  //
  //   Example: { date: '2026-05-06', title: 'A private thought',
  //              slug: '2026-05-06-private-thought', locked: true },
  blog: [
	
  { date: '2026-05-07', title: 'Exciting News', slug: '2026-05-07-paper-thoughts' }, 
  { date: '2026-05-06', title: 'locked #1',
      slug: '260506test1', locked: true},
  { date: '2026-05-04', title: 'greetings', slug: '2026-05-04-welcome' },
      
  ],

  // Footer quote. Edit text/author to swap. Set text to '' to hide entirely.
  // imageLeft / imageRight: paths or URLs for decorative images flanking the
  // quote. Use 'uploads/your-file.jpg' for local files. Set to '' to hide.
  // Defaults below are inline SVG placeholders so you can see the layout.
  quote: {
    text: 'Everything in the world depends on desire',
    author: 'The Zohar',
    imageLeft:
      'uploads/leftimage.png', 
    imageRight:
      'uploads/rightimage.png'
  },
};

window.CONTENT = CONTENT;
