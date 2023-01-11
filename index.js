import * as THREE from "./three.js/build/three.module.js"
import {OrbitControls} from "./three.js/examples/jsm/controls/OrbitControls.js"

import {GLTFLoader} from './three.js/examples/jsm/loaders/GLTFLoader.js'
import * as TFONT from './three.js/examples/jsm/loaders/FontLoader.js'
import * as TGEO from './three.js/examples/jsm/geometries/TextGeometry.js'


let camera, scene, renderer, control, loader, numSnowflakes;

let hdrTexture = new URL('./MR_HDRI_Free_Pack/MR_INT-003_Kitchen_Pierre.hdr', import.meta.url)

let init = () => {
    scene = new THREE.Scene()

    let container = document.body
    let width = window.innerWidth
    let height = window.innerHeight

    renderer = new THREE.WebGLRenderer({
        antialiasing : true
    })

    renderer.setClearColor("#000000");
    renderer.setSize(width, height);
    container.appendChild(renderer.domElement);

    const fov = 45
    let aspect = width / height

    camera = new THREE.PerspectiveCamera(fov, aspect);
    camera.position.set(0, -50, 70);
    camera.lookAt(0,0,0);

    control = new OrbitControls(camera,renderer.domElement)
    control.autoRotate = true

    //shadow
    renderer.shadowMap.enabled = true

    let loader = new TFONT.FontLoader()
    loader.load("./three.js/examples/fonts/droid/droid_sans_bold.typeface.json", font => {
        let TextGeometry = new TGEO.TextGeometry("Snowball", {
            font: font, 
            size: 2, 
            height: 0.1
        })

        let textMaterial = new THREE.MeshBasicMaterial({
            color : 0xffffff,
        })
        let text = new THREE.Mesh(TextGeometry, textMaterial)
        text.position.set(2, -19, -2.5)
        text.rotation.set(1, 0.37, 0.2)
        scene.add(text)

        camera.lookAt(text.position)
    })

}

// light

// Create the snowflake material

const creaetSnowFlake = () => {
    const geometry = new THREE.Geometry()

    for (let i = 0; i < numSnowflakes; i++) {
        // Create a snowflake vertex
        const vertex = new THREE.Vector3();
      
        // Set the x, y, and z positions of the vertex
        vertex.x = Math.random() * 1000 - 500;
        vertex.y = Math.random() * 1000 - 500;
        vertex.z = Math.random() * 1000 - 500;
      
        // Add the vertex to the geometry
        geometry.vertices.push(vertex);
    }
    const material = new THREE.PointsMaterial({ color: 0xffffff });

    // Create the snowflake points
    const Snowflake = new THREE.Points(geometry, material);

    // Add the snowflakes to the scene
    scene.add(Snowflake);

}

// Create an animation mixer

const createAnimationMixer = () => {
    const mixer = new THREE.AnimationMixer(Snowflake);
    // Create an animation clip
    const clip = new THREE.AnimationClip('snowfall', null, Snowflake.geometry.vertices.length, THREE.LoopRepeat);
    // Create a keyframe for the animation
    const keyframe = new THREE.VectorKeyframeTrack('.vertices', [0, 1], [
    0, 0, 0,
    0, -10, 0
    ]);
    // Add the keyframe to the clip
    clip.tracks.push(keyframe);
    // Add the clip to the mixer
    mixer.clipAction(clip).play();

}

// Animate the snowflakes
function animate() {
    requestAnimationFrame(animate);
    // Update the snowflake positions
    // mixer.update(0.1);
    renderer.render(scene, camera);
}

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

// create House
const load3DModel = (url) => {
    const loader = new GLTFLoader();
    loader.load(url,(gltf) => {
      const object = gltf.scene
      object.castShadow = true
      object.receiveShadow = true
      object.position.set(-69, 50, -1)
      object.scale.set(20,20,20)
      object.rotation.set(1.57, 0, 0)
      scene.add(object)
    })
  }


// create texture
const useTexture = (pathImage) => {
    const loader = new THREE.TextureLoader()

    const texture = loader.load(pathImage)

    return texture
 }

