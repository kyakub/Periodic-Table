document.addEventListener('DOMContentLoaded', () => {
    const body = document.body;
    const THREE = window.THREE; 

    const categoryColors = {
        "diatomic nonmetal": "#48cae4", "noble gas": "#ade8f4", "alkali metal": "#f72585",
        "alkaline earth metal": "#b5179e", "metalloid": "#7209b7", "polyatomic nonmetal": "#56cfe1",
        "other nonmetal": "#64dfdf", "halogen": "#20c997", "transition metal": "#fca311",
        "post-transition metal": "#e63946", "lanthanide": "#ffb703", "actinide": "#fb8500",
        "unknown": "#495057", "unknown, probably transition metal": "#fca311",
        "unknown, probably post-transition metal": "#e63946", "unknown, predicted to be noble gas": "#ade8f4",
        "unknown, probably metalloid": "#7209b7"
    };

    const periodicTableContainer = document.createElement('div');
    periodicTableContainer.className = 'periodic-table-container';
    body.appendChild(periodicTableContainer);

    const tooltip = document.createElement('div');
    tooltip.className = 'tooltip';
    body.appendChild(tooltip);

    const modalOverlay = document.createElement('div');
    modalOverlay.className = 'modal-overlay';
    
    const modalContent = document.createElement('div');
    modalContent.className = 'modal-content';
    
    const modalHeader = document.createElement('div');
    modalHeader.className = 'modal-header';
    
    const modalTitle = document.createElement('h2');
    modalTitle.className = 'modal-title';
    
    const modalCloseButton = document.createElement('button');
    modalCloseButton.className = 'modal-close-button';
    modalCloseButton.innerHTML = '×';
    
    modalHeader.appendChild(modalTitle);
    modalHeader.appendChild(modalCloseButton);
    modalContent.appendChild(modalHeader);

    const mainTabContainer = document.createElement('div');
    mainTabContainer.className = 'main-tab-container';
    modalContent.appendChild(mainTabContainer);

    const mainTabContentContainer = document.createElement('div');
    mainTabContentContainer.className = 'main-tab-content-container';
    modalContent.appendChild(mainTabContentContainer);
    
    modalOverlay.appendChild(modalContent);
    body.appendChild(modalOverlay);

    const imagePreviewOverlay = document.createElement('div');
    imagePreviewOverlay.className = 'image-preview-modal-overlay';
    const imagePreviewContent = document.createElement('div');
    imagePreviewContent.className = 'image-preview-modal-content';
    const imagePreviewImg = document.createElement('img');
    imagePreviewContent.appendChild(imagePreviewImg);
    imagePreviewOverlay.appendChild(imagePreviewContent);
    body.appendChild(imagePreviewOverlay);

    imagePreviewOverlay.addEventListener('click', () => {
        imagePreviewOverlay.classList.remove('active');
    });

    const copyrightFooter = document.createElement('div');
    copyrightFooter.className = 'copyright-footer';
    copyrightFooter.innerHTML = `Developed in ${new Date().getFullYear()}, by Kamran Yakub. This project is open source and available under the MIT License.`;
    body.appendChild(copyrightFooter);


    let activeMainTabButton = null;
    let activeMainTabPanel = null;
    let activeInner3DTabButton = null;
    let activeInner3DTabPanel = null;
    let currentModalElement = null;

    let scene, camera, renderer, controls, atomGroup, animationFrameId;
    let currentRendererCanvasId = null;

    const threeJsContainerProcedural = document.createElement('div');
    threeJsContainerProcedural.id = 'threejs-procedural-view';
    
    const modelViewerContainer = document.createElement('div');
    modelViewerContainer.id = 'model-viewer-container';

    const detailsInfoPanelContent = document.createElement('div');
    const galleryPanelContent = document.createElement('div'); 

    function createMainTab(id, labelText, isDefault = false) {
        const button = document.createElement('button');
        button.id = `main-tab-button-${id}`;
        button.className = 'main-tab-button';
        button.textContent = labelText;

        const panel = document.createElement('div');
        panel.id = `main-tab-panel-${id}`;
        panel.className = 'main-tab-panel';

        button.addEventListener('click', () => {
            if (activeMainTabButton) activeMainTabButton.classList.remove('active');
            if (activeMainTabPanel) activeMainTabPanel.classList.remove('active');

            button.classList.add('active');
            panel.classList.add('active');
            activeMainTabButton = button;
            activeMainTabPanel = panel;
            
            clearThreeJSEnvironment(threeJsContainerProcedural);
            modelViewerContainer.innerHTML = '';


            if (currentModalElement) {
                if (id === '3d-model') {
                    const defaultInnerTab = document.getElementById('inner-3d-tab-button-generated');
                    if (defaultInnerTab) defaultInnerTab.click();
                } else if (id === 'gallery') {
                    populateGalleryTab(currentModalElement, galleryPanelContent);
                } else if (id === 'info') {
                    populateDetailedInfo(currentModalElement, detailsInfoPanelContent);
                }
            }
        });
        mainTabContainer.appendChild(button);
        mainTabContentContainer.appendChild(panel);
        return { button, panel };
    }

    const threeDModelMainTab = createMainTab('3d-model', '3D Model', true);
    const detailsMainTab = createMainTab('info', 'Detailed Info');
    const galleryMainTab = createMainTab('gallery', 'Gallery');
    
    detailsMainTab.panel.appendChild(detailsInfoPanelContent);
    galleryMainTab.panel.appendChild(galleryPanelContent);

    const inner3DTabsStruct = document.createElement('div');
    inner3DTabsStruct.className = 'inner-3d-tab-container';
    threeDModelMainTab.panel.appendChild(inner3DTabsStruct);

    const inner3DTabsContent = document.createElement('div');
    inner3DTabsContent.className = 'inner-3d-tab-content-container';
    threeDModelMainTab.panel.appendChild(inner3DTabsContent);

    function createInner3DTab(id, labelText, parentPanel, isDefault = false) {
        const button = document.createElement('button');
        button.id = `inner-3d-tab-button-${id}`;
        button.className = 'inner-3d-tab-button';
        button.textContent = labelText;

        const panel = document.createElement('div');
        panel.id = `inner-3d-tab-panel-${id}`;
        panel.className = 'inner-3d-tab-panel';

        button.addEventListener('click', () => {
            if (activeInner3DTabButton) activeInner3DTabButton.classList.remove('active');
            if (activeInner3DTabPanel) activeInner3DTabPanel.classList.remove('active');
            
            clearThreeJSEnvironment(threeJsContainerProcedural);
            modelViewerContainer.innerHTML = '';

            button.classList.add('active');
            panel.classList.add('active');
            activeInner3DTabButton = button;
            activeInner3DTabPanel = panel;

            if (currentModalElement) {
                if (id === 'generated') {
                    requestAnimationFrame(() => initThreeJS(currentModalElement, threeJsContainerProcedural));
                } else if (id === 'glb') {
                    populateModelViewerTab(currentModalElement, modelViewerContainer);
                }
            }
        });
        inner3DTabsStruct.appendChild(button);
        parentPanel.appendChild(panel);
        return { button, panel };
    }

    const generatedModelInnerTab = createInner3DTab('generated', 'Generated Model', inner3DTabsContent, true);
    const glbModelInnerTab = createInner3DTab('glb', 'GLB Model', inner3DTabsContent);

    generatedModelInnerTab.panel.appendChild(threeJsContainerProcedural);
    glbModelInnerTab.panel.appendChild(modelViewerContainer);

    function clearThreeJSEnvironment(targetContainer) {
        if (animationFrameId) cancelAnimationFrame(animationFrameId);
        animationFrameId = null;
        if (atomGroup && scene) {
            scene.remove(atomGroup);
            if(atomGroup.children){
                atomGroup.children.forEach(child => {
                    if (child.geometry) child.geometry.dispose();
                    if (child.material) {
                        (Array.isArray(child.material) ? child.material : [child.material]).forEach(mat => mat.dispose());
                    }
                });
            }
            atomGroup = null;
        }
        if (renderer) {
             if (scene && scene.children) {
                scene.traverse(obj => {
                    if (obj.isMesh) {
                        if (obj.geometry) obj.geometry.dispose();
                        if (obj.material) {
                            (Array.isArray(obj.material) ? obj.material : [obj.material]).forEach(mat => {
                                if (mat.map) mat.map.dispose();
                                mat.dispose();
                            });
                        }
                    }
                });
            }
            renderer.dispose();
            if (renderer.domElement && renderer.domElement.parentElement) {
                renderer.domElement.parentElement.removeChild(renderer.domElement);
            }
            renderer = null;
        }
        if(targetContainer && targetContainer.id === 'threejs-procedural-view'){ 
             while (targetContainer.firstChild) targetContainer.removeChild(targetContainer.firstChild);
        }
        scene = null; camera = null; controls = null; currentRendererCanvasId = null;
    }
    
    function initThreeJS(element, targetContainer) {
        if (!element || !targetContainer ) return;
        if (!THREE) {
            targetContainer.innerHTML = "<p style='color:red;text-align:center;padding:20px;'>THREE.js library not available.</p>";
            return;
        }
        
        clearThreeJSEnvironment(targetContainer);
        currentRendererCanvasId = targetContainer.id;

        scene = new THREE.Scene();
        let containerWidth = targetContainer.clientWidth;
        let containerHeight = targetContainer.clientHeight;

        if (containerWidth <= 0 || containerHeight <= 0) {
            targetContainer.style.width = '100%'; 
            targetContainer.style.height = '100%';
            containerWidth = targetContainer.offsetWidth > 0 ? targetContainer.offsetWidth : 400;
            containerHeight = targetContainer.offsetHeight > 0 ? targetContainer.offsetHeight : 350;
        }
        
        camera = new THREE.PerspectiveCamera(50, containerWidth / containerHeight, 0.1, 1000);
        renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
        renderer.setSize(containerWidth, containerHeight);
        renderer.setPixelRatio(window.devicePixelRatio);
        renderer.setClearColor(0x000000, 0);
        targetContainer.appendChild(renderer.domElement);

        if(typeof THREE.OrbitControls !== 'undefined'){
            controls = new THREE.OrbitControls(camera, renderer.domElement);
            controls.enableDamping = true;
            controls.dampingFactor = 0.05;
            controls.minDistance = 1;
            controls.maxDistance = 100;
        }
        
        const ambLight = new THREE.AmbientLight(0xffffff, 0.7);
        scene.add(ambLight);
        const dirLight = new THREE.DirectionalLight(0xffffff, 0.8);
        dirLight.position.set(5, 10, 7);
        scene.add(dirLight);
        const dirLight2 = new THREE.DirectionalLight(0xffffff, 0.3);
        dirLight2.position.set(-5, -5, -2);
        scene.add(dirLight2);

        camera.position.set(0, 7, 18);
        if(controls) controls.target.set(0, 0, 0);
        generateProceduralAtom(element);
        animate();

        function animate() {
            if (!renderer || !scene || !camera ) return;
            animationFrameId = requestAnimationFrame(animate);
            if(controls) controls.update();
            if (atomGroup) { 
                 const time = Date.now() * 0.00015;
                atomGroup.children.forEach(child => {
                    if (child.userData && typeof child.userData.orbitRadius === 'number') {
                        const newAngle = child.userData.initialAngle + time * child.userData.speed * 60;
                        child.position.x = Math.cos(newAngle) * child.userData.orbitRadius;
                        child.position.z = Math.sin(newAngle) * child.userData.orbitRadius;
                    }
                });
            }
            renderer.render(scene, camera);
        }
    }
    
    function populateModelViewerTab(element, targetPanel) {
        targetPanel.innerHTML = ''; 
        if (element.bohr_model_3d) {
            const modelViewerElement = document.createElement('model-viewer');
            modelViewerElement.setAttribute('src', element.bohr_model_3d);
            modelViewerElement.setAttribute('alt', `${element.name} 3D Model`);
            modelViewerElement.setAttribute('auto-rotate', '');
            modelViewerElement.setAttribute('camera-controls', '');
            modelViewerElement.setAttribute('environment-image', 'neutral'); 
            modelViewerElement.setAttribute('shadow-intensity', '1');
            targetPanel.appendChild(modelViewerElement);
        } else {
            const noModelMsg = document.createElement('p');
            noModelMsg.textContent = 'No GLB model available for this element.';
            noModelMsg.className = 'no-visuals-message'; 
            targetPanel.appendChild(noModelMsg);
        }
    }

    function generateProceduralAtom(element) {
        atomGroup = new THREE.Group();
        scene.add(atomGroup);
        const shells = Array.isArray(element.shells) ? element.shells : [];
        const protonCount = element.number;
        const neutronCount = Math.round(element.atomic_mass || protonCount) - protonCount;
        let nucleusRadius = Math.max(0.4, Math.cbrt(protonCount + Math.max(0, neutronCount)) * 0.3);
        if (isNaN(nucleusRadius) || nucleusRadius <= 0) nucleusRadius = 0.4;

        const nucleusMat = new THREE.MeshStandardMaterial({ color: 0xff4444, roughness: 0.5, metalness: 0.1 });
        atomGroup.add(new THREE.Mesh(new THREE.SphereGeometry(nucleusRadius, 32, 16), nucleusMat));

        const electronRadius = 0.2;
        let currentOrbitRadius = nucleusRadius + 1.8;
        (shells || []).forEach((numElectrons, shellIndex) => {
            if (numElectrons === 0) return;
            const orbitPathMat = new THREE.MeshBasicMaterial({ color: 0x66ccff, transparent: true, opacity: 0.4, side: THREE.DoubleSide });
            const orbitPathGeom = new THREE.RingGeometry(currentOrbitRadius - 0.03, currentOrbitRadius + 0.03, 64);
            const orbitPath = new THREE.Mesh(orbitPathGeom, orbitPathMat);
            orbitPath.rotation.x = Math.PI / 2;
            atomGroup.add(orbitPath);
            for (let i = 0; i < numElectrons; i++) {
                const elecMat = new THREE.MeshStandardMaterial({ color: 0x4488ff, emissive: 0x88ccff, emissiveIntensity: 0.5, roughness: 0.3 });
                const electron = new THREE.Mesh(new THREE.SphereGeometry(electronRadius, 12, 6), elecMat);
                const angle = (i / numElectrons) * Math.PI * 2 + (shellIndex * Math.PI / 3.5);
                electron.position.set(Math.cos(angle) * currentOrbitRadius, 0, Math.sin(angle) * currentOrbitRadius);
                electron.userData = { orbitRadius: currentOrbitRadius, initialAngle: angle, speed: (0.015 + shellIndex * 0.003) / (currentOrbitRadius * 0.05 + 1) };
                atomGroup.add(electron);
            }
            currentOrbitRadius += (1.0 + shellIndex * 0.3 + nucleusRadius * 0.05);
        });
    }

    function populateDetailedInfo(element, panelContentElement) {
        panelContentElement.innerHTML = ''; 
        const createDetailItem = (label, value, isHtml = false) => {
            if (value === null || value === undefined || (typeof value === 'string' && value.trim() === '')) return document.createDocumentFragment();
            const item = document.createElement('div');
            item.className = 'detail-item';
            const labelSpan = document.createElement('strong');
            labelSpan.textContent = `${label}: `;
            item.appendChild(labelSpan);
            if (isHtml) {
                const valueSpan = document.createElement('span');
                valueSpan.innerHTML = value;
                item.appendChild(valueSpan);
            }
            else {
                const valueText = document.createTextNode(String(value));
                item.appendChild(valueText);
            }
            return item;
        };
        const title = document.createElement('h3');
        title.textContent = `${element.name} (${element.symbol})`;
        panelContentElement.appendChild(title);

        const grid = document.createElement('div');
        grid.className = 'details-grid';
        grid.appendChild(createDetailItem('Atomic Number', element.number));
        grid.appendChild(createDetailItem('Atomic Mass', element.atomic_mass ? element.atomic_mass.toFixed(4) : 'N/A'));
        grid.appendChild(createDetailItem('Category', element.category));
        grid.appendChild(createDetailItem('Phase', element.phase));
        grid.appendChild(createDetailItem('Density', element.density ? `${element.density} g/cm³` : 'N/A'));
        grid.appendChild(createDetailItem('Melting Point', element.melt ? `${element.melt} K` : 'N/A'));
        grid.appendChild(createDetailItem('Boiling Point', element.boil ? `${element.boil} K` : 'N/A'));
        grid.appendChild(createDetailItem('Electron Shells', (element.shells || []).join(', ')));
        grid.appendChild(createDetailItem('Electron Config.', element.electron_configuration_semantic || element.electron_configuration || 'N/A'));
        grid.appendChild(createDetailItem('Electronegativity (Pauling)', element.electronegativity_pauling || 'N/A'));
        grid.appendChild(createDetailItem('Discovered By', element.discovered_by || 'N/A'));
        grid.appendChild(createDetailItem('Named By', element.named_by || 'N/A'));
        if (element.ionization_energies && element.ionization_energies.length > 0) {
            const ieValue = element.ionization_energies.map((e, i) => `E${i+1}: ${e} kJ/mol`).join('<br>');
            grid.appendChild(createDetailItem('Ionization Energies', ieValue, true));
        }
        panelContentElement.appendChild(grid);
        if (element.summary) {
            const summaryHeader = document.createElement('h4');
            summaryHeader.textContent = 'Summary';
            panelContentElement.appendChild(summaryHeader);
            const summaryP = document.createElement('p');
            summaryP.textContent = element.summary;
            panelContentElement.appendChild(summaryP);
        }
    }

    function populateGalleryTab(element, panelContentElement) {
        panelContentElement.innerHTML = '';
        const createImageFigure = (src, caption, altTextBase) => {
            if (!src) return null;
            const figure = document.createElement('figure');
            const img = document.createElement('img');
            img.src = src;
            img.alt = `${altTextBase} - loading...`;
            img.addEventListener('click', () => {
                imagePreviewImg.src = src;
                imagePreviewOverlay.classList.add('active');
            });
            img.onload = function() { this.alt = altTextBase; };
            img.onerror = function() {
                this.alt = `Error loading: ${altTextBase}`;
                const errorP = document.createElement('p');
                errorP.className = 'image-error-message';
                errorP.textContent = 'Image unavailable.';
                if (this.parentNode) this.parentNode.replaceChild(errorP, this);
            };
            figure.appendChild(img);
            if (caption) {
                const figcaption = document.createElement('figcaption');
                figcaption.textContent = caption;
                figure.appendChild(figcaption);
            }
            return figure;
        };
        let hasContent = false;
        if (element.image && element.image.url) {
            const fig = createImageFigure(element.image.url, element.image.title || "Element", `${element.name} image`);
            if (fig) { panelContentElement.appendChild(fig); hasContent = true; }
        }
        if (element.bohr_model_image) {
            const fig = createImageFigure(element.bohr_model_image, "Bohr Model", `${element.name} Bohr model`);
            if (fig) { panelContentElement.appendChild(fig); hasContent = true; }
        }
        if (element.spectral_img) {
            const fig = createImageFigure(element.spectral_img, "Emission Spectrum", `${element.name} spectrum`);
            if (fig) { panelContentElement.appendChild(fig); hasContent = true; }
        }
        if (!hasContent) {
            const noVisualsMsg = document.createElement('p');
            noVisualsMsg.className = 'no-visuals-message';
            noVisualsMsg.textContent = 'No visualisations available for this element.';
            panelContentElement.appendChild(noVisualsMsg);
        }
    }

    elementsData.forEach(element => {
        const cell = document.createElement('div');
        cell.className = 'element-cell';
        cell.style.gridColumnStart = element.xpos;
        cell.style.gridRowStart = element.ypos;
        const categoryKey = (element.category || "unknown").toLowerCase().replace(/ /g, ' ').trim();
        const bgColor = categoryColors[categoryKey] || categoryColors["unknown"];
        cell.style.backgroundColor = bgColor;
        
        cell.addEventListener('mouseenter', () => {
             cell.style.transform = 'scale(1.1)';
             cell.style.boxShadow = `0 0 15px ${bgColor}`;
             cell.style.zIndex = '10';
            tooltip.innerHTML = `<strong>${element.name} (${element.symbol})</strong><br>Atomic #: ${element.number}<br>Mass: ${element.atomic_mass ? element.atomic_mass.toFixed(3) : 'N/A'}<br>Category: ${element.category}<br><hr><em>Click for details</em>`;
            tooltip.style.visibility = 'visible';
        });
        cell.addEventListener('mousemove', (event) => {
             let x = event.clientX + 15;
             let y = event.clientY + 15;
            if (x + tooltip.offsetWidth + 20 > window.innerWidth) x = event.clientX - tooltip.offsetWidth - 15;
            if (y + tooltip.offsetHeight + 20 > window.innerHeight) y = event.clientY - tooltip.offsetHeight - 15;
            tooltip.style.left = `${x}px`;
            tooltip.style.top = `${y}px`;
        });
        cell.addEventListener('mouseleave', () => {
            cell.style.transform = 'scale(1)';
            cell.style.boxShadow = 'none';
            cell.style.zIndex = '1';
            tooltip.style.visibility = 'hidden';
        });

        const atomicNumberDiv = document.createElement('div');
        atomicNumberDiv.className = 'atomic-number';
        atomicNumberDiv.textContent = element.number;
        
        const symbolDiv = document.createElement('div');
        symbolDiv.className = 'symbol';
        symbolDiv.textContent = element.symbol;
        
        const nameDiv = document.createElement('div');
        nameDiv.className = 'name';
        nameDiv.textContent = element.name;

        cell.appendChild(atomicNumberDiv);
        cell.appendChild(symbolDiv);
        cell.appendChild(nameDiv);
        periodicTableContainer.appendChild(cell);

        cell.addEventListener('click', () => {
            currentModalElement = element; 
            modalTitle.textContent = `${element.name}`;
            modalOverlay.classList.add('active');
            
            const defaultMainTabButton = document.getElementById('main-tab-button-3d-model');
            if(defaultMainTabButton) {
                 defaultMainTabButton.click(); 
            }
            populateDetailedInfo(element, detailsInfoPanelContent);
            populateGalleryTab(element, galleryPanelContent);
        });
    });

    body.appendChild(periodicTableContainer);

    function closeModal() {
        modalOverlay.classList.remove('active');
        clearThreeJSEnvironment(threeJsContainerProcedural);
        modelViewerContainer.innerHTML = '';

        currentModalElement = null; 
        detailsInfoPanelContent.innerHTML = '';
        galleryPanelContent.innerHTML = '';
        
        if(activeMainTabButton) activeMainTabButton.classList.remove('active');
        if(activeMainTabPanel) activeMainTabPanel.classList.remove('active');
        activeMainTabButton = null;
        activeMainTabPanel = null;
        
        if(activeInner3DTabButton) activeInner3DTabButton.classList.remove('active');
        if(activeInner3DTabPanel) activeInner3DTabPanel.classList.remove('active');
        activeInner3DTabButton = null;
        activeInner3DTabPanel = null;

        currentRendererCanvasId = null;
    }

    modalCloseButton.addEventListener('click', closeModal);
    modalOverlay.addEventListener('click', (e) => { 
        if (e.target === modalOverlay) closeModal(); 
    });

    setTimeout(() => {
        const defaultMainTab = document.getElementById('main-tab-button-3d-model');
        if (defaultMainTab && !activeMainTabButton) {
        }
    },0);
});