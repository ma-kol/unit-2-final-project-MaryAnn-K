// Calls the .env.local
const BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080';

export async function getWeighInsForUser(userId) {
  const response = await fetch(`${BASE_URL}/api/weigh-ins/user/${userId}`);
  if (!response.ok) throw new Error(`Failed to fetch weigh-ins (${response.status})`);
  return response.json();
}

export async function getLatestWeighIn(userId) {
  const response = await fetch(`${BASE_URL}/api/weigh-ins/latest/${userId}`);
  if (!response.ok) throw new Error(`Failed to fetch latest weigh-in (${response.status})`);
  return response.json();
}

export async function createWeighIn({ userId, weight, notes, date }) {
  const response = await fetch(`${BASE_URL}/api/weigh-ins/add`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ userId, weight, notes, date })
  });
  if (!response.ok) {
    const err = await response.json().catch(() => ({}));
    throw new Error(err.message || `Create failed (${response.status})`);
  }
  return response.json();
}

export async function updateWeighIn(id, data) {
  const response = await fetch(`http://localhost:8080/api/weigh-ins/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(data)
  });

  if (!response.ok) {
    throw new Error("Failed to update weigh-in");
  }

  return response.json();
}

export async function deleteWeighIn(id) {
  const response = await fetch(`http://localhost:8080/api/weigh-ins/${id}`, {
    method: "DELETE"
  });

  if (!response.ok) {
    throw new Error("Failed to delete weigh-in");
  }
}