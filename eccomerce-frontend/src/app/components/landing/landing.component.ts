import { Component, type OnInit, type OnDestroy, type ElementRef, ViewChild, type AfterViewInit } from "@angular/core"
import { CommonModule } from "@angular/common"
import { Router } from "@angular/router"
import { interval, type Subscription } from "rxjs"
import { CartService } from "../../services/cart.service"
import { NotificationService } from "../../services/notification.service"
import { AuthService } from "../../services/auth.service"

interface Dot {
  id: number
  x: number
  y: number
  size: number
  opacity: number
}

interface PearDot {
  x: number
  y: number
}

@Component({
  selector: "app-root",
  templateUrl: "./landing.component.html",
  styleUrls: ["./landing.component.css"],
})
export class LandingComponent implements OnInit, OnDestroy, AfterViewInit {
  @ViewChild("heroSection") heroSection!: ElementRef
  @ViewChild("productSection") productSection!: ElementRef
  @ViewChild("featuresSection") featuresSection!: ElementRef
  @ViewChild("techSection") techSection!: ElementRef
  @ViewChild("gallerySection") gallerySection!: ElementRef
  @ViewChild("communitySection") communitySection!: ElementRef

  currentTime = new Date()
  private timeSubscription!: Subscription
  private intersectionObserver!: IntersectionObserver

  constructor(
    private cartService: CartService,
    private notificationService: NotificationService,
    private authService: AuthService,
    private router: Router
  ) {}

