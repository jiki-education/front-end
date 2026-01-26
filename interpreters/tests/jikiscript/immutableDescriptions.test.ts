import { interpret } from "@jikiscript/interpreter";

describe("immutable descriptions for log statements", () => {
  describe("primitive types", () => {
    test("number mutation doesn't affect earlier log descriptions", () => {
      const code = `
        set x to 42
        log x
        change x to 100
        log x
      `;

      const { frames, error } = interpret(code);
      expect(error).toBeNull();

      const logFrames = frames.filter(f => f.result?.type === "LogStatement");
      expect(logFrames).toHaveLength(2);

      const firstLogDescription = logFrames[0].generateDescription();
      const secondLogDescription = logFrames[1].generateDescription();

      expect(firstLogDescription).toContain("42");
      expect(firstLogDescription).not.toContain("100");
      expect(secondLogDescription).toContain("100");
      expect(secondLogDescription).not.toContain("42");
    });

    test("string mutation doesn't affect earlier log descriptions", () => {
      const code = `
        set message to "hello"
        log message
        change message to "world"
        log message
      `;

      const { frames, error } = interpret(code);
      expect(error).toBeNull();

      const logFrames = frames.filter(f => f.result?.type === "LogStatement");
      expect(logFrames).toHaveLength(2);

      const firstLogDescription = logFrames[0].generateDescription();
      const secondLogDescription = logFrames[1].generateDescription();

      expect(firstLogDescription).toContain('"hello"');
      expect(firstLogDescription).not.toContain('"world"');
      expect(secondLogDescription).toContain('"world"');
      expect(secondLogDescription).not.toContain('"hello"');
    });

    test("boolean mutation doesn't affect earlier log descriptions", () => {
      const code = `
        set flag to true
        log flag
        change flag to false
        log flag
      `;

      const { frames, error } = interpret(code);
      expect(error).toBeNull();

      const logFrames = frames.filter(f => f.result?.type === "LogStatement");
      expect(logFrames).toHaveLength(2);

      const firstLogDescription = logFrames[0].generateDescription();
      const secondLogDescription = logFrames[1].generateDescription();

      expect(firstLogDescription).toContain("true");
      expect(firstLogDescription).not.toContain("false");
      expect(secondLogDescription).toContain("false");
      expect(secondLogDescription).not.toContain("true");
    });
  });

  describe("list mutations", () => {
    test("simple list element mutation doesn't affect earlier log descriptions", () => {
      const code = `
        set myList to [1, 2, 3]
        log myList
        change myList[1] to 10
        log myList
      `;

      const { frames, error } = interpret(code);
      expect(error).toBeNull();

      const logFrames = frames.filter(f => f.result?.type === "LogStatement");
      expect(logFrames).toHaveLength(2);

      const firstLogDescription = logFrames[0].generateDescription();
      const secondLogDescription = logFrames[1].generateDescription();

      expect(firstLogDescription).toContain("[ 1, 2, 3 ]");
      expect(firstLogDescription).not.toContain("[ 10, 2, 3 ]");
      expect(secondLogDescription).toContain("[ 10, 2, 3 ]");
    });

    test("list replacement doesn't affect earlier log descriptions", () => {
      const code = `
        set items to ["a", "b", "c"]
        log items
        change items to ["x", "y", "z"]
        log items
      `;

      const { frames, error } = interpret(code);
      expect(error).toBeNull();

      const logFrames = frames.filter(f => f.result?.type === "LogStatement");
      expect(logFrames).toHaveLength(2);

      const firstLogDescription = logFrames[0].generateDescription();
      const secondLogDescription = logFrames[1].generateDescription();

      expect(firstLogDescription).toContain('[ "a", "b", "c" ]');
      expect(secondLogDescription).toContain('[ "x", "y", "z" ]');
    });

    test("nested list mutation doesn't affect earlier log descriptions", () => {
      const code = `
        set nested to [[1, 2], [3, 4]]
        log nested
        change nested[2][2] to 99
        log nested
      `;

      const { frames, error } = interpret(code);
      expect(error).toBeNull();

      const logFrames = frames.filter(f => f.result?.type === "LogStatement");
      expect(logFrames).toHaveLength(2);

      const firstLogDescription = logFrames[0].generateDescription();
      const secondLogDescription = logFrames[1].generateDescription();

      expect(firstLogDescription).toContain("[ [ 1, 2 ], [ 3, 4 ] ]");
      expect(firstLogDescription).not.toContain("99");
      expect(secondLogDescription).toContain("[ [ 1, 2 ], [ 3, 99 ] ]");
    });

    test("deeply nested list mutation", () => {
      const code = `
        set deep to [1, ["a", ["x", "y", "z"], "b"], 3]
        log deep
        change deep[2][2][3] to "modified"
        log deep
      `;

      const { frames, error } = interpret(code);
      expect(error).toBeNull();

      const logFrames = frames.filter(f => f.result?.type === "LogStatement");
      expect(logFrames).toHaveLength(2);

      const firstLogDescription = logFrames[0].generateDescription();
      const secondLogDescription = logFrames[1].generateDescription();

      expect(firstLogDescription).toContain('[ 1, [ "a", [ "x", "y", "z" ], "b" ], 3 ]');
      expect(firstLogDescription).not.toContain("modified");
      expect(secondLogDescription).toContain('[ 1, [ "a", [ "x", "y", "modified" ], "b" ], 3 ]');
    });
  });

  describe("dictionary mutations", () => {
    test("simple dictionary value mutation doesn't affect earlier log descriptions", () => {
      const code = `
        set myDict to {"a": 1, "b": 2}
        log myDict
        change myDict["a"] to 10
        log myDict
      `;

      const { frames, error } = interpret(code);
      expect(error).toBeNull();

      const logFrames = frames.filter(f => f.result?.type === "LogStatement");
      expect(logFrames).toHaveLength(2);

      const firstLogDescription = logFrames[0].generateDescription();
      const secondLogDescription = logFrames[1].generateDescription();

      expect(firstLogDescription).toContain('{ "a": 1, "b": 2 }');
      expect(firstLogDescription).not.toContain('"a": 10');
      expect(secondLogDescription).toContain('{ "a": 10, "b": 2 }');
    });

    test("dictionary replacement doesn't affect earlier log descriptions", () => {
      const code = `
        set config to {"debug": true, "level": 5}
        log config
        change config to {"debug": false, "level": 1}
        log config
      `;

      const { frames, error } = interpret(code);
      expect(error).toBeNull();

      const logFrames = frames.filter(f => f.result?.type === "LogStatement");
      expect(logFrames).toHaveLength(2);

      const firstLogDescription = logFrames[0].generateDescription();
      const secondLogDescription = logFrames[1].generateDescription();

      expect(firstLogDescription).toContain('{ "debug": true, "level": 5 }');
      expect(secondLogDescription).toContain('{ "debug": false, "level": 1 }');
    });

    test("nested dictionary mutation doesn't affect earlier log descriptions", () => {
      const code = `
        set data to {"user": {"name": "Alice", "age": 30}}
        log data
        change data["user"]["age"] to 31
        log data
      `;

      const { frames, error } = interpret(code);
      expect(error).toBeNull();

      const logFrames = frames.filter(f => f.result?.type === "LogStatement");
      expect(logFrames).toHaveLength(2);

      const firstLogDescription = logFrames[0].generateDescription();
      const secondLogDescription = logFrames[1].generateDescription();

      expect(firstLogDescription).toContain('{ "user": { "name": "Alice", "age": 30 } }');
      expect(secondLogDescription).toContain('{ "user": { "name": "Alice", "age": 31 } }');
    });
  });

  describe("mixed nested structures", () => {
    test("list containing dictionaries mutation", () => {
      const code = `
        set data to [{"id": 1}, {"id": 2}]
        log data
        change data[2]["id"] to 99
        log data
      `;

      const { frames, error } = interpret(code);
      expect(error).toBeNull();

      const logFrames = frames.filter(f => f.result?.type === "LogStatement");
      expect(logFrames).toHaveLength(2);

      const firstLogDescription = logFrames[0].generateDescription();
      const secondLogDescription = logFrames[1].generateDescription();

      expect(firstLogDescription).toContain('[ { "id": 1 }, { "id": 2 } ]');
      expect(secondLogDescription).toContain('[ { "id": 1 }, { "id": 99 } ]');
    });

    test("dictionary containing lists mutation", () => {
      const code = `
        set config to {"items": [1, 2, 3], "flags": [true, false]}
        log config
        change config["items"][2] to 10
        log config
      `;

      const { frames, error } = interpret(code);
      expect(error).toBeNull();

      const logFrames = frames.filter(f => f.result?.type === "LogStatement");
      expect(logFrames).toHaveLength(2);

      const firstLogDescription = logFrames[0].generateDescription();
      const secondLogDescription = logFrames[1].generateDescription();

      expect(firstLogDescription).toContain('{ "items": [ 1, 2, 3 ], "flags": [ true, false ] }');
      expect(secondLogDescription).toContain('{ "items": [ 1, 10, 3 ], "flags": [ true, false ] }');
    });

    test("complex nested structure with multiple mutations", () => {
      const code = `
        set complex to {"data": [{"values": [1, 2]}, {"values": [3, 4]}]}
        log complex
        change complex["data"][2]["values"][2] to 99
        log complex
        change complex["data"][1]["values"] to [100, 200]
        log complex
      `;

      const { frames, error } = interpret(code);
      expect(error).toBeNull();

      const logFrames = frames.filter(f => f.result?.type === "LogStatement");
      expect(logFrames).toHaveLength(3);

      const firstLogDescription = logFrames[0].generateDescription();
      const secondLogDescription = logFrames[1].generateDescription();
      const thirdLogDescription = logFrames[2].generateDescription();

      expect(firstLogDescription).toContain('{ "data": [ { "values": [ 1, 2 ] }, { "values": [ 3, 4 ] } ] }');
      expect(secondLogDescription).toContain('{ "data": [ { "values": [ 1, 2 ] }, { "values": [ 3, 99 ] } ] }');
      expect(thirdLogDescription).toContain('{ "data": [ { "values": [ 100, 200 ] }, { "values": [ 3, 99 ] } ] }');
    });
  });

  describe("edge cases", () => {
    test("empty list and dictionary", () => {
      const code = `
        set emptyList to []
        set emptyDict to {}
        log emptyList
        log emptyDict
        change emptyList to [1]
        change emptyDict to {"a": 1}
        log emptyList
        log emptyDict
      `;

      const { frames, error } = interpret(code);
      expect(error).toBeNull();

      const logFrames = frames.filter(f => f.result?.type === "LogStatement");
      expect(logFrames).toHaveLength(4);

      expect(logFrames[0].generateDescription()).toContain("[]");
      expect(logFrames[1].generateDescription()).toContain("{}");
      expect(logFrames[2].generateDescription()).toContain("[ 1 ]");
      expect(logFrames[3].generateDescription()).toContain('{ "a": 1 }');
    });

    test("list with mixed types", () => {
      const code = `
        set mixed to [42, "hello", true, [1, 2], {"x": 10}]
        log mixed
        change mixed[2] to "world"
        change mixed[5]["x"] to 20
        log mixed
      `;

      const { frames, error } = interpret(code);
      expect(error).toBeNull();

      const logFrames = frames.filter(f => f.result?.type === "LogStatement");
      expect(logFrames).toHaveLength(2);

      const firstLogDescription = logFrames[0].generateDescription();
      const secondLogDescription = logFrames[1].generateDescription();

      expect(firstLogDescription).toContain('[ 42, "hello", true, [ 1, 2 ], { "x": 10 } ]');
      expect(secondLogDescription).toContain('[ 42, "world", true, [ 1, 2 ], { "x": 20 } ]');
    });
  });

  describe("block types with complex mutations", () => {
    describe("binary expressions", () => {
      test("binary expression with mutable operands", () => {
        const code = `
          set list1 to [1, 2, 3]
          set list2 to [4, 5, 6]
          log list1[1] + list2[2]
          change list1[1] to 100
          change list2[2] to 200
          log list1[1] + list2[2]
        `;

        const { frames, error } = interpret(code);
        expect(error).toBeNull();

        const logFrames = frames.filter(f => f.result?.type === "LogStatement");
        expect(logFrames).toHaveLength(2);

        const firstLogDescription = logFrames[0].generateDescription();
        const secondLogDescription = logFrames[1].generateDescription();

        expect(firstLogDescription).toContain("6"); // 1 + 5
        expect(secondLogDescription).toContain("300"); // 100 + 200
      });

      test("complex nested arithmetic with mutations", () => {
        const code = `
          set data to {"x": [10, 20], "y": [30, 40]}
          log data["x"][1] * data["y"][1]
          change data["x"][1] to 5
          change data["y"][1] to 100
          log data["x"][1] * data["y"][1]
        `;

        const { frames, error } = interpret(code);
        expect(error).toBeNull();

        const logFrames = frames.filter(f => f.result?.type === "LogStatement");
        expect(logFrames).toHaveLength(2);

        const firstLogDescription = logFrames[0].generateDescription();
        const secondLogDescription = logFrames[1].generateDescription();

        expect(firstLogDescription).toContain("300"); // 10 * 30
        expect(secondLogDescription).toContain("500"); // 5 * 100
      });
    });

    describe("function calls with mutations", () => {
      test("function returning mutable structure", () => {
        const code = `
          function createMatrix do
            return [[1, 2], [3, 4]]
          end

          set matrix to createMatrix()
          log matrix[1][1] + matrix[2][2]
          change matrix[1][1] to 100
          change matrix[2][2] to 200
          log matrix[1][1] + matrix[2][2]
        `;

        const { frames, error } = interpret(code);
        expect(error).toBeNull();

        const logFrames = frames.filter(f => f.result?.type === "LogStatement");
        expect(logFrames).toHaveLength(2);

        const firstLogDescription = logFrames[0].generateDescription();
        const secondLogDescription = logFrames[1].generateDescription();

        expect(firstLogDescription).toContain("5"); // 1 + 4
        expect(secondLogDescription).toContain("300"); // 100 + 200
      });
    });

    describe("get element with complex mutations", () => {
      test("chained element access preserves immutability", () => {
        const code = `
          set data to {"a": {"b": {"c": [100, 200, 300]}}}
          log data["a"]["b"]["c"][2]
          change data["a"]["b"]["c"][2] to 999
          log data["a"]["b"]["c"][2]
        `;

        const { frames, error } = interpret(code);
        expect(error).toBeNull();

        const logFrames = frames.filter(f => f.result?.type === "LogStatement");
        expect(logFrames).toHaveLength(2);

        const firstLogDescription = logFrames[0].generateDescription();
        const secondLogDescription = logFrames[1].generateDescription();

        expect(firstLogDescription).toContain("200");
        expect(secondLogDescription).toContain("999");
      });

      test("list slice mutations", () => {
        const code = `
          set matrix to [[1, 2, 3], [4, 5, 6], [7, 8, 9]]
          set row to matrix[2]
          log row[1] + row[2] + row[3]
          change matrix[2][1] to 100
          change matrix[2][2] to 200
          change matrix[2][3] to 300
          log matrix[2][1] + matrix[2][2] + matrix[2][3]
        `;

        const { frames, error } = interpret(code);
        expect(error).toBeNull();

        const logFrames = frames.filter(f => f.result?.type === "LogStatement");
        expect(logFrames).toHaveLength(2);

        const firstLogDescription = logFrames[0].generateDescription();
        const secondLogDescription = logFrames[1].generateDescription();

        expect(firstLogDescription).toContain("12"); // 4 + 5 + 6
        expect(secondLogDescription).toContain("600"); // 100 + 200 + 300
      });
    });

    describe("logical expressions", () => {
      test("logical ops with mutable values", () => {
        const code = `
          set list1 to [1, 2, 3]
          set list2 to [4, 5, 6]
          log (list1[1] > 0) and (list2[1] < 10)
          change list1[1] to -5
          change list2[1] to 20
          log (list1[1] > 0) and (list2[1] < 10)
        `;

        const { frames, error } = interpret(code);
        expect(error).toBeNull();

        const logFrames = frames.filter(f => f.result?.type === "LogStatement");
        expect(logFrames).toHaveLength(2);

        const firstLogDescription = logFrames[0].generateDescription();
        const secondLogDescription = logFrames[1].generateDescription();

        expect(firstLogDescription).toContain("true");
        expect(secondLogDescription).toContain("false");
      });
    });

    describe("unary expressions", () => {
      test("unary ops with mutable values", () => {
        const code = `
          set values to {"x": 10, "y": true}
          log -values["x"]
          log not values["y"]
          change values["x"] to -5
          change values["y"] to false
          log -values["x"]
          log not values["y"]
        `;

        const { frames, error } = interpret(code);
        expect(error).toBeNull();

        const logFrames = frames.filter(f => f.result?.type === "LogStatement");
        expect(logFrames).toHaveLength(4);

        expect(logFrames[0].generateDescription()).toContain("-10");
        expect(logFrames[1].generateDescription()).toContain("false");
        expect(logFrames[2].generateDescription()).toContain("5");
        expect(logFrames[3].generateDescription()).toContain("true");
      });
    });
  });
});
