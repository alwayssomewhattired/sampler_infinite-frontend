import Sidebar from "../Layout/Sidebar";
import Account from "../Layout/Account";
import ZachPhoto from "./ZachPhoto.jpg";

export default function AboutAuthor({ me }) {
  const stats = [
    "JavaScript",
    "React",
    "C++",
    "Python",
    "PostgreSQL",
    "Prisma",
    "AWS",
    "RTK",
  ];

  return (
    <>
      <div className="three-column-layout">
        <Sidebar />
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            width: "100%",
            marginLeft: "2em",
            height: "100%",
          }}
        >
          <div style={{ display: "flex", flexDirection: "row" }}>
            <h1 className="text" style={{ fontFamily: "monospace" }}>
              Name:{" "}
            </h1>
            <div style={{ marginLeft: "47%", position: "absolute" }}>
              <img src={ZachPhoto} style={{ height: "15em" }} />
            </div>
          </div>
          <h2 className="text" style={{ fontFamily: "monospace" }}>
            Zachary Malinka
          </h2>
          <h1 className="text" style={{ fontFamily: "monospace" }}>
            Stats:{" "}
          </h1>
          <div style={{ display: "flex", flexWrap: "wrap", gap: "0em" }}>
            {stats.map((stat, index) => (
              <div
                key={index}
                className="text"
                style={{
                  flex: "0 0 calc(33.333% - 1em)",
                }}
              >
                <h2 className="text" style={{ fontFamily: "monospace" }}>
                  {stat}
                </h2>
              </div>
            ))}
          </div>
          <h1 className="text" style={{ fontFamily: "monospace" }}>
            Description:
          </h1>
          <h2 className="text" style={{ fontFamily: "monospace" }}>
            I am a fullstack developer that specializes in JavaScript. This is
            my project that is hosted on AWS. My Frontend is built with React,
            RTK, and JavaScript. My backend is made with Express and Node.js,
            with a Prisma wrapper for high-level SQL creation. The
            samplerinfinite audio processor is built using C++. All three
            components run on EC2 instances to support user interaction and
            provide an engaging experience. This project also supports a user
            base. I run Python Lambda functions to help handle requests, and I
            use REST and WebSockets to communicate across my servers for other
            servers or to trigger Lambda functions.
          </h2>
          <h1 className="text" style={{ fontFamily: "monospace" }}>
            Links
          </h1>
          <div style={{ display: "flex", flexDirection: "column", gap: "1em" }}>
            <a
              className="text"
              href="https://github.com/alwayssomewhattired/sampler_infinite-frontend"
              target="_blank"
              rel="noopener noreferrer"
            >
              Frontend (React)
            </a>
            <a
              className="text"
              href="https://github.com/alwayssomewhattired/sampler_infinite-backend/tree/master"
              target="_blank"
              rel="noopener noreferrer"
            >
              Backend (Node.js + Prisma)
            </a>
            <a
              className="text"
              href="https://github.com/alwayssomewhattired/audioProcessor"
              target="_blank"
              rel="noopener noreferrer"
            >
              Audio Processor (C++)
            </a>
          </div>
        </div>
        <Account me={me} />
      </div>
    </>
  );
}
