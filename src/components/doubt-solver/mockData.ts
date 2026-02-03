import { Conversation } from './types';

export const mockConversations: Conversation[] = [
  {
    id: '1',
    title: 'Quadratic Equations Help',
    lastMessage: 'The quadratic formula is...',
    timestamp: new Date(),
    messages: [
      { id: '1a', role: 'user', content: 'How do I solve quadratic equations?', timestamp: new Date() },
      { id: '1b', role: 'assistant', content: `Great question! A quadratic equation is in the form **ax² + bx + c = 0**. There are several methods to solve it:

**1. Factoring**
If the equation can be factored, this is often the quickest method.

**2. Quadratic Formula**
\`x = (-b ± √(b² - 4ac)) / 2a\`

**3. Completing the Square**
Useful for deriving the quadratic formula.

Would you like me to walk through an example?`, timestamp: new Date() }
    ]
  },
  {
    id: '2',
    title: 'Photosynthesis Process',
    lastMessage: 'Photosynthesis occurs in...',
    timestamp: new Date(Date.now() - 86400000),
    messages: []
  },
  {
    id: '3',
    title: "Newton's Laws of Motion",
    lastMessage: 'The three laws are...',
    timestamp: new Date(Date.now() - 172800000),
    messages: []
  },
  {
    id: '4',
    title: 'Essay Writing Tips',
    lastMessage: 'Start with a strong thesis...',
    timestamp: new Date(Date.now() - 259200000),
    messages: []
  },
  {
    id: '5',
    title: 'World War II Timeline',
    lastMessage: 'The war began in 1939...',
    timestamp: new Date(Date.now() - 604800000),
    messages: []
  }
];

export const mockResponses = [
  `Great question! Let me break this down for you step by step.

**Key Concepts:**
1. First, we need to understand the fundamental principle
2. Then we apply the relevant formula
3. Finally, we verify our answer

Here's an example:
- Start by identifying the given values
- Substitute into the formula
- Solve step by step

Would you like me to go through a specific example?`,

  `I'd be happy to explain that! This is a topic many students find challenging at first.

**The Main Idea:**
Think of it like building blocks — each concept builds on the previous one.

**Steps to solve:**
1. Identify what you're given
2. Determine what you need to find
3. Choose the appropriate method
4. Work through carefully
5. Check your answer

Does this make sense so far? Feel free to ask follow-up questions!`,

  `Absolutely! Let me explain this in a clear and simple way.

**Important Points:**
- This concept was discovered through observation and experimentation
- It applies in many real-world situations
- The key formula to remember is shown below

**Pro Tip:** Always double-check your units and make sure they're consistent throughout.

Want me to show you a practice problem to reinforce this?`,

  `That's an excellent question! Here's a comprehensive explanation:

**Definition:**
This refers to the fundamental principle that governs how things work in this context.

**Why it matters:**
- It helps us understand underlying patterns
- It's used in many practical applications
- It forms the basis for more advanced topics

**Example:**
Let's say we have a specific scenario...

Would you like me to elaborate on any of these points?`
];
