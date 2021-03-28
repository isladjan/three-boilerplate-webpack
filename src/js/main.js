//import * as THREE from 'three';
import {
  Scene,
  PerspectiveCamera,
  DirectionalLight,
  WebGLRenderer,
  TextureLoader,
  SphereBufferGeometry,
  BufferAttribute,
  ShaderMaterial,
  Mesh,
} from 'three';

import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import Stats from 'three/examples/jsm/libs/stats.module.js';



export default class Main {

  constructor() {
    this.speed = 0;
    this.scene = new Scene();
    this.container = document.getElementById("canvas_container");
    this.camera = new PerspectiveCamera(75, this.container.clientWidth / this.container.clientHeight, 0.1, 1000);
    this.camera.position.set(10, 0, 40);

    this.light = new DirectionalLight("#fff", 3);
    this.light.position.set(0, 0, 10);
    this.scene.add(this.light);

    this.renderer = new WebGLRenderer({ alpha: true, antialias: true });
    this.renderer.setSize(this.container.clientWidth, this.container.clientHeight);
    this.renderer.setPixelRatio(window.devicePixelRatio);
    this.container.appendChild(this.renderer.domElement);

    this.textureLoader = new TextureLoader();

    this.controls = new OrbitControls(this.camera, this.renderer.domElement);
    this.controls.update();

    //Stats
    this.stats = new Stats();
    document.body.appendChild(this.stats.dom);



    /***   ShaderMaterial   ***/
    this.sphereGeometry = new SphereBufferGeometry(5, 32, 32);

    this.vertexDisplacement = new Float32Array(this.sphereGeometry.attributes.position.count);
    this.sphereGeometry.setAttribute('displacement', new BufferAttribute(this.vertexDisplacement, 1));

    //custiom uniform
    let uniforms = {
      t_texture: {
        type: "t",
        value: this.textureLoader.load("img/textura.jpg"),
      },
    };

    this.shaderMaterial = new ShaderMaterial({
      uniforms: uniforms,
      fragmentShader: fragmentShader(),
      vertexShader: vertexShader(),
    });
    this.sphere = new Mesh(this.sphereGeometry, this.shaderMaterial);
    this.scene.add(this.sphere);
    this.sphere.scale.set(1, 1, 1);
    this.sphere.position.set(20, 0, 0)



    /*     Resize     */
    window.addEventListener("resize", () => {
      clearTimeout(this.timeout_Debounce);
      this.timeout_Debounce = setTimeout(this.onWindowResize.bind(this), 80);  // Bind the this from class instead of window object
    });
  }//end od constructor



  onWindowResize() {
    this.camera.aspect = this.container.clientWidth / this.container.clientHeight;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(this.container.clientWidth, this.container.clientHeight);
  }


  animate() {
    this.speed += 0.05;
    this.sphere.rotation.x += 0.01;

    for (var i = 0; i < this.vertexDisplacement.length; i++) {
      this.vertexDisplacement[i] = Math.sin(i + this.speed) * 10;
    }

    this.sphere.geometry.attributes.displacement.needsUpdate = true;
    this.renderer.render(this.scene, this.camera);

    //this.stats.update();
    //this.controls.update();

    requestAnimationFrame(this.animate.bind(this));  
  }
}



function vertexShader() {

  return `
    attribute float displacement;
    varying vec2 u_uv;

    void main() {
      u_uv = uv;

      // uzimam trenutne vertex kordinate, dodajem normals (vector pod pravim uglom iz vertex tacke - u sustini oznacava smer) i prosledjenu random vrednost (koja ce oznacavati koliko ce se vertex kordinate pomeriti)
      // attribut position ne mozes da menjas, ali zato mozes da kreiras novu variablu koju ces menjati i koristiti umesto Attributa position
      vec3 newPosition = position + normal * vec3(displacement);

      //ovo je defult code za kovertovanje three.js unete vertex kordinate
      gl_Position = projectionMatrix * modelViewMatrix * vec4( newPosition , 1.0 ); 
    }
  `
}



function fragmentShader() {
  return `
    uniform sampler2D t_texture;  
    varying vec2 u_uv;

    void main(){
      gl_FragColor = texture2D(t_texture, u_uv);
    }

  `
}