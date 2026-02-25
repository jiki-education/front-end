// Mock for @mux/mux-player-react to avoid ESM import failures in Jest
// eslint-disable-next-line @typescript-eslint/no-require-imports
const React = require("react");

const MuxPlayer = React.forwardRef(function MuxPlayer(props, ref) {
  return React.createElement("div", { "data-testid": "mux-player", ref });
});

MuxPlayer.displayName = "MuxPlayer";

module.exports = MuxPlayer;
module.exports.default = MuxPlayer;
