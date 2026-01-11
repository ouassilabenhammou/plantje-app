const BASE_URL = "https://perenual.com/api/v2";

// Plantenlijst
export async function getSpeciesList() {
  const API_KEY = process.env.EXPO_PUBLIC_PERENUAL_API_KEY;
  if (!API_KEY) {
    throw new Error("EXPO_PUBLIC_PERENUAL_API_KEY ontbreekt");
  }

  const url = `${BASE_URL}/species-list?key=${API_KEY}`;

  const res = await fetch(url);
  if (!res.ok) {
    throw new Error("Het ophalen van data is mislukt");
  }
  return res.json();
}
