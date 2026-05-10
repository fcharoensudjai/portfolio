export interface AboutSequenceItem {
  id: string;
  title: string;
  paragraphs: string[];
  image: {
    src: string;
    alt: string;
  };
}

export const aboutSequenceItems: AboutSequenceItem[] = [
  {
    id: "01",
    title: "hi, i'm fasai",
    paragraphs: [
      "Born and raised in Bangkok, Thailand, I grew up around a very diverse mix of people and perspectives.",
      "I’ve always been into art in some form. Drawing, games, anything that just looked good and felt good, even if I didn’t really know why at the time.",
    ],
    image: {
      src: "/images/about.png",
      alt: "Portrait of Fasai",
    },
  },
  {
    id: "02",
    title: "my journey",
    paragraphs: [
      "I moved to the UK to study Economics at the University of Warwick, and ended up staying to explore my own career.",
      "That shift changed my environment and pace, and introduced a different way of thinking about what I wanted to do.",
    ],
    image: {
      src: "/images/about.png",
      alt: "Transition and growth visual",
    },
  },
  {
    id: "03",
    title: "what i'm up to",
    paragraphs: [
      "I now work across finance and tech as a finance strategy consultant in London, helping CFOs reimagine their finance functions.",
      "Most of my time is spent working with data, building internal tools as a UX and front-end engineer, and figuring out how things actually get used.",
    ],
    image: {
      src: "/images/about.png",
      alt: "Finance and technology workflow visual",
    },
  },
  {
    id: "04",
    title: "outside of work",
    paragraphs: [
      "Outside of that, I still spend a lot of time around art.",
      "I draw (all pieces on here are my illustrations!), play games, and pay a bit too much attention to how things look and feel — whether that’s in a game, a UI, or something small that’s well put together.",
    ],
    image: {
      src: "/images/about.png",
      alt: "Personal interests visual",
    },
  },
  {
    id: "05",
    title: "this site",
    paragraphs: [
      "This site is my creative outlet.",
      "It’s where I can experiment, try things out, and build in a way that feels more personal, without overthinking it too much.",
      "It also gives me a space to bring art, design, and the technical side of things together in a way that feels true to myself.",
    ],
    image: {
      src: "/images/about.png",
      alt: "Portfolio purpose visual",
    },
  },
];
