import { beforeEach, describe, expect, it, vi } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import FavoritesList from "../FavoritesList";

const favoritesServiceMock = vi.hoisted(() => ({
  getFavoriteIds: vi.fn(),
}));

vi.mock("@/lib/services/favoritesService", () => favoritesServiceMock);

vi.mock("@/components/PropertyGrid/PropertyGrid", () => ({
  default: ({ properties, onFavoriteChange }) => (
    <section aria-label="Logements favoris">
      {properties.map((property) => (
        <article key={property.id}>
          <h2>{property.title}</h2>
          <button
            type="button"
            onClick={() => onFavoriteChange(property.id, false)}
          >
            Retirer {property.title} des favoris
          </button>
        </article>
      ))}
    </section>
  ),
}));

const properties = [
  {
    id: "property-1",
    title: "Appartement cosy",
  },
  {
    id: "property-2",
    title: "Maison lumineuse",
  },
];

describe("FavoritesList", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("affiche un message vide quand aucun logement n'est favori", () => {
    favoritesServiceMock.getFavoriteIds.mockReturnValue([]);

    render(<FavoritesList properties={properties} />);

    expect(
      screen.getByText(/vous n.*avez encore ajout/i)
    ).toBeInTheDocument();
  });

  it("affiche uniquement les logements favoris", async () => {
    favoritesServiceMock.getFavoriteIds.mockReturnValue(["property-1"]);

    render(<FavoritesList properties={properties} />);

    expect(
      await screen.findByRole("heading", {
        name: /appartement cosy/i,
      })
    ).toBeInTheDocument();
    expect(
      screen.queryByRole("heading", {
        name: /maison lumineuse/i,
      })
    ).not.toBeInTheDocument();
  });

  it("retire le logement de la liste et affiche le message vide apres suppression", async () => {
    const user = userEvent.setup();

    favoritesServiceMock.getFavoriteIds.mockReturnValue(["property-1"]);

    render(<FavoritesList properties={properties} />);

    const removeButton = await screen.findByRole("button", {
      name: /retirer appartement cosy des favoris/i,
    });

    await user.click(removeButton);

    await waitFor(() => {
      expect(
        screen.queryByRole("heading", {
          name: /appartement cosy/i,
        })
      ).not.toBeInTheDocument();
    });

    expect(
      screen.getByText(/vous n.*avez encore ajout/i)
    ).toBeInTheDocument();
  });
});
