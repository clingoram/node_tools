import { describe, expect, jest, test } from "@jest/globals";
import { main } from "../index.js";
import UnitConverter from "../converter/UnitConverter.js";

// 每次instance UnitConverterClass 時，都能得到自己獨立的 doConverter 方法的 mock 函數。
jest.mock("../converter/UnitConverter.js", () => {
  const MockUnitConverterClass = jest.fn((value, fromUnit, toUnit) => ({
    doConverter: jest.fn(), // 每個instance都有自己獨立的 doConverter mock
    value: value,
    fromUnit: fromUnit,
    toUnit: toUnit,
  }));
  return {
    __esModule: true, // 模擬 ES module
    default: MockUnitConverterClass, // 將mock類別設置為 default export
  };
});

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

    // .mockClear() 只適用於 Mock Functions（即 jest.fn() 或 jest.spyOn() 創建的 mock 函數）。
    // UnitConverter.mockClear();

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
    // 確保只調用條件式內的spyOn上的 mockRestore
    // if(consoleWarnSpy){
    //   consoleWarnSpy.mockRestore();
    // }
    // if(consoleErrorSpy){
    //   consoleErrorSpy.mockRestore();
    // }
    // if(processExitSpy){
    //   processExitSpy.mockRestore();
    // }
    process.argv = originalArgv;
  });



  //  ------------------test ----------------------------------------
  test("當只有一個數值參數時，應使用預設單位進行轉換", async () => {
    process.argv = ["node", "index.js", "100"];

    const expectedResult = "100 cm 等於 1.00000 m";
    
    // 為這一個test UnitConverter instance設定 doConverter 的行為
    UnitConverter.mockImplementationOnce((value, fromUnit, toUnit) => ({
      doConverter: jest.fn().mockReturnValue(expectedResult), // 回傳結果
      value: value,
      fromUnit: fromUnit,
      toUnit: toUnit,
    }));

    await main();

    expect(UnitConverter).toHaveBeenCalledTimes(1);
    expect(UnitConverter).toHaveBeenCalledWith(100, "cm", "m");

    const converterInstance = UnitConverter.mock.instances[0];
    expect(converterInstance.doConverter).toHaveBeenCalledTimes(1);
    expect(converterInstance.doConverter).toHaveBeenCalledWith();

    expect(consoleLogSpy).toHaveBeenCalledTimes(1);
    expect(consoleLogSpy).toHaveBeenCalledWith(expectedResult);

    expect(processExitSpy).not.toHaveBeenCalled();
  });

  test("有足夠且正確參數時，應該呼叫 UnitConverter", async () => {
    // cmd: node index.js 10 ft to m
    process.argv = ["node", "index.js", "10", "ft","to", "m"];

    const expectedResult = "10 ft 等於 3.04800 m";

    UnitConverter.mockImplementationOnce((value, fromUnit, toUnit) => ({
      doConverter: jest.fn().mockReturnValue(expectedResult),
      value: value,
      fromUnit: fromUnit,
      toUnit: toUnit,
    }));

    await main();

    // 創建 UnitConverter instance
    expect(UnitConverter).toHaveBeenCalledTimes(1);

    // UnitConverter constructor應該以正確的參數被呼叫
    expect(UnitConverter).toHaveBeenCalledWith(10, "ft","m");

    // 調用 UnitConverter 實例上的 doConverter 方法
    // 從 `UnitConverter.mock.instances` 中獲取被呼叫的實例
    const converterInstance = UnitConverter.mock.instances[0];
    expect(converterInstance.doConverter).toHaveBeenCalledTimes(1);
    expect(converterInstance.doConverter).toHaveBeenCalledWith();

    // 應該要輸出轉換結果
    expect(consoleLogSpy).toHaveBeenCalledTimes(1);
    expect(consoleLogSpy).toHaveBeenCalledWith(expectedResult);

    // 不應該呼叫 process.exit (表示成功執行)
    expect(processExitSpy).not.toHaveBeenCalled();
  });
})