  dots: Dot[] = []
  pearLogoDots: PearDot[] = [
    // Gambo verde - super sottile
    { x: 50, y: 5 },
    { x: 50, y: 8 },

    // Collo strettissimo tipico della pera
    { x: 49, y: 12 }, { x: 50, y: 12 }, { x: 51, y: 12 },
    { x: 48, y: 16 }, { x: 49, y: 16 }, { x: 50, y: 16 }, { x: 51, y: 16 }, { x: 52, y: 16 },

    // Allargamento graduale - tipico della pera
    { x: 46, y: 20 }, { x: 47, y: 20 }, { x: 48, y: 20 }, { x: 49, y: 20 }, { x: 50, y: 20 }, { x: 51, y: 20 }, { x: 52, y: 20 }, { x: 53, y: 20 }, { x: 54, y: 20 },

    { x: 44, y: 24 }, { x: 45, y: 24 }, { x: 46, y: 24 }, { x: 47, y: 24 }, { x: 48, y: 24 }, { x: 49, y: 24 }, { x: 50, y: 24 }, { x: 51, y: 24 }, { x: 52, y: 24 }, { x: 53, y: 24 }, { x: 54, y: 24 }, { x: 55, y: 24 }, { x: 56, y: 24 },

    { x: 42, y: 28 }, { x: 43, y: 28 }, { x: 44, y: 28 }, { x: 45, y: 28 }, { x: 46, y: 28 }, { x: 47, y: 28 }, { x: 48, y: 28 }, { x: 49, y: 28 }, { x: 50, y: 28 }, { x: 51, y: 28 }, { x: 52, y: 28 }, { x: 53, y: 28 }, { x: 54, y: 28 }, { x: 55, y: 28 }, { x: 56, y: 28 }, { x: 57, y: 28 }, { x: 58, y: 28 },

    { x: 40, y: 32 }, { x: 41, y: 32 }, { x: 42, y: 32 }, { x: 43, y: 32 }, { x: 44, y: 32 }, { x: 45, y: 32 }, { x: 46, y: 32 }, { x: 47, y: 32 }, { x: 48, y: 32 }, { x: 49, y: 32 }, { x: 50, y: 32 }, { x: 51, y: 32 }, { x: 52, y: 32 }, { x: 53, y: 32 }, { x: 54, y: 32 }, { x: 55, y: 32 }, { x: 56, y: 32 }, { x: 57, y: 32 }, { x: 58, y: 32 }, { x: 59, y: 32 }, { x: 60, y: 32 },

    { x: 38, y: 36 }, { x: 39, y: 36 }, { x: 40, y: 36 }, { x: 41, y: 36 }, { x: 42, y: 36 }, { x: 43, y: 36 }, { x: 44, y: 36 }, { x: 45, y: 36 }, { x: 46, y: 36 }, { x: 47, y: 36 }, { x: 48, y: 36 }, { x: 49, y: 36 }, { x: 50, y: 36 }, { x: 51, y: 36 }, { x: 52, y: 36 }, { x: 53, y: 36 }, { x: 54, y: 36 }, { x: 55, y: 36 }, { x: 56, y: 36 }, { x: 57, y: 36 }, { x: 58, y: 36 }, { x: 59, y: 36 }, { x: 60, y: 36 }, { x: 61, y: 36 }, { x: 62, y: 36 },

    { x: 36, y: 40 }, { x: 37, y: 40 }, { x: 38, y: 40 }, { x: 39, y: 40 }, { x: 40, y: 40 }, { x: 41, y: 40 }, { x: 42, y: 40 }, { x: 43, y: 40 }, { x: 44, y: 40 }, { x: 45, y: 40 }, { x: 46, y: 40 }, { x: 47, y: 40 }, { x: 48, y: 40 }, { x: 49, y: 40 }, { x: 50, y: 40 }, { x: 51, y: 40 }, { x: 52, y: 40 }, { x: 53, y: 40 }, { x: 54, y: 40 }, { x: 55, y: 40 }, { x: 56, y: 40 }, { x: 57, y: 40 }, { x: 58, y: 40 }, { x: 59, y: 40 }, { x: 60, y: 40 }, { x: 61, y: 40 }, { x: 62, y: 40 }, { x: 63, y: 40 }, { x: 64, y: 40 },

    // PARTE PIÙ LARGA DELLA PERA - verso il basso (caratteristica distintiva!)
    { x: 35, y: 44 }, { x: 36, y: 44 }, { x: 37, y: 44 }, { x: 38, y: 44 }, { x: 39, y: 44 }, { x: 40, y: 44 }, { x: 41, y: 44 }, { x: 42, y: 44 }, { x: 43, y: 44 }, { x: 44, y: 44 }, { x: 45, y: 44 }, { x: 46, y: 44 }, { x: 47, y: 44 }, { x: 48, y: 44 }, { x: 49, y: 44 }, { x: 50, y: 44 }, { x: 51, y: 44 }, { x: 52, y: 44 }, { x: 53, y: 44 }, { x: 54, y: 44 }, { x: 55, y: 44 }, { x: 56, y: 44 }, { x: 57, y: 44 }, { x: 58, y: 44 }, { x: 59, y: 44 }, { x: 60, y: 44 }, { x: 61, y: 44 }, { x: 62, y: 44 }, { x: 63, y: 44 }, { x: 64, y: 44 }, { x: 65, y: 44 },

    { x: 34, y: 48 }, { x: 35, y: 48 }, { x: 36, y: 48 }, { x: 37, y: 48 }, { x: 38, y: 48 }, { x: 39, y: 48 }, { x: 40, y: 48 }, { x: 41, y: 48 }, { x: 42, y: 48 }, { x: 43, y: 48 }, { x: 44, y: 48 }, { x: 45, y: 48 }, { x: 46, y: 48 }, { x: 47, y: 48 }, { x: 48, y: 48 }, { x: 49, y: 48 }, { x: 50, y: 48 }, { x: 51, y: 48 }, { x: 52, y: 48 }, { x: 53, y: 48 }, { x: 54, y: 48 }, { x: 55, y: 48 }, { x: 56, y: 48 }, { x: 57, y: 48 }, { x: 58, y: 48 }, { x: 59, y: 48 }, { x: 60, y: 48 }, { x: 61, y: 48 }, { x: 62, y: 48 }, { x: 63, y: 48 }, { x: 64, y: 48 }, { x: 65, y: 48 }, { x: 66, y: 48 },

    { x: 33, y: 52 }, { x: 34, y: 52 }, { x: 35, y: 52 }, { x: 36, y: 52 }, { x: 37, y: 52 }, { x: 38, y: 52 }, { x: 39, y: 52 }, { x: 40, y: 52 }, { x: 41, y: 52 }, { x: 42, y: 52 }, { x: 43, y: 52 }, { x: 44, y: 52 }, { x: 45, y: 52 }, { x: 46, y: 52 }, { x: 47, y: 52 }, { x: 48, y: 52 }, { x: 49, y: 52 }, { x: 50, y: 52 }, { x: 51, y: 52 }, { x: 52, y: 52 }, { x: 53, y: 52 }, { x: 54, y: 52 }, { x: 55, y: 52 }, { x: 56, y: 52 }, { x: 57, y: 52 }, { x: 58, y: 52 }, { x: 59, y: 52 }, { x: 60, y: 52 }, { x: 61, y: 52 }, { x: 62, y: 52 }, { x: 63, y: 52 }, { x: 64, y: 52 }, { x: 65, y: 52 }, { x: 66, y: 52 }, { x: 67, y: 52 },

    // Ancora parte larga - MASSIMA larghezza qui (tipico della pera!)
    { x: 32, y: 56 }, { x: 33, y: 56 }, { x: 34, y: 56 }, { x: 35, y: 56 }, { x: 36, y: 56 }, { x: 37, y: 56 }, { x: 38, y: 56 }, { x: 39, y: 56 }, { x: 40, y: 56 }, { x: 41, y: 56 }, { x: 42, y: 56 }, { x: 43, y: 56 }, { x: 44, y: 56 }, { x: 45, y: 56 }, { x: 46, y: 56 }, { x: 47, y: 56 }, { x: 48, y: 56 }, { x: 49, y: 56 }, { x: 50, y: 56 }, { x: 51, y: 56 }, { x: 52, y: 56 }, { x: 53, y: 56 }, { x: 54, y: 56 }, { x: 55, y: 56 }, { x: 56, y: 56 }, { x: 57, y: 56 }, { x: 58, y: 56 }, { x: 59, y: 56 }, { x: 60, y: 56 }, { x: 61, y: 56 }, { x: 62, y: 56 }, { x: 63, y: 56 }, { x: 64, y: 56 }, { x: 65, y: 56 }, { x: 66, y: 56 }, { x: 67, y: 56 }, { x: 68, y: 56 },

    // Inizio forma a VASO - manteniamo la larghezza un po' di più
    { x: 35, y: 60 }, { x: 36, y: 60 }, { x: 37, y: 60 }, { x: 38, y: 60 }, { x: 39, y: 60 }, { x: 40, y: 60 }, { x: 41, y: 60 }, { x: 42, y: 60 }, { x: 43, y: 60 }, { x: 44, y: 60 }, { x: 45, y: 60 }, { x: 46, y: 60 }, { x: 47, y: 60 }, { x: 48, y: 60 }, { x: 49, y: 60 }, { x: 50, y: 60 }, { x: 51, y: 60 }, { x: 52, y: 60 }, { x: 53, y: 60 }, { x: 54, y: 60 }, { x: 55, y: 60 }, { x: 56, y: 60 }, { x: 57, y: 60 }, { x: 58, y: 60 }, { x: 59, y: 60 }, { x: 60, y: 60 }, { x: 61, y: 60 }, { x: 62, y: 60 }, { x: 63, y: 60 }, { x: 64, y: 60 }, { x: 65, y: 60 },

    // Curvatura laterale dolce - forma vaso
    { x: 37, y: 64 }, { x: 38, y: 64 }, { x: 39, y: 64 }, { x: 40, y: 64 }, { x: 41, y: 64 }, { x: 42, y: 64 }, { x: 43, y: 64 }, { x: 44, y: 64 }, { x: 45, y: 64 }, { x: 46, y: 64 }, { x: 47, y: 64 }, { x: 48, y: 64 }, { x: 49, y: 64 }, { x: 50, y: 64 }, { x: 51, y: 64 }, { x: 52, y: 64 }, { x: 53, y: 64 }, { x: 54, y: 64 }, { x: 55, y: 64 }, { x: 56, y: 64 }, { x: 57, y: 64 }, { x: 58, y: 64 }, { x: 59, y: 64 }, { x: 60, y: 64 }, { x: 61, y: 64 }, { x: 62, y: 64 }, { x: 63, y: 64 },
  ]

