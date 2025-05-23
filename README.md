# Interactive Periodic Table with 3D Element Visualization

This project is a fully client-side, interactive periodic table of elements built with plain JavaScript, HTML, and CSS. It features 3D visualizations of atomic structures using Three.js for generated Bohr models and Google's `<model-viewer>` for displaying GLB/GLTF models.

![Screenshot of Periodic Table](img/screenshot.png)

## Features

*   **Complete Periodic Table:** Displays all 118 known elements.
*   **Dynamic Cell Styling:** Element cells are styled in JavaScript, with colors corresponding to their chemical group/category.
*   **Hover Tooltips:** Hovering over an element cell reveals a quick-info tooltip.
*   **Detailed Modal View:** Clicking an element cell opens a modal window with multiple tabs:
    *   **3D Model Tab:**
        *   **Generated Model:** A procedurally generated Bohr model of the element's atomic structure (nucleus, electron shells, orbiting electrons) rendered with Three.js. Includes orbit controls for user interaction.
        *   **GLB Model:** Displays a pre-made 3D model of the element (if available from the data source, e.g., `bohr_model_3d` URL) using Google's `<model-viewer>` component.
    *   **Detailed Info Tab:** Comprehensive textual information about the element, including atomic number, mass, category, phase, density, discovery details, and summary.
    *   **Gallery Tab:** Displays various images related to the element (e.g., physical appearance, Bohr model diagram, emission spectrum) in a grid layout with a click-to-preview feature.
*   **Dark Theme with Vibrant Colors:** Aesthetically pleasing dark interface with vibrant accents.
*   **Pure JavaScript DOM Manipulation:** All HTML elements for the table and modal are created and managed via JavaScript.
*   **CSS Styling:** External CSS file (`css/style.css`) for organized styling.

## Project Structure

```
.
├── css/
│   └── style.css        # All visual styling
├── img/
│   ├── favicon.png      # Browser tab icon (add your own)
│   └── screenshot.png   # Project screenshot (add your own)
├── js/
│   ├── elements-data.js # JSON-like data for all chemical elements
│   └── main.js          # Core application logic, DOM manipulation, Three.js, etc.
└── index.html           # Main HTML file
```

## Technologies Used

*   **HTML5**
*   **CSS3**
*   **Plain JavaScript (ES6+)**
*   **Three.js:** For the procedurally generated 3D Bohr model.
    *   `OrbitControls.js` (from Three.js examples) for 3D view interaction.
*   **Google `<model-viewer>`:** For displaying pre-made GLB/GLTF 3D models.
*   **Element Data:** A comprehensive JSON-like dataset (`elements-data.js`) for element properties. The base structure and a significant portion of the data are inspired by or adapted from the [Periodic-Table-JSON project by Bowserinator](https://github.com/Bowserinator/Periodic-Table-JSON). Many thanks to that project for providing such a rich dataset.

## Setup and Usage

1.  **Clone the repository (or download the files):**
    ```bash
    git clone https://github.com/kyakub/Periodic-Table.git
    cd Periodic-Table
    ```
2.  **Ensure you have a local web server.**
    *   Due to browser security restrictions (CORS) for fetching local files and potentially for module scripts, it's best to run this project through a local web server.
    *   If you have Python installed:
        *   Python 3: `python -m http.server`
        *   Python 2: `python -m SimpleHTTPServer`
    *   Or use a live server extension in your code editor (e.g., "Live Server" for VS Code).
3.  **Open `index.html` in your web browser** via the local server (e.g., `http://localhost:8000` or whatever port your server uses).

## How It Works

*   **`index.html`:** Sets up the basic page structure and includes the necessary scripts and CSS.
*   **`elements-data.js`:** Contains an array of JavaScript objects, each representing an element with its properties. The structure is compatible with and inspired by the [Periodic-Table-JSON project](https://github.com/Bowserinator/Periodic-Table-JSON).
*   **`css/style.css`:** Defines the visual appearance of the periodic table, modal, tabs, and other components.
*   **`js/main.js`:**
    *   On `DOMContentLoaded`, it dynamically creates the periodic table grid and all element cells based on the data in `elements-data.js`.
    *   Handles event listeners for mouse hover (tooltips) and clicks (opening the modal).
    *   Manages the modal window, including its tabbing system (main tabs and inner 3D model tabs).
    *   **Procedural 3D Model (Bohr):** When the "Generated Model" tab is active, it initializes a Three.js scene, creates a simplified Bohr model, and sets up `OrbitControls`.
    *   **GLB Model Display:** When the "GLB Model" inner tab is active, it populates a `<model-viewer>` component with the `bohr_model_3d` URL from the element's data.
    *   **Detailed Info & Gallery:** Populates these tabs with relevant information and images from the element data.
    *   **Image Preview:** Implements a simple modal to show larger versions of gallery images on click.

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

This project is open source and available under the [MIT License](LICENSE.md).