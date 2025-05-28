/**
 * 英呎 => 公尺
 */
class FeetToMeters {
    canConverter(fromUnit, toUnit){
        return (fromUnit === "ft" || fromUnit === "feet") && (toUnit === "m" || toUnit === "meter");
    }
    // 執行轉換邏輯
    convert() {
        return this._converterInstance.feetToMeters();
    }
    // 注入 UnitConverter 實例，以便策略可以訪問它的方法
    setConverterInstance(instance) {
        this._converterInstance = instance;
    }
}