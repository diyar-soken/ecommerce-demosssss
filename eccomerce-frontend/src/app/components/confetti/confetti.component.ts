import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { NotificationService } from '../../services/notification.service';

interface ConfettiParticle {
  id: string;
  x: number;
  y: number;
  color: string;
  size: number;
  velocityX: number;
  velocityY: number;
  rotation: number;
  rotationSpeed: number;
}

@Component({
  selector: 'app-confetti',
  template: `
    <div class="confetti-container">
      <div 
        *ngFor="let particle of confettiParticles; trackBy: trackByParticleId"
        class="confetti-particle"
        [style.left.px]="particle.x"
        [style.top.px]="particle.y"
        [style.background-color]="particle.color"
        [style.width.px]="particle.size"
        [style.height.px]="particle.size"
        [style.transform]="'rotate(' + particle.rotation + 'deg)'"
      ></div>
    </div>
  `,
  styleUrls: ['./confetti.component.css']
})
export class ConfettiComponent implements OnInit, OnDestroy {
  confettiParticles: ConfettiParticle[] = [];
  private subscription: Subscription = new Subscription();
  private animationFrame: number = 0;

  private colors = [
    '#22c55e', '#16a34a', '#15803d', '#166534',
    '#3b82f6', '#2563eb', '#1d4ed8', '#1e40af',
    '#f59e0b', '#d97706', '#b45309', '#92400e',
    '#ef4444', '#dc2626', '#b91c1c', '#991b1b'
  ];

  constructor(private notificationService: NotificationService) {}

  ngOnInit(): void {
    this.subscription.add(
      this.notificationService.cartAnimation$.subscribe(animate => {
        if (animate) {
          this.createConfetti();
        }
      })
    );
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
    if (this.animationFrame) {
      cancelAnimationFrame(this.animationFrame);
    }
  }

  private createConfetti(): void {
    const cartIcon = document.querySelector('.cart-link, .cart-icon');
    if (!cartIcon) return;

    const cartRect = cartIcon.getBoundingClientRect();
    const centerX = cartRect.left + cartRect.width / 2;
    const centerY = cartRect.top + cartRect.height / 2;

    // Crea 20 particelle di confetti
    for (let i = 0; i < 20; i++) {
      const particle: ConfettiParticle = {
        id: this.generateId(),
        x: centerX + (Math.random() - 0.5) * 20,
        y: centerY + (Math.random() - 0.5) * 20,
        color: this.colors[Math.floor(Math.random() * this.colors.length)],
        size: Math.random() * 8 + 4,
        velocityX: (Math.random() - 0.5) * 10,
        velocityY: Math.random() * -8 - 2,
        rotation: Math.random() * 360,
        rotationSpeed: (Math.random() - 0.5) * 10
      };

      this.confettiParticles.push(particle);
    }

    // Avvia l'animazione
    this.animateConfetti();

    // Rimuovi tutte le particelle dopo 3 secondi
    setTimeout(() => {
      this.confettiParticles = [];
    }, 3000);
  }

  private animateConfetti(): void {
    const animate = () => {
      this.confettiParticles.forEach(particle => {
        // Aggiorna posizione
        particle.x += particle.velocityX;
        particle.y += particle.velocityY;
        
        // Aggiorna velocità (gravità e attrito)
        particle.velocityY += 0.3; // gravità
        particle.velocityX *= 0.99; // attrito
        
        // Aggiorna rotazione
        particle.rotation += particle.rotationSpeed;
      });

      // Rimuovi particelle che sono uscite dallo schermo
      this.confettiParticles = this.confettiParticles.filter(particle => 
        particle.y < window.innerHeight + 50 && 
        particle.x > -50 && 
        particle.x < window.innerWidth + 50
      );

      if (this.confettiParticles.length > 0) {
        this.animationFrame = requestAnimationFrame(animate);
      }
    };

    this.animationFrame = requestAnimationFrame(animate);
  }

  private generateId(): string {
    return Math.random().toString(36).substr(2, 9);
  }

  trackByParticleId(index: number, particle: ConfettiParticle): string {
    return particle.id;
  }
}