

class Grille{
    constructor(taille,score){
        console.log("Création d'une grille " + taille + "x"+taille );
        this.taille = taille;
        this.score = score;
        this.scoreCombo = 1;
        this.gemmes = new Array();

        var corA;
        var corB;

        //Création d'un tableau taille x taille vide
        for(let i=0; i<taille;i++){
            this.gemmes.push(new Array());
            for(let j=0; j<taille;j++){
                this.gemmes[i].push(new Gemme(Gemme.getRandom()));
            }
        }
        //console.log(this.gemmes);

        var erreurs = this.getAllCeuxQuiSeSuiventTrop();
        var i=0;
        while(this.regenerer(erreurs) !== 0){
            erreurs = this.getAllCeuxQuiSeSuiventTrop();
            i=i+erreurs.length;
        }
        console.log(i + " regenération(s) de zone effecutés");
        this.estPrete = true;
        console.log("grille prête");
    }




    //!!!!!! IL NE TROUVE PAS CERTAINES CASES
    regenerer(groupeGemmes){
        var pointsARegen = new Array();
        for(const groupe of groupeGemmes.values() ){
            for(const gemme of groupe.values()){
                var point = this.getPoint(gemme);
                pointsARegen.push(point);
                //this.gemmes[point.x][point.y] = new Gemme(Gemme.getRandom());

            }
        }
        for(const point of pointsARegen.values()){
            this.gemmes[point.x][point.y] = new Gemme(Gemme.getRandom());
        }
        return pointsARegen.length;
    }

    detruire(groupeGemmes){
        var pointsADetruire = new Array();
        for(const groupe of groupeGemmes.values() ){
            for(const gemme of groupe.values()){
                var point = this.getPoint(gemme);
                pointsADetruire.push(point);
                //this.gemmes[point.x][point.y] = new Gemme(Gemme.getRandom());

            }
        }

        for (const point of pointsADetruire.values()) {
            if (point != undefined)
                this.gemmes[point.x][point.y] = null;
        }

        /*
        var taille = pointsADetruire.length;
        setTimeout(function (pointsADetruire) {
            for (var point of pointsADetruire.values()) {
                if (point != undefined) {
                    grille.gemmes[point.x][point.y] = null;
                }
            }
        },100,pointsADetruire);
        //pointsADetruire = new Array();
        /*
        //setTimeout(function () {
            console.log("Destruction ! ");
            for (var point of pointsADetruire.values()) {
                if (point != undefined) {
                    grille.gemmes[point.x][point.y] = null;
                }
            }
        //},100);*/


        //console.log(taille);
        return groupeGemmes.length;
    }

    getAllCeuxQuiSeSuiventTrop(){
        var mauvaiseCorrespondances = new Array();
        var array;
        for(var i=0;i<this.taille;i++){
            array = this.getCeuxQuiSeSuiventTrop(Axe.VERTICAL,i);
            for(const groupe of array.values()){
                mauvaiseCorrespondances.push(groupe);
            }
        }
        for(var i=0;i<this.taille;i++){
            array = this.getCeuxQuiSeSuiventTrop(Axe.HORIZONTAL,i);
            for(const groupe of array.values()){
                mauvaiseCorrespondances.push(groupe);
            }
        }
        return mauvaiseCorrespondances;
    }

    getCeuxQuiSeSuiventTrop(axe, n){ // >3
        var correspondances = new Array();
        var quantite = 1;
        var doisEtreRenvoyees=false;
        if(axe === Axe.VERTICAL){
                for(var i=1;i<this.taille;i++){
                    if(this.gemmes[n][i-1] != undefined && this.gemmes[n][i] != undefined && this.gemmes[n][i].getTypeGemme() === this.gemmes[n][i-1].getTypeGemme()){
                        quantite++;
                        if(quantite>=3){
                            doisEtreRenvoyees=true;
                        }
                    }else{
                        if(doisEtreRenvoyees){
                            var groupe = new Array();
                            for(var j=1;j<=quantite;j++){
                                groupe.push(this.gemmes[n][i-j])
                            }
                            correspondances.push(groupe);
                        }
                        quantite=1;
                        doisEtreRenvoyees=false;
                    }
                }
                if(doisEtreRenvoyees){
                    var groupe = new Array();
                    for(var j=1;j<=quantite;j++){
                        groupe.push(this.gemmes[n][i-j])
                    }
                    correspondances.push(groupe);
                }
        }
        if(axe === Axe.HORIZONTAL){
            for(var i=1;i<this.taille;i++){

                if(this.gemmes[i-1][n] != undefined && this.gemmes[i][n] != undefined &&  this.gemmes[i][n].getTypeGemme() === this.gemmes[i-1][n].getTypeGemme()){
                    quantite++;
                    if(quantite>=3){
                        doisEtreRenvoyees=true;
                    }
                }else{
                    if(doisEtreRenvoyees){
                        var groupe = new Array();
                        for(var j=1;j<=quantite;j++){
                            groupe.push(this.gemmes[i-j][n])
                        }
                        correspondances.push(groupe);
                    }
                    quantite=1;
                    doisEtreRenvoyees=false;
                }
            }
            if(doisEtreRenvoyees){
                var groupe = new Array();
                for(var j=1;j<=quantite;j++){
                    groupe.push(this.gemmes[i-j][n])
                }
                correspondances.push(groupe);
            }
        }
        //console.log(correspondances);
        return correspondances
    }

