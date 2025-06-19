import { Component, OnInit, AfterViewInit, ElementRef, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { ProductService } from '../../services/product.service';
import { CartService } from '../../services/cart.service';
import { ToastService } from '../../services/toast.service';
import { Product } from '../../models/product.model';
import * as confetti from 'canvas-confetti';

@Component({
  selector: 'app-landing',
  templateUrl: './landing.component.html',
  styleUrls: ['./landing.component.css']
})
export class LandingComponent implements OnInit, AfterViewInit {
  products: Product[] = [];
  featuredProducts: Product[] = [];

  @ViewChild('magicButton', { static: false }) magicButton!: ElementRef;

  constructor(
    private productService: ProductService,
    private cartService: CartService,
    private toastService: ToastService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadProducts();

    // Test toast al caricamento per verificare che funzioni
    setTimeout(() => {
      this.toastService.info('🚀 Landing page caricata con successo!');
    }, 2000);
  }

  ngAfterViewInit(): void {
    this.initializeAnimations();
    this.animateCounters();
  }

  loadProducts(): void {
    this.productService.getProducts().subscribe({
      next: (products) => {
        this.products = products.slice(0, 8); // Mostra solo i primi 8 prodotti
        this.featuredProducts = products.slice(0, 3); // Primi 3 per l'hero
      },
      error: (err) => {
        console.error('Errore nel caricamento prodotti:', err);
        // Dati mock per sviluppo
        this.products = this.getMockProducts();
        this.featuredProducts = this.products.slice(0, 3);
      }
    });
  }

  addToCart(productId: number, event: Event): void {
    event.stopPropagation();

    console.log('🛒 Tentativo aggiunta al carrello:', productId);

    // Trova il prodotto per ottenere le informazioni
    const product = this.products.find(p => p.id === productId);
    console.log('📦 Prodotto trovato:', product);

    if (!product) {
      console.error('❌ Prodotto non trovato!');
      this.toastService.error('❌ Prodotto non trovato!');
      return;
    }

    this.cartService.addToCart(
      productId,
      product?.name,
      product?.price,
      product?.imageUrl
    ).subscribe({
      next: () => {
        console.log('✅ Prodotto aggiunto al carrello con successo!');

        // 🎉 Effetto confetti al click del pulsante
        this.triggerAddToCartEffect(event);

        // 🎯 Animazione alternativa CSS (backup)
        this.triggerButtonAnimation(event);

        // 🛒 Notifica di successo migliorata
        this.toastService.success(
          `🎉 Fantastico! ${product?.name || 'Prodotto'} è stato aggiunto al tuo carrello! 🛒`,
          5000
        );
      },
      error: (err) => {
        console.error('❌ Errore aggiunta al carrello:', err);
        this.toastService.error('❌ Ops! Si è verificato un errore nell\'aggiunta al carrello. Riprova!');
      }
    });
  }

  viewProduct(product: Product): void {
    // Naviga alla pagina del prodotto specifico
    this.router.navigate(['/product', product.id]);
  }

  scrollToProducts(): void {
    const element = document.getElementById('products');
    if (element) {
      element.scrollIntoView({
        behavior: 'smooth',
        block: 'start'
      });
    }
  }

  private initializeAnimations(): void {
    // Animazione delle particelle fluttuanti
    this.animateFloatingElements();

    // Animazione del testo hero
    setTimeout(() => {
      const title = document.querySelector('.hero-title');
      if (title) {
        title.classList.add('animate-in');
      }
    }, 500);
  }

  private animateFloatingElements(): void {
    const circles = document.querySelectorAll('.floating-circle');
    circles.forEach((circle, index) => {
      const element = circle as HTMLElement;
      const duration = 3000 + (index * 1000);
      const delay = index * 500;

      setTimeout(() => {
        element.style.animation = `float ${duration}ms ease-in-out infinite`;
      }, delay);
    });
  }

  private animateCounters(): void {
    const counters = document.querySelectorAll('.stat-number');

    const animateCounter = (counter: Element) => {
      const target = parseInt(counter.getAttribute('data-count') || '0');
      const duration = 2000;
      const step = target / (duration / 16);
      let current = 0;

      const timer = setInterval(() => {
        current += step;
        if (current >= target) {
          current = target;
          clearInterval(timer);
        }
        counter.textContent = Math.floor(current).toString();
      }, 16);
    };

    // Intersection Observer per avviare l'animazione quando visibile
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          animateCounter(entry.target);
          observer.unobserve(entry.target);
        }
      });
    });

    counters.forEach(counter => observer.observe(counter));
  }



  getPlaceholderImage(): string {
    return 'https://images.unsplash.com/photo-1531297484001-80022131f5a1?w=500&h=500&fit=crop&crop=center';
  }

  onImageError(event: any): void {
    event.target.src = this.getPlaceholderImage();
  }

  private getMockProducts(): Product[] {
    return [
      {
        id: 1,
        name: 'PearPhone 15 Pro',
        description: 'Il futuro nelle tue mani. Chip P17 Bionic e fotocamera rivoluzionaria.',
        price: 1199.99,
        imageUrl: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=500&h=500&fit=crop&crop=center'
      },
      {
        id: 2,
        name: 'PearBook Pro',
        description: 'Potenza senza limiti. Chip P3 Max per creativi e professionisti.',
        price: 2299.99,
        imageUrl: 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=500&h=500&fit=crop&crop=center'
      },
      {
        id: 3,
        name: 'PearPods Pro',
        description: 'Audio spaziale. Cancellazione del rumore adattiva di nuova generazione.',
        price: 249.99,
        imageUrl: 'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=500&h=500&fit=crop&crop=center'
      },
      {
        id: 4,
        name: 'PearWatch Ultra',
        description: 'Oltre ogni limite. Titanio, GPS di precisione, batteria infinita.',
        price: 799.99,
        imageUrl: 'https://images.unsplash.com/photo-1551698618-1dfe5d97d256?w=500&h=500&fit=crop&crop=center'
      },
      {
        id: 5,
        name: 'PearPad Pro 13"',
        description: 'Creatività amplificata. Display Liquid Retina XDR e chip P2 Ultra.',
        price: 1099.99,
        imageUrl: 'https://images.unsplash.com/photo-1561154464-82e9adf32764?w=500&h=500&fit=crop&crop=center'
      },
      {
        id: 6,
        name: 'PearStudio Max',
        description: 'Suono cinematografico. Driver dinamici da 40mm e audio spaziale.',
        price: 549.99,
        imageUrl: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500&h=500&fit=crop&crop=center'
      },
      {
        id: 7,
        name: 'PearMini',
        description: 'Piccolo ma potente. Tutto il meglio di Pear in formato compatto.',
        price: 699.99,
        imageUrl: 'https://images.unsplash.com/photo-1512499617640-c74ae3a79d37?w=500&h=500&fit=crop&crop=center'
      },
      {
        id: 8,
        name: 'PearTV 4K',
        description: 'Intrattenimento reinventato. Streaming 4K HDR e gaming di livello console.',
        price: 179.99,
        imageUrl: 'https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?w=500&h=500&fit=crop&crop=center'
      }
    ];
  }

  // ✨ Effetto magico con Canvas Confetti
  triggerMagicEffect(event: MouseEvent): void {
    const button = event.target as HTMLElement;
    const rect = button.getBoundingClientRect();

    // Calcola la posizione del bottone relativa alla viewport
    const x = (rect.left + rect.width / 2) / window.innerWidth;
    const y = (rect.top + rect.height / 2) / window.innerHeight;

    // 🌟 Effetto Stelle Dorate BRILLANTI
    confetti({
      particleCount: 80,
      spread: 70,
      origin: { x, y },
      colors: ['#FFD700', '#FF8C00', '#FF4500', '#DC143C', '#8A2BE2'],
      shapes: ['star'],
      scalar: 1.5,
      drift: 0,
      gravity: 0.5,
      ticks: 400,
      startVelocity: 45
    });

    // ✨ Effetto Sparkles LUMINOSI
    setTimeout(() => {
      confetti({
        particleCount: 60,
        spread: 50,
        origin: { x, y },
        colors: ['#FFFF00', '#00FFFF', '#FF69B4', '#32CD32', '#FF1493'],
        shapes: ['circle'],
        scalar: 1.0,
        drift: 0.3,
        gravity: 0.4,
        ticks: 300,
        startVelocity: 35
      });
    }, 100);

    // 🎊 Effetto Confetti ESPLOSIVO
    setTimeout(() => {
      confetti({
        particleCount: 100,
        spread: 120,
        origin: { x, y },
        colors: ['#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEAA7', '#DDA0DD'],
        shapes: ['square', 'circle'],
        scalar: 0.8,
        drift: 0.5,
        gravity: 0.7,
        ticks: 350,
        startVelocity: 50
      });
    }, 200);

    // 🌈 Effetto Arcobaleno FINALE
    setTimeout(() => {
      confetti({
        particleCount: 40,
        spread: 360,
        origin: { x, y },
        colors: ['#FF0000', '#FF7F00', '#FFFF00', '#00FF00', '#0000FF', '#4B0082', '#9400D3'],
        shapes: ['star', 'circle'],
        scalar: 1.3,
        drift: 1,
        gravity: 0.3,
        ticks: 500,
        startVelocity: 30
      });
    }, 350);
  }

  // 🛒 Effetto confetti per aggiunta al carrello
  triggerAddToCartEffect(event: Event): void {
    console.log('🎉 Triggering add to cart effect!', event);
    
    const button = event.target as HTMLElement;
    const rect = button.getBoundingClientRect();
    
    console.log('📍 Button position:', rect);
    
    // Calcola la posizione del bottone relativa alla viewport
    const x = (rect.left + rect.width / 2) / window.innerWidth;
    const y = (rect.top + rect.height / 2) / window.innerHeight;
    
    console.log('🎯 Confetti origin:', { x, y });

    try {
      // 🎉 Primo esplosione - Oro e Arancione
      confetti({
        particleCount: 50,
        spread: 60,
        origin: { x, y },
        colors: ['#FFD700', '#FF6B35', '#F7931E', '#FFA500', '#FF4500'],
        shapes: ['square', 'circle'],
        scalar: 1.2,
        drift: 0.1,
        gravity: 0.5,
        ticks: 300,
        startVelocity: 35
      });
      
      console.log('✨ First confetti triggered!');

      // ⭐ Secondo esplosione - Stelle Dorate
      setTimeout(() => {
        confetti({
          particleCount: 30,
          spread: 80,
          origin: { x, y },
          colors: ['#FFD700', '#FFDF00', '#FFE135', '#FFF700'],
          shapes: ['star'],
          scalar: 1.5,
          drift: 0.3,
          gravity: 0.4,
          ticks: 250,
          startVelocity: 30
        });
        console.log('⭐ Second confetti triggered!');
      }, 150);

      // 🎊 Terza esplosione - Coriandoli Colorati
      setTimeout(() => {
        confetti({
          particleCount: 40,
          spread: 100,
          origin: { x, y },
          colors: ['#FF69B4', '#00CED1', '#32CD32', '#DA70D6', '#FF1493'],
          shapes: ['square', 'circle'],
          scalar: 0.9,
          drift: 0.5,
          gravity: 0.6,
          ticks: 200,
          startVelocity: 25
        });
        console.log('🎊 Third confetti triggered!');
      }, 300);
    } catch (error) {
      console.error('❌ Errore confetti:', error);
    }
  }

  // 🧪 Metodo di test per confetti
  testConfetti(): void {
    console.log('🧪 Testing confetti...');
    
    try {
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#ff0000', '#00ff00', '#0000ff']
      });
      console.log('✅ Test confetti success!');
    } catch (error) {
      console.error('❌ Test confetti failed:', error);
    }
  }

  // 🎯 Animazione alternativa con CSS (backup se confetti non funziona)
  triggerButtonAnimation(event: Event): void {
    const button = event.target as HTMLElement;
    
    // Aggiungi classe per animazione
    button.classList.add('button-success-animation');
    
    // Rimuovi la classe dopo l'animazione
    setTimeout(() => {
      button.classList.remove('button-success-animation');
    }, 1000);
    
    // Crea particelle CSS
    this.createCssParticles(button);
  }

  private createCssParticles(button: HTMLElement): void {
    const rect = button.getBoundingClientRect();
    const colors = ['#FFD700', '#FF6B35', '#F7931E', '#FFA500', '#FF4500', '#FF69B4', '#00CED1'];
    
    for (let i = 0; i < 15; i++) {
      const particle = document.createElement('div');
      particle.className = 'success-particle';
      particle.style.position = 'fixed';
      particle.style.left = `${rect.left + rect.width / 2}px`;
      particle.style.top = `${rect.top + rect.height / 2}px`;
      
      // Dimensioni random per varietà
      const size = 6 + Math.random() * 8;
      particle.style.width = `${size}px`;
      particle.style.height = `${size}px`;
      
      // Colore random dall'array
      particle.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
      particle.style.borderRadius = Math.random() > 0.5 ? '50%' : '20%';
      particle.style.pointerEvents = 'none';
      particle.style.zIndex = '9999';
      
      // Aggiungi un po' di brillantezza
      particle.style.boxShadow = `0 0 10px ${particle.style.backgroundColor}`;
      
      // Animazione randomica
      const angle = (Math.PI * 2 * i) / 15;
      const velocity = 80 + Math.random() * 80;
      const xEnd = Math.cos(angle) * velocity;
      const yEnd = Math.sin(angle) * velocity - 50; // Un po' verso l'alto
      
      particle.style.transform = `translate(${xEnd}px, ${yEnd}px) rotate(${Math.random() * 360}deg)`;
      particle.style.opacity = '0';
      particle.style.transition = 'all 1s cubic-bezier(0.25, 0.46, 0.45, 0.94)';
      
      document.body.appendChild(particle);
      
      // Trigger l'animazione
      setTimeout(() => {
        particle.style.opacity = '1';
      }, 10);
      
      // Rimuovi particella dopo animazione
      setTimeout(() => {
        if (document.body.contains(particle)) {
          document.body.removeChild(particle);
        }
      }, 1000);
    }
  }
}
