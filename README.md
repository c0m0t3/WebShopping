# WebShopping

## Projektbeschreibung

Eine Anwendung zum Verwalten von Einkaufslisten und Artikeln. Die Anwendung bietet CRUD-Funktionalitäten sowie
mehrere Suchfunktionen, um die Listen zu filtern.
Zusätzlich sind zwei Freestyle Tasks implementiert, die die Anwendung um zusätzliche Features erweitern.

## Motivation

Das Projekt wurde im Rahmen des Moduls "Fortgeschrittene Webentwicklung" an der Hochschule Darmstadt erstellt. Es dient
dazu, die im Modul erlernten Technologien und Konzepte in einem praxisnahen Projekt anzuwenden.

## Tech/Framework

Node.js, TypeScript, Express, PostgreSQL

## Installation & Setup

1. Voraussetzungen: Node.js, npm/yarn, Datenbank/Docker, Git
2. Schritte:

- Repository klonen

```bash
git clone https://code.fbi.h-da.de/stcomoiss/fwe-ws-24-25-111071.git
cd <projektordner>
```

1. Datei ".env" im backend Ordner erstellen
2. Inhalt der .env.example Datei kopieren und in die .env Datei einfügen
3. Dependencies installieren:

```bash
npm install 
cd frontend
npm install
cd ..
cd backend
npm install
cd ..
```

4. Erzeugen der API-Dateien:

```bash
cd frontend
npm run generate:api
```

5. TypeScript-Dateien kompilieren:

```bash
cd backend
tsc
```

5.2 Falls tsc nicht gefunden wird:

```bash
npm uninstall typescript
npm install -g typescript
```

6. Docker-Container starten:

```bash
docker-compose up
```

7. Datenbank migrieren und generieren:

```bash
npm run db:generate
npm run db:migrate
```

8. Starten der Anwendung:

- ```npm start``` im Wurzelverzeichnis
- Anklicken des Links in der Konsole

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

## Anleitung zu Nutzung

- Items erstellen -> In Leiste auf Items klicken
- Einkaufsliste erstellen -> In Leiste auf ShoppingLists klicken
- Einkaufsliste anklicken -> DetailView
- Items zu Einkaufsliste hinzufügen
- Quantity und Purchased ändern durch anklicken bei entsprechendem Item
- Suche auf Homepage nach Namen, Beschreibung oder auf Store umstellen
- Suche nach Item -> Toggle Menü mit allen existierenden Items
- Barcode anklicken -> Barcode eingeben -> Item hinzufügen
- Klick auf FWE 24/25 -> Wechsel auf Homepage
- Klick auf Sonne/Mond -> Wechsel zwischen Dark und Light Mode

## API-Referenz

### Health

- **GET /health**
    - **Beschreibung**: Ruft den Gesundheitsstatus der Anwendung ab.
    - **Antwort**: 200 OK, Gesundheitsstatus.

### Artikel

- **GET /items/:id**
    - **Beschreibung**: Ruft einen einzelnen Artikel anhand seiner ID ab.
    - **Antwort**: 200 OK, Artikelobjekt.
    - **Fehler**: 404 Nicht gefunden.

- **GET /items**
    - **Beschreibung**: Ruft alle Artikel ab.
    - **Antwort**: 200 OK, Array von Artikeln.

- **POST /items**
    - **Beschreibung**: Erstellt neue Artikel.
    - **Antwort**: 201 Erstellt, Artikelobjekt.
    - **Fehler**: 400 Ungültige Anfrage.

- **DELETE /items/:id**
    - **Beschreibung**: Löscht einen Artikel anhand seiner ID.
    - **Antwort**: 204 Kein Inhalt.
    - **Fehler**: 404 Nicht gefunden.

- **PUT /items/:id**
    - **Beschreibung**: Aktualisiert einen Artikel anhand seiner ID.
    - **Antwort**: 200 OK, Artikelobjekt.
    - **Fehler**: 400 Ungültige Anfrage, 404 Nicht gefunden.

### Einkaufslisten

- **GET /shoppingLists/:id**
    - **Beschreibung**: Ruft eine einzelne Einkaufsliste anhand ihrer ID ab.
    - **Antwort**: 200 OK, Einkaufslistenobjekt.
    - **Fehler**: 404 Nicht gefunden.

- **GET /shoppingLists**
    - **Beschreibung**: Ruft alle Einkaufslisten ab.
    - **Antwort**: 200 OK, Array von Einkaufslisten.