  features = [
    {
      title: "P1 NEURAL",
      subtitle: "ENGINE",
      desc: "Potenza di elaborazione rivoluzionaria che ridefinisce il computing mobile.",
      image: "../assets/images/p2-ultra.png",
    },
    {
      title: "LIQUID",
      subtitle: "RETINA",
      desc: "Display da 13,6 pollici con precisione cromatica e luminosità senza precedenti.",
      image: "../assets/images/macbook-display.png",
    },
    {
      title: "ULTRA",
      subtitle: "PORTATILE",
      desc: "Design incredibilmente sottile che non compromette le prestazioni.",
      image: "../assets/images/macbook-side.png",
    },
  ]

  // Specifiche per diversi prodotti (con Database IDs)
  products = [
    {
      id: 1, // Database ID
      name: 'PEARBOOK AIR',
      subtitle: 'NIENTE ALTRO CHE PURA PERFORMANCE',
      image: '../assets/images/macbook-air.png',
      specs: [
        { label: "PROCESSORE", value: "P1 Neural Engine" },
        { label: "MEMORIA", value: "16GB Memoria Unificata" },
        { label: "ARCHIVIAZIONE", value: "512GB SSD" },
        { label: "DISPLAY", value: "13,6 pollici Liquid Retina" },
        { label: "BATTERIA", value: "22 ore di autonomia" },
        { label: "PESO", value: "1,24 kg" },
      ]
    },
    {
      id: 4, // Database ID
      name: 'PEARPHONE 15',
      subtitle: 'INNOVAZIONE IN TASCA',
      image: '../assets/images/iphone16.png',
      specs: [
        { label: "PROCESSORE", value: "Chip A17 Pro" },
        { label: "MEMORIA", value: "8GB RAM" },
        { label: "ARCHIVIAZIONE", value: "256GB Flash" },
        { label: "DISPLAY", value: "6,7 pollici Super Retina XDR" },
        { label: "BATTERIA", value: "29 ore riproduzione video" },
        { label: "PESO", value: "240g" },
      ]
    },
    {
      id: 3, // Database ID
      name: 'PEARPAD PRO',
      subtitle: 'CREATIVITÀ SENZA LIMITI',
      image: '../assets/images/ipadpro.png',
      specs: [
        { label: "PROCESSORE", value: "Chip P2 Ultra" },
        { label: "MEMORIA", value: "12GB Memoria Unificata" },
        { label: "ARCHIVIAZIONE", value: "1TB SSD" },
        { label: "DISPLAY", value: "12,9 pollici Liquid Retina XDR" },
        { label: "BATTERIA", value: "10 ore di autonomia" },
        { label: "PESO", value: "682g" },
      ]
    }
  ];

