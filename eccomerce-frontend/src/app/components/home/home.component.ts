import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ProductService } from '../../services/product.service';
import { Product } from '../../models/product.model';
import { CartService } from '../../services/cart.service';
import { ToastService } from '../../services/toast.service';
import { NotificationService } from '../../services/notification.service';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  products: Product[] = [];
  
  // Quick View Modal
  isQuickViewOpen = false;
  selectedProduct: Product | null = null;

  constructor(
    private productService: ProductService,
    private cartService: CartService,
    private toastService: ToastService,
    private notificationService: NotificationService,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadProducts();
    
    // Add keyboard event listener for escape key
    document.addEventListener('keydown', (event) => this.onKeyDown(event));
  }

  loadProducts(): void {
    this.productService.getProducts().subscribe({
      next: (products) => {
        console.log('✅ Prodotti ricevuti:', products);
        this.products = products;
      },
      error: (err: any) => {
        console.error('❌ Errore caricamento prodotti:', err);
      }

    });
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

  addToCart(productId: number): void {
    // Trova il prodotto per ottenere le informazioni
    const product = this.products.find(p => p.id === productId);
    
    this.cartService.addToCart(
      productId,
      product?.name,
      product?.price,
      product?.imageUrl
    ).subscribe({
      next: () => {
        // Usa il nuovo servizio di notifiche invece del toast
        this.notificationService.showAddToCartSuccess(
          product?.name || 'Prodotto',
          product?.imageUrl
        );
        
        // Mantieni anche il toast per compatibilità
        this.toastService.success(`✅ ${product?.name || 'Prodotto'} aggiunto al carrello! 🛒`, 4000);
      },
      error: (err) => {
        console.error('Errore aggiunta al carrello:', err);
        this.toastService.error('Errore nell\'aggiunta al carrello');
        
        this.notificationService.showNotification({
          type: 'error',
          title: 'Errore',
          message: 'Impossibile aggiungere il prodotto al carrello'
        });
      }
    });
  }

  // Track by function per migliorare le performance della lista
  trackByProductId(index: number, product: Product): number {
    return product.id;
  }

  // Quick View Methods
  openQuickView(product: Product): void {
    this.selectedProduct = product;
    this.isQuickViewOpen = true;
    // Prevent body scroll when modal is open
    document.body.style.overflow = 'hidden';
  }

  closeQuickView(): void {
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
  onQuickViewBackdropClick(event: Event): void {
    if (event.target === event.currentTarget) {
      this.closeQuickView();
    }
  }

  // Handle escape key
  onKeyDown(event: KeyboardEvent): void {
    if (event.key === 'Escape' && this.isQuickViewOpen) {
      this.closeQuickView();
    }
  }

  // Add to cart from Quick View
  addToCartFromQuickView(product: Product): void {
    this.addToCart(product.id);
    this.closeQuickView();
  }

  // 🛒 Buy Now - Acquisto immediato con controllo autenticazione
  buyNow(product: Product): void {
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
              returnUrl: '/home',
              action: 'buy-now',
              productId: product.id,
              productName: product.name 
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
      product.name,
      product.price,
      product.imageUrl
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
          message: `${product.name} è stato aggiunto al carrello. Procediamo al checkout!`,
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
          console.log('🛒 Authenticated user - Redirect to secure checkout for:', product.name);
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
