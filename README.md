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
    - **Description**: Retrieves the health status of the application.
    - **Response**: 200 OK, health status.

### Items

- **GET /items/:id**
    - **Description**: Retrieves a single item by its ID.
    - **Response**: 200 OK, item object.
    - **Errors**: 404 Not Found.

- **GET /items**
    - **Description**: Retrieves all items.
    - **Response**: 200 OK, array of items.

- **POST /items**
    - **Description**: Creates new items.
    - **Response**: 201 Created, item object.
    - **Errors**: 400 Bad Request.

- **DELETE /items/:id**
    - **Description**: Deletes an item by its ID.
    - **Response**: 204 No Content.
    - **Errors**: 404 Not Found.

- **PUT /items/:id**
    - **Description**: Updates an item by its ID.
    - **Response**: 200 OK, item object.
    - **Errors**: 400 Bad Request, 404 Not Found.

### Shopping Lists

- **GET /shoppingLists/:id**
    - **Description**: Retrieves a single shopping list by its ID.
    - **Response**: 200 OK, shopping list object.
    - **Errors**: 404 Not Found.

- **GET /shoppingLists**
    - **Description**: Retrieves all shopping lists.
    - **Response**: 200 OK, array of shopping lists.

- **POST /shoppingLists**
    - **Description**: Creates a new shopping list.
    - **Response**: 201 Created, shopping list object.
    - **Errors**: 400 Bad Request.

- **DELETE /shoppingLists/:id**
    - **Description**: Deletes a shopping list by its ID.
    - **Response**: 204 No Content.
    - **Errors**: 404 Not Found.

- **PUT /shoppingLists/:id**
    - **Description**: Updates a shopping list by its ID.
    - **Response**: 200 OK, shopping list object.
    - **Errors**: 400 Bad Request, 404 Not Found.

### Shopping List Items

- **POST /shoppingLists/:id/items**
    - **Description**: Adds items to a shopping list.
    - **Response**: 201 Created.
    - **Errors**: 400 Bad Request, 404 Not Found.

- **DELETE /shoppingLists/:id/items/:itemId**
    - **Description**: Removes an item from a shopping list.
    - **Response**: 204 No Content.
    - **Errors**: 404 Not Found.

- **GET /shoppingLists/:id/items**
    - **Description**: Retrieves items of a shopping list.
    - **Response**: 200 OK, array of items.
    - **Errors**: 404 Not Found.

- **PUT /shoppingLists/:id/items/:itemId**
    - **Description**: Updates an item in a shopping list.
    - **Response**: 200 OK, item object.
    - **Errors**: 400 Bad Request, 404 Not Found.

### Special Routes

- **GET /shoppingLists/search/search**
    - **Description**: Searches shopping lists by name or description.
    - **Response**: 200 OK, array of shopping lists.
    - **Errors**: 400 Bad Request.

- **GET /shoppingLists/search/:id**
    - **Description**: Searches shopping lists by item.
    - **Response**: 200 OK, array of shopping lists.
    - **Errors**: 404 Not Found.

### Store

- **GET /shoppingLists/store/store**
    - **Description**: Retrieves shopping lists by store.
    - **Response**: 200 OK, array of shopping lists.
    - **Errors**: 404 Not Found.

- **GET /shoppingLists/:id/store**
    - **Description**: Retrieves the store of a shopping list.
    - **Response**: 200 OK, store object.
    - **Errors**: 404 Not Found.

- **PUT /shoppingLists/:id/store**
    - **Description**: Sets the store of a shopping list.
    - **Response**: 200 OK, store object.
    - **Errors**: 400 Bad Request, 404 Not Found.

### Barcode

- **GET /products/lookup**
    - **Description**: Retrieves product information by barcode.
    - **Response**: 200 OK, product information.
    - **Errors**: 404 Not Found.

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

## Fehlerbehandlung

- Gültigkeit der Eingabedaten prüfen
- Abfangen von doppelten oder leeren Namen
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
