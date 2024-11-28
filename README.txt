# WebShopping

 # Projektbeschreibung
Eine Backend-Anwendung zum Verwalten von Einkaufslisten und Artikeln. Die Anwendung bietet CRUD-Funktionalitäten sowie mehrere Suchfunktionen, um die Listen zu filtern.
Zusätzlich sind zwei Freestyle Tasks implementiert, die die Anwendung um zusätzliche Features erweitern.

# Motivation
Das Projekt wurde im Rahmen des Moduls "Fortgeschrittene Webentwicklung" an der Hochschule Darmstadt erstellt. Es dient dazu, die im Modul erlernten Technologien und Konzepte in einem praxisnahen Projekt anzuwenden.

# Build-Status
[![Build Status](https://travis-ci.com/username/repo.svg?branch=master)](https://travis-ci.com/username/repo)

# Code Style
Der Code folgt den Airbnb JavaScript Style Guidelines.

# Tech/Framework
Node.js, TypeScript, Express, PostgreSQL

# Features

	•	Einkaufslisten: Erstellen, Bearbeiten, Anzeigen, Löschen
	•	Artikel: Hinzufügen, Entfernen, Bearbeiten von Artikeln in Listen
	•	Suchfunktion: Nach Namen oder Beschreibung filtern
	•	Freestyle Task #1: [Beschreibung des ersten zusätzlichen Features]
	•	Freestyle Task #2: [Beschreibung des zweiten zusätzlichen Features mit externer API]

# Installation & Setup

	1.	Voraussetzungen: Node.js, npm/yarn, Datenbank/Docker
	2.	Schritte:

git clone <repository-url>
cd <projektordner>
npm install
npm run start

# API-Referenz

    •	GET /lists: Alle Einkaufslisten abrufen
    •	POST /lists: Neue Liste erstellen
    •	GET /lists/:id: Eine Liste anzeigen
    •	PUT /lists/:id: Eine Liste aktualisieren
    •	DELETE /lists/:id: Eine Liste löschen
    •	GET /lists/search: Nach Listen suchen

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
