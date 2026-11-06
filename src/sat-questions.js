
export const satQuestions = [
  {
    id: 'q01',
    practiceId: 'sat-linear-equations',
    difficulty: 'easy',
    number: 'Q01',
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
        type: 'display-math',
        content: String.raw`\begin{aligned}
h &= \frac{9(v-273.15)}{5}+32\\
h &= 467.33\\
v &= ?
\end{aligned}`
      },
      {
        type: 'display-math',
        content: String.raw`\begin{aligned}
467.33 &= \frac{9(v-273.15)}{5}+32\\[8pt]
467.33-32 &= \frac{9(v-273.15)}{5}\\[8pt]
435.33 &= \frac{9(v-273.15)}{5}\\[8pt]
435.33(5) &= 9(v-273.15)\\[8pt]
2176.65 &= 9(v-273.15)\\[8pt]
\frac{2176.65}{9} &= v-273.15\\[8pt]
241.85 &= v-273.15\\[8pt]
241.85+273.15 &= v\\[8pt]
515 &= v
\end{aligned}`
      }
    ]
  },

  {
    id: 'q02',
    practiceId: 'sat-linear-equations',
    difficulty: 'medium',
    number: 'Q01',
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
        type: 'display-math',
        content: String.raw`\begin{aligned}
&\text{Ice cream: }4\text{ cups}\\
&\text{Bananas: }2\\
&\text{Total calcium: }1114\text{ mg}\\
&\text{Calcium (1 ice cream): }276\text{ mg}\\
&\text{Calcium (1 banana): }?
\end{aligned}`
      },
      {
        type: 'display-math',
        content: String.raw`\begin{aligned}
&\text{Calcium (4 ice cream)}=4(276)=1104\text{ mg}\\[12pt]
&\text{Total calcium}=\text{Calcium (4 ice cream)}\\
&\qquad+\text{Calcium (2 bananas)}\\[12pt]
&\text{Calcium (2 bananas)}\\
&\qquad=\text{Total calcium}-\text{Calcium (ice cream)}\\
&\qquad=1114-1104\\
&\qquad=10\text{ mg}\\[12pt]
&\text{Calcium (1 banana)}=\frac{10}{2}=5\text{ mg}
\end{aligned}`
      },
      {
        type: 'paragraph',
        content: 'Answer: A. 5'
      }
    ]
  },

  {
    id: 'q03',
    practiceId: 'sat-linear-equations',
    difficulty: 'medium',
    number: 'Q02',
    type: 'Linear Equations — Word Problems',

    blocks: [
      {
        type: 'text',
        content: 'A museum rents tablets to visitors. The museum earns revenue of $14 for each tablet rented for the day. On Wednesday, the museum earned $406 in profit from renting tablets after paying daily expenses of $112. How many tablets did the museum rent on Wednesday? (profit = total revenue − total expenses)'
      }
    ],

    solution: [
      {
        type: 'display-math',
        content: String.raw`\begin{aligned}
&\text{Revenue (1 tablet): }\$14\\
&\text{Profit: }\$406\\
&\text{Expenses: }\$112\\
&\text{Tablets rented = ?}\\
&\text{Let no. of tablets rented = }x.
\end{aligned}`
      },
      {
        type: 'display-math',
        content: String.raw`\begin{aligned}
&\text{Revenue (x tablets)}=14x\\[14pt]
&\boldsymbol{\mathit{Profit}=\mathit{Revenue}(x\ \mathit{tablets})-\mathit{Expenses}}\\[8pt]
&406=14x-112\\
&14x=406+112\\
&14x=518\\
&x=\frac{518}{14}\\
&x=37
\end{aligned}`
      }
    ]
  },

{
  id: 'q03',
  practiceId: 'sat-linear-equations',
  difficulty: 'medium',
  number: 'Q03',
  type: 'Linear Equations — Word Problems',

  blocks: [
    {
      type: 'text',
      content: 'A museum rents tablets to visitors. The museum earns revenue of $14 for each tablet rented for the day. On Wednesday, the museum earned $406 in profit from renting tablets after paying daily expenses of $112. How many tablets did the museum rent on Wednesday? (profit = total revenue − total expenses)'
    }
  ],

  solution: [
    {
      type: 'display-math',
      content: String.raw`\begin{aligned}
&\text{Revenue (1 tablet): }\$14\\
&\text{Profit: }\$406\\
&\text{Expenses: }\$112\\
&\text{Tablets rented: }?\\
&\text{Let the number of tablets rented be }x.
\end{aligned}`
    },
    {
      type: 'display-math',
      content: String.raw`\begin{aligned}
&\text{Revenue (x tablets)}=14x\\[12pt]
&\text{Profit}=\text{Revenue}-\text{Expenses}\\[8pt]
&406=14x-112\\
&14x=406+112\\
&14x=518\\
&x=\frac{518}{14}\\
&x=37
\end{aligned}`
    },
    {
      type: 'paragraph',
      content: 'Answer: 37 tablets'
    }
  ]
},



{
  id: 'q04',
  practiceId: 'sat-linear-equations',
  difficulty: 'medium',
  number: 'Q04',
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
      type: 'display-math',
      content: String.raw`\begin{aligned}
&\text{Initial wax: }17\text{ oz}\\
&\text{Remaining wax: }6\text{ oz}\\
&\text{Burn rate: 1 oz every 4 hours}\\
&\text{Hours burned, }h=?
\end{aligned}`
    },
    {
      type: 'display-math',
      content: String.raw`\begin{aligned}
\text{Burn rate}
&=-\frac{1\text{ oz}}{4\text{ hours}}\\[8pt]
&=-\frac14\text{ oz/hour}
\end{aligned}`
    },
    {
      type: 'paragraph',
      content: 'Use the linear equation f(x) = mx + b, where m is the rate of change and b is the initial value.'
    },
    {
      type: 'display-math',
      content: String.raw`\begin{aligned}
\text{Remaining wax}&=(\text{Burn rate})(\text{Hours burned})+\text{Initial wax}\\[12pt]
6&=-\frac14h+17\\[12pt]
6-17&=-\frac14h\\[12pt]
-11&=-\frac14h\\[12pt]
h&=44
\end{aligned}`
    },
    {
      type: 'paragraph',
      content: 'Answer: D. 44 hours'
    }
  ]
}



];
