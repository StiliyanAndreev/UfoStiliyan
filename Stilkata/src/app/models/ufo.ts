export class Ufo {
  velocity = { x: 4, y: 0 };
  position = { x: 0, y: 0 };
  image = new Image();
  range = 100;
  width = 60;
  height = 65;
  destroyed = false;
  initialX: number;
  

  constructor(x: number, y: number) {
    this.position.x = x;
    this.position.y = y;
    this.initialX = x;
    this.image.src = '../assets/images/ufo.png';
  }
}
