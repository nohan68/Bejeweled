var grille;
var taille;
var tailleCase;
var toile;
var vueBarre;
var vueBarrePosition;
var score;
var vitesse=2;
var intervalleMainLoop;
var vueEssais;
var vueNiveau;
var vueClassement;
var meilleursScores = new Array();

var vueGemmes = new Array();
var enPause = false;
var gradient;
var gradientHints;


function demmarer() {
    console.log("Lancement de Bejeweled");

    Images.chargerImages();
    Sons.chargerSons();
    Sons.musiqueFond.addEventListener('ended', function() {
        this.currentTime = 0;
        this.play();
    }, false);


    document.body.style.cursor = "ressources/images/rouge.png";

    score = new Score(document.getElementById("score"));
    grille = new Grille(8,score);
    taille = document.getElementById("toile").getAttribute("width");
    tailleCase = taille/grille.taille;
    toile = document.getElementById("toile").getContext("2d");
    vueEssais = document.getElementById("essais");
    vueNiveau = document.getElementById("niveau");
    vueClassement = document.getElementById("classement");
    vueBarre = document.getElementById("barre");
    vueBarrePosition = vueBarre.getAttribute("width")/2;
    toileBarre = vueBarre.getContext("2d");

    gradient = toile.createLinearGradient(10, 0, vueBarre.getAttribute("width"), 0);
    gradient.addColorStop(0, 'rgb(255, 179, 179)');
    gradient.addColorStop(1 / 6, 'rgb(255, 214, 153)');
    gradient.addColorStop(2 / 6, 'rgb(255, 255, 153)');
    gradient.addColorStop(3 / 6, 'rgb(153, 255, 153)');
    gradient.addColorStop(4 / 6, 'rgb(153, 221, 255)');
    gradient.addColorStop(5 / 6, 'rgb(153, 153, 255)');
    gradient.addColorStop(1, 'rgb(255, 102, 179)');


    console.log("Création de la vue");
    creerVueGemmes();



    console.log("Lancement du controller");
    runGrilleController();
    actualiser();

    console.log("Lancement de la syncronisation vue modèle");
    intervalleMainLoop = setInterval(mainloop, 1);
    intervalleBarre = setInterval(score.onDecrementationBarre,3000);

    console.log("Demmarré");
    pause();
    document.getElementById("pause").value = "Lancer";
    document.getElementById("pause").style.color = "black";
    document.getElementById("pause").style.backgroundColor = "lightgreen";

}

function recommencer() {
    console.log("Redemmarage");
    grille = new Grille(8,score);
    score.barre = 50;
    score.essais = 5;
    score.score  = 0;
    score.niveau = 1;
    vueGemmes = new Array();
    console.log("Reinitialisation de la vue ");
    creerVueGemmes();
    console.log("Lancement de la syncronisation vue modèle");
    intervalleMainLoop = setInterval(mainloop, 1);
    //intervalleBarre = setInterval(score.onDecrementationBarre,3000);
    document.getElementById("finPartie").style.display = 'none';
    premiereSelection = null;
    var pseudo = document.getElementById("pseudo");
    pseudo.style.display = "block";
    var envoi = document.getElementById("envoi");
    envoi.disabled = false;
    envoi.value = "Envoyer";
    if(!enPause)
        pause();
    document.getElementById("pause").value = "Lancer";
}

function finPartie() {
    clearInterval(intervalleMainLoop);
    clearInterval(intervalleBarre);
    if(!enPause)
        pause();
    document.getElementById("finPartie").style.display = 'block';
    console.log("Partie terminée");
    document.getElementById("scoreFin").innerText = "Partie terminée, NIVEAU "+ score.niveau + ", " + score.score + " points";
}

function actualiser(){
    toile.fillStyle = "white";
    toile.fillRect(0,0,taille,taille);
    afficherScore(vueBarre);
    //dessinnerGrille(toile);
    dessinerGemmes(toile);
}

function creerVueGemmes(){
    for(var i=0;i<grille.taille;i++){
        for(var j=0;j<grille.taille;j++){
            vueGemmes.push(new VueGemme(grille.gemmes[i][j],grille));
        }
    }
}

function syncModeleVue(){
    for(var i=0;i<vueGemmes.length;i++){
        //On Sync le modèle et la vue de chaque gemme
        if(!vueGemmes[i].sync()){
            vueGemmes.splice(i,1);

        }
    }
    ajouterGemmesManquantesVue();
}

function ajouterGemmesManquantesVue(){
    //Ajouter les gemmes qui sont dans le modele mais pas dans la vue dans la vue
    var absente;
    for(var i=0;i<grille.taille;i++){
        for(var j=0;j<grille.taille;j++){
            absente=true;
            for(var k=0;k<vueGemmes.length;k++){
                absente = absente && (grille.gemmes[i][j] !== vueGemmes[k].gemme);
            }
            if(absente){
                //console.log(i+","+j+" abs");
                vueGemmes.push(new VueGemme(grille.gemmes[i][j],grille));
            }

        }
    }
}

