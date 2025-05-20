import UnitConverter from "./converter.js";

/**
 * 單位換算
 * @param {number} unit 
 * @param {string} fromUnit 
 * @param {string} toUnit 
 * @returns 
 */
function converter(unit,fromUnit,toUnit){
   if ((fromUnit === "meters" && toUnit === "feet") || (fromUnit === "m" && toUnit === "ft")){
        return unit * 3.28084;
   } else if ((fromUnit === "feet" && toUnit === "meters") || (fromUnit === "ft" && toUnit === "m")) {
       return unit  / 3.28084;

    } else if((fromUnit === "meters" && toUnit === "centimeters") || (fromUnit === "m" && toUnit === "cm")) {
        return unit * 100;

    }else if((fromUnit === "centimeters" && toUnit === "meters") || (fromUnit === "cm" && toUnit === "m")) {
        return unit / 100;

    }else if((fromUnit === "kg" && toUnit === "lb") || (fromUnit === "kilograms" && toUnit === "pounds")){
        return unit * 2.20462

    }else if((fromUnit === "lb" && toUnit === "kg") || (fromUnit === "pounds" && toUnit === "kilograms")){
       return unit / 2.20462;
    }else{
        console.log("請確認單位英文是否正確。")
    }
}
/**
 * 輸入參數型態驗證
 * 
 * @param {number} value
 * @param {string} fromUnit
 * @param {string} toUnit
 */
function checkType(value,fromUnit,toUnit){

    if((typeof value != "number" && value >= 0) || (typeof fromUnit !== "string" && fromUnit !== "object")|| (typeof toUnit !== "string" && toUnit !== "object")){
        return false;
    }
    return true;
}

/**
 * 處理單位縮寫(長度、重量)
 * 
 * @param {string} unit
 * @returns {string}
 */
function abbreviationParam (unit){
    switch (unit.toLowerCase) {
        case "m":
        case "meters":
            return "meters";
        case "cm":
        case "centimeters":
            return "centimeters";
        case "kg":
        case "kilograms":
            return "kilograms";
        case "g":
        case "grams":
            return "grams";
        case "lbs":
        case "lb":
        case "pounds":
            return "pounds";
        default:
            return unit;
    }
}
/**
 * 使用說明
 * @param {number} paramLen 
 * @returns 
 */
function showDescriptions(paramLen){
//   process.exit(1);
  const descriptions = [
    "請使用以下指令：",
    "用法：node index.js <數值> <原始單位> <目標單位>",
    "例如：node index.js 10 m ft",
    "支援的長度單位：m (公尺), ft (英尺)",
    "支援的重量單位：kg (公斤), lb (磅)"
  ];
  if(paramLen.length <= 1 ){
    for(let i = 0;i < descriptions.length;i++) {
      console.log(descriptions[i]);
    }
    return;
  }
}

/**
 * input: 數值 原始單位(長度或重量的英文) to 目標單位(長度或重量的英文)
 * eg. 5 cm to m
 * 
 * value: 數值
 * fromUnit: 原始單位；
 * toUnit: 目標單位
 */
async function main() {
    
    const args = process.argv.slice(2);
    showDescriptions(args);

    const value = parseFloat(process.argv[2]);
    const fromUnit = abbreviationParam(process.argv[3]);
    const toUnit = abbreviationParam(process.argv[5]);
    let result = 0;
    
    if(checkType(value,fromUnit,toUnit)){
        // 各種換算
        // result = converter(value,fromUnit,toUnit);

        // oop
        let converter = new UnitConverter(value,fromUnit,toUnit);
        result = converter.doConverter();

        console.log(`${value} ${fromUnit} 換算成 ${toUnit} 是 ${result} ${toUnit}`);
    }
}
main();