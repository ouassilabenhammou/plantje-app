# Persoonlijk Project - Plantje App

Dit project is een plantenverzorgingsapp die gebruikers helpt om hun planten
gezonder te houden.

De app geeft inzicht in water- en lichtbehoefte en ondersteunt met taken en
herinneringen. Veel gebruikers weten niet precies wanneer of hoeveel water een plant
nodig heeft. Daarom ligt de focus op overzicht, basisadvies en het bijhouden van
verzorging.

## Tech stack

![React Native](https://img.shields.io/badge/React_Native-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![Expo](https://img.shields.io/badge/Expo-000020?style=for-the-badge&logo=expo&logoColor=white)
![Supabase](https://img.shields.io/badge/Supabase-3ECF8E?style=for-the-badge&logo=supabase&logoColor=white)
![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black)

- Perenual API (plantinformatie)
- react-native-dotenv (veilig opslaan API-keys)
- Supabase (gebruikersdata & "mijn planten")

## Installatie

### 1. Dependencies installeren

```bash
npm install
```

### 2. App starten

```bash
npx expo start
```

Scan de QR-code met **Expo Go**
of start in een emulator.

## Live link

🔗 [https://dulcet-sable-4aa0e8.netlify.app/login](https://dulcet-sable-4aa0e8.netlify.app/login)

Deze link brengt je naar de online versie van de app.

## Test account

Gebruik onderstaande gegevens om de app te testen:

**E-mail:** test@plantje.app  
**Wachtwoord:** test123

## Functionaliteiten

- Planten toevoegen, bewerken en verwijderen
- Taken tonen en afvinken
- Dagelijkse taken automatisch genereren
- Opslag van gebruikersdata via Supabase
- Basisadvies over water en licht

## Wat heb ik geleerd

- Werken met externe API’s
- Error handling
- CRUD-functionaliteiten bouwen
- Data koppelen aan Supabase
- Structuur opzetten in React Native

## Reflectie

Tijdens dit project heb ik geleerd hoe belangrijk een goede planning is. Omdat ik
later ben gestart, is het design nog niet volledig uitgewerkt.

Technisch heb ik veel geleerd over:

- Werken met API’s
- Omgaan met errors
- CRUD-functionaliteiten
- Database koppelingen met Supabase
- Projectstructuur binnen React Native

Tijdens de ontwikkeling kreeg ik te maken met een **429 API error (Too Many
Requests)**. Door statuscodes zichtbaar te maken ontdekte ik dat er te veel
verzoeken tegelijk werden gedaan.

Hiervoor heb ik:

- Minder vaak data opgehaald
- Pagination toegepast
- Details pas geladen na klik
- Caching gebruikt

Hierdoor werd het API-gebruik efficiënter.

In een volgend project wil ik eerder starten en aan het begin een concreter plan
maken, zodat ik meer tijd heb voor UI en afronding.

## Auteur

Ouassila  
Student ICT  
Fontys Hogescholen  
Semester 4
