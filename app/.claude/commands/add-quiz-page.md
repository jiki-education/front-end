Your job is to create a new page that will allow students to do quizes.

The layout of the page is:

a quiz card that is 1/3 width of the screen, and it is centered.

At the top there will be a markdown content. This needs to be parsed. For now generate a mock markdown content, and use a proper library for it. I'd recommend using `marked` for parsing.

Below there will be 4 options. Each option is a button. The buttons are stacked vertically, and they take the full width of the card.

When a button is clicked, it will show if the answer is correct or not. If it is correct, it will show a green checkmark next to the button. If it is incorrect, it will show a red X next to the button and it should highlight the correct answer, but with a different styling.

The buttons need 7 different styles:

1. default
2. hovered
3. clicked/held
4. selected - users first need to select their answer, and then click submit. This is different from clicked/held.
5. got correct
6. didn't get correct (clicked on something else, and we show the correct one - this needs to be different)
7. got incorrect - when they select the wrong answer.

Below it there will be a Submit button.

Clicking submit button will check if the answer is correct or not.

If they got it right, it will show a message "Correct!" in green text below the submit button. and the submit button will turn to a Next question button.

If they got it wrong, and explanation/information bubble must appear above the submit button.

Generate the component in components/quiz-card/QuizCard.tsx (and every other component that it needs)

The code must contain small files, 80-90-100 lines max!
It must be a clean code.

Once you have the component, wire in data into it, and create a test page under test/quiz/page.tsx
