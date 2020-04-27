class VueGemme{

    constructor(gemme,modele){
        this.gemme = gemme;
        this.modele = modele;
        this.sync();
        this.realX = this.x;
        this.realY = this.y-300;
        this.destructionImminente=false;
    }


    sync(){
        if(this.gemme == undefined)
            return;
        this.point = this.gemme.getPosition(this.modele);
        if(this.point == undefined)
            return false;
        this.x = this.point.x*tailleCase;
        this.y = this.point.y*tailleCase;
        return true;
    }


}