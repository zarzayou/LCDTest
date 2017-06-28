

//use strict;



/*
 * L'affichage sur un écran LCD se fait ligne par ligne
 * On va donc représenter la memoire de l'écran sous la forme d'une matrice
 * a 2 dimension
 *
 */

var Afficheur = function(screenZone, options){



  var _MergeObjects = function(){
    if(arguments.length == 0) return {};
    var Settings = arguments[0];
    for(var li_Index = 1; li_Index < arguments.length; li_Index++)
    {

      if(arguments[li_Index] == null) continue;
      for(var ls_Property in  arguments[li_Index]){

          Settings[ls_Property] = arguments[li_Index][ls_Property];

      }

    }

    return Settings;
  }

  //Jeu de caractères disponibles
  this._CharSet = {
    0 : [[0,2,0], [1,0,1], [1,2,1]],
    1 : [[0,0,0], [0,0,1], [0,0,1]],
    2 : [[0,2,0], [0,2,1], [1,2,0]],
    3 : [[0,2,0], [0,2,1], [0,2,1]],
    4 : [[0,0,0], [1,2,1], [0,0,1]],
    5 : [[0,2,0], [1,2,0], [0,2,1]],
    6 : [[0,2,0], [1,2,0], [1,2,1]],
    7 : [[0,2,0], [0,0,1], [0,0,1]],
    8 : [[0,2,0], [1,2,1], [1,2,1]],
    9 : [[0,2,0], [1,2,1], [0,0,1]]


  };

  this._RefreshTimer = null;
  //Notre afficheur est composé d'une matrice 3 x 3
  //3 Etats possibles par point
  // 0  - Eteinds (.)
  // 2 - Niveau bas (_)
  // 1  - Niveau haut (|)
  //  this._CurrentState = this._DefaultState;


  this._GRID_STATES = ['.', '|', '_'];



  this._DisplayMatrixId = 'MTX_' + new Date().getTime();

  //propriétés par défaut de l'afficheur
  this.defaults = {

    screen_width: 50, //largeur physique de l'écran (en nombre de grid)
    screen_height: 10, //hauteur physique de l'écran (en nombre de grid)
    grid_width: 3, //largeur du grid
    grid_height: 3, //hauteur du grid
    refreshInterval: 1000 //intervalle de rafraichissement de l'écran en  millisecondes

  }


  this.settings = _MergeObjects({}, this.defaults, options)




//Creation de l'écran physique
document.getElementById(screenZone).innerHTML = '<textarea cols="' + ((this.settings.screen_width * this.settings.grid_width) + 1) + '" rows="' + ((this.settings.screen_height * this.settings.grid_height)+ 1) + '" id="' + this._DisplayMatrixId + '"></textarea>';

//Reférence de l'écran
 this._ScreenRef = document.getElementById(this._DisplayMatrixId);

//Initialisation de la RAM et de l'écran
this.initialize();

//position courant de l'éspace mémoire de l'écran
this._CurrentPosition = [0,0];

//Données de la grid en cas d'entrée invalide
this._DefaultGridState = [[0,0,0], [0,0,0], [0,0,0]];


  //this._

};


/*
 * Affiche un caractère sur l'écran
 */
Afficheur.prototype.getCharData = function(pi_Address){

 var la_CharacterData = [];
  if(! this._CharSet[pi_Address]) la_CharacterData = this._DefaultGridState ;
  //On récupère l'élèment dans la mémoire:
   la_CharacterData = this._CharSet[pi_Address];


   return la_CharacterData;
}

//Initialisation de la RAM et de l'écran de l'afficheur.
//Par défaut toutes les cases du grid sont à l'état 0
//Et le curseur de l'écran est dans le coin supérieur

Afficheur.prototype.initialize = function(){

this._CurrentPosition = [0,0];
  if(this._RefreshTimer != null)
  {
    window.clearInterval(this._RefreshTimer);
  }
  this._RAM = [];

  for(var li_Index_Row = 0; li_Index_Row < (this.settings.screen_height * this.settings.grid_height); li_Index_Row++ ){

    var row = [];
    for(var li_Index_Column = 0; li_Index_Column < (this.settings.screen_width * this.settings.grid_width); li_Index_Column++ ){
      row.push(0);

    }
    this._RAM.push(row);

  }
  this.rafraichir();

  if(this.settings.refreshInterval > 0){
    this._RefreshTimer =  window.setInterval(this.rafraichir.bind(this), this.settings.refreshInterval);
  }



}

/*
 Version 1 l'afficheur ne gère qu'une seule ligne
*/
Afficheur.prototype.setData = function(ps_Data){

  this._CurrentPosition = [0,0];  //Row , Col du coin superieur gauche du grid

  console.log('setData', ps_Data);
  if(! ps_Data){
    //On réinitialize la matrice

    this.initialize();
    return;
  }
  else{

    for(var li_Index = 0; li_Index < ps_Data.length ; li_Index++){

          //Récupèration des données

          var la_CharData = this.getCharData(parseInt(ps_Data.charAt(li_Index)));

          for(var li_Index_Row = 0; li_Index_Row < la_CharData.length; li_Index_Row++){
            var la_RowData =  la_CharData[li_Index_Row];

            for(var li_Index_Col = 0; li_Index_Col < la_RowData.length; li_Index_Col++){

                  var pixelRAMAddress_x = (this._CurrentPosition[1] * this.settings.grid_width);

                  var pixelRAMAddress_y = (this._CurrentPosition[0] * this.settings.grid_height);
                  this._RAM[pixelRAMAddress_y + li_Index_Row][pixelRAMAddress_x + li_Index_Col] = la_RowData[li_Index_Col];
            }

          }


        //On bouge le curseur d'un cran vers la droite
        this._CurrentPosition[1]++;
    }

  }





  //Rafaichissement manuel
  if(this.settings.refreshInterval <= 0) {

    //On rafraichit l'écran de suite
    this.rafraichir();
  }
  else{
    //Sinon on attend la prochaine passe
  }




};



Afficheur.prototype.rafraichir = function(){
  //On parcours la RAM et on affiche les états

//  console.log('refresh screen');

  this._ScreenRef.value = '';
 for(var li_Index_Row = 0; li_Index_Row < this._RAM.length; li_Index_Row++)
 {
   var row = this._RAM[li_Index_Row];
   //console.log(row)

   for(var li_Index_Col = 0; li_Index_Col < row.length; li_Index_Col++){
     this._ScreenRef.value +=   this._GRID_STATES[row[li_Index_Col]];// new String();
   }

   this._ScreenRef.value += '\n';


 }
};
