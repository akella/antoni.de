import * as THREE from 'three';
import {TimelineMax} from 'gsap';
var OrbitControls = require('three-orbit-controls')(THREE);
import fragment from './fragment.glsl';
import vertex from './vertex.glsl';


let gallery = [
  THREE.ImageUtils.loadTexture('img/4.jpg'),
  THREE.ImageUtils.loadTexture('img/1.jpg'),
  THREE.ImageUtils.loadTexture('img/2.jpg'),
  THREE.ImageUtils.loadTexture('img/3.jpg')
];

let camera, pos, controls, scene, renderer, geometry, geometry1, material,plane,tex1,tex2;
let destination = {x:0,y:0};
let textures = [];

function init() {
  scene = new THREE.Scene();

  renderer = new THREE.WebGLRenderer();

  renderer.setPixelRatio(window.devicePixelRatio);
  renderer.setSize(window.innerWidth, window.innerWidth);

  var container = document.getElementById('container');
  container.appendChild(renderer.domElement);

  camera = new THREE.PerspectiveCamera(
    70,
    window.innerWidth / window.innerHeight,
    0.001, 100
  );
  camera.position.set( 0, 0, 1 );


  // controls = new OrbitControls(camera, renderer.domElement);


  material = new THREE.ShaderMaterial( {
    side: THREE.DoubleSide,
    uniforms: {
      time: { type: 'f', value: 0 },
      pixels: {type: 'v2', value: new THREE.Vector2(window.innerWidth,window.innerHeight)},
      accel: {type: 'v2', value: new THREE.Vector2(0.5,2)},
      progress: {type: 'f', value: 0},
      uvRate1: {
        value: new THREE.Vector2(1,1)
      },
      texture1: {
        value: THREE.ImageUtils.loadTexture('img/1.jpg')
      },
      texture2: {
        value: THREE.ImageUtils.loadTexture('img/2.jpg')
      },
    },
    // wireframe: true,
    vertexShader: vertex,
    fragmentShader: fragment
  });

  plane = new THREE.Mesh(new THREE.PlaneGeometry( 1,1, 1, 1 ),material);
  scene.add(plane);

  resize();

 
}

window.addEventListener('resize', resize); 
function resize() {
  var w = window.innerWidth;
  var h = window.innerHeight;
  renderer.setSize( w, h );
  camera.aspect = w / h;

  material.uniforms.uvRate1.value.y = h / w;

  // calculate scene
  let dist  = camera.position.z - plane.position.z;
  let height = 1;
  camera.fov = 2*(180/Math.PI)*Math.atan(height/(2*dist));

  // if(w/h>1) {
  plane.scale.x = w/h;
  // }



  camera.updateProjectionMatrix();
}

let time = 0;
function animate() {
  time = time+0.05;
  material.uniforms.time.value = time;
  
  requestAnimationFrame(animate);
  render();
}

function render() {
  renderer.render(scene, camera);
}


init();
animate();


let tl2 = new TimelineMax();
let override = false;
  
$('body').on('click',() => {
  override = true;
  let pos = material.uniforms.progress.value;
  let next = 1+ (((Math.floor(pos) + 1)%gallery.length -1) + gallery.length)%gallery.length;
  tl2.to(material.uniforms.progress,0.7,{
    value:next,
    ease: Power2.easeOut,
    onComplete: function() {override = false;}
  });
});








/// SCROLL MAGIC
let speed = 0;
let position = 0;
document.addEventListener('wheel',function(event) {
  speed += event.deltaY*0.0002;
});

let tl1 = new TimelineMax();
function raf() {

  if(!override) {
    position += speed;
    speed *=0.7;


    let i = Math.round(position);
    let dif = i - position;


    position += dif*0.035;
    if(Math.abs(i - position)<0.001) {
      position = i;
    }

    tl1.set('.dot',{y:position*200});
    material.uniforms.progress.value = position;

  } else{
    position = parseFloat(material.uniforms.progress.value) || 0;
  }

  
  


  let curslide = (Math.floor(position) - 1 + gallery.length)%gallery.length;
  let nextslide = (((Math.floor(position) + 1)%gallery.length -1) + gallery.length)%gallery.length;

  material.uniforms.texture1.value = gallery[curslide];
  material.uniforms.texture2.value = gallery[nextslide];
  console.log(position,curslide,nextslide,gallery);

  // console.log(speed,position);
  window.requestAnimationFrame(raf);
}

raf();





