Einkaufslisten-App

Projektbeschreibung

Eine Backend-Anwendung zum Verwalten von Einkaufslisten und Artikeln. Die Anwendung bietet CRUD-Funktionalitäten und eine Suchfunktion über eine HTTP-API.

Features

	•	Einkaufslisten: Erstellen, Bearbeiten, Anzeigen, Löschen
	•	Artikel: Hinzufügen, Entfernen, Bearbeiten von Artikeln in Listen
	•	Suchfunktion: Nach Namen oder Beschreibung filtern
	•	Freestyle Task #1: [Beschreibung des ersten zusätzlichen Features]
	•	Freestyle Task #2: [Beschreibung des zweiten zusätzlichen Features mit externer API]

Technischer Aufbau

	•	Technologien: Node.js, TypeScript, Express
	•	Datenbankoptionen: [PostgreSQL]
	•	API-Routenübersicht:
	•	GET /lists: Alle Einkaufslisten abrufen
	•	POST /lists: Neue Liste erstellen
	•	GET /lists/:id: Eine Liste anzeigen
	•	PUT /lists/:id: Eine Liste aktualisieren
	•	DELETE /lists/:id: Eine Liste löschen
	•	GET /lists/search: Nach Listen suchen

# Installation & Setup

	1.	Voraussetzungen: Node.js, npm/yarn, Datenbank
	2.	Schritte:

```bash
git clone <repository-url>
cd <projektordner>
npm install
npm run start


Tests

	•	Automatisierte Tests: [Erklärung der Teststrategie, z.B. mit Jest]
	•	Manuelle Tests: Anleitung zur Nutzung von Postman oder curl

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
