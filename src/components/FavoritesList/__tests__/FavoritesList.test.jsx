import {
  beforeEach,
  describe,
  expect,
  it,
  vi,
} from "vitest";
import {
  render,
  screen,
  waitFor,
} from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import FavoritesList from "../FavoritesList";

const favoritesServiceMock = vi.hoisted(() => ({
  getFavoriteProperties: vi.fn(),
}));

vi.mock(
  "@/lib/services/favoritesService",
  () => favoritesServiceMock
);

vi.mock(
  "@/components/PropertyGrid/PropertyGrid",
  () => ({
    default: ({
      properties,
      onFavoriteChange,
    }) => (
      <section aria-label="Logements favoris">
        {properties.map((property) => (
          <article key={property.id}>
            <h2>{property.title}</h2>

            <button
              type="button"
              onClick={() =>
                onFavoriteChange(property.id, false)
              }
            >
              Retirer {property.title} des favoris
            </button>
          </article>
        ))}
      </section>
    ),
  })
);

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

  it("affiche un message vide quand aucun logement n'est favori", async () => {
    favoritesServiceMock.getFavoriteProperties.mockResolvedValue(
      []
    );

    render(<FavoritesList properties={properties} />);

    expect(
      await screen.findByText(
        /vous n.*avez encore ajout/i
      )
    ).toBeInTheDocument();

    expect(
      favoritesServiceMock.getFavoriteProperties
    ).toHaveBeenCalledWith(properties);
  });

  it("affiche uniquement les logements favoris", async () => {
    favoritesServiceMock.getFavoriteProperties.mockResolvedValue(
      [properties[0]]
    );

    render(<FavoritesList properties={properties} />);

    expect(
      await screen.findByRole("heading", {
        name: "Appartement cosy",
      })
    ).toBeInTheDocument();

    expect(
      screen.queryByRole("heading", {
        name: "Maison lumineuse",
      })
    ).not.toBeInTheDocument();
  });

  it("retire le logement de la liste et affiche le message vide après suppression", async () => {
    const user = userEvent.setup();

    favoritesServiceMock.getFavoriteProperties.mockResolvedValue(
      [properties[0]]
    );

    render(<FavoritesList properties={properties} />);

    const removeButton = await screen.findByRole(
      "button",
      {
        name: "Retirer Appartement cosy des favoris",
      }
    );

    await user.click(removeButton);

    await waitFor(() => {
      expect(
        screen.queryByRole("heading", {
          name: "Appartement cosy",
        })
      ).not.toBeInTheDocument();
    });

    expect(
      screen.getByText(/vous n.*avez encore ajout/i)
    ).toBeInTheDocument();
  });
});