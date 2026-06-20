const CONTENT = {
  name: 'Sungwoo Cho',
  role: 'AI @ UC San Diego',
  address: [
    'UC San Diego',
    '9500 Gilman Drive',
    'La Jolla, CA 92093',
  ],
  email: 'solomon@ucsd.edu',
  emailAlt: 'sungwoocho2007@gmail.com',
  cv: '67',
  // Set to '' for hiding the buttons
  github:  'https://github.com/scmaster2007',
  twitter: '',

  about: [
    'I am a 1st-year undergraduate at UC San Diego pursuing a bachelors in Artificial Intelligence and a Minor in Pure Mathematics. I enjoy thinking about the intuition of deep learning, math, and mechanistic interpretability.',
    'Most days I am studying for classes and reading fun papers. I also like to learn about new topics that excite me, which oftentimes all occupy a broad domain of different subjects.',
    'Right now I\'m working with Tao Wang under Sicun Gao\'s group, and also used to work in Pengtao Xie\'s lab. I (occasionally) do research independently.',
    'Feel free to reach out if you are interested in what I do or want to work together!'
  ],

  research: [
    {
      authors: 'S. Cho*, Tao Wang, Sicun Gao',
      title: 'In preparation',
      venue: '',
      links: [],
    },
    {
      authors: 'S. Cho*',
      title: 'In preparation',
      venue: '',
      links: [],
    },
  ],

  now: [
    `Reading: There will be a scientific theory of deep learning.`,
    `Working: on my papers!`,
    `Taking: CSE30, CSE100R, CSE101, and CSE151A. `,
    `**P.S. Scroll all the way down!**`,
  ],

  funFacts: [
    'I am originally from South Korea, but was raised in the US.',
    'I love playing the clarinet (been playing it for over 9 years!) My favorite piece is the Poulenc Sonata.',
    'I like to learn about esoteric knowledge specifically related to Judaism, Kabbalah, and Hermeticism. I promise I\'m not a LARPer, I\'ve read the Zohar! ',
    'I enjoy reading books about contemporary and political philosophy.',
  ],


  // Categories for the full blog page (blog.html).
  blogCategories: ['Notes', 'Theories', 'Philosophy', 'Science', 'Updates', 'Personal'],

  blog: [
	{ date: '2026-06-10', title: 'A Proof Regarding the Necessity of TzimTzum', slug: 'einsof', category: 'Philosophy'},
  
    { date: '2026-05-27', title: 'ToSV Part 1', slug: 'ToSVx1_notes', category: 'Notes'},

  { date: '2026-05-25', title: 'AGI and Labor', slug: 'agiandlabor', category: 'Theories'},

  { date: '2026-05-24', title: 'On Encrypted Posts', slug: 'onencryptedposts', category: 'Updates' },

  { date: '2026-05-06', title: 'test', slug: '260506test1', locked: true, category: 'Personal'},

  { date: '2026-05-04', title: 'greetings', slug: '2026-05-04-welcome', category: 'Updates' },

  
],

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
