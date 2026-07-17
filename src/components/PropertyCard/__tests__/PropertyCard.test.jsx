import { beforeEach, describe, expect, it, vi } from "vitest";
import { createElement } from "react";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import PropertyCard from "../PropertyCard";

const favoritesServiceMock = vi.hoisted(() => ({
  isFavorite: vi.fn(),
  toggleFavorite: vi.fn(),
}));

vi.mock("@/lib/services/favoritesService", () => favoritesServiceMock);

vi.mock("next/image", () => ({
  default: ({ src, alt }) => createElement("img", { src, alt }),
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

  it("affiche le bouton favori non actif par defaut", async () => {
    favoritesServiceMock.isFavorite.mockReturnValue(false);

    render(<PropertyCard property={property} />);

    const favoriteButton = await screen.findByRole("button", {
      name: /ajouter appartement cosy aux favoris/i,
    });

    expect(favoriteButton).toHaveAttribute("aria-pressed", "false");
  });

  it("affiche le bouton favori actif quand le logement est deja favori", async () => {
    favoritesServiceMock.isFavorite.mockReturnValue(true);

    render(<PropertyCard property={property} />);

    const favoriteButton = await screen.findByRole("button", {
      name: /retirer appartement cosy des favoris/i,
    });

    expect(favoriteButton).toHaveAttribute("aria-pressed", "true");
  });

  it("met a jour le bouton favori et notifie le parent au clic", async () => {
    const user = userEvent.setup();
    const onFavoriteChange = vi.fn();

    favoritesServiceMock.isFavorite.mockReturnValue(false);
    favoritesServiceMock.toggleFavorite.mockReturnValue(true);

    render(
      <PropertyCard
        property={property}
        onFavoriteChange={onFavoriteChange}
      />
    );

    const favoriteButton = await screen.findByRole("button", {
      name: /ajouter appartement cosy aux favoris/i,
    });

    await user.click(favoriteButton);

    expect(favoritesServiceMock.toggleFavorite).toHaveBeenCalledWith(
      property.id
    );
    expect(favoriteButton).toHaveAttribute("aria-pressed", "true");
    expect(onFavoriteChange).toHaveBeenCalledWith(property.id, true);
  });
});
