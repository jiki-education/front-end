import { CodeMirror } from "./codemirror/CodeMirror";

export default function CodeEditor() {
  // const { code } = useOrchestratorStore(orchestrator);

  // return (
  //   <textarea
  //     value={code}
  //     onChange={(e) => orchestrator.setCode(e.target.value)}
  //     className="w-full h-full p-4 font-mono text-sm bg-gray-900 text-gray-100 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
  //     placeholder="Write your code here..."
  //   />
  // );

  return <CodeMirror />;
}
