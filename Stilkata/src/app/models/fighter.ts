export class Fighter {
  position = {x: 0, y: 0};
  velocity = {x: 0, y: 0};
  image = new Image();
  speed = 15;
  width = 60;
  height = 150;
  
  

  constructor(canvasWidth: number, canvasHeight: number) {
    this.position.x = canvasWidth / 2 - this.width / 2;
    this.position.y = canvasHeight - this.height / 2;
    this.image.src = '../assets/images/Fighter.jpeg';
  }
}