function afficherScore(){
    vueEssais.innerHTML = score.essais;
    vueNiveau.innerHTML = score.niveau;
    if(score.barre*vueBarre.getAttribute("width")/100 < vueBarrePosition)
        vueBarrePosition = vueBarrePosition - (0.4*score.niveau);
    else
        vueBarrePosition = vueBarrePosition +0.5;

    /*
    for(var i=0;i<255;i++) {
        //toileBarre.fillStyle = 'rgb(' + (chrono.getPourcentageRestant() / 100*255) + ',' + Math.floor(255-i/2) + ',' + Math.floor(i/4) + ')';
        toileBarre.fillStyle = 'rgb(' + Math.floor(255-(i/10)) + ',' + Math.floor(255-i) + ',' + Math.floor(0) + ')';
        toileBarre.fillRect(0, 0, vueBarrePosition - i, vueBarre.getAttribute("height"));
    }
    */
    toileBarre.fillStyle = gradient;
    toileBarre.fillRect(0, 0, vueBarre.getAttribute("width"), vueBarre.getAttribute("height"));
    toileBarre.fillStyle="rgb(230,230,230)";
    toileBarre.fillRect(vueBarrePosition,0,vueBarre.getAttribute("width"),vueBarre.getAttribute("height"));

    toileBarre.fillStyle="grey";
    toileBarre.font = "20px Verdana";
    toileBarre.fillText(score.barre, vueBarre.getAttribute("width") / 2 - 14, vueBarre.getAttribute("height")/2);
}


function dessinnerGrille(toile){
    toile.fillStyle = "black";
    for(i=0;i<=grille.taille;i++){
        toile.beginPath();
        toile.moveTo(0,i*tailleCase);
        toile.lineTo(taille,i*tailleCase);
        toile.stroke();
    }
    for(j=0;j<=grille.taille;j++){
        toile.beginPath();
        toile.moveTo(j*tailleCase,0);
        toile.lineTo(j*tailleCase,taille);
        toile.stroke();
    }
}

function dessinerGemmes(toile) {
    for (var i = 0; i < vueGemmes.length; i++) {
        if(vueGemmes[i].gemme == null )
            continue;
        if (vueGemmes[i].gemme.estSelectionnee) {
            var gradientSelection;
            gradientSelection = toile.createRadialGradient(vueGemmes[i].x+(tailleCase/2), vueGemmes[i].y+(tailleCase/2), 16, vueGemmes[i].x+(tailleCase/2), vueGemmes[i].y+(tailleCase/2), 50);
            gradientSelection.addColorStop(0, "gray");
            gradientSelection.addColorStop(1, "white");
            toile.fillStyle = gradientSelection;
            toile.fillRect(vueGemmes[i].x, vueGemmes[i].y, tailleCase, tailleCase);
        }
        if (vueGemmes[i].gemme.estSolution) {
            gradientHints = toile.createRadialGradient(vueGemmes[i].x+(tailleCase/2), vueGemmes[i].y+(tailleCase/2), 16, vueGemmes[i].x+(tailleCase/2), vueGemmes[i].y+(tailleCase/2), 50);
            gradientHints.addColorStop(0, "red");
            gradientHints.addColorStop(1, "white");

            toile.fillStyle = gradientHints;
            toile.fillRect(vueGemmes[i].realX, vueGemmes[i].realY, tailleCase, tailleCase);
        }

        if (vueGemmes[i].gemme.destructionImminente) {
            var gradientDestruction;
            gradientDestruction = toile.createRadialGradient(
                vueGemmes[i].realX+(tailleCase/2), vueGemmes[i].realY+(tailleCase/2), 20,
                vueGemmes[i].realX+(tailleCase/2), vueGemmes[i].realY+(tailleCase/2), 50
            );

            gradientDestruction.addColorStop(0, 'rgb(191,196,255)');
            gradientDestruction.addColorStop(1/7, 'rgb(238,147,166)');
            gradientDestruction.addColorStop(2/7, 'rgb(255, 179, 179)');
            gradientDestruction.addColorStop(3 / 7, 'rgb(255, 214, 153)');
            gradientDestruction.addColorStop(4 / 7, 'rgb(255, 255, 153)');
            gradientDestruction.addColorStop(5 / 7, 'rgb(153, 255, 153)');
            gradientDestruction.addColorStop(6 / 7, 'rgb(153, 221, 255)');
            gradientDestruction.addColorStop(1, 'white');


            toile.fillStyle = gradientDestruction;
            toile.fillRect(vueGemmes[i].realX, vueGemmes[i].realY, tailleCase, tailleCase);
        }

        if(!enPause) {
            var image = Images.getImage(vueGemmes[i].gemme.getTypeGemme());
            toile.drawImage(image, vueGemmes[i].realX, vueGemmes[i].realY, tailleCase, tailleCase);
        }else{
            toile.drawImage(Images.getImage("cachee"), vueGemmes[i].realX, vueGemmes[i].realY, tailleCase, tailleCase);
        }




        if(vueGemmes[i].realX > vueGemmes[i].x-vitesse)
            vueGemmes[i].realX = vueGemmes[i].realX - vitesse;
        if(vueGemmes[i].realX < vueGemmes[i].x+vitesse)
            vueGemmes[i].realX = vueGemmes[i].realX + vitesse;

        if(vueGemmes[i].realY > vueGemmes[i].y-vitesse)
            vueGemmes[i].realY = vueGemmes[i].realY - vitesse;
        if(vueGemmes[i].realY < vueGemmes[i].y+vitesse)
            vueGemmes[i].realY = vueGemmes[i].realY + vitesse;


    }
}

