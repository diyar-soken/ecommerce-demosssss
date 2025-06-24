import { Component, type OnInit, type OnDestroy, type ElementRef, ViewChild, type AfterViewInit } from "@angular/core"
import { CommonModule } from "@angular/common"
import { interval, type Subscription } from "rxjs"
import { CartService } from "../../services/cart.service"

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

  constructor(private cartService: CartService) {}

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
      desc: "Revolutionary processing power that redefines mobile computing.",
      image: "../assets/images/p2-ultra.png",
    },
    {
      title: "LIQUID",
      subtitle: "RETINA",
      desc: "13.6-inch display with unprecedented color accuracy and brightness.",
      image: "../assets/images/macbook-display.png",
    },
    {
      title: "ULTRA",
      subtitle: "PORTABLE",
      desc: "Impossibly thin design that doesn't compromise on performance.",
      image: "../assets/images/macbook-side.jpg",
    },
  ]

  // Specifiche per diversi prodotti (con Database IDs)
  products = [
    {
      id: 1, // Database ID
      name: 'PEARBOOK AIR',
      subtitle: 'NOTHING BUT PURE PERFORMANCE',
      image: '/assets/images/macbook-hero.png',
      specs: [
        { label: "PROCESSOR", value: "P1 Neural Engine" },
        { label: "MEMORY", value: "16GB Unified Memory" },
        { label: "STORAGE", value: "512GB SSD" },
        { label: "DISPLAY", value: "13.6-inch Liquid Retina" },
        { label: "BATTERY", value: "22-hour all-day battery" },
        { label: "WEIGHT", value: "1.24 kg" },
      ]
    },
    {
      id: 4, // Database ID
      name: 'PEARPHONE 15',
      subtitle: 'INNOVATION IN YOUR POCKET',
      image: '/assets/images/iphone-15.png',
      specs: [
        { label: "PROCESSOR", value: "A17 Pro Chip" },
        { label: "MEMORY", value: "8GB RAM" },
        { label: "STORAGE", value: "256GB Flash" },
        { label: "DISPLAY", value: "6.7-inch Super Retina XDR" },
        { label: "BATTERY", value: "29-hour video playback" },
        { label: "WEIGHT", value: "240g" },
      ]
    },
    {
      id: 3, // Database ID
      name: 'PEARPAD PRO',
      subtitle: 'CREATIVITY UNLEASHED',
      image: '/assets/images/ipad-pro.png',
      specs: [
        { label: "PROCESSOR", value: "P2 Ultra Chip" },
        { label: "MEMORY", value: "12GB Unified Memory" },
        { label: "STORAGE", value: "1TB SSD" },
        { label: "DISPLAY", value: "12.9-inch Liquid Retina XDR" },
        { label: "BATTERY", value: "10-hour all-day battery" },
        { label: "WEIGHT", value: "682g" },
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

  galleryItems = [
    {
      id: 1, // Database ID
      src: "/assets/images/macbook-hero.png",
      title: "PearBook Air",
      subtitle: "13-inch MacBook Air",
      price: 1299,
      description: "Supercharged by the P1 Neural Engine"
    },
    {
      id: 2, // Database ID
      src: "/assets/images/macbook-side.png",
      title: "PearBook Pro",
      subtitle: "14-inch MacBook Pro",
      price: 1999,
      description: "Pro performance for demanding tasks"
    },
    {
      id: 3, // Database ID
      src: "/assets/images/ipad-pro.png",
      title: "PearPad Pro",
      subtitle: "12.9-inch iPad Pro",
      price: 1099,
      description: "The ultimate creative companion"
    },
    {
      id: 4, // Database ID
      src: "/assets/images/iphone-15.png",
      title: "PearPhone 15",
      subtitle: "6.7-inch Display",
      price: 999,
      description: "Innovation in your pocket"
    },
    {
      id: 5, // Database ID
      src: "/assets/images/macbook-display.png",
      title: "Studio Display",
      subtitle: "27-inch 5K Display",
      price: 1599,
      description: "Immersive viewing experience"
    },
    {
      id: 6, // Database ID
      src: "/assets/images/p2-ultra.png",
      title: "PearPod Pro",
      subtitle: "Wireless Earbuds",
      price: 249,
      description: "Spatial audio perfection"
    },
  ]

  // Shopping Cart - gestito dal CartService
  cartCount = 0
  cartAnimated = false

  footerLinks = {
    products: ["PearBook", "PearPad", "PearPhone", "Accessories"],
    support: ["Contact", "Warranty", "Repairs", "Manuals"],
    company: ["About", "Careers", "Press", "Investors"],
    connect: ["Newsletter", "Community", "Social", "Events"],
  }

  ngOnInit() {
    this.generateDots()
    this.startClock()
    this.setupIntersectionObserver()

    // Subscribe al cartCount del CartService
    this.cartService.cartCount$.subscribe(count => {
      this.cartCount = count;
    });
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
    return date.toLocaleTimeString("en-US", {
      hour12: false,
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    })
  }

  formatDate(date: Date): string {
    return date.toLocaleDateString("en-US", {
      weekday: "short",
      day: "numeric",
    })
  }

  formatFullDate(date: Date): string {
    return (
      date.toLocaleDateString("en-US", {
        day: "numeric",
        month: "long",
        year: "numeric",
      }) +
      ", " +
      date.toLocaleTimeString("en-US", {
        hour: "2-digit",
        minute: "2-digit",
        hour12: false,
      }) +
      " EST"
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
        
        this.showAddedToCartNotification(product.title);
        console.log('Product added to cart:', cartItem);
      },
      error: (error) => {
        console.error('Error adding product to cart:', error);
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
}