  currentProductIndex = 0;

  get currentProduct() {
    return this.products[this.currentProductIndex];
  }

  get techSpecs() {
    return this.currentProduct.specs;
  }

  // 🔐 Helper methods per autenticazione
  get isUserLoggedIn(): boolean {
    return this.authService.isLoggedIn();
  }

  get currentUser(): any {
    return this.authService.getUser();
  }

  get userDisplayName(): string {
    const user = this.currentUser;
    return user?.name || user?.email || 'Utente';
  }

  galleryItems = [
    {
      id: 1, // Database ID
      src: "../assets/images/macbook-air-mini.png",
      title: "PearBook Air",
      subtitle: "MacBook Air da 13 pollici",
      price: 1299,
      description: "Potenziato dal P1 Neural Engine"
    },
    {
      id: 2, // Database ID
      src: "/assets/images/macbook-pro.png",
      title: "PearBook Pro",
      subtitle: "MacBook Pro da 14 pollici",
      price: 1999,
      description: "Prestazioni professionali per attività impegnative"
    },
    {
      id: 3, // Database ID
      src: "/assets/images/ipadpro-mini.png",
      title: "PearPad Pro",
      subtitle: "iPad Pro da 12,9 pollici",
      price: 1099,
      description: "Il compagno creativo definitivo"
    },
    {
      id: 4, // Database ID
      src: "/assets/images/iphone16-mini.png",
      title: "PearPhone 15",
      subtitle: "Display da 6,7 pollici",
      price: 999,
      description: "Innovazione in tasca"
    },
    {
      id: 5, // Database ID
      src: "/assets/images/applestudio-mini.png",
      title: "Studio Display",
      subtitle: "Display 5K da 27 pollici",
      price: 1599,
      description: "Esperienza visiva coinvolgente"
    },
    {
      id: 6, // Database ID
      src: "/assets/images/airpods-mini.png",
      title: "PearPod Pro",
      subtitle: "Auricolari Wireless",
      price: 249,
      description: "Perfezione audio spaziale"
    },
  ]

