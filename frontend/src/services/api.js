const API_BASE = "/api";

async function request(url, options = {}) {
  const res = await fetch(`${API_BASE}${url}`, {
    headers: { "Content-Type": "application/json", ...options.headers },
    ...options,
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({ detail: "Request failed" }));
    throw new Error(err.detail || `HTTP ${res.status}`);
  }
  return res.json();
}

export async function convertCurrency(from, to, amount) {
  return request(`/convert?from=${from}&to=${to}&amount=${amount}`);
}

export async function getHistoricalRates(from, to, days = 30) {
  return request(`/history?from=${from}&to=${to}&days=${days}`);
}

export async function getFavorites() {
  return request("/favorites");
}

export async function addFavorite(from, to) {
  return request("/favorites", {
    method: "POST",
    body: JSON.stringify({ from: from, to: to }),
  });
}

export async function deleteFavorite(id) {
  return request(`/favorites/${id}`, { method: "DELETE" });
}

export async function getConversionHistory() {
  return request("/conversions");
}

export async function calculateTravelBudget(baseCurrency, amount) {
  return request("/travel-budget", {
    method: "POST",
    body: JSON.stringify({ base_currency: baseCurrency, amount: amount }),
  });
}

export async function getCurrencies() {
  return request("/currencies");
}
