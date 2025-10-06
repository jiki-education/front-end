"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var interpreter_js_1 = require("./dist/jikiscript/interpreter.js");
var jikiObjects_js_1 = require("./dist/jikiscript/jikiObjects.js");
var code = '\n  set movie to {"director": {"name": "Peter Jackson"}}\n  change movie["director"]["skill"] to 10\n';
var _a = (0, interpreter_js_1.interpret)(code),
  error = _a.error,
  frames = _a.frames;
if (error) {
  console.log("Error:", error);
} else {
  console.log("Frame 0 variables:", (0, jikiObjects_js_1.unwrapJikiObject)(frames[0].variables));
  console.log("Frame 1 variables:", (0, jikiObjects_js_1.unwrapJikiObject)(frames[1].variables));
  // Check if the movie object in frame 1 has the skill property
  var movie = frames[1].variables.movie;
  console.log("\nMovie object in frame 1:", (0, jikiObjects_js_1.unwrapJikiObject)(movie));
}
