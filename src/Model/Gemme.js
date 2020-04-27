class Gemme{
    constructor(type){
        this.estSelectionnee = false;
        this.estSolution = false;
        this.type = type;
    }

    static getRandom(){
        var rand = Math.floor(Math.random() * Object.keys(TypeGemme).length);
        return TypeGemme[Object.keys(TypeGemme)[rand]];
    }

    getTypeGemme(){
        return this.type;
    }

    setType(type){
        this.type = type;
    }

    getPosition(grille){
        if(grille == undefined)
            return null;
        for(var i=0;i<grille.taille;i++){
            for(var j=0;j<grille.taille;j++){
                var point = new Point(i,j);
                if(grille.getGemme(point) === this){
                    return point;
                }
            }
        }
    }
}