// Create Globe

const createGlobe = () => {
    const GlobeGeometry = new THREE.SphereGeometry(14.5 , 32, 16, 0, 6.3, 1.1, 3)
    const GlobeMaterial = new THREE.MeshLambertMaterial({
        color : "#FFFFFF",
        transparent : true,
        opacity : 0.4

    })
    const GlobeMesh = new THREE.Mesh(GlobeGeometry, GlobeMaterial)
   
    return GlobeMesh

}

 //create SnowMan

const createMiddleBody = () => {
    const MiddleBodyGeometry = new THREE.SphereGeometry(1, 32, 6)
    const MiddleBodyMaterial = new THREE.MeshStandardMaterial({
        color : "#FFFFFF"

    });

    const MiddleBodyMesh = new THREE.Mesh(MiddleBodyGeometry, MiddleBodyMaterial)
    MiddleBodyMesh.castShadow = true
    MiddleBodyMesh.position.set(11, -2, 3.2)

    return MiddleBodyMesh
    
}

const createBaseBody = () => {
    const BodyGeometry = new THREE.SphereGeometry(1.5, 32, 6)
    const BodyMaterial = new THREE.MeshStandardMaterial({
        color : "#FFFFFF"

    });

    const BodyMesh = new THREE.Mesh(BodyGeometry, BodyMaterial)
    BodyMesh.castShadow = true
    BodyMesh.position.set(11, -2, 1.2)

    return BodyMesh
    
}

const createUpperBody = () => {
    const UpperBodyGeometry = new THREE.SphereGeometry(0.5,32, 6)
    const UpperBodyMaterial = new THREE.MeshStandardMaterial({
        color : "#FFFFFF"

    });

    const UpperBodyMesh = new THREE.Mesh(UpperBodyGeometry, UpperBodyMaterial)
    UpperBodyMesh.castShadow = true
    UpperBodyMesh.position.set(11, -2, 4.5)

    return UpperBodyMesh
    
}

// create nose
const createNose = () => {
    const NoseGeometry = new THREE.ConeGeometry(0.15, 0.5, 32)
    const NoseMaterial = new THREE.MeshBasicMaterial({
        color : "#FFA500"
    })

    const NoseMesh = new THREE.Mesh(NoseGeometry, NoseMaterial)
    NoseMesh.position.set(11, -2.6, 4.4)
    NoseMesh.castShadow = true
    NoseMesh.rotateX(Math.PI)

    return NoseMesh
}

//Create Buttons

const createButton1 = () => {
    const ButtonGeometry = new THREE.SphereGeometry(0.1, 32, 6)
    const ButtonMaterial = new THREE.MeshBasicMaterial({
        color : "#000000"
    })

    const ButtonMesh = new THREE.Mesh(ButtonGeometry, ButtonMaterial)
    ButtonMesh.position.set(11.25, -2.4, 4.7)
    ButtonMesh.castShadow = true

    return ButtonMesh

}

const createButton2 = () => {
    const ButtonGeometry2 = new THREE.SphereGeometry(0.1, 32, 6)
    const ButtonMaterial2 = new THREE.MeshBasicMaterial({
        color : "#000000"
    })

    const ButtonMesh2 = new THREE.Mesh(ButtonGeometry2, ButtonMaterial2)
    ButtonMesh2.position.set(10.75, -2.5, 4.7)
    ButtonMesh2.castShadow = true

    return ButtonMesh2

}

const createButton3 = () => {
    const ButtonGeometry3 = new THREE.SphereGeometry(0.1, 32, 6)
    const ButtonMaterial3 = new THREE.MeshBasicMaterial({
        color : "#000000"
    })

    const ButtonMesh3 = new THREE.Mesh(ButtonGeometry3, ButtonMaterial3)
    ButtonMesh3.position.set(11, -3.0, 3.7)
    ButtonMesh3.castShadow = true

    return ButtonMesh3

}

