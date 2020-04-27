
class Images{
    static chargerImages(){
        console.log("Chargement des images ..");
        for(const img in TypeGemme){
            var i = new Image();
            i.src = Images.path + img.toLowerCase()+ Images.ext;
            Images.images.set(img.toLowerCase(),i);
        }
        var i = new Image();
        i.src = Images.path + "cachee" + Images.ext;
        Images.images.set("cachee",i);
    }

    static getImage(nom){
        return Images.images.get(nom.toLowerCase());
    }
}

Images.path = 'ressources/images/';
Images.ext = '.png';
Images.images = new Map();