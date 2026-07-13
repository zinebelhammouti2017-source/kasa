import { API_URL } from "../config/api";
export async function getProperties() {
  const response = await fetch(`${API_URL}/properties`);

  if (!response.ok) {
    throw new Error("Erreur lors de la récupération des propriétés");
  }

  return response.json();
}

export async function getPropertyById(id) {
  const response = await fetch(`${API_URL}/properties/${id}`);

  if (!response.ok) {
    throw new Error("Erreur lors de la récupération de la propriété");
  }

  return response.json();
}