const createButton4 = () => {
    const ButtonGeometry4 = new THREE.SphereGeometry(0.1, 32, 6)
    const ButtonMaterial4 = new THREE.MeshBasicMaterial({
        color : "#000000"
    })

    const ButtonMesh4 = new THREE.Mesh(ButtonGeometry4, ButtonMaterial4)
    ButtonMesh4.position.set(11, -3.3, 3.2)
    ButtonMesh4.castShadow = true

    return ButtonMesh4

}

const createButton5 = () => {
    const ButtonGeometry5 = new THREE.SphereGeometry(0.1, 32, 6)
    const ButtonMaterial5 = new THREE.MeshBasicMaterial({
        color : "#000000"
    })

    const ButtonMesh5 = new THREE.Mesh(ButtonGeometry5, ButtonMaterial5)
    ButtonMesh5.position.set(11, -3.5, 2.5)
    ButtonMesh5.castShadow = true

    return ButtonMesh5

}

// •	The snow will be spawn and start falling 

// const createSnow = () =>{
//     const SnowGeometry = new THREE.SphereGeometry(0.1, 32 , 6)
//     const SnowMaterial = new THREE.MeshBasicMaterial({
//         color : "#FFFFFF"
//     })
    
//     const SnowMesh = new THREE.Mesh(SnowGeometry,SnowMaterial)
//     SnowMesh.castShadow = true

//     return SnowMesh
// }

// function onMouseClick(e){
//     scene.remove(group)
//     const raycaster = new THREE.Raycaster()
    
//     // raycaster.setFromCamera(mouse,camera)
//     // const intersects = raycaster.intersectObjects(scene.children)
//     // if(intersects.length > 0){
//     //    group = new THREE.Group()
//     //     let snow1 = createSnow()
//     //     let snow2 = createSnow()
//     //     let snow3 = createSnow()
//     //     let snow4 = createSnow()
//     //     let snow5 = createSnow()
//     //     let snow6 = createSnow()
//     //     let snow7 = createSnow()
//     //     let snow8 = createSnow()
//     //     let snow9 = createSnow()
//     //     let snow10 = createSnow()
//     //     snow1.position.set(0.1,-1.8, 14.1)
//     //     snow2.position.set(6.2 , -3.8, 14.1)
//     //     snow3.position.set(3.1 , -1.8, 14.1)
//     //     snow4.position.set(-3.1 , -1.8, 14.1)
//     //     snow5.position.set(2.5 , 2.8, 14.1)
//     //     snow6.position.set(4.5 , 4.8, 14.1)
//     //     snow7.position.set(5.3 , 4.2, 14.1)
//     //     snow8.position.set(-6.5 , 3.4, 14.1)
//     //     snow9.position.set(-4.2 , 1.8, 14.1)
//     //     snow10.position.set(-2.5 , 3.7, 14.1)
//     //     group.add(snow1,
//     //         snow2,
//     //         snow3,
//     //         snow4,
//     //         snow5,
//     //         snow6,
//     //         snow7,
//     //         snow8,
//     //         snow9,
//     //         snow10
//     //         )
//     //    test++
//     //    scene.add(group)
//     //     }    
//     }
    
// function addEventListener(){
//     document.addEventListener('click', onMouseClick)
// }

// --Create Trees--

const createTrunk1 = () => {
    const TrunkGeometry1 = new THREE.BoxGeometry(0.5, 7, 0.5)
    const TrunkMaterial1 = new THREE.MeshPhongMaterial({
        color : "#3F301D"
    })
    const TrunkMesh1 =  new THREE.Mesh(TrunkGeometry1, TrunkMaterial1)
    TrunkMesh1.castShadow = true
    TrunkMesh1.position.set(-8,2,3)
    TrunkMesh1.rotateX(Math.PI/2)
    
    return TrunkMesh1
}

const createLeaf1 = () => {
    const LeafGeometry1 = new THREE.ConeGeometry(1.5, 5, 32)
    const LeafMaterial1 = new THREE.MeshBasicMaterial({
        color : "#32612D"
    })
    const LeafMesh1 = new THREE.Mesh(LeafGeometry1, LeafMaterial1)
    LeafMesh1.castShadow = true
    LeafMesh1.position.set(-8,2,5)
    LeafMesh1.rotateX(Math.PI/2)

    return LeafMesh1
}

