import { beforeEach, describe, expect, jest, test } from "@jest/globals";
// import { main } from "../index.js";
import UnitConverter from "../../converter/UnitConverter.js";
// test 
// import SomeMath from "../converter/SomeMath.js";

//  ------------------test ----------------------------------------
describe("class UnitConverter",() => {
  // beforeEach 是「準備測試環境」，避免重複 & 保證每個測試都是獨立且全新的instance
  // afterEach 是「清理副作用」，只用於spy / mock、修改全域物件、fake timer、console、DOM
  let callUnit;

  beforeEach(()=>{
    callUnit = new UnitConverter(100);
  })

  describe("constructor",() => {
    test("debug doConverter", () => {
      // 測試是否會在doConverter()出現： console.log();
      callUnit.doConverter();
    });

    test("constructor 能正確接收數值輸入，並以物件資料型態回傳", () => {
      expect(typeof callUnit).toBe("object");
    });

    test("constructor 沒有參數則拋出錯誤",() => {
      const msg = "未輸入有效參數。";
      expect(() => {
        new UnitConverter(null)
      }).toThrow(msg);
    })
  })

  describe("run method doConverter()",() => {
    test("只輸入數值時，會使用預設 cm 轉換為 m", async () => {
      const expectedResult = "100 cm 等於 1 m";
      // await cause async
      const result = await callUnit.doConverter();
      expect(result).toBe(expectedResult);
    });

    test("參數內有數值、轉換單位時，可執行換算",async() => {
      const expectedResult = "100 cm 等於 1 m";
      const result = await callUnit.doConverter();
      expect(result).toBe(expectedResult);
    })

    test("有足夠且正確參數時，應該呼叫 UnitConverter", async () => {
      // 確認doConverter被呼叫了
      const spy = jest.spyOn(callUnit, "doConverter");
      callUnit.doConverter();
      expect(spy).toHaveBeenCalled();
      expect(spy).toHaveBeenCalledTimes(1);
      spy.mockRestore();
    });

    test("doConverter call abbreviationUnit",() => {
      // 測試是否有從doConverter()中呼叫abbreviationUnit()
      const spy = jest.spyOn(callUnit, "abbreviationUnit");
      callUnit.doConverter();
      expect(spy).toHaveBeenCalled();
    })
  })

  

 
  // test("100 cm -> 1 m (for debug)", () => {
    
  //   const spy = jest.spyOn(UnitConverter.prototype, "doConverter");

  //   const unit = new UnitConverter(100);

  //   console.log("Before call");
  //   unit.doConverter();
  //   console.log("After call");

  //   console.log("Calls:", spy.mock.calls);

  //   expect(spy).toHaveBeenCalled();

  //   spy.mockRestore();
  // });
})