const SERVER_URL = process.env.REACT_APP_API_URL;

const getToken = () => {
  return localStorage.getItem("photo_app_token");
};

const fetchModel = async (url) => {
  if (!SERVER_URL) {
    throw new Error("Missing REACT_APP_API_URL in .env");
  }

  const token = getToken();

  const headers = {};

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  const response = await fetch(SERVER_URL + url, {
    headers,
  });

  if (!response.ok) {
    const message = await response.text();
    throw new Error(message || `HTTP error ${response.status}`);
  }

  return response.json();
};

export default fetchModel;
