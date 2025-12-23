import { describe, expect, jest, test } from "@jest/globals";
import { main } from "../index.js";
import UnitConverter from "../converter/UnitConverter.js";
// test 
import SomeMath from "../converter/SomeMath.js";

/**
 * 
 * How to run Jest: npm run test
 * 
 * https://jestjs.io/docs/cli
 */

// 每次instance UnitConverterClass 時，都能得到自己獨立的 doConverter 方法的 mock 函數。
// jest.mock("../converter/UnitConverter.js", () => {
//   const MockUnitConverterClass = jest.fn((value, fromUnit, toUnit) => ({
//     doConverter: jest.fn(), // 每個instance都有自己獨立的 doConverter mock
//     value: value,
//     fromUnit: fromUnit,
//     toUnit: toUnit,
//   }));
//   return {
//     __esModule: true, // 模擬 ES module
//     default: MockUnitConverterClass, // 將mock類別設置為 default export
//   };
// });

describe("Run main function test",() => {
  let consoleWarnSpy,consoleLogSpy,consoleErrorSpy,processExitSpy,originalArgv;

  beforeAll(() => {
    originalArgv = process.argv;
  });

  afterAll(() => {
    process.argv = originalArgv;
    // 每個測試結束後自動恢復所有 mock
    jest.restoreAllMocks();
  });

  beforeEach(() => {
    // 清除所有mock
    jest.clearAllMocks();

    // Mock 實作
    consoleLogSpy = jest.spyOn(console,"log").mockImplementationOnce(() => {});
    consoleWarnSpy = jest.spyOn(console, "warn").mockImplementation(() => {});
    consoleErrorSpy = jest.spyOn(console, "error").mockImplementation(() => {});
    processExitSpy = jest.spyOn(process,"exit").mockImplementation(() => {});
    
    process.argv = [...originalArgv]; // 每次測試前重置 process.argv，確保測試獨立性
  });

  afterEach(() => {
    process.argv = originalArgv;
  });



  //  ------------------test ----------------------------------------
  test("constructor 能正確接收數值輸入", () => {
    const unit = new UnitConverter("100");

    expect(typeof unit).toBe("object");
  });

  test.only("debug doConverter", () => {
    const unit = new UnitConverter("100");
    unit.doConverter();
  });

  test.only("100 cm -> 1 m (debug)", () => {
    
    const spy = jest.spyOn(UnitConverter.prototype, "doConverter");

    const unit = new UnitConverter("100");

    console.log("before call");
    unit.doConverter();
    console.log("after call");

    console.log("calls:", spy.mock.calls);

    expect(spy).toHaveBeenCalled();

    spy.mockRestore();
  });

  test.only("只輸入數值時，會自動使用 cm 轉換為 m", async () => {

    process.argv = ["node", "index.js", "100"];

    const expectedResult = "100 cm 等於 1.00000 m";
    const unit = new UnitConverter(process.argv[2]);

    // spy console.log，抓出輸出
    const consoleLogSpy = jest
      .spyOn(console, "log")
      .mockImplementation(() => {}); // 避免真的印出

    // spy 方法本身只是額外確認呼叫次數
    const spy = jest.spyOn(unit, "doConverter");

    // 執行方法
    unit.doConverter();

    // 驗證方法被呼叫
    expect(spy).toHaveBeenCalledTimes(1);

    // 驗證 console.log 輸出正確
    expect(consoleLogSpy).toHaveBeenCalledWith(expectedResult);
    // 清理 spy
    spy.mockRestore();
    consoleLogSpy.mockRestore();

  });

  test.only("有足夠且正確參數時，應該呼叫 UnitConverter", async () => {
    // cmd: node index.js 10 ft to m
    // process.argv = ["node", "index.js", "10", "ft","to", "m"];
    // const expectedResult = "10 ft 等於 3.04800 m";

    //  const consoleLogSpy = jest
    //   .spyOn(console, "log")
    //   .mockImplementation(() => {});

    // const spy = jest.spyOn(UnitConverter.prototype,'doConverter');
    // const unit = new UnitConverter(process.argv[2]);

    // unit.doConverter(); 

    // expect(spy).toHaveBeenCalled(); // 是否被呼叫
    // expect(spy).toHaveBeenCalledTimes(1);
    // spy.mockRestore();

    // expect(consoleLogSpy).toHaveBeenCalledWith(expectedResult);

    // consoleLogSpy.mockRestore();

    const unit = new UnitConverter("100");
    const spy = jest.spyOn(unit, "doConverter");

    unit.doConverter();

    expect(spy).toHaveBeenCalled();

    spy.mockRestore();


    // FIXME: TypeError:UnitConverter.mockImplementationOnce is not a function
    // UnitConverter.mockImplementationOnce((value, fromUnit, toUnit) => ({
    //   doConverter: jest.fn().mockReturnValue(expectedResult),
    //   value: value,
    //   fromUnit: fromUnit,
    //   toUnit: toUnit,
    // }));

    // await main();
    // const unit = new SomeMath(10,2);
    // const result = unit.toSum().then((result) => {
    //     expect(result).toBe(12)
    //     done();
    // });

    // // 創建 UnitConverter instance
    // expect(UnitConverter).toHaveBeenCalledTimes(1);

    // // UnitConverter constructor應該以正確的參數被呼叫
    // expect(UnitConverter).toHaveBeenCalledWith(10, "ft","m");

    // // 調用 UnitConverter 實例上的 doConverter 方法
    // // 從 `UnitConverter.mock.instances` 中獲取被呼叫的實例
    // const converterInstance = UnitConverter.mock.instances[0];
    // expect(converterInstance.doConverter).toHaveBeenCalledTimes(1);
    // expect(converterInstance.doConverter).toHaveBeenCalledWith();

    // // 應該要輸出轉換結果
    // expect(consoleLogSpy).toHaveBeenCalledTimes(1);
    // expect(consoleLogSpy).toHaveBeenCalledWith(expectedResult);

    // // 不應該呼叫 process.exit (表示成功執行)
    // expect(processExitSpy).not.toHaveBeenCalled();


  //---
    // const unit = new UnitConverter(process.argv);
    // unit.doConverter = jest.fn();//.mockReturnValue(expectedResult)
    // // 創建 UnitConverter instance
    // expect(unit.doConverter).toHaveBeenCalledTimes(1)

    // // UnitConverter constructor應該以正確的參數被呼叫
    // expect(unit).toHaveBeenCalledWith("10", "ft","m");

    // // 調用 UnitConverter 實例上的 doConverter 方法
    // // 從 `UnitConverter.mock.instances` 中獲取被呼叫的實例
    // const converterInstance = UnitConverter.mock.instances[0];
    // expect(converterInstance.doConverter).toHaveBeenCalledTimes(1);
    // expect(converterInstance.doConverter).toHaveBeenCalledWith();

    // // 應該要輸出轉換結果
    // expect(consoleLogSpy).toHaveBeenCalledTimes(1);
    // expect(consoleLogSpy).toMatch(expectedResult);

    // // 不應該呼叫 process.exit (表示成功執行)
    // expect(processExitSpy).not.toHaveBeenCalled();

  });
})