// ES Modules
import {expect, jest, test} from "@jest/globals";
import UnitConverter from "../converter/UnitConverter.js"
import { main } from "../index.js";

// UnitConverter和它的method不能共用同一個 mockFn
const mockUnitConverterConstructor = jest.fn();
// 模擬 doConverter
const mockDoConverterMethod = jest.fn();

// 模擬 UnitConverter 回傳的結果
jest.mock("../converter/UnitConverter.js", () => {
  return mockUnitConverterConstructor.mockImplementation(() => {
    return {
      value: 0,
      fromUnit: "",
      toUnit: "",
      // 建立 Mock Functions
      doConverter: mockDoConverterMethod
    };
  });
});

// 說明單元測試，類似群組的概念，將多個 test 包在一起，讓程式看起來更有結構性。
describe("Run main function test",() => {
  let consoleLogSpy;
  let consoleWarnSpy;
  let processExitSpy;
  let originalArgv; // 用於儲存原始的 process.argv

  // 只需要在開始前後（所有 test 執行前後）執行一次就好
  beforeAll(() => {
    // 儲存原始的 process.argv
    originalArgv = process.argv;
  });

  // 在每一個 test 前都會先執行 beforeEach，test 後都會執行 afterEach
  // 每次測試前，模擬 console 方法和 process.exit
  beforeEach(() => {
    // spy 監聽一個真實的物件或函數。不會改變真實物件的行為，但會記錄該物件上方法被呼叫的資訊（例如被呼叫了多少次，參數是什麼）。
    consoleLogSpy = jest.spyOn(console, "log").mockImplementation(() => {});
    consoleWarnSpy = jest.spyOn(console, "warn").mockImplementation(() => {});

    // 模擬 process.exit，並確保它拋出錯誤以中斷測試，而不是真的退出 Node 進程
    processExitSpy = jest.spyOn(process, "exit").mockImplementation((errorCode) => {
      throw new Error(`process.exit: ${errorCode}`); // 拋出錯誤來停止測試
    });

    // 清除 UnitConverter 的 mock 構造函數的呼叫紀錄
    mockUnitConverterConstructor.mockClear();
    // 清除 doConverter 方法的呼叫紀錄
    mockDoConverterMethod.mockClear();
  });

  // 每次測試後，恢復 console 方法和 process.exit
  afterEach(() => {
    consoleLogSpy.mockRestore();
    consoleWarnSpy.mockRestore();
    processExitSpy.mockRestore();

    // 恢復 process.argv 到其原始值
    process.argv = originalArgv;

    mockUnitConverterConstructor.mockRestore();
    mockDoConverterMethod.mockRestore();
  });

  // -------------------------------
  // test
  test("沒有參數時，顯示showDescriptions涵式說明", async () => {
    // 模擬cmd參數：只有 node 和 index.js (沒有value)
    process.argv = ["node", "index.js"];

    // main 函式在呼叫 process.exit 時拋出錯誤
    await expect(main()).rejects.toThrow("process.exit: 1");
    // 呼叫 showDescriptions
    // showDescriptions 會呼叫 console.warn，檢查 console.warn
    expect(consoleWarnSpy).toHaveBeenCalledWith(expect.stringContaining("請使用以下指令："));
    expect(consoleWarnSpy).toHaveBeenCalledTimes(5);

    expect(processExitSpy).toHaveBeenCalledWith(1);

    // 檢查 doConverter 是否被調用
    // 在這測試中，因為沒有足夠的參數觸發轉換邏輯，所以 doConverter 不應該被調用
    expect(mockDoConverterMethod).not.toHaveBeenCalled();
    expect(mockUnitConverterConstructor).not.toHaveBeenCalled();
  });

  // 驗證 UnitConverter 及其 doConverter 被調用的情況
  test.only("有足夠且正確參數時，應該呼叫 UnitConverter 和 doConverter", async () => {
    // cmd: node index.js 10 ft to m
    process.argv = ["node", "index.js", "10", "ft" ,"m"];

    // 模擬 doConverter 返回一個特定結果
    mockDoConverterMethod.mockReturnValue("10 ft 等於 3.04800 m");

    // 有足夠的參數，應該要能夠成功執行
    await main();

    // 應該創建 UnitConverter 實例
    expect(mockUnitConverterConstructor).toHaveBeenCalledTimes(1);
    // 應該調用 UnitConverter 實例上的 doConverter 方法
    expect(mockDoConverterMethod).toHaveBeenCalledTimes(1);
    expect(mockDoConverterMethod).toHaveBeenCalledWith(10, "ft", "m");

    // 應該輸出轉換結果
    expect(consoleLogSpy).toBeCloseTo("10 ft 等於 3.04800 m");
    expect(processExitSpy).not.toHaveBeenCalled();

  });

  
})