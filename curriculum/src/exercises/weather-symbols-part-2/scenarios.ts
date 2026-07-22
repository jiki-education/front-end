import type { Task, VisualScenario } from "../types";
import type { WeatherSymbolsPart2Exercise } from "./Exercise";

export const tasks = [
  {
    id: "draw-weather" as const,
    name: "tasks.drawWeather.name",
    description: "tasks.drawWeather.description",
    hints: [],
    requiredScenarios: ["sunny", "dull", "hopeful", "miserable", "rainbow-territory", "exciting", "snowboarding-time"],
    bonus: false
  }
] as const satisfies readonly Task[];

export const scenarios: VisualScenario[] = [
  {
    slug: "sunny",
    name: "scenarios.sunny.name",
    description: "scenarios.sunny.description",
    taskId: "draw-weather",
    functionCall: { name: "draw_weather", args: [["sun"]] },
    expectations(exercise) {
      const ex = exercise as WeatherSymbolsPart2Exercise;
      return [
        {
          pass: ex.hasCircleAt(50, 50, 25),
          errorHtml: ex.t("checks.theSunIsntCorrect")
        },
        {
          pass: !ex.hasCircleAt(75, 30, 15),
          errorHtml: ex.t("checks.youHaveTwoSuns")
        },
        {
          pass: !ex.hasEllipseAt(30, 70, 3, 5),
          errorHtml: ex.t("checks.thereShouldntBeRain")
        },
        {
          pass: !ex.hasCircleAt(30, 70, 5),
          errorHtml: ex.t("checks.thereShouldntBeSnow")
        }
      ];
    }
  },
  {
    slug: "dull",
    name: "scenarios.dull.name",
    description: "scenarios.dull.description",
    taskId: "draw-weather",
    functionCall: { name: "draw_weather", args: [["cloud"]] },
    expectations(exercise) {
      const ex = exercise as WeatherSymbolsPart2Exercise;
      return [
        {
          pass: ex.hasRectangleAt(25, 50, 50, 10),
          errorHtml: ex.t("checks.theBaseOfTheCloudIsnt")
        },
        {
          pass: ex.hasCircleAt(25, 50, 10),
          errorHtml: ex.t("checks.theFluffyBitsOfTheCloud")
        },
        {
          pass: ex.hasCircleAt(40, 40, 15),
          errorHtml: ex.t("checks.theFluffyBitsOfTheCloud")
        },
        {
          pass: ex.hasCircleAt(55, 40, 20),
          errorHtml: ex.t("checks.theFluffyBitsOfTheCloud")
        },
        {
          pass: ex.hasCircleAt(75, 50, 10),
          errorHtml: ex.t("checks.theFluffyBitsOfTheCloud")
        },
        {
          pass: !ex.hasCircleAt(75, 30, 15),
          errorHtml: ex.t("checks.thereShouldntBeASun")
        },
        {
          pass: !ex.hasEllipseAt(30, 70, 3, 5),
          errorHtml: ex.t("checks.thereShouldntBeRain")
        },
        {
          pass: !ex.hasCircleAt(30, 70, 5),
          errorHtml: ex.t("checks.thereShouldntBeSnow")
        }
      ];
    }
  },
  {
    slug: "hopeful",
    name: "scenarios.hopeful.name",
    description: "scenarios.hopeful.description",
    taskId: "draw-weather",
    functionCall: { name: "draw_weather", args: [["sun", "cloud"]] },
    expectations(exercise) {
      const ex = exercise as WeatherSymbolsPart2Exercise;
      return [
        {
          pass: ex.hasCircleAt(75, 30, 15),
          errorHtml: ex.t("checks.theSunIsntCorrect")
        },
        {
          pass: ex.hasRectangleAt(25, 50, 50, 10),
          errorHtml: ex.t("checks.theBaseOfTheCloudIsnt")
        },
        {
          pass: ex.hasCircleAt(25, 50, 10),
          errorHtml: ex.t("checks.theFluffyBitsOfTheCloud")
        },
        {
          pass: ex.hasCircleAt(40, 40, 15),
          errorHtml: ex.t("checks.theFluffyBitsOfTheCloud")
        },
        {
          pass: ex.hasCircleAt(55, 40, 20),
          errorHtml: ex.t("checks.theFluffyBitsOfTheCloud")
        },
        {
          pass: ex.hasCircleAt(75, 50, 10),
          errorHtml: ex.t("checks.theFluffyBitsOfTheCloud")
        },
        {
          pass: !ex.hasEllipseAt(30, 70, 3, 5),
          errorHtml: ex.t("checks.thereShouldntBeRain")
        },
        {
          pass: !ex.hasCircleAt(30, 70, 5),
          errorHtml: ex.t("checks.thereShouldntBeSnow")
        }
      ];
    }
  },
  {
    slug: "miserable",
    name: "scenarios.miserable.name",
    description: "scenarios.miserable.description",
    taskId: "draw-weather",
    functionCall: { name: "draw_weather", args: [["cloud", "rain"]] },
    expectations(exercise) {
      const ex = exercise as WeatherSymbolsPart2Exercise;
      return [
        {
          pass: ex.hasRectangleAt(25, 50, 50, 10),
          errorHtml: ex.t("checks.theBaseOfTheCloudIsnt")
        },
        {
          pass: ex.hasCircleAt(25, 50, 10),
          errorHtml: ex.t("checks.theFluffyBitsOfTheCloud")
        },
        {
          pass: ex.hasCircleAt(40, 40, 15),
          errorHtml: ex.t("checks.theFluffyBitsOfTheCloud")
        },
        {
          pass: ex.hasCircleAt(55, 40, 20),
          errorHtml: ex.t("checks.theFluffyBitsOfTheCloud")
        },
        {
          pass: ex.hasCircleAt(75, 50, 10),
          errorHtml: ex.t("checks.theFluffyBitsOfTheCloud")
        },
        {
          pass: ex.hasEllipseAt(30, 70, 3, 5),
          errorHtml: ex.t("checks.theFirstRainDropIsntCorrect")
        },
        {
          pass: ex.hasEllipseAt(50, 70, 3, 5),
          errorHtml: ex.t("checks.theSecondRainDropIsntCorrect")
        },
        {
          pass: ex.hasEllipseAt(70, 70, 3, 5),
          errorHtml: ex.t("checks.theThirdRainDropIsntCorrect")
        },
        {
          pass: ex.hasEllipseAt(40, 80, 3, 5),
          errorHtml: ex.t("checks.theFourthRainDropIsntCorrect")
        },
        {
          pass: ex.hasEllipseAt(60, 80, 3, 5),
          errorHtml: ex.t("checks.theFifthRainDropIsntCorrect")
        },
        {
          pass: !ex.hasCircleAt(75, 30, 15),
          errorHtml: ex.t("checks.theSunShouldntBePeakingOut")
        },
        {
          pass: !ex.hasCircleAt(30, 70, 5),
          errorHtml: ex.t("checks.thereShouldntBeSnow")
        }
      ];
    }
  },
  {
    slug: "rainbow-territory",
    name: "scenarios.rainbowTerritory.name",
    description: "scenarios.rainbowTerritory.description",
    taskId: "draw-weather",
    functionCall: { name: "draw_weather", args: [["sun", "cloud", "rain"]] },
    expectations(exercise) {
      const ex = exercise as WeatherSymbolsPart2Exercise;
      return [
        {
          pass: ex.hasCircleAt(75, 30, 15),
          errorHtml: ex.t("checks.theSunIsntCorrect")
        },
        {
          pass: ex.hasRectangleAt(25, 50, 50, 10),
          errorHtml: ex.t("checks.theBaseOfTheCloudIsnt")
        },
        {
          pass: ex.hasCircleAt(25, 50, 10),
          errorHtml: ex.t("checks.theFluffyBitsOfTheCloud")
        },
        {
          pass: ex.hasCircleAt(40, 40, 15),
          errorHtml: ex.t("checks.theFluffyBitsOfTheCloud")
        },
        {
          pass: ex.hasCircleAt(55, 40, 20),
          errorHtml: ex.t("checks.theFluffyBitsOfTheCloud")
        },
        {
          pass: ex.hasCircleAt(75, 50, 10),
          errorHtml: ex.t("checks.theFluffyBitsOfTheCloud")
        },
        {
          pass: ex.hasEllipseAt(30, 70, 3, 5),
          errorHtml: ex.t("checks.theFirstRainDropIsntCorrect")
        },
        {
          pass: ex.hasEllipseAt(50, 70, 3, 5),
          errorHtml: ex.t("checks.theSecondRainDropIsntCorrect")
        },
        {
          pass: ex.hasEllipseAt(70, 70, 3, 5),
          errorHtml: ex.t("checks.theThirdRainDropIsntCorrect")
        },
        {
          pass: ex.hasEllipseAt(40, 80, 3, 5),
          errorHtml: ex.t("checks.theFourthRainDropIsntCorrect")
        },
        {
          pass: ex.hasEllipseAt(60, 80, 3, 5),
          errorHtml: ex.t("checks.theFifthRainDropIsntCorrect")
        }
      ];
    }
  },
  {
    slug: "exciting",
    name: "scenarios.exciting.name",
    description: "scenarios.exciting.description",
    taskId: "draw-weather",
    functionCall: { name: "draw_weather", args: [["cloud", "snow"]] },
    expectations(exercise) {
      const ex = exercise as WeatherSymbolsPart2Exercise;
      return [
        {
          pass: ex.hasRectangleAt(25, 50, 50, 10),
          errorHtml: ex.t("checks.theBaseOfTheCloudIsnt")
        },
        {
          pass: ex.hasCircleAt(25, 50, 10),
          errorHtml: ex.t("checks.theFluffyBitsOfTheCloud")
        },
        {
          pass: ex.hasCircleAt(40, 40, 15),
          errorHtml: ex.t("checks.theFluffyBitsOfTheCloud")
        },
        {
          pass: ex.hasCircleAt(55, 40, 20),
          errorHtml: ex.t("checks.theFluffyBitsOfTheCloud")
        },
        {
          pass: ex.hasCircleAt(75, 50, 10),
          errorHtml: ex.t("checks.theFluffyBitsOfTheCloud")
        },
        {
          pass: ex.hasCircleAt(30, 70, 5),
          errorHtml: ex.t("checks.theFirstSnowFlakeIsntCorrect")
        },
        {
          pass: ex.hasCircleAt(50, 70, 5),
          errorHtml: ex.t("checks.theSecondSnowFlakeIsntCorrect")
        },
        {
          pass: ex.hasCircleAt(70, 70, 5),
          errorHtml: ex.t("checks.theThirdSnowFlakeIsntCorrect")
        },
        {
          pass: ex.hasCircleAt(40, 80, 5),
          errorHtml: ex.t("checks.theFourthSnowFlakeIsntCorrect")
        },
        {
          pass: ex.hasCircleAt(60, 80, 5),
          errorHtml: ex.t("checks.theFifthSnowFlakeIsntCorrect")
        },
        {
          pass: !ex.hasCircleAt(75, 30, 15),
          errorHtml: ex.t("checks.theSunShouldntBePeakingOut")
        },
        {
          pass: !ex.hasEllipseAt(30, 70, 3, 5),
          errorHtml: ex.t("checks.thereShouldntBeRain")
        }
      ];
    }
  },
  {
    slug: "snowboarding-time",
    name: "scenarios.snowboardingTime.name",
    description: "scenarios.snowboardingTime.description",
    taskId: "draw-weather",
    functionCall: { name: "draw_weather", args: [["sun", "cloud", "snow"]] },
    expectations(exercise) {
      const ex = exercise as WeatherSymbolsPart2Exercise;
      return [
        {
          pass: ex.hasCircleAt(75, 30, 15),
          errorHtml: ex.t("checks.theSunIsntCorrect")
        },
        {
          pass: ex.hasRectangleAt(25, 50, 50, 10),
          errorHtml: ex.t("checks.theBaseOfTheCloudIsnt")
        },
        {
          pass: ex.hasCircleAt(25, 50, 10),
          errorHtml: ex.t("checks.theFluffyBitsOfTheCloud")
        },
        {
          pass: ex.hasCircleAt(40, 40, 15),
          errorHtml: ex.t("checks.theFluffyBitsOfTheCloud")
        },
        {
          pass: ex.hasCircleAt(55, 40, 20),
          errorHtml: ex.t("checks.theFluffyBitsOfTheCloud")
        },
        {
          pass: ex.hasCircleAt(75, 50, 10),
          errorHtml: ex.t("checks.theFluffyBitsOfTheCloud")
        },
        {
          pass: ex.hasCircleAt(30, 70, 5),
          errorHtml: ex.t("checks.theFirstSnowFlakeIsntCorrect")
        },
        {
          pass: ex.hasCircleAt(50, 70, 5),
          errorHtml: ex.t("checks.theSecondSnowFlakeIsntCorrect")
        },
        {
          pass: ex.hasCircleAt(70, 70, 5),
          errorHtml: ex.t("checks.theThirdSnowFlakeIsntCorrect")
        },
        {
          pass: ex.hasCircleAt(40, 80, 5),
          errorHtml: ex.t("checks.theFourthSnowFlakeIsntCorrect")
        },
        {
          pass: ex.hasCircleAt(60, 80, 5),
          errorHtml: ex.t("checks.theFifthSnowFlakeIsntCorrect")
        },
        {
          pass: !ex.hasEllipseAt(30, 70, 3, 5),
          errorHtml: ex.t("checks.thereShouldntBeRain")
        },
        {
          pass: !ex.hasCircleAt(50, 50, 25),
          errorHtml: ex.t("checks.thereAreTwoSuns")
        }
      ];
    }
  }
];
