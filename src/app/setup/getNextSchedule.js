import { GoogleGenerativeAI } from "@google/generative-ai";
const genAI = new GoogleGenerativeAI("AIzaSyA9Qcf_c6YETaAbttvWUCQWNKxbGlF45VQ");
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

async function createSch(syllabus,start_date,end_date,hours,cur_start,cur_end,completed){
    let prompt = ``;
    prompt+=syllabus;
    prompt+=`you are given the syllabus and course details of all courses in the array. the student should learn all the course in from ${start_date} to ${end_date}. Create a schedule for studying the course thought the time specified where each day the student has ${hours} to study. The schedule should specify the date, the course name and the topics for said day that the student should study. And for each topic there should also be a recommended time to study said topic in minutes. the schedule and allotted time should be specified based on the difficulty of the topic/course and the credit for the course. Make sure all the given courses the student will study to completion after the period specified.All course should have about an uniform progress. give the schedule for the next 10 days , start date ${cur_start} and end date ${cur_end}` ;
    prompt+=`the completed topics are : ${completed}`;
    prompt+=`[
        {
        "date": "2024-12-21",
        "courses": [
        {
        "course_name": "Course 1",
        "topics": [
        {
        "topic_name": "Introduction to Course 1",
        "time": "2 hour"
        }
        ]
        }
        ]
        }
        ]
        give  output like this with just the schedule array without any other additional text`;
        const response = await model.generateContent(prompt); // Wait for the Promise to resolve
        try {
          // Access the correct part of the response (candidates) // This will log the candidates (or data you need)
          return response.response.object; // Return the candidates (or any desired data)
        } catch (error) {
          console.error("Error:", error); // Handle any error that might occur
        }
c        
    } 
