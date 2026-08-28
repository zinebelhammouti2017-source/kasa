"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

import {
  createProperty,
  uploadPropertyImage,
} from "@/lib/services/propertiesService";

import styles from "./page.module.css";

const EQUIPMENTS = [
  "Micro-ondes",
  "Douche italienne",
  "Frigo",
  "Wi-Fi",
  "Parking",
  "Sèche-cheveux",
  "Machine à laver",
  "Cuisine équipée",
  "Télévision",
  "Chambre séparée",
  "Climatisation",
  "Frigo américain",
  "Clic-clac",
  "Four",
  "Rangements",
  "Lit",
  "Bouilloire",
  "SDB",
  "Toilettes sèches",
  "Cintres",
  "Baie vitrée",
  "Hotte",
  "Baignoire",
  "Vue parc",
];

const CATEGORIES = [
  "Parc",
  "Night Life",
  "Culture",
  "Nature",
  "Touristique",
  "Vue sur mer",
  "Pour les couples",
  "Famille",
  "Forêt",
];

const ACCEPTED_IMAGE_TYPES = [
  "image/jpeg",
  "image/png",
  "image/webp",
];

const ACCEPTED_IMAGE_EXTENSIONS = [
  ".jpg",
  ".jpeg",
  ".png",
  ".webp",
];

const IMAGE_ACCEPT_ATTRIBUTE =
  ".jpg,.jpeg,.png,.webp,image/jpeg,image/png,image/webp";

const MAX_IMAGE_SIZE = 5 * 1024 * 1024;
const MAX_PROPERTY_PICTURES = 10;

function toggleSelection(currentSelection, value) {
  return currentSelection.includes(value)
    ? currentSelection.filter((item) => item !== value)
    : [...currentSelection, value];
}

function getImageValidationMessage(
  files,
  maxFiles = 1
) {
  if (files.length > maxFiles) {
    return `Vous pouvez sélectionner au maximum ${maxFiles} images du logement.`;
  }

  for (const file of files) {
    const extension = file.name
      .slice(file.name.lastIndexOf("."))
      .toLocaleLowerCase("fr");

    const hasAcceptedType =
      ACCEPTED_IMAGE_TYPES.includes(file.type);

    const hasAcceptedExtension =
      ACCEPTED_IMAGE_EXTENSIONS.includes(extension);

    if (!hasAcceptedType || !hasAcceptedExtension) {
      return `Le fichier « ${file.name} » n’est pas accepté. Utilisez une image JPG, JPEG, PNG ou WebP.`;
    }

    if (file.size > MAX_IMAGE_SIZE) {
      return `Le fichier « ${file.name} » dépasse la taille maximale de 5 Mo.`;
    }
  }

  return "";
}

function FileUpload({
  id,
  name,
  label,
  multiple = false,
  selectedText,
  showAddImageText = false,
  rulesText,
  error,
  onChange,
}) {
  const labelId = `${id}-label`;
  const selectionId = `${id}-selection`;

  const describedBy = [
    selectionId,
    `${id}-rules`,
    error ? `${id}-error` : null,
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <div className={styles.uploadField}>
      <p
        id={labelId}
        className={styles.uploadTitle}
      >
        {label}
      </p>

      <input
        id={id}
        name={name}
        className={styles.fileInput}
        type="file"
        accept={IMAGE_ACCEPT_ATTRIBUTE}
        multiple={multiple}
        aria-labelledby={labelId}
        aria-describedby={describedBy}
        aria-invalid={Boolean(error)}
        onChange={onChange}
      />

      <label
        htmlFor={id}
        className={styles.uploadRow}
      >
        <span
          id={selectionId}
          className={styles.uploadValue}
        >
          {selectedText}
        </span>

        <span
          className={styles.uploadButton}
          aria-hidden="true"
        >
          <span>+</span>
        </span>
      </label>

      <p
        id={`${id}-rules`}
        className={styles.uploadRules}
      >
        {rulesText}
      </p>

      {error && (
        <p
          id={`${id}-error`}
          className={styles.uploadError}
          role="alert"
        >
          {error}
        </p>
      )}

      {showAddImageText && (
        <p className={styles.uploadHelp}>
          + Ajouter une image
        </p>
      )}
    </div>
  );
}

