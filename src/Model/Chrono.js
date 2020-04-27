class Chrono{

    constructor(intervalleEnSeconde){
        this.tempsInit = Date.now();
        this.intervalle = intervalleEnSeconde*1000;
        this.tempsFin  = this.tempsInit + this.intervalle;
    }

    getPourcentageRestant(){
        var tempsRestant = this.tempsFin - Date.now();
        if(Date.now() < this.tempsFin)
            return ((tempsRestant/this.intervalle)*100)/2;
        else
            return 0;
    }

    getSecondesRestantes(){
        if(this.tempsFin - Date.now() <= 0)
            return "Partie terminée";
        return Math.floor(((this.tempsFin - Date.now())/1000)/2);
    }
}