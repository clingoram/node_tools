// ES Modules
import UnitConverter from "./converter/UnitConverter.js";

/**
 * 輸入參數型態驗證
 * 
 * @param {number} value
 * @param {string} fromUnit
 * @param {string} toUnit
 */
export function checkType(value,fromUnit,toUnit){

  try {
    // value必須是數字且非負數，from & to 必須是字串
    if(value < 0){
      throw new RangeError("不能是負數");
    }
    if((typeof value != "number") || (isNaN(value)) || (typeof fromUnit !== "string")|| (typeof toUnit !== "string")){
      throw new TypeError("請確認輸入數值或字串");
    }
    return value;
  } catch (error) {
    if(error instanceof RangeError){
      console.warn(`範圍錯誤: ${error.message}`);
      return null;
    }
    if(error instanceof TypeError){
      console.warn(`型態錯誤: ${error.message}`);
      return null;
    }
  }
}

/**
 * 使用說明
 * @param {string[]} agrs 
 * @returns {boolean} 如果參數數量不足並顯示了說明，返回 true，否則返回 false
 */
export function showDescriptions(agrs){
  // console.log(agrs.length);
  const descriptions = [
    "請使用以下指令：",
    "用法：node index.js <數值> <原始單位> <目標單位>",
    "例如：node index.js 10 m to ft",
    "支援的長度單位：m (公尺), ft (英尺), cm (公分)",
    "支援的重量單位：kg (公斤), lb (磅)"
  ];

  if(agrs.length === 0){
    for(let i = 0;i < descriptions.length;i++) {
      console.warn(descriptions[i]);
    }
    return true;
  }
  return false;
}

/**
 * input: 數值 原始單位(長度或重量的英文) to 目標單位(長度或重量的英文)
 * eg. 5 cm to m
 * 
 * value: 數值
 * fromUnit: 原始單位；
 * toUnit: 目標單位
 */
export async function main() {
    
    const args = process.argv.slice(2);
    if (showDescriptions(args)) {
      process.exit(1); // 退出程式，錯誤代碼 1 表示異常退出
    }

    const valueStr = args[0];
    let fromUnit = args[1];
    let toKeyword = args[2];// 應該是 'to'
    let toUnit = args[3];

    const value = parseFloat(valueStr);
    
    // 使用預設單位做換算
    if(args.length === 1){
      toKeyword = "to";
      fromUnit = "cm";
      toUnit = "m";
    }

    if(toKeyword.toLowerCase() !== "to"){
      console.warn("錯誤：請在原始單位和目標單位之間使用 'to' 關鍵字。");
      showDescriptions([]);
      process.exit(1);
    }

    const validatedValue = checkType(value,fromUnit,toUnit);
    if(validatedValue !== null){
      // 各種換算
      let converter = new UnitConverter();
      converter.value = validatedValue;
      converter.fromUnit = fromUnit;
      converter.toUnit = toUnit;

      try {
        console.log(converter.doConverter());
        
      } catch (error) {
        console.error(`轉換錯誤：${error.message}`);
        process.exit(1);
      }
    }else{
      // console.log("a")
      process.exit(1);
    }
}
// main();
// for test
if (import.meta.url === `file://${process.argv[1]}`) {
  main();
}