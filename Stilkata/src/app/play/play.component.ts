import { isPlatformBrowser } from '@angular/common';
import { Component, ElementRef, HostListener, Inject, OnInit, PLATFORM_ID, ViewChild } from '@angular/core';
import { GameService } from '../preferences.service';
import { RecordsService } from '../records.service';


@Component({
  selector: 'app-play',
  templateUrl: './play.component.html',
  styleUrls: ['./play.component.css'],
})
export class PlayComponent implements OnInit {
  @ViewChild('gameCanvas') canvasRef!: ElementRef<HTMLCanvasElement>;
  points = 0;
  initialTime = 60; 
  remainingTime = 60; 
  ufoCount = 1; 

  private canvas!: HTMLCanvasElement;
  private context!: CanvasRenderingContext2D;
  private keysPressed: { [key: string]: boolean } = {};

  constructor(
    private gameService: GameService,
    private scoresService: RecordsService,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {}

  ngOnInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      const savedUfoCount = localStorage.getItem('ufoCount');
      const savedGameTime = localStorage.getItem('gameTime');
      if (savedUfoCount) this.ufoCount = parseInt(savedUfoCount, 10);
      if (savedGameTime) {
        this.remainingTime = parseInt(savedGameTime, 10);
        this.initialTime = this.remainingTime;
      }
    } else {
      console.log('Running on the serverrr, localStorage is not available.');
    }
  }

  ngAfterViewInit() {
    if (isPlatformBrowser(this.platformId)) {
      this.canvas = this.canvasRef.nativeElement;
      this.context = this.canvas.getContext('2d')!;
      this.canvas.width = window.innerWidth;
      this.canvas.height = window.innerHeight;

      
      this.gameService.enemies = [];
      this.gameService.initializePlayer(this.canvas.width, this.canvas.height);

      for (let r = 0; r < this.ufoCount; r++) {
        this.gameService.spawnEnemy(this.canvas.width, this.canvas.height);
      }

      this.startTimer();
      this.startGameLoop();
    } else {
      console.log('Canvas operations are not available on the server this time!');
    }
  }

  @HostListener('window:keydown', ['$event'])
onKeyDown(event: KeyboardEvent) {
  this.keysPressed[event.key] = true;
  if (event.code === 'Space') { 
    if (this.gameService.projectiles.length === 0) {
      this.gameService.fireProjectile();
    }
  }
}


  @HostListener('window:keyup', ['$event'])
  onKeyUp(event: KeyboardEvent) {
    this.keysPressed[event.key] = false;
  }

  startGameLoop() {
    const update = () => {
      if (!isPlatformBrowser(this.platformId)) return;

      this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
      this.handlePlayerMovement();

      const player = this.gameService.player!;
      this.context.drawImage(
        player.image,
        player.position.x,
        player.position.y,
        player.width,
        player.height
      );

      this.gameService.enemies.forEach((enemy) => {
        enemy.position.x += enemy.velocity.x;
        if (
          enemy.position.x < enemy.initialX - enemy.range ||
          enemy.position.x > enemy.initialX + enemy.range
        ) {
          enemy.velocity.x = -enemy.velocity.x;
        }

        this.context.drawImage(
          enemy.image,
          enemy.position.x,
          enemy.position.y,
          enemy.width,
          enemy.height
        );
      });

      this.gameService.projectiles.forEach((projectile, index) => {
        projectile.position.y += projectile.velocity.y;
        this.context.drawImage(
          projectile.image,
          projectile.position.x,
          projectile.position.y,
          projectile.width,
          projectile.height
        );

        if (projectile.position.y + projectile.height < 0) {
          this.gameService.projectiles.splice(index, 1);
          this.points -= 25;
        }
      });

      this.checkForCollisions();

      if (this.remainingTime > 0) {
        requestAnimationFrame(update);
      }
    };

    update();
  }

  handlePlayerMovement() {
    const player = this.gameService.player!;
    if (this.keysPressed['ArrowRight']) {
      player.velocity.x = player.speed;
    } else if (this.keysPressed['ArrowLeft']) {
      player.velocity.x = -player.speed;
    } else {
      player.velocity.x = 0;
    }

    player.position.x += player.velocity.x;

    if (player.position.x < 0) {
      player.position.x = 0;
    }
    if (player.position.x + player.width > this.canvas.width) {
      player.position.x = this.canvas.width - player.width;
    }
  }

  checkForCollisions() {
    for (let z = this.gameService.projectiles.length - 1; z >= 0; z--) {
      const projectile = this.gameService.projectiles[z];
      for (let j = this.gameService.enemies.length - 1; j >= 0; j--) {
        const enemy = this.gameService.enemies[j];
        if (this.gameService.detectCollision(projectile, enemy)) {
          this.gameService.enemies.splice(j, 1);
          this.gameService.projectiles.splice(z, 1);
          this.points += 100;

          if (this.gameService.enemies.length < this.ufoCount) {
            this.gameService.respawnEnemy(this.canvas.width, this.canvas.height);
          }
          break;
        }
      }
    }
  }

  startTimer() {
    const timerInterval = setInterval(() => {
      if (this.remainingTime > 0) {
        this.remainingTime--;
      } else {
        clearInterval(timerInterval);
        this.endGame();
      }
    }, 1000);
  }

  endGame() {
    let finalScore = this.points;
    finalScore = finalScore / (this.initialTime / 60);
    finalScore = finalScore - 50 * (this.ufoCount - 1);

    const scoreData = {
      punctuation: Math.max(0, Math.round(finalScore)),
      ufos: this.ufoCount,
      disposedTime: this.initialTime,
    };
    console.log('End of game, sending scoreData:', scoreData);

    this.scoresService.postRecord(scoreData).subscribe({
      next: () => {
        alert(`Score saved! Final Score: ${scoreData.punctuation}`);
      },
      error: (error: any) => {
        console.error('Error saving score:', error);
        alert('Failed to save the score. Please try again, please.');
      },
    });
  }
}
