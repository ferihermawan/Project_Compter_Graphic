import * as THREE from "./three.js/build/three.module.js"
import {OrbitControls} from "./three.js-master/examples/jsm/controls/OrbitControls.js"

let camera, scene, renderer;

let init = () => {
    scene = new THREE.Scene()

    let container = document.body
    let width = window.innerWidth
    let height = window.innerHeight

    renderer = new THREE.WebGLRenderer({
        antialiasing : true
    })
    renderer.setClearColor("#ffffff");
    renderer.setSize(width, height);
    container.appendChild(renderer.domElement);

    const fov = 45
    let aspect = width / height

    camera = new THREE.PerspectiveCamera(fov, aspect);
    camera.position.set(0, -50, 70);
    camera.lookAt(0,0,0);

    //shadow
    renderer.shadowMap.enabled = true

    
}
// light

const createAmbientLight = ()  => {
    const AmbientLight = new THREE.AmbientLight("#FFFFFF", 1)

    return AmbientLight
}

const createPointLight = () => {
    const PointLight = new THREE.PointLight("#FFFFFF", 0.8, 1000)
    PointLight.position.set(0, 0, 10)
    PointLight.castShadow = true

    return PointLight
}

// ground

const createGround = () => {
    const GroundGeometry = new THREE.CircleGeometry(14.5, 40)

    const texture = useTexture ('./assets/texture/snowtexture.png')

    const GroundMaterial = new THREE.MeshStandardMaterial({
        map : texture,
        side : THREE.DoubleSide
    })

    const GroundMesh = new THREE.Mesh(GroundGeometry, GroundMaterial)

    GroundMesh.position.set(0, 0, 0)
    GroundMesh.receiveShadow = true

    return GroundMesh
}

//create Base
const createBase = () => {
    const BaseGeometry = new THREE.CylinderGeometry(15, 20, 4, 8)
    const BaseMaterial = new THREE.MeshBasicMaterial({
        color: "#000000"
    })

    const BaseMesh = new THREE.Mesh(BaseGeometry, BaseMaterial)

    BaseMesh.position.set(0,0,-2.1)
    BaseMesh.rotateX(1.57)

    return BaseMesh

}

//create SnowMan

const createBaseBody = () => {
    const BodyGeometry = new THREE.SphereGeometry(1.5, 32, 6)
    const BodyMaterial = new THREE.MeshStandardMaterial({
        color : "#FFFFFF"

    });

    const BodyMesh = new THREE.Mesh(BodyGeometry, BodyMaterial)
    BodyMesh.castShadow = true
    BodyMesh.position.set(0, 0, 4)

    return BodyMesh
    
}
const createMiddleBody = () => {
    const MiddleBodyGeometry = new THREE.SphereGeometry(1, 32, 6)
    const MiddleBodyMaterial = new THREE.MeshStandardMaterial({
        color : "#FFFFFF"

    });

    const MiddleBodyMesh = new THREE.Mesh(MiddleBodyGeometry, MiddleBodyMaterial)
    MiddleBodyMesh.castShadow = true
    MiddleBodyMesh.position.set(0, 0, 6)

    return MiddleBodyMesh
    
}

const createUpperBody = () => {
    const UpperBodyGeometry = new THREE.SphereGeometry(0.5,32, 6)
    const UpperBodyMaterial = new THREE.MeshStandardMaterial({
        color : "#FFFFFF"

    });

    const UpperBodyMesh = new THREE.Mesh(UpperBodyGeometry, UpperBodyMaterial)
    UpperBodyMesh.castShadow = true
    UpperBodyMesh.position.set(0, 0, 8)

    return UpperBodyMesh
    
}



// create texture
const useTexture = (pathImage) => {
    const loader = new THREE.TextureLoader()

    const texture = loader.load(pathImage)

    return texture
 }


let render = () => {
    requestAnimationFrame(render)
    
    renderer.render(scene, camera)
}

window.onload = function() {
    init()
   

    let PointLight = createPointLight()
    let AmbientLight = createAmbientLight()
    let GroundMaterial = createGround()
    let BaseMaterial = createBase()
    let BodyMaterial = createBaseBody()
    let MiddleBodyMaterial = createMiddleBody()
    let UpperBodyMaterial = createUpperBody()

    //scene
    scene.add(PointLight)
    scene.add(AmbientLight)
    scene.add(GroundMaterial)
    scene.add(BaseMaterial)
    scene.add(BodyMaterial)
    scene.add(MiddleBodyMaterial)
    scene.add(UpperBodyMaterial)
    
    render()

}