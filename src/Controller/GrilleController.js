var premiereSelection = null;
var gemmes;

/*
function runGrilleController() {
    let toile = document.getElementById("toile");
    toile.addEventListener("mousedown", function(e)
    {
        onMouseDown(toile, e);
    });

    toile.addEventListener("mouseup", function(e)
    {
        onMouseUp(toile, e);
    });
}

function onMouseDown(canvas, event){
    Sons.selection.play();
    if(!grille.estPrete || enPause)
        return;
    let rect = canvas.getBoundingClientRect();
    let x = Math.floor((event.clientX - rect.left)/tailleCase);
    let y = Math.floor((event.clientY - rect.top)/tailleCase);
    console.log("DOWN"+
        "x: " + x,
        "y: " + y
    );
    gemme = grille.getGemme(new Point(x,y));
    gemme.estSelectionnee = true;
    premiereSelection = gemme;
}

function onMouseUp(canvas, event){
    if(!grille.estPrete || enPause || premiereSelection===null)
        return;

    let rect = canvas.getBoundingClientRect();
    let x = Math.floor((event.clientX - rect.left)/tailleCase);
    let y = Math.floor((event.clientY - rect.top)/tailleCase);
    console.log("UP "+
        "x: " + x,
        "y: " + y
    );
    gemme = grille.getGemme(new Point(x,y));

    gemme.estSelectionnee = true;
    grille.estPrete = false;
    grille.jouer(premiereSelection,gemme);
    gemme.estSelectionnee = false;
    premiereSelection.estSelectionnee = false;
    premiereSelection = null;

}
*/


function runGrilleController() {
    let toile = document.getElementById("toile");
    toile.addEventListener("mousedown", function(e)
    {
        selectionner(toile, e);
    });
}

function selectionner(canvas, event) {
    if(!grille.estPrete || enPause)
        return;
    let rect = canvas.getBoundingClientRect();
    let x = Math.floor((event.clientX - rect.left)/tailleCase);
    let y = Math.floor((event.clientY - rect.top)/tailleCase);
    console.log(
                "x: " + x,
                "y: " + y
    );
    gemme = grille.getGemme(new Point(x,y));
    gemme.estSelectionnee = true;
    if(premiereSelection === null){
        premiereSelection = gemme;
    }else{
        grille.estPrete = false;
       // setTimeout(function() {
            grille.jouer(premiereSelection,gemme);
            premiereSelection.estSelectionnee = false;
            premiereSelection = null;
            gemme.estSelectionnee = false;
            actualiser();
        //},100);
    }
}