// console.log(await createSch(`[
//     {
//       "course_name": "Computer Graphics and Image Processing",
//       "credits": 4,
//       "modules": [
//         {
//           "module_name": "Basics of Computer Graphics and Algorithms",
//           "hours": 9,
//           "topics": [
//             "Basics of Computer Graphics and applications",
//             "Refresh Cathode Ray Tubes",
//             "Random Scan Displays and systems",
//             "Raster scan displays and systems",
//             "DDA line drawing Algorithm",
//             "Bresenham’s line drawing algorithm",
//             "Midpoint Circle generation algorithm",
//             "Bresenham’s Circle generation algorithm",
//             "Illustration of line drawing and circle drawing algorithms"
//           ]
//         },
//         {
//           "module_name": "Filled Area Primitives and transformations",
//           "hours": 9,
//           "topics": [
//             "Filled Area Primitives-Scan line polygon filling, Boundary filling and flood filling",
//             "Two dimensional transformations-Translation, Rotation, Scaling, Reflection and shearing",
//             "Composite transformations",
//             "Matrix representations and homogeneous coordinates",
//             "Basic 2D transformations-Translation and scaling",
//             "Basic 2D transformations-Rotation and Scaling",
//             "Reflection and Shearing",
//             "Composite transformations",
//             "Matrix representations and homogeneous coordinates",
//             "Basic 3D transformations-Translation and scaling",
//             "Basic 3D transformation-Rotation"
//           ]
//         },
//         {
//           "module_name": "Clipping and Projections",
//           "hours": 8,
//           "topics": [
//             "Window to viewport transformation",
//             "Cohen Sutherland Line clipping algorithm",
//             "Sutherland Hodgeman Polygon clipping algorithm",
//             "Three dimensional Clipping algorithms",
//             "Practice problems on clipping pipelines",
//             "Projections-Parallel projections",
//             "Perspective projections",
//             "Visible surface detection algorithms-Depth buffer algorithm",
//             "Scan line visible surface detection algorithm"
//           ]
//         },
//         {
//           "module_name": "Fundamentals of Digital Image Processing",
//           "hours": 8,
//           "topics": [
//             "Introduction to fundamentals of digital image processing",
//             "Image representation in Gray scale",
//             "Binary image and Colour as a 2D data",
//             "Components of Gray level",
//             "Fundamentals of spatial domain operations-Sampling and quantization, Spatial and Gray Level Resolution",
//             "Basic relationship between pixels – neighbourhood, adjacency, connectivity",
//             "Illustration of basic relationship between pixel – neighbourhood, adjacency, connectivity",
//             "Fundamentals of spatial domain – Convolution operation",
//             "Illustration of Convolution operation"
//           ]
//         },
//         {
//           "module_name": "Image Enhancement in Spatial domain and Image Segmentation",
//           "hours": 11,
//           "topics": [
//             "Basic gray level transformation functions",
//             "Log transformations",
//             "Power-law transformations",
//             "Contrast stretching",
//             "Histogram equalization",
//             "Basics of spatial filtering",
//             "Smoothing spatial filter",
//             "Linear and nonlinear filters",
//             "Sharpening spatial filter-Gradient filter",
//             "Laplacian spatial filter",
//             "Fundamentals of Image Segmentation",
//             "Basics of Intensity thresholding",
//             "Fundamental of Thresholding",
//             "Region Based Approach",
//             "Region Growing",
//             "Region Splitting and Merging",
//             "Edge Detection",
//             "Sobel and Prewitt edge detection masks"
//           ]
//         }
//       ]
//     },
//     {
//       "course_name": "Comprehensive Course work",
//       "credits": 1,
//       "modules": [
//         {
//           "module_name": "Discrete Mathematical Structures",
//           "hours": 14,
//           "topics": [
//             "Mock Test on Module 1 and Module 2",
//             "Mock Test on Module 3, Module 4 and Module 5"
//           ]
//         },
//         {
//           "module_name": "Data Structures",
//           "hours": 10,
//           "topics": [
//             "Mock Test on Module 1, Module 2 and Module 3",
//             "Mock Test on Module 4 and Module 5"
//           ]
//         },
//         {
//           "module_name": "Operating Systems",
//           "hours": 10,
//           "topics": [
//             "Mock Test on Module 1 and Module 2",
//             "Mock Test on Module 3, Module 4 and Module 5",
//             "Feedback and Remedial"
//           ]
//         },
//         {
//           "module_name": "Computer Organization and Architecture",
//           "hours": 10,
//           "topics": [
//             "Mock Test on Module 1, Module 2 and Module 3",
//             "Mock Test on Module 4 and Module 5"
//           ]
//         },
//         {
//           "module_name": "Database Management Systems",
//           "hours": 10,
//           "topics": [
//             "Mock Test on Module 1, Module 2 and Module 3",
//             "Mock Test on Module 4 and Module 5"
//           ]
//         },
//         {
//           "module_name": "Formal Languages and Automata Theory",
//           "hours": 11,
//           "topics": [
//             "Mock Test on Module 1, Module 2 and Module 3",
//             "Mock Test on Module 4 and Module 5",
//             "Feedback and Remedial"
//           ]
//         }
//       ]
//     },
//     {
//       "course_name": "Compiler Design",
//       "credits": 4,
//       "modules": [
//         {
//           "module_name": "Introduction to compilers and lexical analyzer",
//           "hours": 8,
//           "topics": [
//             "Analysis of the source program",
//             "Phases of the compiler – Analysis and synthesis phases",
//             "Phases of the Compiler – Analysis Phases",
//             "Symbol Table Manager, Error Handler",
//             "Compiler writing tools, bootstrapping",
//             "The role of Lexical analyzer, Input Buffering",
//             "Specification of Tokens",
//             "Recognition of Tokens"
//           ]
//         },
//         {
//           "module_name": "Introduction to Syntax Analysis",
//           "hours": 10,
//           "topics": [
//             "Role of the Syntax Analyser",
//             "Syntax error handling",
//             "Review of Context Free Grammars",
//             "Parse trees and Derivations",
//             "Grammar transformations",
//             "Eliminating ambiguity",
//             "Left factoring the grammar",
//             "Eliminating left recursion",
//             "Recursive Descent parsing",
//             "Predictive Parsing table constructor",
//             "LL(1) Grammars"
//           ]
//         },
//         {
//           "module_name": "Bottom up parsing",
//           "hours": 9,
//           "topics": [
//             "Bottom up parsing",
//             "Handle Pruning",
//             "Shift Reduce Parsing",
//             "Operator precedence parsing (Concept only)",
//             "LR parsing",
//             "SLR Parser,Canonical collection of LR(0) items",
//             "Augmented Grammar Construction",
//             "SLR Parser Table Construction",
//             "Constructing Canonical LR Parsing Tables",
//             "Constructing LALR Parsing Tables",
//             "LALR Parser"
//           ]
//         },
//         {
//           "module_name": "Syntax directed translation and intermediate code generation",
//           "hours": 9,
//           "topics": [
//             "Syntax directed translation",
//             "Syntax directed definitions",
//             "S-attributed definitions",
//             "S-attributed definitions – I, S-attributed definitions",
//             "Source Language Issues",
//             "Storage organization",
//             "Intermediate languages",
//             "Graphical representations",
//             "Three-address code",
//             "Quadruples, Triples"
//           ]
//         },
//         {
//           "module_name": "Code Optimization and Generation",
//           "hours": 9,
//           "topics": [
//             "Code Optimization",
//             "Principal sources of optimization",
//             "Machine dependent machine independent optimizations",
//             "Local optimizations",
//             "Global optimizations",
//             "Machine dependent optimizations",
//             "Issues in the design of a code generator – Lecture 1",
//             "Issues in the design of a code generator – Lecture 2",
//             "Target Language",
//             "Design of a simple code generator"
//           ]
//         }
//       ]
//     },
//     {
//       "course_name": "Programming in Python",
//       "credits": 3,
//       "modules": [
//         {
//           "module_name": "Programming Environment and Python Basics",
//           "hours": 6,
//           "topics": [
//             "Getting started with Python programming",
//             "Interactive shell, IDLE, IPython Notebooks",
//             "Notebooks, Deleting and correcting syntax error",
//             "How Python works",
//             "The software development process – A case study",
//             "Basic coding skills",
//             "Strings, assignment, and comments",
//             "Numeric data types and character sets",
//             "Expressions, Using inbuilt functions with modules",
//             "Control statements",
//             "For loop, Formatting text for output",
//             "Selection structure (if, switch-case), Conditional execution with output",
//             "while loop",
//             "Testing the control statements",
//             "Lazy evaluation"
//           ]
//         },
//         {
//           "module_name": "Building Python Programs",
//           "hours": 8,
//           "topics": [
//             "Strings and methods",
//             "Accessing characters, substrings",
//             "Data encryption",
//             "Strings and number system",
//             "String slicing, String methods, sub-string",
//             "Text Files",
//             "Functions as Abstraction Mechanisms",
//             "Problem solving with recursive functions",
//             "Managing a program’s namespace",
//             "Higher-Order Functions",
//             "Lists and basic operations",
//             "Functions, List of lists, Slicing, Searching, Sorting lists",
//             "List comprehension",
//             "Work with tuples",
//             "Sets",
//             "Work with dates and times",
//             "A case study with lists",
//             "Dictionaries",
//             "Dictionaries",
//             "Adding and removing keys",
//             "Dictionary functions",
//             "Dictionary functions",
//             "Traversing dictionaries",
//             "Reverse lookup",
//             "Case study – Data Structure Selection"
//           ]
//         },
//         {
//           "module_name": "Graphics",
//           "hours": 7,
//           "topics": [
//             "Graphics",
//             "Simple Graphics using Turtle",
//             "Operations",
//             "2D Shapes",
//             "Colors and RGB Systems",
//             "A case study",
//             "Image Processing",
//             "Basic image processing with inbuilt functions",
//             "Graphical User Interfaces",
//             "Event-driven programming",
//             "Coding simple GUI-based programs",
//             "Windows, Labels, Displaying images",
//             "Coding simple GUI-based programs",
//             "Input text entry",
//             "Popup dialog boxes",
//             "Command buttons",
//             "A case study"
//           ]
//         },
//         {
//           "module_name": "Object Oriented Programming",
//           "hours": 7,
//           "topics": [
//             "Design with classes",
//             "Objects and Classes",
//             "Methods, Instance Variables",
//             "Constructor, Accessors, and Mutators",
//             "Structuring classes with inheritance",
//             "Polymorphism",
//             "Abstract Classes",
//             "Interfaces",
//             "Exceptions",
//             "Handle a single exception",
//             "Handle multiple exceptions"
//           ]
//         },
//         {
//           "module_name": "Data Processing",
//           "hours": 9,
//           "topics": [
//             "The ‘numpy’ and ‘pandas’ modules",
//             "Basics, Creating arrays",
//             "Arithmetic, Slicing, Matrix Operations, Random numbers",
//             "Plotting and visualization",
//             "Matplotlib",
//             "Basic plots",
//             "Ticks, Labels, and Legends",
//             "Working with CSV files",
//             "Pandas",
//             "Reading, Manipulating",
//             "Processing Data and Visualizing",
//             "Introduction to Microservices using Flask",
//             "Introduction to Microservices using Flask",
//             "Introduction to Microservices using Flask"
//           ]
//         }
//       ]
//     },
//     {
//       "course_name": "Algorithm Analysis and Design",
//       "credits": 4,
//       "modules": [
//         {
//           "module_name": "Introduction to Algorithm Analysis",
//           "hours": 9,
//           "topics": [
//             "Characteristics of Algorithms",
//             "Criteria for Analysing Algorithms",
//             "Time and Space Complexity",
//             "Worst and Average Case complexities",
//             "Asymptotic Notions",
//             "Big –O(Big Oh), Big –Ω(Big Omega), Big –Θ(Big Theta), Little –o(Little oh) and Little –ω(Little omega)",
//             "Their properties",
//             "Classifying functions by their asymptotic growth rate",
//             "Time and Space Complexity Calculation of algorithms/code segments",
//             "Analysis of Recursive Algorithms",
//             "Recurrence Equations",
//             "Solving Recurrence Equations",
//             "Iteration Methods",
//             "Recursion Tree Method",
//             "Substitution method and Master’s Theorem (Proof not required)"
//           ]
//         },
//         {
//           "module_name": "Advanced Data Structures and Graph Algorithms",
//           "hours": 10,
//           "topics": [
//             "Self Balancing Tree – AVL Trees (insertion and deletion operations with all rotations in detail)",
//             "AVL Trees",
//             "Insertions and Illustration",
//             "AVL Tree Deletion and Illustration",
//             "Disjoint set operations",
//             "Union and find algorithms",
//             "Graph Algorithms and traversal, Analysis",
//             "Illustration of BFS and find algorithms",
//             "DFS traversal, Analysis",
//             "Strongly connected components of a Directed graph",
//             "Topological Sorting"
//           ]
//         },
//         {
//           "module_name": "Divide & Conquer and Greedy Method",
//           "hours": 8,
//           "topics": [
//             "Divide and Conquer",
//             "The Control Abstraction",
//             "2-way Merge Sort",
//             "Analysis",
//             "Strassen’s Algorithm for Matrix Multiplication",
//             "Analysis",
//             "Greedy Strategy",
//             "The Control Abstraction",
//             "Triangular Knapsack Problem",
//             "Minimum Cost Spanning Tree (Computation, Kruskal’s Algorithm, Analysis)",
//             "Single Source Shortest Path Algorithm – Dijkstra’s Algorithm",
//             "Illustration of Dijkstra’s Algorithm, Analysis"
//           ]
//         },
//         {
//           "module_name": "Dynamic Programming, Back Tracking and Branch and Bound",
//           "hours": 8,
//           "topics": [
//             "Dynamic Programming",
//             "The Control Abstraction",
//             "The Optimality Principle",
//             "Matrix Chain Multiplication-Analysis",
//             "Illustration of Matrix Chain Multiplication-Analysis",
//             "All Pairs, Shortest Paths Algorithm and illustration of Floyd-Warshall Algorithm",
//             "Back Tracking",
//             "The Control Abstraction",
//             "Back Tracking",
//             "The Control Abstraction – The N Queen’s Problem",
//             "Branch and Bound",
//             "Travelling salesman problem"
//           ]
//         },
//         {
//           "module_name": "Introduction to Complexity Theory",
//           "hours": 10,
//           "topics": [
//             "Introduction to Complexity Theory",
//             "Tractable and Intractable Problems",
//             "Complexity Classes – P, NP, NP-Complete Problems",
//             "NP-Hard and NP-Complete Problems",
//             "NP Completeness Proof of Clique Problem",
//             "NP Completeness Proof of Vertex Cover Problem",
//             "Approximation algorithms-Bin Packing Algorithm and Illustration",
//             "Graph Colouring Algorithm and Illustration",
//             "Randomized Algorithms (definitions of Monte Carlo and Las Vegas algorithms)",
//             "Randomized Version of Quick Sort Algorithm with Analysis",
//             "Illustration of Randomized Version of Quick Sort Algorithm with Analysis"
//           ]
//         }
//       ]
//     },
//     {
//       "course_name": "Industrial Economics & Foreign Trade",
//       "credits": 3,
//       "modules": [
//         {
//           "module_name": "Basic Concepts and Demand & Supply Analysis",
//           "hours": 7,
//           "topics": [
//             "Scarcity and choice",
//             "Basic economic problems",
//             "PPC",
//             "Firms and its objectives",
//             "Types of firms",
//             "Utility – Law of diminishing marginal utility",
//             "Demand – Law of demand",
//             "Measurement of elasticity and its applications",
//             "Supply – Law of supply and determinants of supply",
//             "Equilibrium – changes in demand and supply and its effects",
//             "Consumer surplus and producer surplus (Concepts)",
//             "Taxation and deadweight loss"
//           ]
//         },
//         {
//           "module_name": "Production and cost",
//           "hours": 7,
//           "topics": [
//             "Production function – Law of variable proportions",
//             "Economies of scale – Internal and external economies",
//             "Producers equilibrium – Expansion path",
//             "Technical progress and its implication – Cobb Douglas Production function",
//             "Cost concepts – social cost, private cost and external cost",
//             "Explicit and implicit cost",
//             "Short run cost curves",
//             "Long run cost curves",
//             "Revenue concepts – shutdown point – Break-even point"
//           ]
//         },
//         {
//           "module_name": "Market Structure",
//           "hours": 6,
//           "topics": [
//             "Perfect and imperfect competition",
//             "Regulation of monopoly",
//             "Monopolistic competition (features and equilibrium of a firm)",
//             "MR approach and TC – TR approach",
//             "Monopoly – Regulation of monopoly",
//             "Monopolistic competition",
//             "Oligopoly – Kinked demand curve",
//             "Collusive oligopoly (meaning)",
//             "Non-price competition",
//             "Predatory pricing",
//             "Going rate pricing",
//             "Price skimming",
//             "Penetration – price skimming"
//           ]
//         },
//         {
//           "module_name": "Macroeconomic concepts",
//           "hours": 7,
//           "topics": [
//             "Circular flow of economic activities",
//             "Stock and flow",
//             "Final goods and intermediate goods",
//             "Gross Domestic Product – National Income",
//             "Three sectors of an economy",
//             "Methods of measuring national income",
//             "Inflation – Demand pull and cost push",
//             "Causes and effects",
//             "Measures to control inflation",
//             "Monetary and fiscal policies",
//             "Business financing",
//             "Bonds and shares",
//             "Money market and capital market",
//             "Stock market – Demat account and Trading account",
//             "SENSEX and NIFTY"
//           ]
//         },
//         {
//           "module_name": "International Trade",
//           "hours": 8,
//           "topics": [
//             "Advantages and disadvantages of international trade",
//             "Absolute and comparative advantage theory",
//             "Heckscher – Ohlin theory",
//             "Balance of payments – Components",
//             "Balance of payments deficit and devaluation",
//             "Trade policy",
//             "Free trade versus protection",
//             "Tariff and non-tariff barriers"
//           ]
//         }
//       ]
//     }
//   ]`,`2024-12-20`,`2025-04-31`,'2 hours',`2024-12-31`,`2025-01-09`,`Analysis of the source program - Analysis and synthesis phases, Phases of a compiler
// Compiler writing tools. Bootstrapping
// Lexical Analysis - Specification of Tokens
// Recognition of Tokens
// Role of the Syntax Analyser – Syntax error handling
// Review of Context Free Grammars - Derivation and Parse Trees
// Eliminating Ambiguity. Basic parsing approaches - Eliminating left recursion, left factoring
// Top-Down Parsing - Recursive Descent parsing, Predictive Parsing, LL(1) Grammars
// Handle Pruning. Shift Reduce parsing. Operator precedence parsing (Concept only). LR parsing
// Constructing SLR, LALR and canonical LR parsing tables
// Syntax directed translation - Syntax directed definitions, S-attributed definitions, L-attributed definitions
// Bottom-up evaluation of S-attributed definitions
// Run-Time Environments - Source Language issues, Storage organization, Storage-allocation strategies
// Intermediate Code Generation - Intermediate languages, Graphical representations, Three-Address code, Quadruples, Triples
// Code Optimization - Principal sources of optimization, Machine dependent and machine independent optimizations, Local and global optimizations
// Code generation - Issues in the design of a code generator, Target Language, A simple code generator
// Characteristics of Algorithms, Criteria for Analysing Algorithms, Time and Space Complexity
// Best, Worst and Average Case Complexities
// Asymptotic Notations - Big-Oh (O), Big- Omega (Ω), Big-Theta (Θ), Little-oh (o) and Little- Omega (ω)
// Classifying functions by their asymptotic growth rate, Time and Space Complexity Calculation of simple algorithms`));