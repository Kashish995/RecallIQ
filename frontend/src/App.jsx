import { useState } from "react";

function App() {
  const [topic, setTopic] = useState("");
  const [date, setDate] = useState("");
  const [confidence, setConfidence] = useState(5);

  const [topics, setTopics] = useState([]);

  const handleSubmit = (e) => {
    e.preventDefault();

    const newTopic = {
      topic,
      date,
      confidence,
    };

    setTopics([...topics, newTopic]);

    setTopic("");
    setDate("");
    setConfidence(5);
  };

  return (
    <div style={{ padding: "30px" }}>
      <h1>Memory Gap Detector</h1>

      <form onSubmit={handleSubmit}>
        <div>
          <label>Topic Name</label>
          <br />
          <input
            type="text"
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
          />
        </div>

        <br />

        <div>
          <label>Date Learned</label>
          <br />
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
          />
        </div>

        <br />

        <div>
          <label>Confidence (1-10)</label>
          <br />
          <input
            type="number"
            min="1"
            max="10"
            value={confidence}
            onChange={(e) => setConfidence(e.target.value)}
          />
        </div>

        <br />

        <button type="submit">Save Topic</button>
      </form>

      <hr />

      <h2>Saved Topics</h2>

     {topics.map((item, index) => {
  const retention = item.confidence * 10;

  let status = "";

  if (retention >= 70) {
    status = "Strong Memory";
  } else if (retention >= 40) {
    status = "Moderate Risk";
  } else {
    status = "Needs Revision";
  }

  return (
    <div
      key={index}
      style={{
        border: "1px solid gray",
        padding: "15px",
        marginBottom: "10px",
        borderRadius: "10px",
      }}
    >
      <h3>{item.topic}</h3>

      <p>Date Learned: {item.date}</p>

      <p>Confidence: {item.confidence}/10</p>

      <p>Retention Score: {retention}%</p>

      <p>Status: {status}</p>
    </div>
  );
})}
    </div>
  );
}

export default App;