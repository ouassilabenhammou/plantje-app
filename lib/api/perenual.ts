const BASE_URL = "https://perenual.com/api/v2";

// API key

function getKey() {
  const API_KEY = process.env.EXPO_PUBLIC_PERENUAL_API_KEY;
  if (!API_KEY) {
    throw new Error("EXPO_PUBLIC_PERENUAL_API_KEY ontbreekt");
  }
  return API_KEY;
}

// Plantenlijst met paginatie

export async function getSpeciesList(page: number = 1, perPage: number = 10) {
  const API_KEY = getKey();
  const url = `${BASE_URL}/species-list?key=${API_KEY}&page=${page}&per_page=${perPage}`;

  const res = await fetch(url);
  if (!res.ok) {
    const errorBody = await res.text();
    console.error("API Error body:", errorBody);
    throw new Error(`Fetch failed: ${res.status}`);
  }

  return res.json();
}

// Plantendetails

export async function getSpeciesDetails(id: number) {
  const API_KEY = getKey();
  const url = `${BASE_URL}/species/details/${id}?key=${API_KEY}`;

  const res = await fetch(url);
  if (!res.ok) throw new Error("Species details ophalen mislukt");
  return res.json();
}
