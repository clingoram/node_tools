import { expect, jest, test } from "@jest/globals";
import { main } from "../index.js";
import { UnitConverter }  from "../converter/UnitConverter.js";

// ---
// 1. **最優先：確保 jest.mock 設置在所有相關 import 之前**
// 這是 ES Modules 中 Jest 模擬的關鍵。
// 當你的主程式碼 (index.js) 執行 `import UnitConverter from "../converter/UnitConverter.js";` 時，
// Jest 會用這個工廠函數返回的內容來替換真正的 UnitConverter。
jest.mock("../converter/UnitConverter.js", () => {
  // 創建一個 Jest 模擬函數作為 UnitConverter 類別的替身。
  // 這個模擬函數將具有 Jest 的所有模擬方法（如 .mockClear(), .toHaveBeenCalledWith() 等）。
  const MockUnitConverterClass = jest.fn((value, fromUnit, toUnit) => ({
    // 當這個模擬類別被 `new` 時，它會返回一個物件。
    // 這個物件應該包含所有你預期在 UnitConverter 實例上會呼叫的方法，例如 doConverter。
    doConverter: jest.fn(), // 每個實例都有自己獨立的 doConverter mock
    // 你也可以在這裡設置其他屬性，如果你的測試需要檢查它們
    value: value,
    fromUnit: fromUnit,
    toUnit: toUnit,
  }));
  // 對於 ES Modules 的 `default export`，我們需要回傳一個物件，
  // 其中包含 `__esModule: true` 和 `default` 屬性。
  return {
    __esModule: true,
    default: MockUnitConverterClass, // 將我們創建的 jest.fn() 作為 default export
  };
});



describe("Run main function test",() => {
  // let consoleLogSpy;
  let consoleWarnSpy;
  let consoleErrorSpy;
  let processExitSpy;
  let originalArgv; // 用於儲存原始的 process.argv

  beforeAll(() => {
    originalArgv = process.argv;
  });

  afterAll(() => {
    process.argv = originalArgv;
    jest.restoreAllMocks(); // 確保所有 Jest mock 都被恢復，防止影響其他測試文件
  });

  beforeEach(() => {

    UnitConverter.mockClear();

    // consoleLogSpy = jest.spyOn(console, "log").mockImplementation(() => {});
    consoleWarnSpy = jest.spyOn(console, "warn").mockImplementation(() => {});
    consoleErrorSpy = jest.spyOn(console, "error").mockImplementation(() => {});
    processExitSpy = jest.spyOn(process,"exit").mockImplementation(() => {});


    jest.clearAllMocks();

    process.argv = [...originalArgv]; // 每次測試前重置 process.argv，確保測試獨立性
  });

  afterEach(() => {
    // consoleLogSpy.mockRestore();
    consoleWarnSpy.mockRestore();
    consoleErrorSpy.mockRestore();
    processExitSpy.mockRestore();
    process.argv = originalArgv;
  });


  test("有足夠且正確參數時，應該呼叫 UnitConverter", async () => {
    // cmd: node index.js 10 ft to m
    process.argv = ["node", "index.js", "10", "ft","to", "m"];

    const expectedResult = "10 ft 等於 3.04800 m";

    UnitConverter.mockImplementationOnce((value, fromUnit, toUnit) => ({
      doConverter: jest.fn().mockResolvedValue(expectedResult),
      value: value,
      fromUnit: fromUnit,
      toUnit: toUnit,
    }));

    await main();

    // 應該創建 UnitConverter 實例
    expect(UnitConverter).toHaveBeenCalledTimes(1);

    // UnitConverter 建構子應該以正確的參數被呼叫
    expect(UnitConverter).toHaveBeenCalledWith(10, "ft","m");

    // 應該調用 UnitConverter 實例上的 doConverter 方法
    // 從 `UnitConverter.mock.instances` 中獲取被呼叫的實例
    const converterInstance = UnitConverter.mock.instances[0];
    expect(converterInstance.doConverter).toHaveBeenCalledTimes(1);
    expect(converterInstance.doConverter).toHaveBeenCalledWith();

    // 應該輸出轉換結果
    expect(consoleLogSpy).toHaveBeenCalledTimes(1);
    expect(consoleLogSpy).toHaveBeenCalledWith(expectedResult);

    // 不應該呼叫 process.exit (表示成功執行)
    expect(processExitSpy).not.toHaveBeenCalled();
  });

  test("沒有參數時，顯示showDescriptions涵式說明", async () => {
    process.argv = ["node", "index.js"];

    await main();

    expect(consoleWarnSpy).toHaveBeenCalledWith(expect.stringContaining("請使用以下指令："));
    expect(consoleWarnSpy).toHaveBeenCalledTimes(5);

    expect(processExitSpy).toHaveBeenCalledWith(1);
    expect(processExitSpy).toHaveBeenCalledTimes(1);

    expect(UnitConverter).not.toHaveBeenCalled();
  });


  test("當只有一個數值參數時，應使用預設單位進行轉換", async () => {
    process.argv = ["node", "index.js", "100"];

    const expectedResult = "100 cm 等於 1.00000 m";
    // 同樣地，為這次測試的 UnitConverter 實例化設定 doConverter 的行為
    UnitConverter.mockImplementationOnce((value, fromUnit, toUnit) => ({
      doConverter: jest.fn().mockResolvedValue(expectedResult),
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
});