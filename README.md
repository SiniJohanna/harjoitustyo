# Harjoitustyö
Tämä harjoitustyösovellus auttaa käyttäjää löytämään parkkipaikan etelä- Helsingistä.
Sovellus hakee tietoa parkkipaikoista REST Api:sta  osoitteesta https://pubapi.parkkiopas.fi/public/v1/. Rajapinta palauttaa json-  ja geojson- muotoista dataa.
Sovelluksen käyttöliittymä koostuu viidestä komponentista: 
App (käynnistää sovelluksen), 
ShowMap renderöi näytölle kartan, jossa näkyvät kaikki rajapinnastalöytyvät parkkipaikat,
StackNav, jossa ovat
  SavedAreas, listaus tallennetuista suosikkiparkkipaikoista
  MyPark, joka näyttää valitun suosikkiparkkipaikan sijainnin kartalla.

Sovellus käyttää myös laitteen sijaintia (expo-location) näyttämään käyttäjän sijaintia kartalla ja reitin laskemiseen sijainista määränpäähän. Reitti ei piirry tässä sovelluksessa kartalle.
Android-laitteella, jossa on myös GoogleMaps- sovellus, voidaan tästä sovelluksesta avata Maps ja näyttää reitti siellä.

Karttojen näyttäminen tapahtuu react-native-mapsin avulla.

Tietojen tallennuksessa hyödynnetään firebase real-time databasea.

Osoitteen koordinaatit haetaan mapQustin avulla.
