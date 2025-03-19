export const triggerBackend = async () => {
  try {
    //this is for local
    // const response = await fetch("http://127.0.0.1:4000/start", {
    const response = await fetch(
      "https://s1w15x1qoc.execute-api.us-east-2.amazonaws.com/test",
      {
        method: "GET",
        headers: {
          "Content-type": "application/json",
        },
        // body: JSON.stringify({ message: "User would like to start" }),
      }
    );
    const data = await response.json();
    console.log("Response from backend:", data);
  } catch (error) {
    console.error(error);
  }
};
