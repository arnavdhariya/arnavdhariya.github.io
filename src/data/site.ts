export const site = {
  name: 'Arnav Dhariya',
  title: 'Arnav Dhariya · Database Systems & Agentic AI',
  description:
    'Undergraduate researcher at UC Irvine (B.S. Computer Science, June 2027) working on data privacy and deletion, distributed vector search, and agentic AI infrastructure. Seeking PhD programs starting in fall 2027 and a summer 2027 internship.',
  url: 'https://arnavdhariya.github.io',
  email: 'dhariyaa@uci.edu',
  formEmail: 'arnavdhariya24@gmail.com',
  links: {
    scholar: 'https://scholar.google.com/citations?user=jzSG8DgAAAAJ&hl=en',
    github: 'https://github.com/arnavdhariya',
    linkedin: 'https://www.linkedin.com/in/arnav-dhariya-3a2441241/',
    x: 'https://x.com/dhariyaar/',
  },
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
