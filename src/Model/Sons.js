
class Sons{
    static chargerSons(){
        console.log("Chargement des musiques et effets sonores");
        Sons.path = "ressources/sounds/";
        Sons.ext  = ".mp3";
        Sons.musiqueFond = new Audio(Sons.path+"gardenParty"+Sons.ext);
        Sons.musiqueFond.volume = 10/100;
        Sons.commutation = new Audio(Sons.path+"commutation"+Sons.ext);
        Sons.commutation.volume = 10/100;
        Sons.destruction = new Audio(Sons.path+"destruction"+Sons.ext);
        Sons.destruction.volume = 10/100;
        Sons.erreur = new Audio(Sons.path+"erreur"+Sons.ext);
        Sons.erreur.volume = 10/100;
        Sons.niveauSuivant = new Audio(Sons.path+"niveauSuivant"+Sons.ext);
        Sons.niveauSuivant.volume = 10/100;
        Sons.selection = new Audio(Sons.path+"selection"+Sons.ext);
        Sons.selection.volume = 10/100;
    }

}

