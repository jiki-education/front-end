import { interpret } from "./dist/jikiscript/interpreter.js";
import { unwrapJikiObject } from "./dist/jikiscript/jikiObjects.js";

const code = `
  set movie to {"director": {"name": "Peter Jackson"}}
  change movie["director"]["skill"] to 10
`;

const { error, frames } = interpret(code);

if (error) {
  console.log("Error:", error);
} else {
  console.log("Frame 0 variables:", unwrapJikiObject(frames[0].variables));
  console.log("Frame 1 variables:", unwrapJikiObject(frames[1].variables));

  // Check if the movie object in frame 1 has the skill property
  const movie = frames[1].variables.movie;
  console.log("\nMovie object in frame 1:", unwrapJikiObject(movie));
}
