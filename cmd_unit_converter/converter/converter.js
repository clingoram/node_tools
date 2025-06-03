/**
 * 單位換算
 */
class UnitConverter {

    constructor(){
        //確保單位是統一的名稱
        this.unitMap = {
            "meters": "m",
            "m": "m",
            "feet": "ft",
            "ft": "ft",
            "kilometers": "km",
            "km": "km",
            "centimeters": "cm",
            "cm": "cm",
            "kilograms": "kg",
            "kg": "kg",
            "pounds": "lb",
            "lb": "lb"
        }

        // 將單位轉換對應到方法
        this.conversionMethods = {
            "m_ft": this.metersToFeet,
            "ft_m": this.feetToMeters,
            "km_cm": this.kilometersToCenimeter,
            "m_cm": this.meterToCenimeter,
            "cm_m": this.cenimeterToMetetr,
            "kg_lb": this.kilogramsToPounds,
            "lb_kg": this.poundsToKilograms,
        };
    }

    /**
     * 正規化單位(長度、重量)，確保是小寫
     * @param {string} unit 
     * @returns 
     */
    abbreviationUnit(unit){
        return this.unitMap[unit.toLowerCase()] || unit.toLowerCase();
    }

    /**
     * 依據from、to執行各methods換算
     * @returns 
     */
    doConverter(){
        const from = this.abbreviationUnit(this.fromUnit);
        const to = this.abbreviationUnit(this.toUnit);
        const conversionKey = `${from}_${to}`;
        const value = this.value;

        const methodToCall = this.conversionMethods[conversionKey];

        try {
            return `${value} ${from} 等於 ${methodToCall.call(this)} ${to}` ;
        } catch (error) {
            console.warn(`找不到 ${this.fromUnit} 到 ${this.toUnit} 的轉換方法。`);
            return null;
        }
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
    cenimeterToMetetr() {
        return this.value / 100;
    }
    /**
     * 公里 => 公分
     * @returns 
     */
    kilometersToCenimeter() {
        return this.value * 100000;
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
}

export default UnitConverter;