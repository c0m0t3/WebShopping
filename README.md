# WebShopping

## Projektbeschreibung

Eine Anwendung zum Verwalten von Einkaufslisten und Artikeln. Die Anwendung bietet CRUD-Funktionalitäten sowie
mehrere Suchfunktionen, um die Listen zu filtern.
Zusätzlich sind zwei Freestyle Tasks implementiert, die die Anwendung um zusätzliche Features erweitern.

## Motivation

Das Projekt wurde im Rahmen des Moduls "Fortgeschrittene Webentwicklung" an der Hochschule Darmstadt erstellt. Es dient
dazu, die im Modul erlernten Technologien und Konzepte in einem praxisnahen Projekt anzuwenden.

## Code Style

Der Code folgt den Airbnb JavaScript Style Guidelines.

## Tech/Framework

Node.js, TypeScript, Express, PostgreSQL

## Features

- Einkaufslisten: Erstellen, Bearbeiten, Anzeigen, Löschen
- Artikel: Erstellen, Bearbeiten, Anzeigen, Löschen
- Einkaufslisten-Items: Verknüpfen, Entfernen, Anzeigen, Aktualisieren
- Suchfunktion: Nach Namen, Beschreibung, Item oder Store suchen

## Freestyle Tasks

### Freestyle Task #1: [Beschreibung des ersten zusätzlichen Features]

- Da die Einkaufslisten für verschiedenen Einkaufsläden erstellt werden, soll es möglich sein, einen Store zu einer
  Einkaufsliste hinzuzufügen.
- Hinzufügen von einem Store-Attribut zu den Einkaufslisten
- Anzeige des Stores in der Einkaufsliste
- Suchfunktion nach Store

### Freestyle Task #2: [Beschreibung des zweiten zusätzlichen Features mit externer API]

- Implementierung einer Barcode-Scanner-Funktion, um Artikel über den Barcode zu suchen und hinzuzufügen.
- Verwendung der externen API "Barcode Lookup" von openfoodfacts.org
- Eingeben des Barcodes in die Suchleiste
- Anzeige des gefundenen Artikels
- Hinzufügen des Artikels als Item in die Datenbank

## Installation & Setup

1. Voraussetzungen: Node.js, npm/yarn, Datenbank/Docker
2. Schritte:

```bash
git clone <repository-url>
cd <projektordner>
npm install
npm run start
```

## API-Referenz

### Health

- **GET /health**: Gesundheitsstatus der Anwendung abrufen

### Items

- **GET /items/:id**: Einzelnes Item nach ID abrufen
- **GET /items**: Alle Items abrufen
- **POST /items**: Neue Items erstellen
- **DELETE /items/:id**: Item nach ID löschen
- **PUT /items/:id**: Item nach ID aktualisieren

### Einkaufslisten

- **GET /shoppingLists/:id**: Einzelne Einkaufsliste nach ID abrufen
- **GET /shoppingLists**: Alle Einkaufslisten abrufen
- **POST /shoppingLists**: Neue Einkaufsliste erstellen
- **DELETE /shoppingLists/:id**: Einkaufsliste nach ID löschen
- **PUT /shoppingLists/:id**: Einkaufsliste nach ID aktualisieren

### Einkaufslisten-Items

- **POST /shoppingLists/:id/items**: Items mit Einkaufsliste verknüpfen
- **DELETE /shoppingLists/:id/items/:itemId**: Item aus Einkaufsliste entfernen
- **GET /shoppingLists/:id/items**: Items einer Einkaufsliste abrufen
- **PUT /shoppingLists/:id/items/:itemId**: Items einer Einkaufsliste aktualisieren

### Spezielle Routen

- **GET /shoppingLists/search/search**: Einkaufslisten nach Name/Beschreibung durchsuchen
- **GET /shoppingLists/search/:id**: Einkaufslisten nach Item durchsuchen

### Store

- **GET /shoppingLists/store/store**: Einkaufslisten nach Store abrufen
- **GET /shoppingLists/:id/store**: Store einer Einkaufsliste abrufen
- **PUT /shoppingLists/:id/store**: Store einer Einkaufsliste setzen

### Barcode

- **GET /products/lookup**: Produkt nach Barcode suchen

## Tests

- Automatisierte Tests: Jest
- Zum Ausführen der Tests: `npm run test`
- Manuelle Tests: Postman

## Fehlerbehandlung

- Gültigkeit der Eingabedaten prüfen
- Fehler bei leeren oder inkorrekten Feldern abfangen
- Korrekte HTTP-Statuscodes verwenden

## Deployment

- Docker: Anleitung zur Nutzung eines Docker-Containers
- Gitlab: Code-Upload in das h\_da Gitlab-Repository

## Entwicklerhinweise

- Coding-Standards: Einheitliche Syntax, Kommentare, konsistente Namenskonventionen
- `.gitignore`: `node_modules`, environment files und API-Keys ausschließen

## Contributors

- Colin Moissl