    jouer(gemmeA,gemmeB){
        //TODO: tester sur cet axe
        Sons.commutation.play();
        var estVoisin = this.estVoisin(gemmeA,gemmeB);
        var pA = this.getPoint(gemmeA);
        var pB = this.getPoint(gemmeB);
        this.corA = new Array();
        this.corB = new Array();

        if(estVoisin === Axe.VERTICAL || estVoisin === Axe.HORIZONTAL){ // Si les deux gemmes selectionnées sont voisines
            console.log("Tentative d'inversion ...");
            this.commuter(pA,pB);
            //On regarde si la nouvelle position des gemmes inversé fais des correspondances sur leurs nouveaux Axe
            for(var value of this.getCeuxQuiSeSuiventTrop(Axe.VERTICAL,pA.x).values()){
                this.corA.push(value);
            }
            for(var value of this.getCeuxQuiSeSuiventTrop(Axe.HORIZONTAL,pA.y).values()){
                this.corA.push(value);
            }
            for(var value of this.getCeuxQuiSeSuiventTrop(Axe.VERTICAL,pB.x).values()){
                this.corB.push(value);
            }
            for(var value of this.getCeuxQuiSeSuiventTrop(Axe.HORIZONTAL,pB.y).values()){
                this.corB.push(value);
            }
        }else{
            grille.estPrete=true;
            console.log("Les cases ne sont pas voisines !");
            return;
        }
        //Si la commutation provoque un crush
        if(this.corA.length > 0 || this.corB.length > 0) {
            console.log(" - Succès");
            this.intervalleDestruction = setInterval(this.boucleDestruction,1000);
        }else {
            setTimeout(function() {
                grille.commuter(pA, pB);
                grille.estPrete=true;
                console.log(" - Echec");
                Sons.erreur.play();
                score.decrementerEssai();
                actualiser();
            },300);
        }
        for(var i=0;i<this.taille;i++) {
            for (var j = 0; j < this.taille; j++) {
                this.gemmes[i][j].estSolution=false;
            }
        }

    }

    boucleDestruction(){
        var aDetruire;
        var doisRecommencer;


        console.log("Destruction");
        Sons.destruction.play();
        aDetruire = grille.getAllCeuxQuiSeSuiventTrop();
        grille.detruire(aDetruire);
        //score.ajouter(grille.compterGemmesDans(aDetruire)*grille.scoreCombo); Le combo ne sera pas pris en compte afin de respecter l'exercice

        if(grille.compterGemmesDans(aDetruire) === 3)
            score.ajouter(100*score.niveau);
        if(grille.compterGemmesDans(aDetruire) === 4)
            score.ajouter(300*score.niveau);
        if(grille.compterGemmesDans(aDetruire) > 5)
            score.ajouter(1000*score.niveau);
        score.incrementerBarre();

        grille.attractionGravitationnelle();
        grille.scoreCombo++;

        doisRecommencer = grille.pluieDeGemmes();
        aDetruire = grille.getAllCeuxQuiSeSuiventTrop();
        if(aDetruire.length === 0 || !doisRecommencer) {
            grille.scoreCombo=1;
            clearInterval(grille.intervalleDestruction);
            grille.estPrete=true;
        }
        actualiser();
    }

    compterGemmesDans(groupeGemme){
        var n = 0;
        for (var groupe of groupeGemme.values()) {
            n=n+groupe.length;
        }
        return n;
    }

