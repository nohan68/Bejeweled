class Point{
    constructor(x,y){
        this.x = x;
        this.y = y;
    }

    add(point){
        this.x = this.x + point.x;
        this.y = this.y + point.y;
    }

}