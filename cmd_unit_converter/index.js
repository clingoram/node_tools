/**
 * 長度換算
 * @param {number} value
 * @param {string} fromUnit
 * @param {string} toUnit
 */
function convertLength (value,fromUnit,toUnit) {
    if (fromUnit === 'meters' && toUnit === 'centimeters') {
        return value * 100;
    } else if (fromUnit === 'centimeters' && toUnit === 'meters') {
        return value / 100;
    } else {
        return null; // 表示不支持的轉換
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
    if((typeof value != "number" && value >= 0) || typeof fromUnit !== "string" || typeof toUnit !== "string"){
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
            return unit; // 如果不是已知的縮寫，就返回原樣
    }
}

function main() {
    /**
     * input: 數值 原始單位(長度或重量的英文) to 目標單位(長度或重量的英文)
     * eg. 5 cm to m
     * 
     * value: 數值
     * fromUnit: 原始單位；"
     * toUnit: 目標單位
     */
    const value = parseFloat(process.argv[2]);
    const fromUnit = process.argv[3];
    const toUnit = process.argv[5];

    if(checkType(value,fromUnit,toUnit)){
        // 各種換算
        if (fromUnit === 'meters' || fromUnit === 'centimeters') {
            console.log(convertLength(value, fromUnit, toUnit));
        } else if (fromUnit === 'kg' || fromUnit === 'grams') {
            return convertWeight(value, fromUnit, toUnit);
        }
    }

    
}
main();