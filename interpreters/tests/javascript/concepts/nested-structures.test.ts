import { interpret } from "@javascript/interpreter";
import type { TestAugmentedFrame } from "@shared/frames";

describe("Nested Objects and Arrays", () => {
  describe("Complex nested patterns", () => {
    it("should handle complex nested pattern from TODO example", () => {
      const code = `
        let x = [
          { something: [{ foo: [0, 1, 2, 3, 4, 5] }] }
        ];
        x[0].something[0]['foo'][5] = 'bar';
        x[0].something[0].foo[5];
      `;
      const result = interpret(code);

      expect(result.success).toBe(true);
      expect(result.error).toBe(null);
      expect(result.frames).toHaveLength(3);

      const lastFrame = result.frames[2] as TestAugmentedFrame;
      expect(lastFrame.status).toBe("SUCCESS");
      expect(lastFrame.result?.jikiObject?.toString()).toBe("bar");
    });

    it("should handle reading complex nested values", () => {
      const code = `
        let obj = {
          users: [
            {
              name: "Alice",
              settings: {
                preferences: ["dark", "compact", "notifications"]
              }
            }
          ]
        };
        obj.users[0].settings.preferences[1];
      `;
      const result = interpret(code);

      expect(result.success).toBe(true);
      expect(result.error).toBe(null);
      expect(result.frames).toHaveLength(2);

      const lastFrame = result.frames[1] as TestAugmentedFrame;
      expect(lastFrame.status).toBe("SUCCESS");
      expect(lastFrame.result?.jikiObject?.toString()).toBe("compact");
    });

    it("should handle writing to complex nested structures", () => {
      const code = `
        let data = {
          config: {
            servers: [
              { id: 1, settings: { port: 8080 } }
            ]
          }
        };
        data.config.servers[0].settings.port = 9000;
        data['config']['servers'][0].settings['port'];
      `;
      const result = interpret(code);

      expect(result.success).toBe(true);
      expect(result.error).toBe(null);
      expect(result.frames).toHaveLength(3);

      const lastFrame = result.frames[2] as TestAugmentedFrame;
      expect(lastFrame.status).toBe("SUCCESS");
      expect(lastFrame.result?.jikiObject?.toString()).toBe("9000");
    });
  });

  describe("Mixed notation patterns", () => {
    it("should handle mixed bracket and dot notation", () => {
      const code = `
        let data = {
          "user-data": {
            accounts: [
              { "account-id": 123, balance: { amount: 1000 } }
            ]
          }
        };
        data["user-data"].accounts[0]["account-id"] = 456;
        data["user-data"]["accounts"][0].balance.amount = 2000;
        let id = data["user-data"].accounts[0]["account-id"];
        let amt = data["user-data"].accounts[0].balance["amount"];
        id;
      `;
      const result = interpret(code);

      expect(result.success).toBe(true);
      expect(result.error).toBe(null);

      const frames = result.frames as TestAugmentedFrame[];
      expect(frames[frames.length - 1].result?.jikiObject?.toString()).toBe("456");
      expect(frames[frames.length - 2].variables.amt?.toString()).toBe("2000");
    });
  });

  describe("Deep nesting", () => {
    it("should handle very deep nesting", () => {
      const code = `
        let deep = {
          a: {
            b: {
              c: {
                d: {
                  e: {
                    f: "deep value"
                  }
                }
              }
            }
          }
        };
        deep.a.b.c.d.e.f = "updated";
        deep.a.b.c.d.e.f;
      `;
      const result = interpret(code);

      expect(result.success).toBe(true);
      expect(result.error).toBe(null);
      expect(result.frames).toHaveLength(3);

      const lastFrame = result.frames[2] as TestAugmentedFrame;
      expect(lastFrame.status).toBe("SUCCESS");
      expect(lastFrame.result?.jikiObject?.toString()).toBe("updated");
    });

    it("should handle deep array nesting", () => {
      const code = `
        let nested = [[[[[["value"]]]]]];
        nested[0][0][0][0][0][0] = "changed";
        nested[0][0][0][0][0][0];
      `;
      const result = interpret(code);

      expect(result.success).toBe(true);
      expect(result.error).toBe(null);
      expect(result.frames).toHaveLength(3);

      const lastFrame = result.frames[2] as TestAugmentedFrame;
      expect(lastFrame.status).toBe("SUCCESS");
      expect(lastFrame.result?.jikiObject?.toString()).toBe("changed");
    });
  });

  describe("Dynamic property creation in nested structures", () => {
    it("should create nested properties that don't exist", () => {
      const code = `
        let obj = { level1: {} };
        obj.level1.level2 = { level3: {} };
        obj.level1.level2.level3.value = "created";
        obj.level1.level2.level3.value;
      `;
      const result = interpret(code);

      expect(result.success).toBe(true);
      expect(result.error).toBe(null);
      expect(result.frames).toHaveLength(4);

      const lastFrame = result.frames[3] as TestAugmentedFrame;
      expect(lastFrame.status).toBe("SUCCESS");
      expect(lastFrame.result?.jikiObject?.toString()).toBe("created");
    });

    it("should extend arrays in nested structures", () => {
      const code = `
        let obj = { items: [] };
        obj.items[0] = { subitems: [] };
        obj.items[0].subitems[0] = "first";
        obj.items[0].subitems[1] = "second";
        obj.items[0].subitems[1];
      `;
      const result = interpret(code);

      expect(result.success).toBe(true);
      expect(result.error).toBe(null);
      expect(result.frames).toHaveLength(5);

      const lastFrame = result.frames[4] as TestAugmentedFrame;
      expect(lastFrame.status).toBe("SUCCESS");
      expect(lastFrame.result?.jikiObject?.toString()).toBe("second");
    });
  });

  describe("Complex real-world patterns", () => {
    it("should handle JSON-like API response structure", () => {
      const code = `
        let response = {
          status: "success",
          data: {
            users: [
              {
                id: 1,
                profile: {
                  name: "Alice",
                  settings: {
                    theme: "dark",
                    notifications: {
                      email: true,
                      push: false
                    }
                  }
                }
              },
              {
                id: 2,
                profile: {
                  name: "Bob",
                  settings: {
                    theme: "light",
                    notifications: {
                      email: false,
                      push: true
                    }
                  }
                }
              }
            ]
          }
        };
        response.data.users[0].profile.settings.notifications.push = true;
        response.data.users[1].profile.settings.theme = "dark";
        let alicePush = response.data.users[0].profile.settings.notifications.push;
        let bobTheme = response.data.users[1].profile.settings.theme;
        alicePush;
      `;
      const result = interpret(code);

      expect(result.success).toBe(true);
      expect(result.error).toBe(null);

      const frames = result.frames as TestAugmentedFrame[];
      const lastFrame = frames[frames.length - 1];
      expect(lastFrame.result?.jikiObject?.toString()).toBe("true");
      expect(lastFrame.variables.bobTheme?.toString()).toBe("dark");
    });

    it("should handle game board pattern", () => {
      const code = `
        let game = {
          board: [
            [{ piece: "pawn", color: "white" }, null, null],
            [null, { piece: "knight", color: "black" }, null],
            [null, null, { piece: "king", color: "white" }]
          ],
          players: {
            white: { name: "Alice", score: 0 },
            black: { name: "Bob", score: 0 }
          }
        };
        game.board[0][0] = null;
        game.board[0][1] = { piece: "pawn", color: "white" };
        game.players.white.score = 1;
        let movedPiece = game.board[0][1].piece;
        let whiteScore = game.players["white"]["score"];
        movedPiece;
      `;
      const result = interpret(code);

      expect(result.success).toBe(true);
      expect(result.error).toBe(null);

      const frames = result.frames as TestAugmentedFrame[];
      const lastFrame = frames[frames.length - 1];
      expect(lastFrame.result?.jikiObject?.toString()).toBe("pawn");
      expect(lastFrame.variables.whiteScore?.toString()).toBe("1");
    });
  });
});
