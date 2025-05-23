# Periodic Table

This project is a fully client-side, interactive periodic table of elements built with plain JavaScript, HTML, and CSS. It features 3D visualizations of atomic structures using Three.js for generated Bohr models and Google's `<model-viewer>` for displaying GLB/GLTF models.

![Screenshot of Periodic Table](img/screenshot.png)

## Features

*   **Complete Periodic Table:** Displays all 118 known elements.
*   **Dynamic Cell Styling:** Element cells are styled in JavaScript, with colors corresponding to their chemical group/category.
*   **Hover Tooltips:** Hovering over an element cell reveals a quick-info tooltip.
*   **Detailed Modal View:** Clicking an element cell opens a modal window with multiple tabs:
    *   **3D Model Tab (Main):**
        *   **Generated Model (Inner Tab):** A procedurally generated Bohr model of the element's atomic structure (nucleus, electron shells, orbiting electrons) rendered with Three.js. Includes orbit controls for user interaction.
        *   **GLB Model (Inner Tab):** Displays a pre-made 3D model of the element (if available from the data source, e.g., `bohr_model_3d` URL) using Google's `<model-viewer>` component.
    *   **Detailed Info Tab (Main):** Comprehensive textual information about the element, including atomic number, mass, category, phase, density, discovery details, and summary.
    *   **Gallery Tab (Main):** Displays various images related to the element (e.g., physical appearance, Bohr model diagram, emission spectrum) in a responsive grid layout with a click-to-preview larger image feature.
*   **Dark Theme with Vibrant Colors:** Aesthetically pleasing dark interface with vibrant accents, using "Work Sans" and "Noto Sans Display" fonts from Google Fonts.
*   **Pure JavaScript DOM Manipulation:** All HTML elements for the table and modal are created and managed via JavaScript.
*   **CSS Styling:** External CSS file (`css/style.css`) for organized styling.
*   **Dynamic Copyright:** Footer displays "Developed in [Current Year], by Kamran Yakub. This project is open source and available under the MIT License."

## Project Structure
```
.
├── css/
│   └── style.css
├── img/
│   ├── favicon.png
│   └── screenshot.png
├── js/
│   ├── elements-data.js
│   └── main.js
└── index.html
```

## Technologies Used

*   **HTML5**
*   **CSS3** (including CSS Grid and Flexbox for layout)
*   **Plain JavaScript (ES6+)**
*   **Three.js:** For the procedurally generated 3D Bohr model.
    *   `OrbitControls.js` (from Three.js examples) for 3D view interaction.
*   **Google `<model-viewer>`:** For displaying pre-made GLB/GLTF 3D models.
*   **Google Fonts:** "Work Sans" and "Noto Sans Display".
*   **Element Data:** A comprehensive JSON-like dataset (`elements-data.js`) for element properties. The base structure and a significant portion of the data are inspired by or adapted from the [Periodic-Table-JSON project by Bowserinator](https://github.com/Bowserinator/Periodic-Table-JSON). Many thanks to that project for providing such a rich dataset.

## Setup and Usage

1.  **Clone the repository (or download the files):**
    ```bash
    git clone https://github.com/kyakub/Periodic-Table.git
    cd Periodic-Table
    ```
2.  **Ensure you have a local web server.**
    *   Due to browser security restrictions (CORS) and for module scripts (`<model-viewer>`), it's best to run this project through a local web server.
    *   If you have Python installed:
        *   Python 3: `python -m http.server`
        *   Python 2: `python -m SimpleHTTPServer`
    *   Or use a live server extension in your code editor (e.g., "Live Server" for VS Code).
3.  **Open `index.html` in your web browser** via the local server (e.g., `http://localhost:8000` or whatever port your server uses).

## How It Works

*   **`index.html`:** Sets up the basic page, loads Google Fonts, includes CSS, and necessary JavaScript libraries (`<model-viewer>`, Three.js, OrbitControls) and application scripts.
*   **`elements-data.js`:** Contains an array of JavaScript objects, each representing an element.
*   **`css/style.css`:** Defines the visual appearance, including the new font families, tab styles, and gallery grid.
*   **`js/main.js`:**
    *   Dynamically creates the periodic table and modal structure using CSS classes for styling.
    *   Manages the main tabbing system and the nested tabbing system within the "3D Model" tab.
    *   **Procedural 3D Model (Bohr):** Uses the explicitly included Three.js library.
    *   **GLB Model Display:** Uses the `<model-viewer>` web component.
    *   **Content Isolation:** Ensures each tab (main and inner) displays only its relevant content.
    *   **Gallery Image Preview:** Shows a larger image in a simple modal on click.
    *   **Dynamic Copyright:** Adds the updated copyright notice with the current year to the page footer.

## Known Considerations

*   **"Multiple instances of Three.js" Warning:** Since `<model-viewer>` bundles its own Three.js and we are also including Three.js for the procedural model, browsers may issue this warning. This is a common trade-off when combining such components and is generally accepted for functionality.
*   **`<model-viewer>` Internal Warnings:** Warnings like "Added non-passive event listener" are internal to the `<model-viewer>` component and typically don't affect usability unless significant performance issues are observed.

## Future Enhancements (Ideas)

*   More scientifically accurate 3D atomic orbital visualizations.
*   Filtering and searching elements.
*   Animations or transitions for modal display.
*   Saving user preferences.
*   More detailed element information and direct links to external resources like Wikipedia.
*   Mobile responsiveness improvements.
*   Performance optimization.
*   Investigate methods to use a single Three.js instance if possible, to resolve the "Multiple instances" warning without losing functionality.

## Contributing

Contributions, issues, and feature requests are welcome! Feel free to check the [issues page](https://github.com/kyakub/Periodic-Table/issues).

## License

This project is open source and available under the [MIT License](LICENSE).