    notifierGemmesDeLeursDestructionImminente(){
        var aDetruire = grille.getAllCeuxQuiSeSuiventTrop();
        for (var groupe of aDetruire.values()) {
            for (var gemme of groupe) {
                gemme.destructionImminente=true;
            }
        }
    }

    commuter(pointA,pointB){
        var tampon = this.gemmes[pointA.x][pointA.y];
        this.gemmes[pointA.x][pointA.y] = this.gemmes[pointB.x][pointB.y];
        this.gemmes[pointB.x][pointB.y] = tampon;
    }

    //Si A et B sont voisins renvoi l'axe impliqué
    //Sinon return null
    estVoisin(gemmeA,gemmeB){
        var pa = this.getPoint(gemmeA);
        var pb = this.getPoint(gemmeB)
        //On cherche l'axe
        if(pa.x === pb.x){ //AXE=VERTICAL
            if(Math.abs(pa.y-pb.y) === 1){ //Sont voisins sur la vertical
                return Axe.VERTICAL;
            }
        }else if(pa.y === pb.y){ //AXE=HORIZONTAL
            if(Math.abs(pa.x-pb.x) === 1){ //Sont voisins sur l'horizontal
                return Axe.HORIZONTAL;
            }
        }else{ //HORS AXE
            return null
        }
        return null;
    }

    getGemme(point){
        return this.gemmes[point.x][point.y]
    }

    getPoint(gemme){
        for(var i=0;i<this.taille;i++){
            for(var j=0;j<this.taille;j++){
                if(this.gemmes[i][j] === gemme){
                    return new Point(i,j);
                }
            }
        }
        return null;
        //console.log("INTROUVABLE");
        //console.log(gemme);
    }

    attractionGravitationnelle(){
        var changements;
        for(var col=0;col<this.taille;col++){
            changements = 0;
            for(var com=0;com<this.taille*this.taille;com++){
                for(var row=1;row<this.taille;row++){
                    if(this.gemmes[col][row] === null){
                            grille.commuter(new Point(col, row), new Point(col, row - 1));
                            actualiser();
                            changements++;
                    }
                }
            }
        }
    }

    pluieDeGemmes(){
        var effectue = false;
        for(var i=0;i<this.taille;i++){
           for(var j=0;j<this.taille;j++){
               if(this.gemmes[i][j] === null) {
                   this.gemmes[i][j] = new Gemme(Gemme.getRandom());
                   effectue = true;
               }
           }
        }
       return effectue;
    }

    hint(){
        if(score.essais === 0)
            return;
        console.log("Clonage de la grille ...");
        this.score.decrementerEssai();
        //On clone la grille pour pouvoir faire des déplacements invisibles
        var clone = this.clone();
        //console.log(clone.gemmes);
        var dirs  = [-1,0,1];

        console.log("Recherche de solutions ...");
        //Pour toutes les gemmes
        for(var i=0;i<clone.taille;i++) {
            for (var j = 0; j < clone.taille; j++) {
                //Pour toutes les directions
                for(const dirX of dirs){
                    for(const dirY of dirs){
                        //console.log((i+dirX)+" ,"+ (j+dirY));
                        //Si les indices correspondent a une case du tableau
                        if(i+dirX > 0 && i+dirX < clone.taille && j+dirY > 0 && j+dirY < clone.taille){
                            //Si les deux cases représentées par les indices ne sont pas voisine diagonales
                            if(Math.abs(dirX) !== Math.abs(dirY)) {
                                //Si la deuxieme case n'est pas la premiere
                                if(!(i+dirX === i && j+dirY === j)){
                                    //Si elle existe
                                    if (clone.gemmes[i + dirX][j + dirY] != null) {
                                        clone.commuter(new Point(i,j), new Point(i + dirX,j + dirY));
                                        if (clone.getAllCeuxQuiSeSuiventTrop().length !== 0) {
                                            this.gemmes[i][j].estSolution = true;
                                            this.gemmes[i+dirX][j+dirY].estSolution = true;
                                            console.log("Solution en " + i + "," + j + " et" + (i + dirX) + "," +(j + dirY));
                                            return;
                                        }
                                        else {
                                            this.gemmes[i][j].estSolution = false;
                                        }
                                        clone.commuter(new Point(i, j), new Point(i + dirX, j + dirY));
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }
    }

    clone(){
        var clone = new Grille(this.taille);
        for(var i=0;i<this.taille;i++) {
            for (var j = 0; j < this.taille; j++) {
                clone.gemmes[i][j] = new Gemme(this.gemmes[i][j].type);
            }
        }
        return clone;
    }
}