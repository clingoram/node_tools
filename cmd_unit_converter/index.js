import UnitConverter from "./converter.js";

/**
 * 長度換算
 * @param {number} value
 * @param {string} fromUnit
 * @param {string} toUnit
 */
// function convertLength (value,fromUnit,toUnit) {
//     if (fromUnit === 'meters' && toUnit === 'centimeters') {
//         return value * 100;
//     } else if (fromUnit === 'centimeters' && toUnit === 'meters') {
//         return value / 100;
//     } else {
//         return null; // 表示不支持的轉換
//     }
// }

/**
 * 重量換算
 * 
 * @param {number} value 
 * @param {string} fromUnit 
 * @param {string} toUnit 
 */
// function convertWeight (value,fromUnit,toUnit) {

// }

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
        case 'm':
            return 'meters';
        case 'meters':
            return 'meters';
        case 'cm':
            return 'centimeters';
        case 'centimeters':
            return 'centimeters';
        case 'kg':
            return 'kilograms';
        case 'kilograms':
            return 'kilograms';
        case 'g':
            return 'grams';
        case 'grams':
            return 'grams';
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
    // console.log(paramLen.length)
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
 * fromUnit: 原始單位；"
 * toUnit: 目標單位
 */
async function main() {
    
    const args = process.argv.slice(2);
    const value = parseFloat(process.argv[2]);

    abbreviationParam();
    const fromUnit = process.argv[3].toLowerCase();
    const toUnit = process.argv[5].toLowerCase();
    let result = 0;
    
    showDescriptions(args);
    if(checkType(value,fromUnit,toUnit)){
        // 各種換算
        let converter = new UnitConverter();
        if (fromUnit === 'meters' && toUnit === 'feet') {
            result = converter.metersToFeet(value);
        } else if (fromUnit === 'feet' && toUnit === 'meters') {
            result = converter.feetToMeters(value);
        } else if(fromUnit === 'meters' && toUnit === 'centimeters'){
            result = converter.meterToCenimeter(value);
        }else if(fromUnit === 'centimeters' && toUnit === 'meters'){
            result = converter.cenimeterToMetet(value);
        }

        // if (fromUnit === 'meters' || fromUnit === 'centimeters') {
        //     result = convertLength(value, fromUnit, toUnit);
        // } else if (fromUnit === 'kg' || fromUnit === 'grams') {
        //     result = convertWeight(value, fromUnit, toUnit);
        // }
        console.log(`${value} ${fromUnit} 換算成 ${toUnit} 是 ${result} ${toUnit}`);
    }
    
    
}
main();