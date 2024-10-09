const API_HOST = 'http://localhost:3000/';

async function fetchData(endpoint) {
  const url = `${API_HOST}${endpoint}`;
  
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Error fetching ${url}`);
    }
    return await response.json();
  } catch (error) {
    console.error('Error fetching:', error);
    return [];
  }
}
