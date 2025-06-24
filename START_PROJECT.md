# 🚀 Avvio Progetto Pear Store - E-commerce Completo

## 📋 Checklist Pre-Avvio

### ✅ Problemi Rivelti
- [x] **TypeScript Error**: `item.productPrice` possibly undefined → Risolto con null coalescing operator
- [x] **Database**: Prodotti Pear organizzati con categorie
- [x] **Integrazione**: CartService sincronizzato con database IDs
- [x] **Header**: Totale carrello con gestione sicura dei prezzi
- [x] **Environment**: URLs centralizzati

### 🏗️ Componenti Completati
- [x] **LandingComponent**: Gallery interattiva con carrello
- [x] **HeaderComponent**: Badge contatore + totale dinamico
- [x] **CartComponent**: Gestione completa carrello
- [x] **CheckoutComponent**: Processo di pagamento
- [x] **OrdersComponent**: Storico ordini
- [x] **AuthComponents**: Login/Register
- [x] **HomeComponent**: Lista prodotti

## 🚀 Avvio del Progetto

### 1. Backend (Spring Boot)
```bash
cd /Users/user/Desktop/justeat-example/ecommerce-demos
./mvnw clean install
./mvnw spring-boot:run
```

Il backend sarà disponibile su: http://localhost:8080

### 2. Database H2
- **Console**: http://localhost:8080/h2-console
- **JDBC URL**: jdbc:h2:mem:testdb
- **Username**: sa
- **Password**: (vuota)

### 3. Frontend (Angular)
```bash
cd eccomerce-frontend

# Se ci sono problemi npm, prova:
sudo chown -R $(whoami) ~/.npm
npm cache clean --force

# Installazione e avvio
npm install
ng serve
```

Il frontend sarà disponibile su: http://localhost:4200

## 🎯 Funzionalità Principali

### 🏠 Landing Page (`/`)
- **Hero Section**: Animazioni interattive
- **Gallery E-commerce**: 6 prodotti principali con hover effects
- **Add to Cart**: Aggiunta prodotti al carrello
- **Tech Specs**: Carousel specifiche tecniche
- **Animazioni**: Dots floating, clock widget, scroll effects

### 🛒 Sistema Carrello
- **Header Badge**: Contatore articoli + totale spesa
- **Cart Page** (`/cart`): Gestione completa carrello
- **Local Storage**: Per utenti ospiti
- **API Integration**: Per utenti loggati
- **Sync**: Sincronizzazione carrello locale → server al login

### 🔐 Autenticazione
- **Login** (`/login`): Accesso utenti
- **Register** (`/register`): Registrazione
- **Guards**: Protezione rotte private (checkout, orders)
- **JWT**: Token management

### 💰 Checkout & Pagamento
- **Checkout** (`/checkout`): Processo di pagamento
- **Orders** (`/orders`): Storico ordini utente
- **Auth Required**: Solo per utenti loggati

### 🏪 Catalogo Prodotti
- **Home** (`/home`): Lista completa prodotti
- **Categories**: Filtri per categoria
- **Product Cards**: Design responsive

## 🗄️ Database - Prodotti Pear

### Categorie
1. **Computers**: PearBook Air, PearBook Pro
2. **Tablets**: PearPad Pro
3. **Smartphones**: PearPhone 15
4. **Displays**: Studio Display
5. **Audio**: PearPod Pro
6. **Accessories**: Magic Keyboard, Magic Mouse, PearWatch Ultra, AirTag

### Prezzi
- PearBook Air: $1,299
- PearBook Pro: $1,999
- PearPad Pro: $1,099
- PearPhone 15: $999
- Studio Display: $1,599
- PearPod Pro: $249

## 🧪 Test del Sistema

### 1. Test Carrello
1. Vai su http://localhost:4200
2. Passa sopra i prodotti nella gallery
3. Clicca "Add to Cart"
4. Verifica badge nell'header
5. Vai su `/cart` per vedere il carrello

### 2. Test Autenticazione
1. Vai su `/register` e crea un account
2. Fai login su `/login`
3. Aggiungi prodotti al carrello
4. Procedi al checkout su `/checkout`

### 3. Test API Backend
```bash
# Test prodotti
curl http://localhost:8080/api/products

# Test carrello (con token)
curl -H "Authorization: Bearer YOUR_TOKEN" http://localhost:8080/api/cart
```

## 🔧 Troubleshooting

### NPM Issues
```bash
# Fix permissions
sudo chown -R $(whoami) ~/.npm

# Clear cache
npm cache clean --force

# Reinstall
rm -rf node_modules package-lock.json
npm install
```

### Backend Issues
```bash
# Rebuild
./mvnw clean install

# Check logs
./mvnw spring-boot:run --debug
```

### Database Reset
1. Stop Spring Boot
2. Database H2 si pulisce automaticamente (in memory)  
3. Restart → `data.sql` ricarica i prodotti

## 🎨 Features Design

### 🎪 Animazioni & UX
- **Glassmorphism**: Effetti blur moderni
- **Hover States**: Transizioni fluide
- **Loading States**: Feedback visivo
- **Toast Notifications**: Conferme azioni
- **Responsive**: Mobile-first design

### 🎯 E-commerce Flow
1. **Browse** → Gallery/Home
2. **Add to Cart** → Carrello locale/server
3. **Login** (opzionale per guest checkout)
4. **Checkout** → Pagamento
5. **Orders** → Storico

Tutto è pronto per l'avvio! 🚀