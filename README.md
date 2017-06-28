# LCDTest
Affichage sur écran LCD

On te propose de faire un petit exercice de code from scratch.

Ta mission est de créer la logique pour afficher des numéros sur un écran LCD. Cet écran dispose d’un grid de 3x3, chaque case peut contenir une espace, un tiret bas, ou un pipe.
Par exemple (ici en utilisant un point à la place d’espace)


  ._.   ...   ._.   ._.   ...   ._.   ._.   ._.   ._.   ._.
  |.|   ..|   ._|   ._|   |_|   |_.   |_.   ..|   |_|   |_|
  |_|   ..|   |_.   ._|   ..|   ._|   |_|   ..|   |_|   ..|



Exemple: 910


  ._. ... ._.
  |_| ..| |.|
  ..| ..| |_|



Début des hostilité : 28/07/2017 9:54

Fin Session 28/07/2017 12:43
TODOs
- Meilleurs controles des entrées: (texte trop long pour l'écran, ...)  
- Gestion du multi-ligne pour l'écran.  
- Meilleure Doc  
- Amélioration des performances du rafraichissement  
- Gestion des Charsets  

Usage:  


  //Initialisation
  var afficheur = new Afficheur( <emplacement>[, options]);

  //Affichage d'informations
  afficheur.setData(<nombres_a_afficher>);


Ex:


  var go_LCD = new Afficheur('screen',{screen_width: 10, screen_height: 1});  
  go_LCD.setData('910');


produit:


  ._....._......................  
  |_|..||.|.....................  
  ..|..||_|.....................  



Options:  
 screen_width: 50, //largeur physique de l'écran (en nombre de grid)  
 screen_height: 10, //hauteur physique de l'écran (en nombre de grid)  
 grid_width: 3, //largeur du grid  
 grid_height: 3, //hauteur du grid  
 refreshInterval: 1000 //intervalle de rafraichissement de l'écran en  millisecondes  



Demo:
  Le fichier index.html contient un exemple d'utilisation
