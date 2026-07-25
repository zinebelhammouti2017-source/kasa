"use client";

import { useState } from "react";

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

function toggleSelection(currentSelection, value) {
  return currentSelection.includes(value)
    ? currentSelection.filter((item) => item !== value)
    : [...currentSelection, value];
}

function FileUpload({
  id,
  name,
  label,
  multiple = false,
  selectedText,
  showAddImageText = false,
  onChange,
}) {
  return (
    <div className={styles.uploadField}>
      <label
        htmlFor={id}
        className={styles.uploadTitle}
      >
        {label}
      </label>

      <input
        id={id}
        name={name}
        className={styles.fileInput}
        type="file"
        accept="image/*"
        multiple={multiple}
        aria-describedby={`${id}-selection`}
        onChange={onChange}
      />

      <div className={styles.uploadRow}>
        <label
          id={`${id}-selection`}
          htmlFor={id}
          className={styles.uploadValue}
        >
          {selectedText}
        </label>

        <label
          htmlFor={id}
          className={styles.uploadButton}
          aria-label={`Ajouter : ${label}`}
        >
          <span aria-hidden="true">+</span>
        </label>
      </div>

      {showAddImageText && (
        <label
          htmlFor={id}
          className={styles.uploadHelp}
        >
          + Ajouter une image
        </label>
      )}
    </div>
  );
}

export default function AddPropertyForm() {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    postalCode: "",
    location: "",
    hostName: "",
  });

  const [coverImage, setCoverImage] = useState(null);
  const [propertyPictures, setPropertyPictures] =
    useState([]);
  const [hostPicture, setHostPicture] = useState(null);

  const [selectedEquipments, setSelectedEquipments] =
    useState([]);

  const [selectedCategories, setSelectedCategories] =
    useState([]);

  const [customTag, setCustomTag] = useState("");
  const [customTags, setCustomTags] = useState([]);
  const [formMessage, setFormMessage] = useState("");

  function handleTextChange(event) {
    const { name, value } = event.target;

    setFormData((currentData) => ({
      ...currentData,
      [name]: value,
    }));

    setFormMessage("");
  }

  function handleCoverChange(event) {
    setCoverImage(event.target.files?.[0] ?? null);
    setFormMessage("");
  }

  function handlePicturesChange(event) {
    setPropertyPictures(
      Array.from(event.target.files ?? [])
    );

    setFormMessage("");
  }

  function handleHostPictureChange(event) {
    setHostPicture(event.target.files?.[0] ?? null);
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

  function handleSubmit(event) {
    event.preventDefault();

    setFormMessage(
      "L’interface est prête. L’enregistrement dans l’API sera connecté à l’étape suivante."
    );
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
              onChange={handleCoverChange}
            />

            <FileUpload
              id="property-images"
              name="propertyPictures"
              label="Images du logement"
              multiple
              selectedText={propertyPicturesText}
              showAddImageText
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