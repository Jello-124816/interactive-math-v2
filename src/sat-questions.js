
export const satQuestions = [
  {
    id: 'E001',
    practiceId: 'sat-linear-equations',
    difficulty: 'easy',
    number: 'E001',
    type: 'Linear Equations — Rearranging a Formula',

    blocks: [
      {
        type: 'text',
        content: 'The equation'
      },
      {
        type: 'math',
        content: String.raw`h=\frac{9(v-273.15)}{5}+32`
      },
      {
        type: 'text',
        content: 'gives the corresponding temperature h, in degrees Fahrenheit, of any substance that has a temperature of v kelvins, where v > 0. If a substance has a temperature of 467.33 degrees Fahrenheit, what is its corresponding temperature, in kelvins?'
      }
    ],

    solution: [
      {
        type: 'pdf',
        src: 'solutions/SAT-E-Sol/SAT-E-Sol-01.pdf',
        title: 'SAT Algebra Easy E001 Solution'
      }
    ]
  },

  {
    id: 'E002',
    practiceId: 'sat-linear-equations',
    difficulty: 'easy',
    number: 'E002',
    type: 'Linear Equations — Modeling a Situation',

    blocks: [
      {
        type: 'text',
        content: 'A manufacturing plant makes 10-inch, 9-inch, and 7-inch frying pans. During a certain day, the number of 10-inch frying pans that the manufacturing plant makes is 4 times the number'
      },
      {
        type: 'math',
        content: String.raw`n`
      },
      {
        type: 'text',
        content: 'of 9-inch frying pans it makes, and the number of 7-inch frying pans it makes is 10. During this day, the manufacturing plant makes 100 frying pans total. Which equation represents this situation?'
      },
      {
        type: 'paragraph',
        content: String.raw`A. \(10(4n) + 9n + 7(10) = 100\)`
      },
      {
        type: 'paragraph',
        content: String.raw`B. \(10n + 9n + 7n = 100\)`
      },
      {
        type: 'paragraph',
        content: String.raw`C. \(4n + 10 = 100\)`
      },
      {
        type: 'paragraph',
        content: String.raw`D. \(5n + 10 = 100\)`
      }
    ],

    solution: [
      {
        type: 'pdf',
        src: 'solutions/SAT-E-Sol/SAT-E-Sol-02.pdf',
        title: 'SAT Algebra Easy E002 Solution'
      }
    ]
  },

  {
    id: 'M001',
    practiceId: 'sat-linear-equations',
    difficulty: 'medium',
    number: 'M001',
    type: 'Linear Equations — Word Problems',

    blocks: [
      {
        type: 'text',
        content: 'A batch of banana milkshakes consists of 4 cups of ice cream and 2 bananas and has 1,114 milligrams (mg) of calcium. There is 276 mg of calcium in 1 cup of the ice cream used to make this batch of milkshakes. How much calcium, in mg, is in 1 banana?'
      },
      {
        type: 'paragraph',
        content: 'A. 5'
      },
      {
        type: 'paragraph',
        content: 'B. 10'
      },
      {
        type: 'paragraph',
        content: 'C. 419'
      },
      {
        type: 'paragraph',
        content: 'D. 1,104'
      }
    ],

    solution: [
      {
        type: 'pdf',
        src: 'solutions/SAT-M-Sol/SAT-M-Sol-01.pdf',
        title: 'SAT Algebra Medium Q01 Solution'
      }
    ]
  },

  {
    id: 'M002',
    practiceId: 'sat-linear-equations',
    difficulty: 'medium',
    number: 'M002',
    type: 'Linear Equations — Word Problems',

    blocks: [
      {
        type: 'text',
        content: 'A museum rents tablets to visitors. The museum earns revenue of $14 for each tablet rented for the day. On Wednesday, the museum earned $406 in profit from renting tablets after paying daily expenses of $112. How many tablets did the museum rent on Wednesday? (profit = total revenue − total expenses)'
      }
    ],

    solution: [
      {
        type: 'pdf',
        src: 'solutions/SAT-M-Sol/SAT-M-Sol-02.pdf',
        title: 'SAT Algebra Medium M002 Solution'
      }
    ]
  },

  {
    id: 'M003',
    practiceId: 'sat-linear-equations',
    difficulty: 'medium',
    number: 'M003',
    type: 'Linear Equations — Word Problems',

    blocks: [
      {
        type: 'text',
        content: 'A candle is made of 17 ounces of wax. When the candle is burning, the amount of wax in the candle decreases by 1 ounce every 4 hours. If 6 ounces of wax remain in this candle, for how many hours has it been burning?'
      },
      {
        type: 'paragraph',
        content: 'A. 3'
      },
      {
        type: 'paragraph',
        content: 'B. 6'
      },
      {
        type: 'paragraph',
        content: 'C. 24'
      },
      {
        type: 'paragraph',
        content: 'D. 44'
      }
    ],

    solution: [
      {
        type: 'pdf',
        src: 'solutions/SAT-M-Sol/SAT-M-Sol-03.pdf',
        title: 'SAT Algebra Medium M003 Solution'
      }
    ]
  },

  {
    id: 'H001',
    practiceId: 'sat-linear-equations',
    difficulty: 'hard',
    number: 'H001',
    type: 'Linear Equations — Systems of Equations',

    blocks: [
      {
        type: 'text',
        content: 'Store A sells raspberries for $5.50 per pint and blackberries for $3.00 per pint. Store B sells raspberries for $6.50 per pint and blackberries for $8.00 per pint. A certain purchase of raspberries and blackberries would cost $37.00 at Store A or $66.00 at Store B. How many pints of blackberries are in this purchase?'
      },
      {
        type: 'paragraph',
        content: 'A. 4'
      },
      {
        type: 'paragraph',
        content: 'B. 5'
      },
      {
        type: 'paragraph',
        content: 'C. 8'
      },
      {
        type: 'paragraph',
        content: 'D. 12'
      }
    ],

    solution: [
      {
        type: 'pdf',
        src: 'solutions/SAT-H-Sol/SAT-H-Sol-01.pdf',
        title: 'SAT Algebra Hard H001 Solution'
      }
    ]
  },

  {
    id: 'H002',
    practiceId: 'sat-linear-equations',
    difficulty: 'hard',
    number: 'H002',
    type: 'Linear Equations — Rate of Change',

    blocks: [
      {
        type: 'text',
        content: 'The function'
      },
      {
        type: 'math',
        content: String.raw`F(x)=\frac95(x-273.15)+32`
      },
      {
        type: 'text',
        content: 'gives the temperature, in degrees Fahrenheit, that corresponds to a temperature of x kelvins. If a temperature increased by 2.10 kelvins, by how much did the temperature increase, in degrees Fahrenheit?'
      },
      {
        type: 'paragraph',
        content: 'A. 3.78'
      },
      {
        type: 'paragraph',
        content: 'B. 35.78'
      },
      {
        type: 'paragraph',
        content: 'C. 487.89'
      },
      {
        type: 'paragraph',
        content: 'D. 519.89'
      }
    ],

    solution: [
      {
        type: 'pdf',
        src: 'solutions/SAT-H-Sol/SAT-H-Sol-02.pdf',
        title: 'SAT Algebra Hard H002 Solution'
      }
    ]
  },

  {
    "id": "M004",
    "practiceId": "sat-linear-equations",
    "difficulty": "medium",
    "number": "M004",
    "type": "Linear Equations — Modelling a Situation",
    "blocks": [
      {
        "type": "paragraph",
        "content": "A teacher is creating an assignment worth 70 points. The assignment will consist of questions worth 1 point and questions worth 3 points. Which equation represents this situation, where \\(x\\) represents the number of 1-point questions and \\(y\\) represents the number of 3-point questions?"
      },
      {
        "type": "paragraph",
        "content": "A. \\(4xy = 70\\)"
      },
      {
        "type": "paragraph",
        "content": "B. \\(4(x + y) = 70\\)"
      },
      {
        "type": "paragraph",
        "content": "C. \\(3x + y = 70\\)"
      },
      {
        "type": "paragraph",
        "content": "D. \\(x + 3y = 70\\)"
      }
    ],
    "solution": [
      {
        "type": "pdf",
        "src": "solutions/SAT-M-Sol/SAT-M-Sol-04.pdf",
        "title": "SAT Algebra Medium M004 Solution"
      }
    ]
  },

  {
    "id": "M005",
    "practiceId": "sat-linear-equations",
    "difficulty": "medium",
    "number": "M005",
    "type": "Linear Equations — Modelling a Situation",
    "blocks": [
      {
        "type": "paragraph",
        "content": "One gallon of paint will cover 220 square feet of a surface. A room has a total wall area of \\(w\\) square feet. Which equation represents the total amount of paint \\(P\\), in gallons, needed to paint the walls of the room twice?"
      },
      {
        "type": "paragraph",
        "content": "A. \\(P = \\frac{w}{110}\\)"
      },
      {
        "type": "paragraph",
        "content": "B. \\(P = 440w\\)"
      },
      {
        "type": "paragraph",
        "content": "C. \\(P = \\frac{w}{220}\\)"
      },
      {
        "type": "paragraph",
        "content": "D. \\(P = 220w\\)"
      }
    ],
    "solution": [
      {
        "type": "pdf",
        "src": "solutions/SAT-M-Sol/SAT-M-Sol-05.pdf",
        "title": "SAT Algebra Medium M005 Solution"
      }
    ]
  },

  {
    "id": "M006",
    "practiceId": "sat-linear-equations",
    "difficulty": "medium",
    "number": "M006",
    "type": "Linear Equations — Modelling a Situation",
    "blocks": [
      {
        "type": "paragraph",
        "content": "For a training program, Juan rides his bike at an average rate of 5.7 minutes per mile. Which function \\(m\\) models the number of minutes it will take Juan to ride \\(x\\) miles at this rate?"
      },
      {
        "type": "paragraph",
        "content": "A. \\(m(x) = \\frac{x}{5.7}\\)"
      },
      {
        "type": "paragraph",
        "content": "B. \\(m(x) = x + 5.7\\)"
      },
      {
        "type": "paragraph",
        "content": "C. \\(m(x) = x - 5.7\\)"
      },
      {
        "type": "paragraph",
        "content": "D. \\(m(x) = 5.7x\\)"
      }
    ],
    "solution": [
      {
        "type": "pdf",
        "src": "solutions/SAT-M-Sol/SAT-M-Sol-06.pdf",
        "title": "SAT Algebra Medium M006 Solution"
      }
    ]
  },

  {
    "id": "H003",
    "practiceId": "sat-linear-equations",
    "difficulty": "hard",
    "number": "H003",
    "type": "Linear Equations — Modelling a Situation",
    "blocks": [
      {
        "type": "paragraph",
        "content": "The cost of renting a backhoe for up to 10 days is $270 for the first day and $135 for each additional day. Which of the following equations gives the cost \\(y\\), in dollars, of renting the backhoe for \\(x\\) days, where \\(x\\) is a positive integer and \\(x \\leq 10\\)?"
      },
      {
        "type": "paragraph",
        "content": "A. \\(y = 270x - 135\\)"
      },
      {
        "type": "paragraph",
        "content": "B. \\(y = 270x + 135\\)"
      },
      {
        "type": "paragraph",
        "content": "C. \\(y = 135x + 270\\)"
      },
      {
        "type": "paragraph",
        "content": "D. \\(y = 135x + 135\\)"
      }
    ],
    "solution": [
      {
        "type": "pdf",
        "src": "solutions/SAT-H-Sol/SAT-H-Sol-03.pdf",
        "title": "SAT Algebra Hard H003 Solution"
      }
    ]
  },

  {
    "id": "H004",
    "practiceId": "sat-linear-equations",
    "difficulty": "hard",
    "number": "H004",
    "type": "Linear Equations — Modelling a Situation",
    "blocks": [
      {
        "type": "paragraph",
        "content": "For groups of 25 or more people, a museum charges $21 per person for the first 25 people and $14 for each additional person. Which function \\(f\\) gives the total charge, in dollars, for a group with \\(n\\) people, where \\(n \\geq 25\\)?"
      },
      {
        "type": "paragraph",
        "content": "A. \\(f(n) = 14n + 175\\)"
      },
      {
        "type": "paragraph",
        "content": "B. \\(f(n) = 14n + 525\\)"
      },
      {
        "type": "paragraph",
        "content": "C. \\(f(n) = 35n - 350\\)"
      },
      {
        "type": "paragraph",
        "content": "D. \\(f(n) = 14n + 21\\)"
      }
    ],
    "solution": [
      {
        "type": "pdf",
        "src": "solutions/SAT-H-Sol/SAT-H-Sol-04.pdf",
        "title": "SAT Algebra Hard H004 Solution"
      }
    ]
  },

  {
    "id": "H005",
    "practiceId": "sat-linear-equations",
    "difficulty": "hard",
    "number": "H005",
    "type": "Linear Equations — Modelling a Situation",
    "blocks": [
      {
        "type": "paragraph",
        "content": "The cost to rent a commercial fishing boat from a certain company is $950 for the first 2 hours and an additional $50 per hour for each hour after the first 2 hours. If the total cost to rent the commercial fishing boat from the company for \\(t\\) hours, where \\(t > 2\\), is $1,100, which equation represents this situation?"
      },
      {
        "type": "paragraph",
        "content": "A. \\(950(t - 2) + 50t = 1{,}100\\)"
      },
      {
        "type": "paragraph",
        "content": "B. \\(950(2t) + 50t = 1{,}100\\)"
      },
      {
        "type": "paragraph",
        "content": "C. \\(950 + 50(t - 2) = 1{,}100\\)"
      },
      {
        "type": "paragraph",
        "content": "D. \\(950 + 50(2t) = 1{,}100\\)"
      }
    ],
    "solution": [
      {
        "type": "pdf",
        "src": "solutions/SAT-H-Sol/SAT-H-Sol-05.pdf",
        "title": "SAT Algebra Hard H005 Solution"
      }
    ]
  },

  {
    "id": "H006",
    "practiceId": "sat-linear-equations",
    "difficulty": "hard",
    "number": "H006",
    "type": "Linear Equations — Modelling a Situation",
    "blocks": [
      {
        "type": "paragraph",
        "content": "A chemist studying the impact of salt on a process mixes \\(x\\) kilograms of a low-salt mixture, which is 2% salt by weight, with \\(y\\) kilograms of a high-salt mixture, which is 96% salt by weight, to create 24 kilograms of a mixture that is 4% salt by weight. Which equation represents this situation?"
      },
      {
        "type": "paragraph",
        "content": "A. \\(0.96x + 0.02y = (0.04)(24)\\)"
      },
      {
        "type": "paragraph",
        "content": "B. \\(0.02x + 0.96y = (0.04)(24)\\)"
      },
      {
        "type": "paragraph",
        "content": "C. \\(0.96x + 0.02y = 24\\)"
      },
      {
        "type": "paragraph",
        "content": "D. \\(0.02x + 0.96y = 24\\)"
      }
    ],
    "solution": [
      {
        "type": "pdf",
        "src": "solutions/SAT-H-Sol/SAT-H-Sol-06.pdf",
        "title": "SAT Algebra Hard H006 Solution"
      }
    ]
  },

  {
    "id": "H007",
    "practiceId": "sat-linear-equations",
    "difficulty": "hard",
    "number": "H007",
    "type": "Linear Equations — Modelling a Situation",
    "blocks": [
      {
        "type": "paragraph",
        "content": "In 2010, a swim club had a total of 35 swimmers, each classified as either advanced or intermediate. From 2010 to 2020, the number of advanced swimmers in the club increased by approximately 53%, and the number of intermediate swimmers in the club increased by approximately 44%. The total number of swimmers in the club increased by approximately 49%. Which equation best represents this situation, where \\(a\\) represents the number of advanced swimmers in the club in 2010 and \\(b\\) represents the number of intermediate swimmers in the club in 2010?"
      },
      {
        "type": "paragraph",
        "content": "A. \\(1.53a + 1.49b = 35(1.44)\\)"
      },
      {
        "type": "paragraph",
        "content": "B. \\(1.49a + 0.53b = 35(1.44)\\)"
      },
      {
        "type": "paragraph",
        "content": "C. \\(1.53a + 1.44b = 35(1.49)\\)"
      },
      {
        "type": "paragraph",
        "content": "D. \\(1.44a + 1.53b = 35(1.49)\\)"
      }
    ],
    "solution": [
      {
        "type": "pdf",
        "src": "solutions/SAT-H-Sol/SAT-H-Sol-07.pdf",
        "title": "SAT Algebra Hard H007 Solution"
      }
    ]
  }
];
