import {
  beforeEach,
  describe,
  expect,
  it,
  vi,
} from "vitest";

import {
  addFavorite,
  getFavoriteIds,
  isFavorite,
  removeFavorite,
  toggleFavorite,
} from "../favoritesService";

const cookiesMock = vi.hoisted(() => ({
  getToken: vi.fn(),
  removeToken: vi.fn(),
}));

vi.mock("@/lib/utils/cookies", () => cookiesMock);

const STORAGE_KEY = "kasa-favorites";

describe("favoritesService en mode déconnecté", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    localStorage.clear();

    cookiesMock.getToken.mockReturnValue(null);
  });

  it("retourne une liste vide quand aucun favori n'est enregistré", async () => {
    const favoriteIds = await getFavoriteIds();

    expect(favoriteIds).toEqual([]);
  });

  it("récupère les identifiants enregistrés dans le localStorage", async () => {
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify(["property-1", 2])
    );

    const favoriteIds = await getFavoriteIds();

    expect(favoriteIds).toEqual(["property-1", "2"]);
  });

  it("retourne une liste vide lorsque les données enregistrées sont invalides", async () => {
    localStorage.setItem(
      STORAGE_KEY,
      "données-invalides"
    );

    const favoriteIds = await getFavoriteIds();

    expect(favoriteIds).toEqual([]);
  });

  it("ajoute un logement aux favoris", async () => {
    await addFavorite("property-1");

    expect(
      JSON.parse(localStorage.getItem(STORAGE_KEY))
    ).toEqual(["property-1"]);
  });

  it("n'ajoute pas deux fois le même logement", async () => {
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify(["property-1"])
    );

    await addFavorite("property-1");

    expect(
      JSON.parse(localStorage.getItem(STORAGE_KEY))
    ).toEqual(["property-1"]);
  });

  it("supprime un logement des favoris", async () => {
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify(["property-1", "property-2"])
    );

    await removeFavorite("property-1");

    expect(
      JSON.parse(localStorage.getItem(STORAGE_KEY))
    ).toEqual(["property-2"]);
  });

  it("ajoute puis retire un logement avec toggleFavorite", async () => {
    const addedFavoriteState =
      await toggleFavorite("property-1");

    expect(addedFavoriteState).toBe(true);

    await expect(
      isFavorite("property-1")
    ).resolves.toBe(true);

    const removedFavoriteState =
      await toggleFavorite("property-1");

    expect(removedFavoriteState).toBe(false);

    await expect(
      isFavorite("property-1")
    ).resolves.toBe(false);
  });
});