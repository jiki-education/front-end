import type { Task, VisualScenario } from "../types";
import type { WeatherSymbolsPart2Exercise } from "./Exercise";

export const tasks = [
  {
    id: "draw-weather" as const,
    name: "Draw the weather scene",
    description:
      "Create a function called drawWeather that takes a list of weather elements and draws the correct scene.",
    hints: [
      "Always draw the sky background first",
      'Check if the elements list contains "cloud" to decide the sun size',
      "Use helper functions to keep the code clean",
      "Snow is like rain but uses circles instead of ellipses"
    ],
    requiredScenarios: ["sunny", "dull", "hopeful", "miserable", "rainbow-territory", "exciting", "snowboarding-time"],
    bonus: false
  }
] as const satisfies readonly Task[];

export const scenarios: VisualScenario[] = [
  {
    slug: "sunny",
    name: "Sunny",
    description: "Draw a sunny day with just the sun.",
    taskId: "draw-weather",
    functionCall: { name: "draw_weather", args: [["sun"]] },
    expectations(exercise) {
      const ex = exercise as WeatherSymbolsPart2Exercise;
      return [
        {
          pass: ex.hasCircleAt(50, 50, 25),
          errorHtml: "The sun isn't correct."
        },
        {
          pass: !ex.hasCircleAt(75, 30, 15),
          errorHtml: "You have two suns!"
        },
        {
          pass: !ex.hasEllipseAt(30, 70, 3, 5),
          errorHtml: "There shouldn't be rain."
        },
        {
          pass: !ex.hasCircleAt(30, 70, 5),
          errorHtml: "There shouldn't be snow."
        }
      ];
    }
  },
  {
    slug: "dull",
    name: "Dull",
    description: "Draw a dull day with just clouds.",
    taskId: "draw-weather",
    functionCall: { name: "draw_weather", args: [["cloud"]] },
    expectations(exercise) {
      const ex = exercise as WeatherSymbolsPart2Exercise;
      return [
        {
          pass: ex.hasRectangleAt(25, 50, 50, 10),
          errorHtml: "The base of the cloud isn't correct."
        },
        {
          pass: ex.hasCircleAt(25, 50, 10),
          errorHtml: "The fluffy bits of the cloud aren't correct."
        },
        {
          pass: ex.hasCircleAt(40, 40, 15),
          errorHtml: "The fluffy bits of the cloud aren't correct."
        },
        {
          pass: ex.hasCircleAt(55, 40, 20),
          errorHtml: "The fluffy bits of the cloud aren't correct."
        },
        {
          pass: ex.hasCircleAt(75, 50, 10),
          errorHtml: "The fluffy bits of the cloud aren't correct."
        },
        {
          pass: !ex.hasCircleAt(75, 30, 15),
          errorHtml: "There shouldn't be a sun."
        },
        {
          pass: !ex.hasEllipseAt(30, 70, 3, 5),
          errorHtml: "There shouldn't be rain."
        },
        {
          pass: !ex.hasCircleAt(30, 70, 5),
          errorHtml: "There shouldn't be snow."
        }
      ];
    }
  },
  {
    slug: "hopeful",
    name: "Hopeful",
    description: "Draw a hopeful day with sun and cloud.",
    taskId: "draw-weather",
    functionCall: { name: "draw_weather", args: [["sun", "cloud"]] },
    expectations(exercise) {
      const ex = exercise as WeatherSymbolsPart2Exercise;
      return [
        {
          pass: ex.hasCircleAt(75, 30, 15),
          errorHtml: "The sun isn't correct."
        },
        {
          pass: ex.hasRectangleAt(25, 50, 50, 10),
          errorHtml: "The base of the cloud isn't correct."
        },
        {
          pass: ex.hasCircleAt(25, 50, 10),
          errorHtml: "The fluffy bits of the cloud aren't correct."
        },
        {
          pass: ex.hasCircleAt(40, 40, 15),
          errorHtml: "The fluffy bits of the cloud aren't correct."
        },
        {
          pass: ex.hasCircleAt(55, 40, 20),
          errorHtml: "The fluffy bits of the cloud aren't correct."
        },
        {
          pass: ex.hasCircleAt(75, 50, 10),
          errorHtml: "The fluffy bits of the cloud aren't correct."
        },
        {
          pass: !ex.hasEllipseAt(30, 70, 3, 5),
          errorHtml: "There shouldn't be rain."
        },
        {
          pass: !ex.hasCircleAt(30, 70, 5),
          errorHtml: "There shouldn't be snow."
        }
      ];
    }
  },
  {
    slug: "miserable",
    name: "Miserable",
    description: "Draw a miserable day with cloud and rain.",
    taskId: "draw-weather",
    functionCall: { name: "draw_weather", args: [["cloud", "rain"]] },
    expectations(exercise) {
      const ex = exercise as WeatherSymbolsPart2Exercise;
      return [
        {
          pass: ex.hasRectangleAt(25, 50, 50, 10),
          errorHtml: "The base of the cloud isn't correct."
        },
        {
          pass: ex.hasCircleAt(25, 50, 10),
          errorHtml: "The fluffy bits of the cloud aren't correct."
        },
        {
          pass: ex.hasCircleAt(40, 40, 15),
          errorHtml: "The fluffy bits of the cloud aren't correct."
        },
        {
          pass: ex.hasCircleAt(55, 40, 20),
          errorHtml: "The fluffy bits of the cloud aren't correct."
        },
        {
          pass: ex.hasCircleAt(75, 50, 10),
          errorHtml: "The fluffy bits of the cloud aren't correct."
        },
        {
          pass: ex.hasEllipseAt(30, 70, 3, 5),
          errorHtml: "The first rain drop isn't correct."
        },
        {
          pass: ex.hasEllipseAt(50, 70, 3, 5),
          errorHtml: "The second rain drop isn't correct."
        },
        {
          pass: ex.hasEllipseAt(70, 70, 3, 5),
          errorHtml: "The third rain drop isn't correct."
        },
        {
          pass: ex.hasEllipseAt(40, 80, 3, 5),
          errorHtml: "The fourth rain drop isn't correct."
        },
        {
          pass: ex.hasEllipseAt(60, 80, 3, 5),
          errorHtml: "The fifth rain drop isn't correct."
        },
        {
          pass: !ex.hasCircleAt(75, 30, 15),
          errorHtml: "The sun shouldn't be peaking out."
        },
        {
          pass: !ex.hasCircleAt(30, 70, 5),
          errorHtml: "There shouldn't be snow."
        }
      ];
    }
  },
  {
    slug: "rainbow-territory",
    name: "Rainbow Territory",
    description: "Draw rainbow territory with sun, cloud, and rain.",
    taskId: "draw-weather",
    functionCall: { name: "draw_weather", args: [["sun", "cloud", "rain"]] },
    expectations(exercise) {
      const ex = exercise as WeatherSymbolsPart2Exercise;
      return [
        {
          pass: ex.hasCircleAt(75, 30, 15),
          errorHtml: "The sun isn't correct."
        },
        {
          pass: ex.hasRectangleAt(25, 50, 50, 10),
          errorHtml: "The base of the cloud isn't correct."
        },
        {
          pass: ex.hasCircleAt(25, 50, 10),
          errorHtml: "The fluffy bits of the cloud aren't correct."
        },
        {
          pass: ex.hasCircleAt(40, 40, 15),
          errorHtml: "The fluffy bits of the cloud aren't correct."
        },
        {
          pass: ex.hasCircleAt(55, 40, 20),
          errorHtml: "The fluffy bits of the cloud aren't correct."
        },
        {
          pass: ex.hasCircleAt(75, 50, 10),
          errorHtml: "The fluffy bits of the cloud aren't correct."
        },
        {
          pass: ex.hasEllipseAt(30, 70, 3, 5),
          errorHtml: "The first rain drop isn't correct."
        },
        {
          pass: ex.hasEllipseAt(50, 70, 3, 5),
          errorHtml: "The second rain drop isn't correct."
        },
        {
          pass: ex.hasEllipseAt(70, 70, 3, 5),
          errorHtml: "The third rain drop isn't correct."
        },
        {
          pass: ex.hasEllipseAt(40, 80, 3, 5),
          errorHtml: "The fourth rain drop isn't correct."
        },
        {
          pass: ex.hasEllipseAt(60, 80, 3, 5),
          errorHtml: "The fifth rain drop isn't correct."
        }
      ];
    }
  },
  {
    slug: "exciting",
    name: "Exciting",
    description: "Draw an exciting day with cloud and snow.",
    taskId: "draw-weather",
    functionCall: { name: "draw_weather", args: [["cloud", "snow"]] },
    expectations(exercise) {
      const ex = exercise as WeatherSymbolsPart2Exercise;
      return [
        {
          pass: ex.hasRectangleAt(25, 50, 50, 10),
          errorHtml: "The base of the cloud isn't correct."
        },
        {
          pass: ex.hasCircleAt(25, 50, 10),
          errorHtml: "The fluffy bits of the cloud aren't correct."
        },
        {
          pass: ex.hasCircleAt(40, 40, 15),
          errorHtml: "The fluffy bits of the cloud aren't correct."
        },
        {
          pass: ex.hasCircleAt(55, 40, 20),
          errorHtml: "The fluffy bits of the cloud aren't correct."
        },
        {
          pass: ex.hasCircleAt(75, 50, 10),
          errorHtml: "The fluffy bits of the cloud aren't correct."
        },
        {
          pass: ex.hasCircleAt(30, 70, 5),
          errorHtml: "The first snow flake isn't correct."
        },
        {
          pass: ex.hasCircleAt(50, 70, 5),
          errorHtml: "The second snow flake isn't correct."
        },
        {
          pass: ex.hasCircleAt(70, 70, 5),
          errorHtml: "The third snow flake isn't correct."
        },
        {
          pass: ex.hasCircleAt(40, 80, 5),
          errorHtml: "The fourth snow flake isn't correct."
        },
        {
          pass: ex.hasCircleAt(60, 80, 5),
          errorHtml: "The fifth snow flake isn't correct."
        },
        {
          pass: !ex.hasCircleAt(75, 30, 15),
          errorHtml: "The sun shouldn't be peaking out."
        },
        {
          pass: !ex.hasEllipseAt(30, 70, 3, 5),
          errorHtml: "There shouldn't be rain."
        }
      ];
    }
  },
  {
    slug: "snowboarding-time",
    name: "Snowboarding Time",
    description: "Draw a perfect day for snowboarding.",
    taskId: "draw-weather",
    functionCall: { name: "draw_weather", args: [["sun", "cloud", "snow"]] },
    expectations(exercise) {
      const ex = exercise as WeatherSymbolsPart2Exercise;
      return [
        {
          pass: ex.hasCircleAt(75, 30, 15),
          errorHtml: "The sun isn't correct."
        },
        {
          pass: ex.hasRectangleAt(25, 50, 50, 10),
          errorHtml: "The base of the cloud isn't correct."
        },
        {
          pass: ex.hasCircleAt(25, 50, 10),
          errorHtml: "The fluffy bits of the cloud aren't correct."
        },
        {
          pass: ex.hasCircleAt(40, 40, 15),
          errorHtml: "The fluffy bits of the cloud aren't correct."
        },
        {
          pass: ex.hasCircleAt(55, 40, 20),
          errorHtml: "The fluffy bits of the cloud aren't correct."
        },
        {
          pass: ex.hasCircleAt(75, 50, 10),
          errorHtml: "The fluffy bits of the cloud aren't correct."
        },
        {
          pass: ex.hasCircleAt(30, 70, 5),
          errorHtml: "The first snow flake isn't correct."
        },
        {
          pass: ex.hasCircleAt(50, 70, 5),
          errorHtml: "The second snow flake isn't correct."
        },
        {
          pass: ex.hasCircleAt(70, 70, 5),
          errorHtml: "The third snow flake isn't correct."
        },
        {
          pass: ex.hasCircleAt(40, 80, 5),
          errorHtml: "The fourth snow flake isn't correct."
        },
        {
          pass: ex.hasCircleAt(60, 80, 5),
          errorHtml: "The fifth snow flake isn't correct."
        },
        {
          pass: !ex.hasEllipseAt(30, 70, 3, 5),
          errorHtml: "There shouldn't be rain."
        },
        {
          pass: !ex.hasCircleAt(50, 50, 25),
          errorHtml: "There are two suns."
        }
      ];
    }
  }
];
