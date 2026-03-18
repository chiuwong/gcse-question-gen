export interface SubjectTopic {
  name: string;
  topics: string[];
}

export const SUBJECTS: SubjectTopic[] = [
  {
    name: "Geography (Edexcel B)",
    topics: [
      "Tectonic Hazards",
      "Weather Hazards",
      "Climate Change",
      "Ecosystems",
      "Fieldwork",
      "Urban Issues",
      "Resource Management",
      "Development & Globalisation",
    ],
  },
  {
    name: "History – 1B: Elizabethan Age (WJEC)",
    topics: [
      "Elizabeth's Government & Court",
      "Religious Settlement",
      "Mary Queen of Scots",
      "Plots & Rebellions",
      "The Spanish Armada",
      "Poverty & Exploration",
      "Culture & Entertainment",
    ],
  },
  {
    name: "History – 1G: Germany in Transition (WJEC)",
    topics: [
      "Weimar Republic & Its Problems",
      "Rise of the Nazi Party",
      "Hitler's Consolidation of Power",
      "Nazi Economic Policy",
      "Nazi Social Policy",
      "Persecution & the Holocaust",
      "Opposition to Nazi Rule",
    ],
  },
  {
    name: "History – 2A: USA 1929–2000 (WJEC)",
    topics: [
      "The Great Depression",
      "The New Deal",
      "Post-War Prosperity",
      "Civil Rights Movement",
      "Vietnam War",
      "Social & Cultural Change",
      "Reagan & End of Cold War",
    ],
  },
  {
    name: "History – 2E: Crime & Punishment (WJEC)",
    topics: [
      "Crime & Punishment in the Medieval Period",
      "Crime & Punishment in the Early Modern Period",
      "Crime & Punishment in the Industrial Era",
      "Crime & Punishment in the 20th Century",
      "Continuity & Change Over Time",
    ],
  },
  {
    name: "Biology (AQA Trilogy)",
    topics: [
      "Cell Biology",
      "Organisation",
      "Infection & Response",
      "Bioenergetics",
      "Homeostasis & Response",
      "Inheritance & Evolution",
      "Ecology",
    ],
  },
  {
    name: "Chemistry (AQA Trilogy)",
    topics: [
      "Atomic Structure & Periodic Table",
      "Bonding, Structure & Properties",
      "Quantitative Chemistry",
      "Chemical Changes",
      "Energy Changes",
      "Rate & Extent of Chemical Change",
      "Organic Chemistry",
      "Chemical Analysis",
    ],
  },
  {
    name: "Physics (AQA Trilogy)",
    topics: [
      "Energy",
      "Electricity",
      "Particle Model of Matter",
      "Atomic Structure",
      "Forces",
      "Waves",
      "Magnetism & Electromagnetism",
    ],
  },
  {
    name: "Maths (AQA)",
    topics: [
      "Number",
      "Algebra",
      "Ratio, Proportion & Rates of Change",
      "Geometry & Measures",
      "Probability",
      "Statistics",
      "Quadratics",
      "Vectors",
      "Trigonometry",
    ],
  },
  {
    name: "English Language (AQA)",
    topics: [
      "Reading Fiction – Implicit Meanings",
      "Reading Non-Fiction – Comparison",
      "Language Analysis",
      "Structure Analysis",
      "Narrative Writing",
      "Descriptive Writing",
      "Transactional/Persuasive Writing",
    ],
  },
  {
    name: "Spanish (AQA)",
    topics: [
      "Identity & Culture",
      "Local, National & Global Areas of Interest",
      "Current & Future Study & Employment",
      "Grammar – Tenses",
      "Translation",
      "Reading Comprehension",
    ],
  },
];

export const MARK_OPTIONS = [2, 4, 6, 8, 12];
