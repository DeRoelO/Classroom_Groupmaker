# Klassenindeling Generator

Een webapplicatie voor het optimaliseren van klassenindelingen op basis van studentvoorkeuren en restricties.

## Functionaliteiten

### Online Invoer
- Direct invoeren van studenten via een gebruiksvriendelijk formulier
- Per student:
  - 3 voorkeuren (prioriteit 1, 2 en 3)
  - 3 restricties (studenten die niet in dezelfde groep mogen)
- Realtime overzicht van ingevoerde studenten
- Mogelijkheid om studenten te verwijderen
- Export naar Excel voor verdere verwerking

### Excel Invoer
- Upload van Excel bestanden met studentgegevens
- Download van een template voor het invullen van gegevens
- Ondersteuning voor .xlsx en .xls bestanden

### Geavanceerde Instellingen
- Aanpasbare groepsgrootte
- Configureerbare gewichten voor:
  - Restricties (negatief gewicht)
  - Voorkeuren (positieve gewichten per prioriteit)
- Instellingen voor het optimalisatie-algoritme:
  - Aantal iteraties
  - Lokale zoekpogingen per start

### Resultaatweergave
- Duidelijke groepsindeling
- Samenvatting van:
  - Totale score
  - Overtreden restricties
  - Ingewilligde voorkeuren per prioriteit
  - Studenten zonder ingewilligde voorkeuren
- Export mogelijkheid van de resultaten

## Technische Details

### Gebruikte Technologieën
- HTML5
- CSS3
- JavaScript (ES6+)
- SheetJS voor Excel verwerking
- Responsive design voor verschillende schermformaten

### Installatie
1. Clone de repository:
```bash
git clone https://github.com/[jouw-gebruikersnaam]/klassenindeling-generator.git
```

2. Open `index.html` in een moderne webbrowser

### Gebruik
1. Kies tussen Online Invoer of Excel Invoer
2. Voer studentgegevens in of upload een Excel bestand
3. Configureer de gewenste instellingen
4. Klik op "Bereken Indeling"
5. Bekijk de resultaten en exporteer indien gewenst

## Licentie
Dit project is gelicenseerd onder de MIT License - zie het [LICENSE](LICENSE) bestand voor details.

## Bijdragen
Bijdragen zijn welkom! Voel je vrij om een pull request te maken of een issue te openen voor suggesties of bug reports. 