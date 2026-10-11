// Newest term first. Titles only, by design.
export const coursework = [
  {
    term: "Fall 2026",
    note: "In progress",
    courses: [
      ["CS 161", "Computer Security"],
      ["CS 162", "Operating Systems and System Programming"],
      ["CS 189", "Introduction to Machine Learning"],
      ["DATA C101", "Data Engineering"],
    ],
  },
  {
    term: "Summer 2026",
    courses: [
      ["UGBA 104", "Introduction to Business Analytics"],
      ["GEOG N130", "Food and the Environment"],
    ],
  },
  {
    term: "Spring 2026",
    courses: [
      ["CS 168", "Introduction to the Internet: Architecture and Protocols"],
      ["CS 186", "Introduction to Database Systems"],
      ["DATA C140", "Probability for Data Science"],
    ],
  },
  {
    term: "Fall 2025",
    courses: [
      ["DATA 144", "Data Mining and Analytics"],
      ["INDENG 142A", "Introduction to Machine Learning and Data Analytics"],
      ["UGBA 135", "Personal Financial Management"],
    ],
  },
  {
    term: "Summer 2025",
    courses: [["CS 61C", "Great Ideas of Computer Architecture (Machine Structures)"]],
  },
  {
    term: "Spring 2025",
    note: "Abroad, Carlos III University of Madrid",
    courses: [
      ["COMM", "Society and the Internet"],
      ["ART HIST", "Spanish Art in Museums"],
      ["SPANISH", "Elementary Spanish I"],
    ],
  },
  {
    term: "Fall 2024",
    courses: [
      ["CS 70", "Discrete Mathematics and Probability Theory"],
      ["CIVENG 100", "Elementary Fluid Mechanics"],
      ["INDENG 120", "Principles of Engineering Economics"],
      ["HISTORY 4A", "The Ancient Mediterranean World"],
      ["NUSCTX 10", "Introduction to Human Nutrition"],
    ],
  },
  {
    term: "Summer 2024",
    courses: [
      ["DATA C100", "Principles and Techniques of Data Science"],
      ["DATA C104", "Human Contexts and Ethics of Data"],
    ],
  },
  {
    term: "Spring 2024",
    courses: [
      ["ENGIN 7", "Introduction to Computer Programming for Scientists and Engineers"],
      ["CIVENG 190", "Special Topics in Civil and Environmental Engineering"],
      ["CIVENG 60", "Structure and Properties of Civil Engineering Materials"],
      ["CIVENG 11", "Engineered Systems and Sustainability"],
    ],
  },
  {
    term: "Fall 2023",
    courses: [
      ["CS 61B", "Data Structures"],
      ["CIVENG 93", "Engineering Data Analysis"],
      ["PHYSICS 7A", "Physics for Scientists and Engineers"],
      ["ITALIAN R5B", "Reading and Composition"],
    ],
  },
  {
    term: "Spring 2023",
    courses: [
      ["DATA C8", "Foundations of Data Science"],
      ["MATH 1B", "Calculus"],
      ["GERMAN 130AC", "Cultures of Migration"],
    ],
  },
  {
    term: "Fall 2022",
    courses: [
      ["CS 61A", "The Structure and Interpretation of Computer Programs"],
      ["MATH 1A", "Calculus"],
      ["CHEM 1A", "General Chemistry"],
    ],
  },
] satisfies { term: string; note?: string; courses: [code: string, title: string][] }[];
