class MeterToCenimeter {
    canConverter(fromUnit,toUnit){
        return (fromUnit === "m" || fromUnit === "meter") && (toUnit === "cm" || toUnit === "cenimeter");
    }
    // 執行轉換邏輯
    convert() {
        return this._converterInstance.meterToCenimeter();
    }
    // 注入 UnitConverter 實例，以便策略可以訪問它的方法
    setConverterInstance(instance) {
        this._converterInstance = instance;
    }
}