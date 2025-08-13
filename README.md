# Component: Project Logic

Dieser Branch enthält die Implementierung der **Projekt-Dashboard-Logik** und führt mehrere neue Funktionen sowie Strukturverbesserungen ein, um die Verwaltung und Darstellung von Projekten und Nutzerdaten zu verbessern.

---

## Neue Features

### Projekt-Dashboard
- Übersicht über alle Projekte mit ansprechender Darstellung
- Projekte beinhalten Titel, Beschreibung, Deadline und Tags
- Erstellung der Projekte über Modal, benutzerfreundlich und angenehm
- Responsive Grid-Layout für optimale Darstellung auf allen Bildschirmgrößen
- Statische Fortschrittsanzeige für jedes Projekt (Platzhalter für spätere Logik)

### Projekt-Suche
- Eingebaute Suchfunktion zur schnellen Filterung der angezeigten Projekte (buggt gerade etwas)

### Tags
- Projekte können mit **Standard-Tags** versehen werden
- Nutzer*innen können zusätzlich **eigene Tags** erstellen und zuweisen
- Projekte nach Tags filtern *kommt noch*

---

## Code-Struktur

### Frontend

- `frontend/Dashboard.tsx`: Hauptkomponente für das Projekt-Dashboard
- `frontend/Dashboard.css`: Stylesheet für das Dashboard-Layout und die Projektkarten
- `frontend/components/`
  - `projectsV1.tsx`: Erste Iteration der Projektliste mit responsivem Layout
  - `ProjectCardV1.tsx`: Darstellung einer einzelnen Projektkarte (Version 1)
  - `Sidebar.tsx`: Seitenleiste zur Navigation und Projektauswahl
  - `Sidebar.css`: Styling der Sidebar-Komponente

### Backend

- `backend/user-data.ts`: Persistiert Sitzungsdaten und lädt zugehörige Nutzerinformationen

### Common Types

Zur Gewährleistung einer konsistenten Datenstruktur zwischen Frontend und Backend:

- `common/types/projects.ts`
- `common/types/tags.ts`
- `common/types/users.ts`

---

## Status

- Design fertig
- paar kleine Bugs noch enthalten
- Fortschrittsanzeige später ergänzt

---

## Änderungen zur vorherigen Version

- Neuer Ordner `frontend/components/` eingeführt zur strukturierten Trennung wiederverwendbarer UI-Komponenten
- Neue Komponenten erstellt:
  - `projectsV1.tsx`: Container-Komponente zur Anzeige mehrerer Projekte mit responsive Grid
  - `ProjectCardV1.tsx`: Visualisierung einzelner Projektinformationen mit statischer Fortschrittsleiste
  - `Sidebar.tsx`: Navigationsleiste mit Projektübersicht, vollständig angebunden an das Backend
  - `Sidebar.css`: Stildefinitionen zur optischen Abgrenzung und mobilen Unterstützung
- Sidebar vollständig in das Projekt-Dashboard integriert, inklusive Anbindung an das Projekt-Backend zur Anzeige bereits erstellter Projekte
- Control-Container im Layout an den oberen Rand verschoben, um eine intuitivere Benutzerführung zu ermöglichen
- Dashboard-Logik und -Frontend vollständig responsiv umgesetzt – insbesondere in Bezug auf die Sidebar und kleinere Bildschirmgrößen
- Erste Modularisierung des Frontends eingeleitet (Trennung von Darstellung und Logik)
