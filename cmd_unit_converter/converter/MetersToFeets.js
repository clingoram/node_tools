/**
 * 公尺 => 英尺
 */
class MetersToFeets {
    // 判斷此策略是否能處理指定的單位轉換
    canConvert(fromUnit, toUnit) {
        return (fromUnit === "meters" || fromUnit === "m") && (toUnit === "feet" || toUnit === "ft");
    }
    // 執行轉換邏輯
    convert() {
        // 假設 metersToFeet 方法在 UnitConverter 實例中
        // 這裡需要透過注入的 _converterInstance 來呼叫它
        return this._converterInstance.metersToFeet();
    }
    // 注入 UnitConverter 實例，以便策略可以訪問它的方法
    setConverterInstance(instance) {
        this._converterInstance = instance;
    }
}