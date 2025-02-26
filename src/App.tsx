import { useState } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import "./App.css";
import { useMutation } from "convex/react";
import { api } from "../convex/_generated/api";

function App() {
  const [count, setCount] = useState(0);
  const generateMockData = useMutation(
    api.mockData.generateJerusalemGameMockData
  );
  const [loading, setLoading] = useState(false);
  const [gameId, setGameId] = useState<string | null>(null);

  const handleGenerateData = async () => {
    setLoading(true);
    try {
      const { gameId } = await generateMockData();
      setGameId(gameId);
      console.log("Game created with ID:", gameId);
    } catch (error) {
      console.error("Error creating mock data:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div>
        <a href="https://vite.dev" target="_blank">
          <img src={viteLogo} className="logo" alt="Vite logo" />
        </a>
        <a href="https://react.dev" target="_blank">
          <img src={reactLogo} className="logo react" alt="React logo" />
        </a>
      </div>
      <h1>GeoQuiz Admin</h1>
      <div className="card">
        <button onClick={() => setCount((count) => count + 1)}>
          count is {count}
        </button>
        <p>
          Edit <code>src/App.tsx</code> and save to test HMR
        </p>
      </div>

      <div className="mt-8">
        <button
          onClick={handleGenerateData}
          disabled={loading}
          className="px-4 py-2 bg-blue-500 text-white rounded disabled:bg-blue-300"
        >
          {loading ? "Creating..." : "Generate Jerusalem Game Data"}
        </button>
        {gameId && <p className="mt-2">Game created! ID: {gameId}</p>}
      </div>

      <p className="read-the-docs">
        Click on the Vite and React logos to learn more
      </p>
    </>
  );
}

export default App;
