export const site = {
  name: 'Arnav Dhariya',
  title: 'Arnav Dhariya · Database Systems & Agentic AI',
  description:
    'Undergraduate researcher at UC Irvine (B.S. Computer Science, June 2027) working on data privacy and deletion, distributed vector search, and agentic AI infrastructure.',
  url: 'https://arnavdhariya.github.io',
  email: 'dhariyaa@uci.edu',
  formEmail: 'arnavdhariya24@gmail.com',
  links: {
    scholar: 'https://scholar.google.com/citations?user=jzSG8DgAAAAJ&hl=en',
    github: 'https://github.com/arnavdhariya',
    linkedin: 'https://www.linkedin.com/in/arnav-dhariya-3a2441241/',
    medium: 'https://medium.com/@arnavdhariya24',
  },
  mediumUser: 'arnavdhariya24',
};

export const publications = [
  {
    title: 'Inference-Aware & Privacy-Preserving Deletion in Databases',
    venue: 'SIGMOD Workshop · ACM SeQuereDB 2026',
    authors: ['Chakraborty, V.', 'Kaminsky, Y.', 'Dhariya, A.A.', 'Mehrotra, S.', 'Naumann, F.', 'Pandey, S.'],
    abstract:
      'Addresses the challenge of satisfying Right-to-Be-Forgotten requests in a way that preserves differential privacy guarantees while preventing inference leakage. Introduces ILP-based deletion mechanisms evaluated across diverse UCI ML datasets, with a reproducible benchmarking framework for leakage analysis.',
    links: [{ label: 'PDF (arXiv)', href: 'https://arxiv.org/pdf/2604.00326' }],
  },
  {
    title: 'A Systematic Literature Review of Climate Econometrics Research',
    venue: 'SSRN · April 2025',
    authors: ['Freedman, H.', 'Foletta, M.', 'Fernandez, G.', 'Sokolova, V.', 'Dhariya, A.A.', 'van der Hoek, A.', 'Tomlinson, B.'],
    abstract:
      'A systematic review of 300+ climate econometrics papers, evaluating methodological rigor, reproducibility, and the availability of data and code. Synthesizes trends and gaps in the field to inform future reproducible climate research.',
    links: [{ label: 'SSRN', href: 'https://ssrn.com/abstract=6178246' }],
  },
];

export const presentations = [
  {
    title: 'Real Time Occupancy Based Control for Lighting, PPL, and HVAC in Commercial Buildings',
    venue: 'UCI Undergraduate Research Symposium, 2026',
    authors: 'Dhariya, A.A., Kaushal, A., Pandit, R.S., Wang, S., Li, G.P. · CalPlug / Calit2, UC Irvine',
  },
  {
    title: 'Meaningful Data Deletion in Data Processing Pipelines',
    venue: 'UCI Undergraduate Research Symposium, 2025',
    authors: 'Dhariya, A.A., Chakraborty, V., Mehrotra, S. · Department of Computer Science, UC Irvine',
  },
];

export const awards = [
  ['2025, 2026', 'UCI Undergraduate Research Symposium Finalist'],
  ['2025', "Chancellor's Award for Excellence in Undergraduate Research"],
  ['2025–2027', 'UCI UROP Fellow, 2025–2026 and 2026–2027'],
  ['2025', 'Summer Undergraduate Research Program Fellowship ($1,500 Award)'],
  ['2025', 'Calit2 IRT Award, Computer Vision Lab ($2,000)'],
  ['2024–2027', "Dean's Honor List, 6 Quarters (GPA 3.92)"],
];
