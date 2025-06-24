# Database Setup - Pear Store

## 📦 Prodotti nel Database

### 🏷️ Categorie
- **Computers** (ID: 1) - High-performance computers and laptops
- **Tablets** (ID: 2) - Innovative tablets for work and creativity  
- **Smartphones** (ID: 3) - Cutting-edge smartphones
- **Displays** (ID: 4) - Professional displays and monitors
- **Audio** (ID: 5) - Premium audio accessories
- **Accessories** (ID: 6) - Essential tech accessories

### 🛍️ Prodotti Principali

| ID | Nome | Categoria | Prezzo | Descrizione |
|---|---|---|---|---|
| 1 | PearBook Air | Computers | $1,299 | Supercharged by the P1 Neural Engine |
| 2 | PearBook Pro | Computers | $1,999 | Pro performance for demanding tasks |
| 3 | PearPad Pro | Tablets | $1,099 | The ultimate creative companion |
| 4 | PearPhone 15 | Smartphones | $999 | Innovation in your pocket |
| 5 | Studio Display | Displays | $1,599 | Immersive viewing experience |
| 6 | PearPod Pro | Audio | $249 | Spatial audio perfection |
| 7 | Magic Keyboard | Accessories | $299 | Precision typing experience |
| 8 | Magic Mouse | Accessories | $199 | Wireless precision |
| 9 | PearWatch Ultra | Accessories | $799 | Ultimate fitness companion |
| 10 | AirTag 4-Pack | Accessories | $99 | Find your things |

## 🔄 Ricaricare il Database

1. **Arrestare l'applicazione Spring Boot**
2. **Cancellare il database H2** (se in memoria)
3. **Riavviare l'applicazione** - i dati verranno ricaricati automaticamente da `data.sql`

## 🎯 Integrazione Frontend

### Landing Component
- **Gallery**: Mostra i primi 6 prodotti (IDs: 1-6)
- **Tech Specs**: Alterna tra PearBook Air (1), PearPhone 15 (4), PearPad Pro (3)
- **Add to Cart**: Usa gli ID del database per aggiungere prodotti

### Cart Service
- **Sincronizzazione**: Usa gli ID del database per gestire il carrello
- **API Integration**: Comunica con il backend per utenti loggati
- **Local Storage**: Salva temporaneamente per utenti ospiti

## 🧪 Test del Sistema

### 1. Verifica Database
```bash
# Avvia l'applicazione
./mvnw spring-boot:run

# Verifica API
curl http://localhost:8080/api/products
```

### 2. Verifica Frontend
```bash
# Avvia il frontend
cd eccomerce-frontend
ng serve

# Testa il carrello
- Vai su http://localhost:4200
- Passa sopra i prodotti nella gallery
- Clicca "Add to Cart"
- Verifica l'header per il conteggio
```

### 3. Verifica Integrazione
- ✅ I prodotti hanno ID consistenti tra frontend e backend
- ✅ Il carrello usa i corretti ID del database
- ✅ Le immagini corrispondono ai prodotti
- ✅ I prezzi sono sincronizzati

## 🚀 Deployment

### Produzione
- Sostituire H2 con PostgreSQL/MySQL
- Aggiungere script di migrazione
- Configurare variabili d'ambiente
- Aggiungere prodotti via admin panel

### Backup
- Esportare i dati in formato SQL
- Versionare le modifiche allo schema
- Implementare rollback automatico