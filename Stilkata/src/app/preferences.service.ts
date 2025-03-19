import { Injectable } from '@angular/core';
import { Fighter } from './models/fighter';
import { Projectile } from './models/projectile';
import { Ufo } from './models/ufo';

@Injectable({
  providedIn: 'root',
})
export class GameService {
  player: Fighter | null = null;
  projectiles: Projectile[] = [];
  enemies: Ufo[] = [];
  points = 0;

  initializePlayer(canvasWidth: number, canvasHeight: number) {
    this.player = new Fighter(canvasWidth, canvasHeight);
  }

  respawnEnemy(canvasWidth: number, canvasHeight: number) {
    this.spawnEnemy(canvasWidth, canvasHeight);
  }

  spawnEnemy(canvasWidth: number, canvasHeight: number) {
    const x = 100 + Math.random() * (canvasWidth - 300);
    const y = 100 + Math.random() * (canvasHeight / 2 - 100);
    const enemy = new Ufo(x, y);
    this.enemies.push(enemy);
  }

  detectCollision(projectile: Projectile, enemy: Ufo): boolean {
    return (
      projectile.position.x < enemy.position.x + enemy.width &&
      projectile.position.x + projectile.width > enemy.position.x &&
      projectile.position.y < enemy.position.y + enemy.height &&
      projectile.position.y + projectile.height > enemy.position.y
    );
  }

  fireProjectile() {
    if (!this.player)
      return;
    
    const projectileX = this.player.position.x + this.player.width / 2 - 10;
    const projectileY = this.player.position.y;
    this.projectiles.push(new Projectile(projectileX, projectileY));
  }
}
