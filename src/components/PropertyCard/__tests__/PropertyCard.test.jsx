import { createElement } from "react";
import {
  beforeEach,
  describe,
  expect,
  it,
  vi,
} from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import PropertyCard from "../PropertyCard";

const favoritesServiceMock = vi.hoisted(() => ({
  isFavorite: vi.fn(),
  toggleFavorite: vi.fn(),
}));

vi.mock(
  "@/lib/services/favoritesService",
  () => favoritesServiceMock
);

vi.mock("next/image", () => ({
  default: ({ src, alt }) =>
    createElement("img", { src, alt }),
}));

vi.mock("next/link", () => ({
  default: ({ href, children, ...props }) => (
    <a href={href} {...props}>
      {children}
    </a>
  ),
}));

const property = {
  id: "property-1",
  title: "Appartement cosy",
  location: "Paris",
  price_per_night: 95,
  cover: "/cover.jpg",
};

describe("PropertyCard", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("affiche le bouton favori non actif par défaut", async () => {
    favoritesServiceMock.isFavorite.mockResolvedValue(false);

    render(<PropertyCard property={property} />);

    const favoriteButton = await screen.findByRole(
      "button",
      {
        name: /ajouter appartement cosy aux favoris/i,
      }
    );

    expect(favoriteButton).toHaveAttribute(
      "aria-pressed",
      "false"
    );
  });

  it("affiche le bouton favori actif quand le logement est déjà favori", async () => {
    favoritesServiceMock.isFavorite.mockResolvedValue(true);

    render(<PropertyCard property={property} />);

    const favoriteButton = await screen.findByRole(
      "button",
      {
        name: /retirer appartement cosy des favoris/i,
      }
    );

    expect(favoriteButton).toHaveAttribute(
      "aria-pressed",
      "true"
    );
  });

  it("met à jour le bouton favori et notifie le parent au clic", async () => {
    const user = userEvent.setup();
    const onFavoriteChange = vi.fn();

    favoritesServiceMock.isFavorite.mockResolvedValue(false);
    favoritesServiceMock.toggleFavorite.mockResolvedValue(
      true
    );

    render(
      <PropertyCard
        property={property}
        onFavoriteChange={onFavoriteChange}
      />
    );

    const favoriteButton = await screen.findByRole(
      "button",
      {
        name: /ajouter appartement cosy aux favoris/i,
      }
    );

    await user.click(favoriteButton);

    expect(
      favoritesServiceMock.toggleFavorite
    ).toHaveBeenCalledWith(property.id, false);

    const activeFavoriteButton = await screen.findByRole(
      "button",
      {
        name: /retirer appartement cosy des favoris/i,
      }
    );

    expect(activeFavoriteButton).toHaveAttribute(
      "aria-pressed",
      "true"
    );

    expect(onFavoriteChange).toHaveBeenCalledWith(
      property.id,
      true
    );
  });
});