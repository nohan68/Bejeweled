
class Score {

    constructor(element){
        this.score = 0;
        this.niveau = 1;
        this.essais = 5;
        this.barre = 50;
        element.innerHTML = 0;
        this.element = element;
    }

    decrementerEssai(){
        if(this.essais > 0)
            this.essais--;
        else
            finPartie();
    }

    ajouter(n){
        console.log(" +"+n+ " points");
        this.score = this.score + n;
        this.element.innerHTML = this.score;
    }

    onDecrementationBarre(){
        score.barre = score.barre-score.niveau;
        if(score.barre < 0)
            score.barre = 0;
    }

    incrementerBarre(){
        score.barre = score.barre+ 10;
        if(score.barre > 100){
            Sons.niveauSuivant.play();
            this.niveau = this.niveau+1;
            this.barre = 50;
            vueBarrePosition = vueBarre.getAttribute("width")/2;
        }
    }


}