import {
  addFavorite,
  getFavoriteIds,
  isFavorite,
  removeFavorite,
  toggleFavorite,
} from "../favoritesService";

describe("favoritesService", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it("retourne une liste vide quand aucun favori n'est enregistré", () => {
    expect(getFavoriteIds()).toEqual([]);
  });

  it("retourne les identifiants enregistrés dans le localStorage", () => {
    localStorage.setItem(
      "kasa-favorites",
      JSON.stringify(["property-1", "property-2"])
    );

    expect(getFavoriteIds()).toEqual([
      "property-1",
      "property-2",
    ]);
  });

  it("ajoute un logement sans créer de doublon", () => {
    addFavorite("property-1");
    addFavorite("property-1");

    expect(getFavoriteIds()).toEqual(["property-1"]);
    expect(isFavorite("property-1")).toBe(true);
  });

  it("supprime un logement des favoris", () => {
    addFavorite("property-1");
    addFavorite("property-2");

    removeFavorite("property-1");

    expect(getFavoriteIds()).toEqual(["property-2"]);
    expect(isFavorite("property-1")).toBe(false);
  });

  it("ajoute un logement avec toggleFavorite", () => {
    const newFavoriteState = toggleFavorite("property-1");

    expect(newFavoriteState).toBe(true);
    expect(isFavorite("property-1")).toBe(true);
  });

  it("retire un logement avec toggleFavorite", () => {
    addFavorite("property-1");

    const newFavoriteState = toggleFavorite("property-1");

    expect(newFavoriteState).toBe(false);
    expect(isFavorite("property-1")).toBe(false);
  });

  it("retourne une liste vide si le localStorage contient une valeur invalide", () => {
    localStorage.setItem(
      "kasa-favorites",
      "valeur-invalide"
    );

    expect(getFavoriteIds()).toEqual([]);
  });
});