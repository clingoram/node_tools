/**
 * 單位換算
 */
class UnitConverter {

    /**
     * 
     * @param {number} value 數值
     * @param {string} from 原始單位
     * @param {string} to 欲換算單位
     */
    constructor(value,from,to){
        this.value = value;
        this.fromUnit = from;
        this.toUnit = to;
    }
    /**
     * 公尺 => 英尺
     */
    metersToFeet() {
        return this.value * 3.28084;
    }
    /**
     * 英呎 => 公尺
     */
    feetToMeters() {
       return this.value / 3.28084;
    }
    /**
     * 公尺 => 公分
     */ 
    meterToCenimeter() {
        return this.value * 100;
    }
    /**
     * 公分 => 公尺
     */
    cenimeterToMetet() {
        return this.value / 100;
    }

    /**
     * 公斤 => 磅
     */
    kilogramsToPounds() {
        return this.value * 2.20462;
    }
    /**
     * 磅 => 公斤
     */
    poundsToKilograms(){
        return this.value / 2.20462;
    }

    /**
     * 依據fromUnit、toUnit執行各methods換算
     * @returns 
     */
    doConverter(){
        if ((this.fromUnit === "meters" && this.toUnit === "feet") || (this.fromUnit === "m" && this.toUnit === "ft")){
            return this.metersToFeet()

        } else if ((this.fromUnit === "feet" && this.toUnit === "meters") || (this.fromUnit === "ft" && this.toUnit === "m")) {
            return this.feetToMeters()
            
        } else if((this.fromUnit === "meters" && this.toUnit === "centimeters") || (this.fromUnit === "m" && this.toUnit === "cm")) {
            return this.meterToCenimeter();
            
        }else if((this.fromUnit === "centimeters" && this.toUnit === "meters") || (this.fromUnit === "cm" && this.toUnit === "m")) {
            return this.cenimeterToMetet();
            
        }else if((this.fromUnit === "kg" && this.toUnit === "lb") || (this.fromUnit === "kilograms" && this.toUnit === "pounds")) {
            return this.kilogramsToPounds();

        }else if((this.fromUnit === "lb" && this.toUnit === "kg") || (this.fromUnit === "pounds" && this.toUnit === "kilograms")) {
            return this.poundsToKilograms();
        }

    }
}

export default UnitConverter;