/*
function dessinerGemmes(toile) {
    var gemme;
    for(i=0;i<grille.taille;i++){
        for(j=0;j<grille.taille;j++){
            gemme = grille.getGemme(new Point(i,j));
            if(gemme != undefined) {
                if (gemme.estSelectionnee) {
                    toile.fillStyle = "grey";
                    toile.fillRect(i * tailleCase, j * tailleCase, tailleCase, tailleCase);
                }
                var image = Images.getImage(gemme.getTypeGemme());
                toile.drawImage(image, i * tailleCase, j * tailleCase, tailleCase, tailleCase);
            }else{
                toile.fillStyle = "#F2F2F2";
                toile.fillRect(i * tailleCase, j * tailleCase, tailleCase, tailleCase);
            }
        }
    }
    toile.stroke();
}
*/

function refreshMeilleursScores(){
    var requeteReceptionScore = new XMLHttpRequest();
    var zoneClassement = document.getElementById("zoneClassement");
    requeteReceptionScore.open('GET','scores.php');
    requeteReceptionScore.send(null);
    requeteReceptionScore.addEventListener('readystatechange', function() {
        if (this.readyState == 4 && this.status == 200) {
            meilleursScores = JSON.parse(requeteReceptionScore.response);
            var i = 0;
            zoneClassement.innerHTML="";
            for (var record of meilleursScores.values()) {
                i++;
                console.log(record);
                zoneClassement.innerHTML += "<tr><td>" + i + "</td><td>" + record[1] + "</td><td>" + record[2] + "</td></tr>";
            }
        }
    });
}

function envoyerScore(){
    var pseudo = document.getElementById("pseudo");
    pseudo.style.display = "none";
    var envoi = document.getElementById("envoi");
    envoi.disabled = true;
    envoi.value = "Envoi ...";

    var requeteEnvoiScores = new XMLHttpRequest();
    requeteEnvoiScores.open('POST','scores.php');
    requeteEnvoiScores.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    if(pseudo.value === "")
        pseudo.value = "Anonyme";
    console.log("pseudo="+pseudo.value+"&score="+score.score);
    requeteEnvoiScores.addEventListener('readystatechange', function() {
        if (this.readyState == 4 && this.status == 200){
            if(requeteEnvoiScores.responseText == "ok") {
                document.getElementById("envoi").value = "Envoyé";
            }else{
                document.getElementById("envoi").value = "Echec";
            }
        }
    });
    requeteEnvoiScores.send("pseudo="+pseudo.value+"&score="+score.score);
}

function mainloop(){
    if(score.barre <= 0 && grille.estPrete) {
        finPartie();
    }
    syncModeleVue();
    grille.notifierGemmesDeLeursDestructionImminente();
    actualiser();
}

function fermerClassement(){
    vueClassement.style.display = "none";
}

function afficherClassement(){
    refreshMeilleursScores();
    vueClassement.style.display = "block";
}

function pause(){
    enPause = !enPause;
    if(enPause){
        Sons.musiqueFond.pause();
        clearInterval(intervalleBarre);
        document.getElementById("pause").value = "Reprendre";
        document.getElementById("pause").style.color = "black";
        document.getElementById("pause").style.backgroundColor = "lightgreen";
        document.getElementById("conseil").disabled = true;
    }else{
        Sons.musiqueFond.play();
        intervalleBarre = setInterval(score.onDecrementationBarre,3000);
        document.getElementById("pause").value = "Pause";
        document.getElementById("pause").style.color = "white";
        document.getElementById("pause").style.backgroundColor = "orange";
        document.getElementById("conseil").disabled = false;
    }
}
