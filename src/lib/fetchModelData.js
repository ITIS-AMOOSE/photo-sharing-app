const SERVER_URL = process.env.REACT_APP_API_URL;

const fetchModel = async (url) => {
  if (!SERVER_URL) {
    throw new Error("Missing REACT_APP_API_URL in .env");
  }

  const response = await fetch(SERVER_URL + url, {
    credentials: "include",
  });

  if (!response.ok) {
    const message = await response.text();
    throw new Error(message || `HTTP error ${response.status}`);
  }

  return response.json();
};

export default fetchModel;