  // Shopping Cart - gestito dal CartService
  cartCount = 0
  cartAnimated = false

  // Quick View Modal
  isQuickViewOpen = false
  selectedProduct: any = null

  footerLinks = {
    products: ["PearBook", "PearPad", "PearPhone", "Accessori"],
    support: ["Contatti", "Garanzia", "Riparazioni", "Manuali"],
    company: ["Chi Siamo", "Carriere", "Stampa", "Investitori"],
    connect: ["Newsletter", "Community", "Social", "Eventi"],
  }

  ngOnInit() {
    this.generateDots()
    this.startClock()
    this.setupIntersectionObserver()

    // Subscribe al cartCount del CartService
    this.cartService.cartCount$.subscribe(count => {
      this.cartCount = count;
    });

    // Add keyboard event listener for escape key
    document.addEventListener('keydown', (event) => this.onKeyDown(event));
  }

  ngAfterViewInit() {
    this.observeElements()
  }

  ngOnDestroy() {
    if (this.timeSubscription) {
      this.timeSubscription.unsubscribe()
    }
    if (this.intersectionObserver) {
      this.intersectionObserver.disconnect()
    }
  }

  trackByDotId(index: number, dot: Dot): number {
    return dot.id
  }

  private generateDots() {
    for (let i = 0; i < 110; i++) {
      this.dots.push({
        id: i,
        x: Math.random() * 100,
        y: Math.random() * 100,
        size: Math.random() * 2 + 1,
        opacity: Math.random() * 0.4 + 0.2,
      })
    }
  }

  private startClock() {
    this.timeSubscription = interval(1000).subscribe(() => {
      this.currentTime = new Date()
    })
  }

