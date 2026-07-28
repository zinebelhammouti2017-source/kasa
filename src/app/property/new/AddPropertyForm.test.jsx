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

import AddPropertyForm from "./AddPropertyForm";

const routerMock = vi.hoisted(() => ({
  push: vi.fn(),
  refresh: vi.fn(),
}));

const propertiesServiceMock = vi.hoisted(() => ({
  createProperty: vi.fn(),
  uploadPropertyImage: vi.fn(),
}));

vi.mock("next/navigation", () => ({
  useRouter: () => routerMock,
}));

vi.mock(
  "@/lib/services/propertiesService",
  () => propertiesServiceMock
);

function renderForm() {
  render(
    <>
      <button
        type="submit"
        form="add-property-form"
      >
        Ajouter
      </button>

      <AddPropertyForm />
    </>
  );
}

async function fillRequiredFields(user) {
  await user.type(
    screen.getByLabelText(/titre de la propriété/i),
    "Appartement lumineux"
  );
  await user.type(
    screen.getByLabelText(/^description$/i),
    "Un logement agréable et bien situé."
  );
  await user.type(
    screen.getByLabelText(/code postal/i),
    "75011"
  );
  await user.type(
    screen.getByLabelText(/^localisation$/i),
    "Paris"
  );
  await user.type(
    screen.getByLabelText(/prix par nuit/i),
    "120"
  );
  await user.type(
    screen.getByLabelText(/nom de l’hôte/i),
    "Zineb"
  );
}

function createImage(
  name,
  {
    type = "image/jpeg",
    size = 10,
  } = {}
) {
  return new File([new Uint8Array(size)], name, {
    type,
  });
}

function getFileInput(id) {
  return document.getElementById(id);
}

describe("AddPropertyForm", () => {
  beforeEach(() => {
    vi.clearAllMocks();

    propertiesServiceMock.uploadPropertyImage.mockImplementation(
      async (file, purpose) => ({
        url: `/uploads/${purpose}-${file.name}`,
      })
    );

    propertiesServiceMock.createProperty.mockResolvedValue({
      id: "property-42",
    });
  });

  it("affiche les champs obligatoires et les règles des images", () => {
    renderForm();

    expect(
      screen.getByLabelText(/titre de la propriété/i)
    ).toBeRequired();
    expect(
      screen.getByLabelText(/prix par nuit/i)
    ).toHaveAttribute("min", "1");
    expect(
      getFileInput("property-images")
    ).toHaveAttribute("multiple");
    expect(
      screen.getByText(/10 images maximum/i)
    ).toBeInTheDocument();
  });

  it("refuse un fichier dont le format n’est pas accepté", async () => {
    const user = userEvent.setup({
      applyAccept: false,
    });

    renderForm();

    const invalidFile = new File(
      ["contenu"],
      "document.pdf",
      {
        type: "application/pdf",
      }
    );

    await user.upload(
      getFileInput("cover-image"),
      invalidFile
    );

    expect(
      screen.getByRole("alert")
    ).toHaveTextContent(
      /document\.pdf.*n’est pas accepté/i
    );
    expect(
      propertiesServiceMock.uploadPropertyImage
    ).not.toHaveBeenCalled();
  });

  it("refuse une image dépassant 5 Mo", async () => {
    const user = userEvent.setup();

    renderForm();

    const oversizedImage = createImage("grande-photo.jpg", {
      size: 5 * 1024 * 1024 + 1,
    });

    await user.upload(
      getFileInput("host-picture"),
      oversizedImage
    );

    expect(
      screen.getByRole("alert")
    ).toHaveTextContent(
      /grande-photo\.jpg.*dépasse la taille maximale de 5 Mo/i
    );
  });

  it("refuse plus de 10 images du logement", async () => {
    const user = userEvent.setup();

    renderForm();

    const pictures = Array.from(
      { length: 11 },
      (_, index) => createImage(`photo-${index + 1}.jpg`)
    );

    await user.upload(
      getFileInput("property-images"),
      pictures
    );

    expect(
      screen.getByRole("alert")
    ).toHaveTextContent(
      /au maximum 10 images du logement/i
    );
  });

  it("envoie les images et les données complètes à l’API", async () => {
    const user = userEvent.setup();

    renderForm();
    await fillRequiredFields(user);

    const cover = createImage("cover.jpg");
    const pictures = [
      createImage("salon.jpg"),
      createImage("chambre.webp", {
        type: "image/webp",
      }),
    ];
    const hostPicture = createImage("zineb.png", {
      type: "image/png",
    });

    await user.upload(
      getFileInput("cover-image"),
      cover
    );
    await user.upload(
      getFileInput("property-images"),
      pictures
    );
    await user.upload(
      getFileInput("host-picture"),
      hostPicture
    );
    await user.click(
      screen.getByRole("checkbox", {
        name: /wi-fi/i,
      })
    );
    await user.click(
      screen.getByRole("checkbox", {
        name: /^famille$/i,
      })
    );
    await user.type(
      screen.getByLabelText(
        /ajouter une catégorie personnalisée/i
      ),
      "Centre-ville"
    );
    await user.click(
      screen.getByRole("button", {
        name: /ajouter le tag personnalisé/i,
      })
    );
    await user.click(
      screen.getByRole("button", {
        name: /^ajouter$/i,
      })
    );

    await waitFor(() => {
      expect(
        propertiesServiceMock.createProperty
      ).toHaveBeenCalledWith({
        title: "Appartement lumineux",
        description:
          "Un logement agréable et bien situé.",
        location: "75011 Paris",
        price_per_night: 120,
        host: {
          name: "Zineb",
          picture:
            "/uploads/user-picture-zineb.png",
        },
        pictures: [
          "/uploads/property-picture-salon.jpg",
          "/uploads/property-picture-chambre.webp",
        ],
        equipments: ["Wi-Fi"],
        tags: ["Famille", "Centre-ville"],
        cover:
          "/uploads/property-cover-cover.jpg",
      });
    });

    expect(
      propertiesServiceMock.uploadPropertyImage
    ).toHaveBeenCalledTimes(4);
    expect(routerMock.push).toHaveBeenCalledWith(
      "/property/property-42"
    );
    expect(routerMock.refresh).toHaveBeenCalledOnce();
  });

  it("affiche un message clair lorsque l’API refuse le rôle", async () => {
    const user = userEvent.setup();

    propertiesServiceMock.createProperty.mockRejectedValue({
      status: 403,
    });

    renderForm();
    await fillRequiredFields(user);
    await user.click(
      screen.getByRole("button", {
        name: /^ajouter$/i,
      })
    );

    expect(
      await screen.findByRole("status")
    ).toHaveTextContent(
      /seuls les propriétaires et les administrateurs/i
    );
  });
});