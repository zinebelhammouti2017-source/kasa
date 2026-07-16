import { describe, expect, it , vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import PropertyCarousel from "../PropertyCarousel";

// Mock de next/image
vi.mock("next/image", () => ({
  default: ({ src, alt }) => <img src={src} alt={alt} />,
}));

const pictures = [
  "/image1.jpg",
  "/image2.jpg",
  "/image3.jpg",
];

describe("PropertyCarousel", () => {
  it("affiche la première image au chargement", () => {
    render(
      <PropertyCarousel
        pictures={pictures}
        title="Appartement test"
      />
    );

    expect(
      screen.getByAltText("Appartement test - photo 1 sur 3")
    ).toBeInTheDocument();
  });

  it("passe à la photo suivante", async () => {
    const user = userEvent.setup();

    render(
      <PropertyCarousel
        pictures={pictures}
        title="Appartement test"
      />
    );

    await user.click(
      screen.getByRole("button", {
        name: /photo suivante/i,
      })
    );

    expect(
      screen.getByAltText("Appartement test - photo 2 sur 3")
    ).toBeInTheDocument();
  });

  it("revient à la dernière photo depuis la première", async () => {
    const user = userEvent.setup();

    render(
      <PropertyCarousel
        pictures={pictures}
        title="Appartement test"
      />
    );

    await user.click(
      screen.getByRole("button", {
        name: /photo précédente/i,
      })
    );

    expect(
      screen.getByAltText("Appartement test - photo 3 sur 3")
    ).toBeInTheDocument();
  });

  it("ne montre pas les boutons si une seule image est disponible", () => {
    render(
      <PropertyCarousel
        pictures={["/unique.jpg"]}
        title="Appartement test"
      />
    );

    expect(
      screen.queryByRole("button", {
        name: /photo suivante/i,
      })
    ).not.toBeInTheDocument();

    expect(
      screen.queryByRole("button", {
        name: /photo précédente/i,
      })
    ).not.toBeInTheDocument();
  });
});