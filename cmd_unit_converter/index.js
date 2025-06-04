import UnitConverter from "./converter/converter.js";

/**
 * 輸入參數型態驗證
 * 
 * @param {number} value
 * @param {string} fromUnit
 * @param {string} toUnit
 */
function checkType(value,fromUnit,toUnit){

  try {
    // value必須是數字且非負數，from & to 必須是字串
    if(value < 0){
      throw new RangeError("不能是負數");
    }
    if((typeof value != "number") || (typeof fromUnit !== "string")|| (typeof toUnit !== "string")){
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
 * @param {number} paramLen 
 * @returns 
 */
function showDescriptions(paramLen){
//   process.exit(1);
  const descriptions = [
    "請使用以下指令：",
    "用法：node index.js <數值> <原始單位> <目標單位>",
    "例如：node index.js 10 m to ft",
    "支援的長度單位：m (公尺), ft (英尺), cm (公分)",
    "支援的重量單位：kg (公斤), lb (磅)"
  ];
  try {
    if(paramLen.length <= 1 ){
      for(let i = 0;i < descriptions.length;i++) {
        throw new Error(descriptions[i]);
      }
      return null;
    }
  } catch (error) {
    return null;
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
    // 若物件長度 <= 3 則使用預設單位做換算
    const from = Object.keys(process.argv).length <= 3 ? "cm" : process.argv[3];
    const to = Object.keys(process.argv).length <= 3 ? "m" : process.argv[5];

    if(checkType(value,from,to)){
      // 各種換算
      let converter = new UnitConverter();
      converter.value = value;
      converter.fromUnit = from;
      converter.toUnit = to;
      console.log(converter.doConverter());
    }else{
      checkType(process.argv[2],from,to)
    }
}
main();