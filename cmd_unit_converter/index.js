// ES Modules
import UnitConverter from "./converter/UnitConverter.js";

/**
 * 輸入參數型態驗證
 * 如果驗證失敗，將會拋出對應的錯誤。
 *
 * @param {number} value 數值
 * @param {string} fromUnit 原始單位
 * @param {string} keyWord 關鍵字，預期為 "to"
 * @param {string} toUnit 目標單位
 * @returns {number} 驗證通過的數值
 * @throws {RangeError} 如果 value 是負數
 * @throws {TypeError} 如果 value 不是數字、是 NaN，或 fromUnit/toUnit 不是字串
 * @throws {SyntaxError} 如果 keyWord 不是 "to"
 */
export function checkType(value,fromUnit,keyWord,toUnit){

  // value必須是數字且非負數，fromUnit & toUnit 必須是字串
  if(value < 0){
    throw new RangeError("數值不能是負數。");
  }else if((typeof value != "number") || (isNaN(value)) || (typeof fromUnit !== "string")|| (typeof toUnit !== "string")){
    throw new TypeError("請確認輸入的數值或單位型態正確。數值必須是數字，單位必須是字串。");
  }else if(typeof keyWord !== "string" || keyWord.toLowerCase() !== "to"){
    throw new SyntaxError("請在原始單位和目標單位之間使用 'to' 關鍵字。");
  }

  return value;
}

/**
 * 使用說明
 * @param {string[]} agrs 
 * @returns {boolean} 如果參數數量不足並顯示了說明，返回 true，否則返回 false
 */
export function showDescriptions(agrs){
  // console.log(agrs.length);
  let bool = true;
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
    bool = false
  }
  return bool;
}

/**
 * input: 數值 原始單位(長度或重量的英文) to 目標單位(長度或重量的英文)
 * eg. node index.js 5 cm to m
 * 
 * value: 數值
 * fromUnit: 原始單位；
 * toUnit: 目標單位
 */
export async function main() {
  try{
    const args = process.argv.slice(2);

    if (showDescriptions(args) === false) {
      process.exit(Number(1));
    }

    const valueStr = args[0];
    let fromUnit = args[1];
    let toKeyword = args[2];// 應該是 'to'
    let toUnit = args[3];

    const value = parseFloat(valueStr);
    
    // 若只出現： node index.js value，則使用預設單位做換算
    if(args.length === 1){
      fromUnit = "cm";
      toKeyword = "to";
      toUnit = "m";
    }

    const validatedValue = checkType(value,fromUnit,toKeyword,toUnit);

    // console.log('Creating UnitConverter instance')

    // 各種換算
    let converter = new UnitConverter(value,fromUnit,toUnit);
    console.log(await converter.doConverter());
      
  }catch(error){
    if (error instanceof RangeError || error instanceof TypeError || error instanceof SyntaxError) {
      console.warn(`輸入錯誤: ${error.message}`); // 統一處理來自 checkType 的警告
    } else {
      console.error(`執行錯誤: ${error.message}`); // 處理其他未預期的錯誤，包括 doConverter 的錯誤
    }
    process.exit(Number(1));
  }
}
// main();
// for test
if (import.meta.url === `file://${process.argv[1]}`) {
  main();
}
