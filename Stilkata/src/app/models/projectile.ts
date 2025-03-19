export class Projectile {
  position = { x: 0, y: 0 };
  velocity = { x: 0, y: -10 };
  image = new Image();
  height = 70;
  width = 20;
  
  constructor(x: number, y: number) {
    this.position.x = x;
    this.position.y = y;
    this.image.src = '../assets/images/missile.png';
  }
}