  private setupIntersectionObserver() {
    this.intersectionObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("visible")
          }
        })
      },
      { threshold: 0.1, rootMargin: "-100px" },
    )
  }

  private observeElements() {
    const elements = [
      this.productSection,
      this.featuresSection,
      this.techSection,
      this.gallerySection,
      this.communitySection,
    ]

    elements.forEach((element) => {
      if (element) {
        this.intersectionObserver.observe(element.nativeElement)
      }
    })
  }

  formatTime(date: Date): string {
    return date.toLocaleTimeString("it-IT", {
      hour12: false,
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    })
  }

  formatDate(date: Date): string {
    return date.toLocaleDateString("it-IT", {
      weekday: "short",
      day: "numeric",
    })
  }

  formatFullDate(date: Date): string {
    return (
      date.toLocaleDateString("it-IT", {
        day: "numeric",
        month: "long",
        year: "numeric",
      }) +
      ", " +
      date.toLocaleTimeString("it-IT", {
        hour: "2-digit",
        minute: "2-digit",
        hour12: false,
      }) +
      " CET"
    )
  }

  getClockRotation(type: "hour" | "minute" | "second"): string {
    const hours = this.currentTime.getHours() % 12
    const minutes = this.currentTime.getMinutes()
    const seconds = this.currentTime.getSeconds()

    switch (type) {
      case "hour":
        return `rotate(${hours * 30 + minutes * 0.5}deg)`
      case "minute":
        return `rotate(${minutes * 6}deg)`
      case "second":
        return `rotate(${seconds * 6}deg)`
      default:
        return "rotate(0deg)"
    }
  }

  scrollToSection(sectionId: string) {
    const element = document.getElementById(sectionId)
    if (element) {
      element.scrollIntoView({ behavior: "smooth" })
    }
  }

  // Metodi per navigare tra i prodotti
  nextProduct() {
    this.currentProductIndex = (this.currentProductIndex + 1) % this.products.length;
  }

  prevProduct() {
    this.currentProductIndex = this.currentProductIndex === 0
      ? this.products.length - 1
      : this.currentProductIndex - 1;
  }

  selectProduct(index: number) {
    this.currentProductIndex = index;
  }

  // Shopping Cart Methods
  addToCart(product: any) {
    this.cartService.addToCart(
      product.id,
      product.title,
      product.price,
      product.src
    ).subscribe({
      next: (cartItem) => {
        // Forza l'aggiornamento del contatore carrello
        this.cartService.getCartItems().subscribe(items => {
          this.cartService.updateCartCount(items);
        });

        // Usa il nuovo servizio di notifiche
        this.notificationService.showAddToCartSuccess(
          product.title,
          product.src
        );

        // Mantieni anche la notifica semplice per compatibilità
        this.showAddedToCartNotification(product.title);
        console.log('Product added to cart:', cartItem);
      },
      error: (error) => {
        console.error('Error adding product to cart:', error);

        // Usa il nuovo servizio per gli errori
        this.notificationService.showNotification({
          type: 'error',
          title: 'Errore',
          message: 'Impossibile aggiungere il prodotto al carrello'
        });

        this.showErrorNotification('Errore nell\'aggiungere il prodotto al carrello');
      }
    });
  }

  private showAddedToCartNotification(productName: string) {
    console.log(`${productName} aggiunto al carrello!`);

    this.showNotification(`🛒 ${productName} aggiunto al carrello!`, 'success');
  }

  private showErrorNotification(message: string) {
    this.showNotification(`❌ ${message}`, 'error');
  }

  private showNotification(message: string, type: 'success' | 'error') {
    // Rimuovi notifiche esistenti
    const existingNotifications = document.querySelectorAll('.simple-notification');
    existingNotifications.forEach(n => n.remove());

    // Crea notifica semplice
    const notification = document.createElement('div');
    notification.className = `simple-notification ${type}`;
    notification.textContent = message;

    document.body.appendChild(notification);

    // Mostra con animazione
    setTimeout(() => notification.classList.add('show'), 10);

    // Auto-rimuovi dopo 4 secondi (più tempo per leggere)
    setTimeout(() => {
      notification.classList.add('hide');
      setTimeout(() => {
        if (document.body.contains(notification)) {
          document.body.removeChild(notification);
        }
      }, 400);
    }, 4000);
  }

  private animateCartCounter() {
    this.cartAnimated = true;
    setTimeout(() => {
      this.cartAnimated = false;
    }, 600);
  }

  getCartTotal() {
    // This could be enhanced to get total from CartService if needed
    return 0; // Per ora non utilizzato nell'header
  }

  // Quick View Methods
  openQuickView(product: any) {
    this.selectedProduct = product;
    this.isQuickViewOpen = true;
    // Prevent body scroll when modal is open
    document.body.style.overflow = 'hidden';
  }

  closeQuickView() {
    // Aggiungi animazione di chiusura
    const modal = document.querySelector('.quick-view-modal');
    if (modal) {
      modal.classList.add('closing');
      
      // Attendi che l'animazione finisca prima di chiudere
      setTimeout(() => {
        this.isQuickViewOpen = false;
        this.selectedProduct = null;
        // Restore body scroll
        document.body.style.overflow = 'auto';
      }, 300); // Durata dell'animazione
    } else {
      // Fallback se non trova la modal
      this.isQuickViewOpen = false;
      this.selectedProduct = null;
      document.body.style.overflow = 'auto';
    }
  }

  // Close modal when clicking outside
  onQuickViewBackdropClick(event: Event) {
    if (event.target === event.currentTarget) {
      this.closeQuickView();
    }
  }

  // Handle escape key
  onKeyDown(event: KeyboardEvent) {
    if (event.key === 'Escape' && this.isQuickViewOpen) {
      this.closeQuickView();
    }
  }

  // 🛒 Buy Now - Acquisto immediato con controllo autenticazione
  buyNow(product: any) {
    // 🔐 Controlla se l'utente è autenticato
    if (!this.authService.isLoggedIn()) {
      // Chiudi la modal prima di mostrare la notifica
      this.closeQuickView();
      
      // Mostra notifica che richiede login
      this.notificationService.showNotification({
        type: 'warning',
        title: '🔐 Accesso Richiesto',
        message: 'Devi essere registrato e loggato per effettuare un acquisto immediato.',
        duration: 6000
      });

      // Dopo un breve delay, mostra opzioni di login/registrazione
      setTimeout(() => {
        this.notificationService.showNotification({
          type: 'info',
          title: '👤 Accedi o Registrati',
          message: 'Reindirizzamento alla pagina di login...',
          duration: 3000
        });
        
        // Redirect alla pagina di login dopo 2 secondi
        setTimeout(() => {
          this.router.navigate(['/login'], { 
            queryParams: { 
              returnUrl: '/landing',
              action: 'buy-now',
              productId: product.id,
              productName: product.title 
            }
          });
        }, 2000);
      }, 1500);

      return; // Esci dalla funzione se non autenticato
    }

    // ✅ Utente autenticato - Procedi con l'acquisto
    const user = this.authService.getUser();
    
    // Prima aggiungi al carrello
    this.cartService.addToCart(
      product.id,
      product.title,
      product.price,
      product.src
    ).subscribe({
      next: (cartItem) => {
        // Aggiorna il contatore carrello
        this.cartService.getCartItems().subscribe(items => {
          this.cartService.updateCartCount(items);
        });

        // Chiudi la modal con animazione
        this.closeQuickView();

        // Mostra notifica di successo personalizzata con nome utente
        this.notificationService.showNotification({
          type: 'success',
          title: `🚀 Ciao ${user?.name || 'Utente'}!`,
          message: `${product.title} è stato aggiunto al carrello. Procediamo al checkout!`,
          duration: 5000
        });

        // Simula il redirect al checkout dopo un breve delay
        setTimeout(() => {
          this.notificationService.showNotification({
            type: 'info',
            title: '🛒 Checkout Sicuro',
            message: 'Reindirizzamento al checkout protetto...',
            duration: 3000
          });
          
          // Qui potresti aggiungere la navigazione al checkout
          // this.router.navigate(['/checkout'], { 
          //   queryParams: { 
          //     buyNow: true,
          //     productId: product.id 
          //   }
          // });
          console.log('🛒 Authenticated user - Redirect to secure checkout for:', product.title);
          console.log('👤 User:', user);
        }, 1500);

        console.log('Buy Now - Product added to cart:', cartItem);
      },
      error: (error) => {
        console.error('Error in Buy Now:', error);
        
        this.notificationService.showNotification({
          type: 'error',
          title: '❌ Errore Acquisto',
          message: 'Impossibile completare l\'acquisto immediato. Riprova.'
        });
      }
    });
  }
}
