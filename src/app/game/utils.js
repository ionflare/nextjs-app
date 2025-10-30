class V2{
    constructor(_x, _y)
    {
        x: _x;
        y: _y;
    }
}

export class WFig2D{
    static GetUnitVector(v1x, v1y)
    {
        let dst = Math.sqrt*(v1x**2) +(v1y**2);
        return V2(v1x/dst, v1y/dst);
    }

    static GetDotProduct(v1x, v1y, v2x, v2y)
    {
        return  (v1x * v2x) + (v2x * v2y);
    }

    static GetRel2Vector(v1x, v1y, v2x, v2y)
    {
        let dst1 = Math.sqrt((v1x**2) +(v1y**2));
        let dst2 = Math.sqrt((v2x**2) +(v2y**2));
        
        let v1Ux = v1x/dst1;
        let v1Uy = v1y/dst1;
        let v2Ux = v2x/dst2;
        let v2Uy = v2y/dst2;
        let dDot = (v1Ux * v2Ux) + (v1Uy * v2Uy);
        
        if(dDot > 0.99 && dDot <1.01)           return 1;   //Same Dir
        else if(dDot > -0.01 && dDot < 0.01)    return 0;   //Perpendicular
        else if(dDot > -1.01 && dDot < -0.99)   return -1;  //Opposite Dir
        else                                    return -2;  //Arbitary Dir
    }
}
