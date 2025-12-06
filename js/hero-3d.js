document.addEventListener('DOMContentLoaded', () => {
    const container = document.getElementById('canvas-container');
    if (!container) return;

    // Scene setup
    const scene = new THREE.Scene();

    // Camera
    const camera = new THREE.PerspectiveCamera(75, container.clientWidth / container.clientHeight, 0.1, 1000);
    camera.position.z = 4;

    // Renderer
    const renderer = new THREE.WebGLRenderer({
        alpha: true,
        antialias: true
    });
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.setPixelRatio(window.devicePixelRatio);
    container.appendChild(renderer.domElement);

    // Main Geometry - Icosahedron
    const geometry = new THREE.IcosahedronGeometry(1.8, 0); // radius, detail
    const material = new THREE.MeshBasicMaterial({
        color: 0x3cff8f, // Matches --accent
        wireframe: true,
        transparent: true,
        opacity: 0.6
    });
    const sphere = new THREE.Mesh(geometry, material);
    scene.add(sphere);

    // Inner Core - Smaller Icosahedron
    const innerGeo = new THREE.IcosahedronGeometry(0.9, 0);
    const innerMat = new THREE.MeshBasicMaterial({
        color: 0xffffff,
        wireframe: true,
        transparent: true,
        opacity: 0.3
    });
    const innerSphere = new THREE.Mesh(innerGeo, innerMat);
    scene.add(innerSphere);

    // Interaction variables
    let mouseX = 0;
    let mouseY = 0;
    let targetRotationX = 0;
    let targetRotationY = 0;
    let spinSpeed = 0.003;

    // Mouse Move
    document.addEventListener('mousemove', (event) => {
        // Normalize mouse position (-1 to 1) relative to window center
        const windowHalfX = window.innerWidth / 2;
        const windowHalfY = window.innerHeight / 2;
        mouseX = (event.clientX - windowHalfX) * 0.0005;
        mouseY = (event.clientY - windowHalfY) * 0.0005;
    });

    // Click Interaction


    // Styles handling for Theme Toggle (optional: listen to mutations on body)
    const updateColors = () => {
        const isLight = document.body.classList.contains('theme-light');
        if (isLight) {
            material.color.setHex(0x009544); // Darker green for light mode
        } else {
            material.color.setHex(0x3cff8f); // Bright green for dark mode
        }
    };
    // Initial check
    updateColors();

    // Watch for theme changes if using a class on body
    const observer = new MutationObserver(updateColors);
    observer.observe(document.body, {
        attributes: true,
        attributeFilter: ['class']
    });


    // Animation Loop
    const animate = () => {
        requestAnimationFrame(animate);

        // Constant rotation
        sphere.rotation.y += spinSpeed;
        sphere.rotation.x += spinSpeed * 0.5;

        innerSphere.rotation.y -= spinSpeed; // Counter-rotate
        innerSphere.rotation.x -= spinSpeed * 0.5;

        // Mouse influence (gentle tilt towards mouse)
        const targetX = mouseY * 2;
        const targetY = mouseX * 2;

        sphere.rotation.x += 0.05 * (targetX - sphere.rotation.x);
        sphere.rotation.y += 0.05 * (targetY - sphere.rotation.y);

        renderer.render(scene, camera);
    };

    animate();

    // Resize handling
    window.addEventListener('resize', () => {
        if (!container) return;
        const width = container.clientWidth;
        const height = container.clientHeight;
        renderer.setSize(width, height);
        camera.aspect = width / height;
        camera.updateProjectionMatrix();
    });
});