- **POST /shoppingLists**
    - **Beschreibung**: Erstellt eine neue Einkaufsliste.
    - **Antwort**: 201 Erstellt, Einkaufslistenobjekt.
    - **Fehler**: 400 Ungültige Anfrage.

- **DELETE /shoppingLists/:id**
    - **Beschreibung**: Löscht eine Einkaufsliste anhand ihrer ID.
    - **Antwort**: 204 Kein Inhalt.
    - **Fehler**: 404 Nicht gefunden.

- **PUT /shoppingLists/:id**
    - **Beschreibung**: Aktualisiert eine Einkaufsliste anhand ihrer ID.
    - **Antwort**: 200 OK, Einkaufslistenobjekt.
    - **Fehler**: 400 Ungültige Anfrage, 404 Nicht gefunden.

### Einkaufslisten-Artikel

- **POST /shoppingLists/:id/items**
    - **Beschreibung**: Fügt Artikel zu einer Einkaufsliste hinzu.
    - **Antwort**: 201 Erstellt.
    - **Fehler**: 400 Ungültige Anfrage, 404 Nicht gefunden.

- **DELETE /shoppingLists/:id/items/:itemId**
    - **Beschreibung**: Entfernt einen Artikel aus einer Einkaufsliste.
    - **Antwort**: 204 Kein Inhalt.
    - **Fehler**: 404 Nicht gefunden.

- **GET /shoppingLists/:id/items**
    - **Beschreibung**: Ruft Artikel einer Einkaufsliste ab.
    - **Antwort**: 200 OK, Array von Artikeln.
    - **Fehler**: 404 Nicht gefunden.

- **PUT /shoppingLists/:id/items/:itemId**
    - **Beschreibung**: Aktualisiert einen Artikel in einer Einkaufsliste.
    - **Antwort**: 200 OK, Artikelobjekt.
    - **Fehler**: 400 Ungültige Anfrage, 404 Nicht gefunden.

### Spezielle Routen

- **GET /shoppingLists/search/search**
    - **Beschreibung**: Durchsucht Einkaufslisten nach Name oder Beschreibung.
    - **Antwort**: 200 OK, Array von Einkaufslisten.
    - **Fehler**: 400 Ungültige Anfrage.

- **GET /shoppingLists/search/:id**
    - **Beschreibung**: Durchsucht Einkaufslisten nach Artikel.
    - **Antwort**: 200 OK, Array von Einkaufslisten.
    - **Fehler**: 404 Nicht gefunden.

### Geschäft

- **GET /shoppingLists/store/store**
    - **Beschreibung**: Ruft Einkaufslisten mit Suche nach Geschäft ab.
    - **Antwort**: 200 OK, Array von Einkaufslisten.
    - **Fehler**: 404 Nicht gefunden.

- **GET /shoppingLists/:id/store**
    - **Beschreibung**: Ruft das Geschäft einer Einkaufsliste ab.
    - **Antwort**: 200 OK, Geschäftsobjekt.
    - **Fehler**: 404 Nicht gefunden.

- **PUT /shoppingLists/:id/store**
    - **Beschreibung**: Setzt das Geschäft einer Einkaufsliste.
    - **Antwort**: 200 OK, Geschäftsobjekt.
    - **Fehler**: 400 Ungültige Anfrage, 404 Nicht gefunden.

### Barcode

- **GET /products/lookup**
    - **Beschreibung**: Ruft Produktinformationen anhand des Barcodes ab.
    - **Antwort**: 200 OK, Produktinformationen.
    - **Fehler**: 404 Nicht gefunden.

## Tests

- Automatisierte Tests: Jest
- Zum Ausführen der Tests:

```bash
cd backend
npm run test
```

- Für Coverage:

```bash
cd backend
npm run test:coverage
```

- Manuelle Tests: Postman
- Importieren der Postman-Collection aus der Postman-Colletion-Json

## Fehlerbehandlung

- Gültigkeit der Eingabedaten prüfen
- Abfangen von doppelten oder leeren Namen
- Fehler bei leeren oder inkorrekten Feldern abfangen
- Korrekte HTTP-Statuscodes verwenden

## Entwicklerhinweise

- Coding-Standards: Einheitliche Syntax, Kommentare, konsistente Namenskonventionen
- `.gitignore`: `node_modules`, environment files und API-Keys ausschließen

## Contributors

- Colin Moissl
