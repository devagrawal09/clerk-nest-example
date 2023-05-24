import { useState } from "react";
import { useAuth } from "@clerk/clerk-react";
import "./styles/App.css";

const apiUrl = "http://localhost:3000";

function App() {
  const [message, setMessage] = useState("");
  console.log({ message });
  function getHello() {
    fetch(`${apiUrl}/hello`)
      .then((res) => res.json())
      .then((data) => setMessage(data.message));
  }

  const { getToken } = useAuth();
  async function getWelcome() {
    fetch(`${apiUrl}/welcome`, {
      headers: { Authorization: `Bearer ${await getToken()}` },
    })
      .then((res) => res.json())
      .then((data) => setMessage(data.message));
  }

  return (
    <div className="app">
      <h1>Clerk + React</h1>
      <div>
        <button onClick={getHello}>Get Hello</button>
        <button onClick={getWelcome}>Get Welcome</button>
      </div>
      <p>{message}</p>
      <a
        href="https://docs.clerk.dev/reference/clerk-react"
        target="_blank"
        rel="noopener noreferrer"
      >
        Learn more
      </a>
    </div>
  );
}

export default App;
