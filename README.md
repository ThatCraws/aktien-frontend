# aktien-frontend
## Aktienanalyse Frontend

Eine live-Version dieses Frontends mit seinem [entsprechendem Backend](https://github.com/ThatCraws/aktien-backend/tree/develop) kann unter [stock-ticker.tk](https://stock-ticker.tk) gefunden werden.

## Dependencies

Die Dependencies sind in der Datei [package.json](stock-analysis/package.json) gespeichert.

## Build und Deployment

Zum Builden müssen im _stock-analysis_-Ordner die folgenden Befehle ausgeführt werden:

- `npm install`
  -  Installiert die nötigen Dependencies
- `npm install ng`
  - Installiert das _ng_-Package zum Builden, Testen usw. von Angular-Projekten
- `npx ng build --configuration=production`
  - Buildet das Projekt mittels ng

Bei Erfolg wird ein neuer ordner namens _dist_ erstellt in welchem die nötigen Dateien zum Hosten des Frontends (wie index.html) enthalten sind. Diese Dateien müssen dann in den DocumentRoot des verwendeten WebServer platziert werden. 

Ausserdem sollten die Verzeichnisregeln angepasst werden, da alle Anfragen über das root-Verzeichnis laufen müssen (wird z.B. _/stock-details/58_ angefragt, muss diese Anfrage an _/_ umgeleitet werden). Dies kann auf Apache bspw. mittels einer _.htaccess_-Datei erfolgen, diese muss folgende Regel beinhalten: `RewriteRule ^(?!.*\.).*$ index.html [NC,L]`