export default function AddPropertyForm() {
  const router = useRouter();

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    postalCode: "",
    location: "",
    price: "",
    hostName: "",
  });

  const [coverImage, setCoverImage] = useState(null);
  const [propertyPictures, setPropertyPictures] =
    useState([]);
  const [hostPicture, setHostPicture] = useState(null);

  const [fileErrors, setFileErrors] = useState({
    cover: "",
    pictures: "",
    host: "",
  });

  const [selectedEquipments, setSelectedEquipments] =
    useState([]);

  const [selectedCategories, setSelectedCategories] =
    useState([]);

  const [customTag, setCustomTag] = useState("");
  const [customTags, setCustomTags] = useState([]);
  const [formMessage, setFormMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  function handleTextChange(event) {
    const { name, value } = event.target;

    setFormData((currentData) => ({
      ...currentData,
      [name]: value,
    }));

    setFormMessage("");
  }

  function handleCoverChange(event) {
    const file = event.target.files?.[0] ?? null;
    const error = getImageValidationMessage(
      file ? [file] : []
    );

    if (error) {
      event.target.value = "";
      setCoverImage(null);
      setFileErrors((currentErrors) => ({
        ...currentErrors,
        cover: error,
      }));
      setFormMessage("");
      return;
    }

    setCoverImage(file);
    setFileErrors((currentErrors) => ({
      ...currentErrors,
      cover: "",
    }));
    setFormMessage("");
  }

  function handlePicturesChange(event) {
    const pictures = Array.from(
      event.target.files ?? []
    );
    const error = getImageValidationMessage(
      pictures,
      MAX_PROPERTY_PICTURES
    );

    if (error) {
      event.target.value = "";
      setPropertyPictures([]);
      setFileErrors((currentErrors) => ({
        ...currentErrors,
        pictures: error,
      }));
      setFormMessage("");
      return;
    }

    setPropertyPictures(pictures);
    setFileErrors((currentErrors) => ({
      ...currentErrors,
      pictures: "",
    }));
    setFormMessage("");
  }

  function handleHostPictureChange(event) {
    const file = event.target.files?.[0] ?? null;
    const error = getImageValidationMessage(
      file ? [file] : []
    );

    if (error) {
      event.target.value = "";
      setHostPicture(null);
      setFileErrors((currentErrors) => ({
        ...currentErrors,
        host: error,
      }));
      setFormMessage("");
      return;
    }

    setHostPicture(file);
    setFileErrors((currentErrors) => ({
      ...currentErrors,
      host: "",
    }));
    setFormMessage("");
  }

  function handleEquipmentChange(equipment) {
    setSelectedEquipments((currentSelection) =>
      toggleSelection(currentSelection, equipment)
    );
  }

  function handleCategoryChange(category) {
    setSelectedCategories((currentSelection) =>
      toggleSelection(currentSelection, category)
    );
  }

  function addCustomTag() {
    const normalizedTag = customTag.trim();

    if (!normalizedTag) return;

    const tagAlreadyExists = [
      ...CATEGORIES,
      ...customTags,
    ].some(
      (tag) =>
        tag.toLocaleLowerCase("fr") ===
        normalizedTag.toLocaleLowerCase("fr")
    );

    if (!tagAlreadyExists) {
      setCustomTags((currentTags) => [
        ...currentTags,
        normalizedTag,
      ]);
    }

    setCustomTag("");
  }

  function handleCustomTagKeyDown(event) {
    if (event.key !== "Enter") return;

    event.preventDefault();
    addCustomTag();
  }

  function removeCustomTag(tagToRemove) {
    setCustomTags((currentTags) =>
      currentTags.filter((tag) => tag !== tagToRemove)
    );
  }

  

  async function handleSubmit(event) {
    event.preventDefault();

    // Empêche plusieurs soumissions simultanées du formulaire.
    if (isSubmitting) return;

    // Vérifie une dernière fois la validité des images
    // avant de commencer les appels vers l’API.
    const nextFileErrors = {
      cover: getImageValidationMessage(
        coverImage ? [coverImage] : []
      ),
      pictures: getImageValidationMessage(
        propertyPictures,
        MAX_PROPERTY_PICTURES
      ),
      host: getImageValidationMessage(
        hostPicture ? [hostPicture] : []
      ),
    };

    if (Object.values(nextFileErrors).some(Boolean)) {
      setFileErrors(nextFileErrors);
      setFormMessage(
        "Veuillez corriger les images sélectionnées."
      );
      return;
    }

    setIsSubmitting(true);
    setFormMessage("Création du logement en cours…");

    try {
      // Envoie les différentes images en parallèle
      // afin de réduire le temps total de création.
      const [
        uploadedCover,
        uploadedPictures,
        uploadedHostPicture,
      ] = await Promise.all([
        coverImage
          ? uploadPropertyImage(
              coverImage,
              "property-cover"
            )
          : null,
        Promise.all(
          propertyPictures.map((picture) =>
            uploadPropertyImage(
              picture,
              "property-picture"
            )
          )
        ),
        hostPicture
          ? uploadPropertyImage(
              hostPicture,
              "user-picture"
            )
          : null,
      ]);

      // Transforme les données du formulaire au format
      // attendu par l’API Kasa.
      const propertyData = {
        title: formData.title.trim(),
        description: formData.description.trim(),
        location: [
          formData.postalCode.trim(),
          formData.location.trim(),
        ]
          .filter(Boolean)
          .join(" "),
        price_per_night: Number(formData.price),
        host: {
          name: formData.hostName.trim(),
          ...(uploadedHostPicture?.url && {
            picture: uploadedHostPicture.url,
          }),
        },
        pictures: uploadedPictures.map(
          (picture) => picture.url
        ),
        equipments: selectedEquipments,
        tags: [
          ...selectedCategories,
          ...customTags,
        ],
        ...(uploadedCover?.url && {
          cover: uploadedCover.url,
        }),
      };

      const createdProperty =
        await createProperty(propertyData);

      setFormMessage("Le logement a bien été créé.");

      // Redirige l’utilisateur vers la fiche
      // du logement nouvellement créé.
      if (createdProperty?.id) {
        router.push(`/property/${createdProperty.id}`);
        router.refresh();
      }
    } catch (error) {
      // Adapte le comportement de l’interface selon
      // les erreurs d’authentification et d’autorisation.
      if (error?.status === 401) {
        router.push("/login");
        return;
      }

      if (error?.status === 403) {
        setFormMessage(
          "Seuls les propriétaires et les administrateurs peuvent ajouter un logement."
        );
        return;
      }

      setFormMessage(
        error?.message ||
          "Impossible de créer le logement. Veuillez réessayer."
      );
    } finally {
      // Réactive le formulaire après le traitement,
      // que la création réussisse ou échoue.
      setIsSubmitting(false);
    }
  }

  const coverImageText = coverImage
    ? coverImage.name
    : "Sélectionner une image";

  const propertyPicturesText =
    propertyPictures.length > 0
      ? `${propertyPictures.length} image(s) sélectionnée(s)`
      : "Sélectionner une ou plusieurs images";

  const hostPictureText = hostPicture
    ? hostPicture.name
    : "Sélectionner une image";

  return (
    <form
      id="add-property-form"
      className={styles.form}
      onSubmit={handleSubmit}
      aria-busy={isSubmitting}
    >
      <div className={styles.topGrid}>
        <section
          className={`${styles.card} ${styles.generalCard}`}
          aria-labelledby="general-information-title"
        >
          <h2
            id="general-information-title"
            className={styles.srOnly}
          >
            Informations générales
          </h2>

          <div className={styles.formField}>
            <label htmlFor="property-title">
              Titre de la propriété
            </label>

            <input
              id="property-title"
              name="title"
              type="text"
              placeholder="Ex : Appartement cosy au cœur de Paris"
              value={formData.title}
              onChange={handleTextChange}
              required
            />
          </div>

          <div className={styles.formField}>
            <label htmlFor="property-description">
              Description
            </label>

            <textarea
              id="property-description"
              name="description"
              placeholder="Décrivez votre propriété en détail..."
              rows="5"
              value={formData.description}
              onChange={handleTextChange}
              required
            />
          </div>

          <div className={styles.formField}>
            <label htmlFor="property-postal-code">
              Code postal
            </label>

            <input
              id="property-postal-code"
              name="postalCode"
              type="text"
              inputMode="numeric"
              autoComplete="postal-code"
              value={formData.postalCode}
              onChange={handleTextChange}
              required
            />
          </div>

          <div className={styles.formField}>
            <label htmlFor="property-location">
              Localisation
            </label>

            <input
              id="property-location"
              name="location"
              type="text"
              autoComplete="address-level2"
              value={formData.location}
              onChange={handleTextChange}
              required
            />
          </div>

          <div className={styles.formField}>
            <label htmlFor="property-price">
              Prix par nuit (€)
            </label>

            <input
              id="property-price"
              name="price"
              type="number"
              min="1"
              step="1"
              inputMode="numeric"
              placeholder="Ex : 80"
              value={formData.price}
              onChange={handleTextChange}
              required
            />
          </div>
        </section>

        <div className={styles.rightColumn}>
          <section
            className={`${styles.card} ${styles.imagesCard}`}
            aria-labelledby="property-images-title"
          >
            <h2
              id="property-images-title"
              className={styles.srOnly}
            >
              Photos du logement
            </h2>

            <FileUpload
              id="cover-image"
              name="coverImage"
              label="Image de couverture"
              selectedText={coverImageText}
              rulesText="JPG, JPEG, PNG ou WebP — 5 Mo maximum."
              error={fileErrors.cover}
              onChange={handleCoverChange}
            />

            <FileUpload
              id="property-images"
              name="propertyPictures"
              label="Images du logement"
              multiple
              selectedText={propertyPicturesText}
              showAddImageText
              rulesText="JPG, JPEG, PNG ou WebP — 5 Mo maximum par image, 10 images maximum."
              error={fileErrors.pictures}
              onChange={handlePicturesChange}
            />
          </section>

          <section
            className={`${styles.card} ${styles.hostCard}`}
            aria-labelledby="host-information-title"
          >
            <h2
              id="host-information-title"
              className={styles.srOnly}
            >
              Informations de l’hôte
            </h2>

            <div className={styles.formField}>
              <label htmlFor="host-name">
                Nom de l’hôte
              </label>

              <input
                id="host-name"
                name="hostName"
                type="text"
                autoComplete="name"
                value={formData.hostName}
                onChange={handleTextChange}
                required
              />
            </div>

            <FileUpload
              id="host-picture"
              name="hostPicture"
              label="Photo de profil"
              selectedText={hostPictureText}
              showAddImageText
              rulesText="JPG, JPEG, PNG ou WebP — 5 Mo maximum."
              error={fileErrors.host}
              onChange={handleHostPictureChange}
            />
          </section>
        </div>
      </div>

      <div className={styles.bottomGrid}>
        <section className={styles.card}>
          <fieldset className={styles.choiceFieldset}>
            <legend className={styles.sectionTitle}>
              Équipements
            </legend>

            <div className={styles.equipmentGrid}>
              {EQUIPMENTS.map((equipment) => (
                <label
                  key={equipment}
                  className={styles.checkboxLabel}
                >
                  <input
                    type="checkbox"
                    checked={selectedEquipments.includes(
                      equipment
                    )}
                    onChange={() =>
                      handleEquipmentChange(equipment)
                    }
                  />

                  <span>{equipment}</span>
                </label>
              ))}
            </div>
          </fieldset>
        </section>

        <section className={styles.card}>
          <fieldset className={styles.choiceFieldset}>
            <legend className={styles.sectionTitle}>
              Catégories
            </legend>

            <div className={styles.categoryGrid}>
              {CATEGORIES.map((category) => {
                const isSelected =
                  selectedCategories.includes(category);

                return (
                  <label
                    key={category}
                    className={`${styles.categoryLabel} ${
                      isSelected
                        ? styles.categorySelected
                        : ""
                    }`}
                  >
                    <input
                      className={styles.choiceInput}
                      type="checkbox"
                      checked={isSelected}
                      onChange={() =>
                        handleCategoryChange(category)
                      }
                    />

                    <span>{category}</span>
                  </label>
                );
              })}
            </div>

            <div className={styles.customCategory}>
              <label htmlFor="custom-tag">
                Ajouter une catégorie personnalisée
              </label>

              <div className={styles.customCategoryField}>
                <input
                  id="custom-tag"
                  type="text"
                  placeholder="Nouveau tag"
                  value={customTag}
                  onChange={(event) =>
                    setCustomTag(event.target.value)
                  }
                  onKeyDown={handleCustomTagKeyDown}
                />

                <button
                  type="button"
                  className={styles.addTagButton}
                  aria-label="Ajouter le tag personnalisé"
                  onClick={addCustomTag}
                >
                  +
                </button>
              </div>

              <button
                type="button"
                className={styles.addTagTextButton}
                onClick={addCustomTag}
              >
                + Ajouter un tag
              </button>

              {customTags.length > 0 && (
                <ul
                  className={styles.customTagList}
                  aria-label="Tags personnalisés ajoutés"
                >
                  {customTags.map((tag) => (
                    <li key={tag}>
                      <button
                        type="button"
                        className={styles.customTag}
                        aria-label={`Supprimer le tag ${tag}`}
                        onClick={() => removeCustomTag(tag)}
                      >
                        {tag}
                        <span aria-hidden="true"> ×</span>
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </fieldset>
        </section>
      </div>

      {formMessage && (
        <p
          className={styles.formMessage}
          role="status"
        >
          {formMessage}
        </p>
      )}
    </form>
  );
}