const createTrunk2 = () => {
    const TrunkGeometry2 = new THREE.BoxGeometry(0.5, 7, 0.5)
    const TrunkMaterial2 = new THREE.MeshPhongMaterial({
        color : "#3F301D"
    })
    const TrunkMesh2 =  new THREE.Mesh(TrunkGeometry2, TrunkMaterial2)
    TrunkMesh2.castShadow = true
    TrunkMesh2.position.set(-11,0,3)
    TrunkMesh2.rotateX(Math.PI/2)
    
    return TrunkMesh2
}

const createLeaf2 = () => {
    const LeafGeometry2 = new THREE.ConeGeometry(1.5, 5, 32)
    const LeafMaterial2 = new THREE.MeshBasicMaterial({
        color : "#32612D"
    })
    const LeafMesh2 = new THREE.Mesh(LeafGeometry2, LeafMaterial2)
    LeafMesh2.castShadow = true
    LeafMesh2.position.set(-11,0,5)
    LeafMesh2.rotateX(Math.PI/2)

    return LeafMesh2
}


// create Sky box

const createSkyBox = () => {
    const SkyBoxGeometry = new THREE.BoxGeometry(300,300,300)
    
    const px = useTexture('/assets/skybox/px.jpg')
    const nx = useTexture('/assets/skybox/nx.jpg')
    const py2 = useTexture('/assets/skybox/py(2).jpg')
    const ny = useTexture('./assets/skybox/ny.jpg')
    const pz = useTexture('/assets/skybox/pz.jpg')
    const nz = useTexture('/assets/skybox/nz.jpg')
  
    const SkyBoxMaterials = [
        new THREE.MeshBasicMaterial({map : px, side : THREE.DoubleSide}),
        new THREE.MeshBasicMaterial({map : nx, side : THREE.DoubleSide}),
        new THREE.MeshBasicMaterial({map : py2, side : THREE.DoubleSide}),
        new THREE.MeshBasicMaterial({map : ny, side : THREE.DoubleSide}),
        new THREE.MeshBasicMaterial({map : pz, side : THREE.DoubleSide}),
        new THREE.MeshBasicMaterial({map : nz, side : THREE.DoubleSide})
    ];
  
    const SkyBoxMesh = new THREE.Mesh(SkyBoxGeometry, SkyBoxMaterials)
    return SkyBoxMesh
  
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
    let GlobeMaterial = createGlobe()
    let BodyMaterial = createBaseBody()
    let MiddleBodyMaterial = createMiddleBody()
    let UpperBodyMaterial = createUpperBody()
    let NoseMaterial = createNose()
    let ButtonMaterial = createButton1()
    let ButtonMaterial2 = createButton2()
    let ButtonMaterial3 = createButton3()
    let ButtonMaterial4 = createButton4()
    let ButtonMaterial5 = createButton5()
    let TrunkMaterial1 = createTrunk1()
    let TrunkMaterial2 = createTrunk2()
    let LeafMaterial1 = createLeaf1()
    let LeafMaterial2 = createLeaf2()
    load3DModel("./assets/model/scene.gltf")
    let SkyBoxMaterials = createSkyBox()
    

    //scene
    scene.add(PointLight)
    scene.add(AmbientLight)
    scene.add(GroundMaterial)
    scene.add(GlobeMaterial)
    scene.add(BaseMaterial)
    scene.add(BodyMaterial)
    scene.add(MiddleBodyMaterial)
    scene.add(UpperBodyMaterial)
    scene.add(NoseMaterial)
    scene.add(ButtonMaterial)
    scene.add(ButtonMaterial2)
    scene.add(ButtonMaterial3)
    scene.add(ButtonMaterial4)
    scene.add(ButtonMaterial5)
    scene.add(TrunkMaterial1)
    scene.add(TrunkMaterial2)
    scene.add(LeafMaterial1)
    scene.add(LeafMaterial2)
    scene.add(SkyBoxMaterials)
    

    render()

    animate()
    scene.add(createAnimationMixer)
}