const welcomePoem = {
  poemId: "welcome",
  creatorUserId: "YYCGsmUWtZSMK15u9NXPX1L965y1",
  title: "Welcome",
  author: "Andrew Ko",
  createdDate: 1640963500000,
  flags: {
    disallowEdit: true,
    disallowEditReason: `This poem can not be edited`,
    isPublic: true,
  },
  details: [
    ["Dedicated To", "You"],
    ["Rhyming Scheme", "limerick"],
    ["Poem Type", "rhymed poetry"],
  ],
  context: "Welcome poem for WikiMuse",
  links: [{
    title: 'WikiMuse',
    url: "http://wikimuse.org",
  }],
  content: "\
Welcome to the WikiMuse\n\
a place for all to come peruse\n\
to share, create,\n\
collaborate\n\
it's truly up to you to choose\n\
"
}

const testPoem = {
  poemId: "coded1",
  creatorUserId: "YYCGsmUWtZSMK15u9NXPX1L965y1",
  title: "Mom",
  author: "Andrew Ko",
  createdDate: 1629514800000,
  flags: {
    disallowEdit: true,
    disallowEditReason: `This poem can not be edited`,
    isPublic: true,
  },
  details: [
    ["Dedicated To", "Oiyin Pauline Chow"],
    ["Foot", "iamb"],
    ["Meter", "heptameter"],
    ["Rhyming Scheme", "coupled rhyme"],
    ["Poem Type", "rhymed poetry"],
  ],
  context: "This poem is dedicated to my mother who had a long and fulfilling career as a mathematics professor.  Her numerous accomplishments can be found in her obituary link.",
  links: [{
    title: 'Obituary',
    url: "http://www.legacy.com/Link.asp?I=LS000199311211X",
  }],
  annotations: [
    {
      sections: [
        [9, 18, 25],
        [10, 5, 12],
      ],
      explanation: "These are computer science terms, a field closely related to mathematics.  My mother was actually the first to teach me to code, in Q-Basic many years ago",
    },
    {
      sections: [
        [13, 22, 28],
        [13, 29, 36],
      ],
      explanation: "An extra rhyme here for fun",
    },
    {
      sections: [
        [16, 15, 21],
        [16, 51, 66],
      ],
      explanation: "My mom's students said she was like the unquestionable captain of the classroom.",
    },
    {
      sections: [
        [16, 32, 39],
      ],
      explanation: "Complexity theory is a field of computer science and mathematics",
    },
    {
      sections: [
        [16, 51, 66],
      ],
      explanation: "My mom was the first of her siblings to come to the US across the Pacific.",
    },
    {
      sections: [
        [19, 15, 20],
        [19, 25, 34],
      ],
      explanation: "An almost-rhyme here",
    },
    {
      sections: [
        [21, 2, 10],
        [21, 29, 34],
        [22, 22, 26],
      ],
      explanation: "My mom was a first generation American and always remembered that she came as an immigrant",
    },
    {
      sections: [
        [21, 46, 54],
      ],
      explanation: "Topology is a field of math related to geometrical figures, such as the Earth's spherical structure",
    },
    {
      sections: [
        [22, 4, 11],
      ],
      explanation: "Span is a term from linear algebra",
    },
    {
      sections: [
        [25, 44, 57],
      ],
      explanation: "My mom was deaf in her left ear.",
    },
    {
      sections: [
        [25, 44, 57],
        [27, 40, 46],
      ],
      explanation: "More sensory themes.  My mom also had poor eyesight and relied on glasses.",
    },
  ],
  content: "\
in time they say, the pain will fade and sadness drifts away\n\
yet every time I feel regret, I think what mom would say\n\
\n\
when I was young, I dropped a dish, it shattered on the floor\n\
she asked me why I cried and said we can't go back before\n\
\n\
what's done is done, we must move on, so pick the pieces up\n\
and if that was our very best, then hold your head high up\n\
\n\
so practical, her methods and the way she chose her path\n\
it's logical, in looking back, I see why she chose math\n\
\n\
she knew that people's number struggles cause an endless strife\n\
and overcoming mental blocks unlocks careers in life\n\
\n\
there was no soul she could not touch within her classroom realm\n\
for though the depths are quite complex, my mother manned the helm\n\
\n\
she taught through all the ups and downs, to any age or creed\n\
with chalk and jokes and anecdotes, a guiding force indeed\n\
\n\
a language shared across the world, that vast topology\n\
she spanned it like a flag unfurled through new technology\n\
\n\
her life was not an easy one, with obstacles abound\n\
to teach in a non-native tongue, a distant, foreign sound\n\
\n\
but though my mom can't be with us, her vision stays yet true\n\
may those who still remember her, embrace her passion too\n\
\n\
\"empowerment\", it was her goal for what more can we give\n\
but chances for the ones we love, the chance for dreams to live\n\
\n",
};

export const ALL_CODED_POEMS = [
  welcomePoem,
  testPoem,
];
