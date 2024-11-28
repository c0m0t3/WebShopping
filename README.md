# WebShopping

# WebShopping

## Projektbeschreibung

Eine Backend-Anwendung zum Verwalten von Einkaufslisten und Artikeln. Die Anwendung bietet CRUD-Funktionalitäten sowie
mehrere Suchfunktionen, um die Listen zu filtern.
Zusätzlich sind zwei Freestyle Tasks implementiert, die die Anwendung um zusätzliche Features erweitern.

## Motivation

Das Projekt wurde im Rahmen des Moduls "Fortgeschrittene Webentwicklung" an der Hochschule Darmstadt erstellt. Es dient
dazu, die im Modul erlernten Technologien und Konzepte in einem praxisnahen Projekt anzuwenden.

## Build-Status

[![Build Status](https://travis-ci.com/username/repo.svg?branch=master)](https://travis-ci.com/username/repo)

## Code Style

Der Code folgt den Airbnb JavaScript Style Guidelines.

## Tech/Framework

Node.js, TypeScript, Express, PostgreSQL

## Features

- Einkaufslisten: Erstellen, Bearbeiten, Anzeigen, Löschen
- Artikel: Hinzufügen, Entfernen, Bearbeiten von Artikeln in Listen
- Suchfunktion: Nach Namen oder Beschreibung filtern
- Freestyle Task #1: \[Beschreibung des ersten zusätzlichen Features\]
- Freestyle Task #2: \[Beschreibung des zweiten zusätzlichen Features mit externer API\]

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

### Authentifizierung

- **POST /auth/register**: Benutzer registrieren
- **POST /auth/login**: Benutzer einloggen

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

- **GET /shoppingLists/search/search**: Einkaufslisten durchsuchen
- **GET /shoppingLists/search/:id**: Einkaufslisten nach Item durchsuchen

### Store

- **GET /shoppingLists/store/store**: Einkaufslisten nach Store abrufen
- **GET /shoppingLists/:id/store**: Store einer Einkaufsliste abrufen
- **PUT /shoppingLists/:id/store**: Store einer Einkaufsliste setzen

### Barcode

- **GET /products/lookup**: Produkt nach Barcode suchen

# Tests

    - Automatisierte Tests: Jest
    - zum ausführen der Tests: npm run test
    - Manuelle Tests: Postman oder curl

Fehlerbehandlung

	•	Gültigkeit der Eingabedaten prüfen
	•	Fehler bei leeren oder inkorrekten Feldern abfangen
	•	Korrekte HTTP-Statuscodes verwenden

Deployment

	•	Docker: Anleitung zur Nutzung eines Docker-Containers
	•	Gitlab: Code-Upload in das h_da Gitlab-Repository

Entwicklerhinweise

	•	Coding-Standards: Einheitliche Syntax, Kommentare, konsistente Namenskonventionen
	•	.gitignore: node_modules, environment files und API-Keys ausschließen
