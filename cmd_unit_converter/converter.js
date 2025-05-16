class UnitConverter {

    constructor(){
        this.value = 0;
        this.fromUnit = "";
        this.toUnit = "";
    }
    // 公尺 => 英尺
    metersToFeet(value) {
        return value * 3.28084;
    }
    // 英呎 => 公尺
    feetToMeters(value) {
       return value / 3.28084;
    }
    // 公尺 => 公分
    meterToCenimeter(value) {
        return value * 100;
    }
    // 公分 => 公尺
    cenimeterToMetet(value) {
        return value / 100;
    }

    // 公斤 => 磅
    kilogramsToPounds(value) {
        return value * 2.20462;
    }
    // 磅 => 公斤
    poundsToKilograms(value) {
        return value / 2.20462;
    }


    // getResult(value,from,to){
    //     this.value = value;
    //     this.fromUnit = from;
    //     this.toUnit = to;
    //     if(this.fromUnit === "cenimeter" && this.toUnit === "meters"){
    //         return this.cenimeterToMetet(value);
    //     }else if(this.fromUnit === "meters" && this.toUnit === "cenimeter"){
    //         return this.meterToCenimeter(value);
    //     }
    // }
}

export default UnitConverter;