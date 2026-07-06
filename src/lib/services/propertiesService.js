import { API_URL } from "../config/api";
export async function getProperties() {
  const response = await fetch(`${API_URL}/properties`);

  if (!response.ok) {
    throw new Error("Erreur lors de la récupération des propriétés");
  }

  return response.json();
}