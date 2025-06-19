// ES Modules
import {expect, jest, test} from "@jest/globals";
import  {main}  from "../index.js";

// 模擬 UnitConverter 的建構子和 doConverter 方法
// mockDoConverterMethod 用於 mock UnitConverter 實例上的 doConverter
const mockDoConverterMethod = jest.fn();

// 模擬 UnitConverter 回傳的結果
const mockUnitConverterConstructor = jest.fn((value, fromUnit, toUnit) => ({
  //  當 new UnitConverter() 被呼叫時，它會返回這個物件
  doConverter: mockDoConverterMethod,
  // 假設 UnitConverter 的建構子會設定這些屬性
  value: value,
  fromUnit: fromUnit,
  toUnit: toUnit
}));
// 模擬 UnitConverter
jest.mock("../converter/UnitConverter.js", () => {
  return mockUnitConverterConstructor;
});


// 說明單元測試，類似群組的概念，將多個 test 包在一起，讓程式看起來更有結構性。
describe("Run main function test",() => {
  let consoleLogSpy;
  let consoleWarnSpy;
  let consoleErrorSpy;
  let processExitSpy;
  let originalArgv; // 用於儲存原始的 process.argv

  // 只需要在開始前後（所有 test 執行前後）執行一次就好
  // 專用來處理一次性、高成本的設定
  // 只需要在整個測試套件開始前連接一次資料庫、啟動一次伺服器，或載入一次大型設定檔。
  beforeAll(() => {
    // 儲存原始的 process.argv
    originalArgv = process.argv;
  });
  afterAll(() => {
    // 在所有測試案例執行完畢之後，恢復原始的 process.argv
    process.argv = originalArgv;
    // 確保所有 Jest mock 都被恢復，防止影響其他測試文件
    jest.restoreAllMocks();
  });

  // 在每一個 test 前都會先執行 beforeEach，test 後都會執行 afterEach，因此有幾個test就會執行幾次beforeEach
  // 每次測試前，模擬 console 方法和 process.exit
  beforeEach(() => {
    // spy 監聽一個真實的物件或函數。不會改變真實物件的行為，但會記錄該物件上方法被呼叫的資訊（例如被呼叫了多少次，參數是什麼）。
    consoleLogSpy = jest.spyOn(console, "log").mockImplementation(() => {});
    consoleWarnSpy = jest.spyOn(console, "warn").mockImplementation(() => {});
    consoleErrorSpy = jest.spyOn(console, "error").mockImplementation(() => {});
    // 模擬 process.exit，並確保它拋出錯誤以中斷測試，而不是真的退出 Node 進程
    processExitSpy = jest.spyOn(process, "exit").mockImplementation((errorCode) => {
      // 拋出錯誤來停止測試
      throw new Error(`process.exit: ${errorCode}`); 
    });

    // 清除 UnitConverter 的 mock 構造函數的呼叫紀錄
    mockUnitConverterConstructor.mockClear();
    // 清除 doConverter 方法的呼叫紀錄
    mockDoConverterMethod.mockClear();

    // 每次測試前重置 process.argv，確保測試獨立性
    process.argv = [...originalArgv]; // 使用 spread operator 創建一個新的陣列副本
  });

  // 每次測試後，恢復 console 方法和 process.exit
  afterEach(() => {
    consoleLogSpy.mockRestore();
    consoleWarnSpy.mockRestore();
    consoleErrorSpy.mockRestore();
    processExitSpy.mockRestore();

    // 恢復 process.argv 到其原始值
    process.argv = originalArgv;
  });

  // -------------------------------
  // test
   // 驗證 UnitConverter 及其 doConverter 被調用的情況
  test("有足夠且正確參數時，應該呼叫 UnitConverter", async () => {
    // cmd: node index.js 10 ft to m
    // 設置 process.argv 來模擬命令列輸入
    process.argv = ["node", "index.js", "10", "ft", "m"];

    // 模擬 doConverter 返回一個特定結果
    const expectedResult = "10 ft 等於 3.04800 m";
    mockDoConverterMethod.mockResolvedValue(expectedResult);

    // 呼叫 main 函式
    await main();

    // FIXME: line 96 報錯 表示這個 mockUnitConverterConstructor沒有被呼叫
    // 應該創建 UnitConverter 實例
    expect(mockUnitConverterConstructor).toHaveBeenCalledTimes(1);
    //  UnitConverter 建構子應該以正確的參數被呼叫
    // 這裡根據你 UnitConverter 建構子的實際參數順序來斷言
    expect(mockUnitConverterConstructor).toHaveBeenCalledWith(10, "ft","m");

    // 應該調用 UnitConverter 實例上的 doConverter 方法
    //已經 mock 了 UnitConverter 的實例，所以直接檢查 mockDoConverterMethod
    expect(mockDoConverterMethod).toHaveBeenCalledTimes(1);
    expect(mockDoConverterMethod).toHaveBeenCalledWith();

    // 應該輸出轉換結果
    expect(consoleLogSpy).toHaveBeenCalledTimes(1);
    expect(consoleLogSpy).toHaveBeenCalledWith(expectedResult);

    // 不應該呼叫 process.exit (表示成功執行)
    expect(processExitSpy).not.toHaveBeenCalled();

  });

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
    // 因為沒有足夠的參數觸發轉換邏輯，所以 doConverter 不應該被調用
    expect(mockDoConverterMethod).not.toHaveBeenCalled();
    expect(mockUnitConverterConstructor).not.toHaveBeenCalled();
  });

  // 新增一個測試：測試只有一個參數（預設轉換）的情況
  test("當只有一個數值參數時，應使用預設單位進行轉換", async () => {
    // cmd: node index.js 100
    process.argv = ["node", "index.js", "100"];

    const expectedResult = "100 cm 等於 1.00000 m";
    mockDoConverterMethod.mockResolvedValue(expectedResult); // 假設預設轉換結果

    await main();

     // FIXME: line 147 報錯 表示這個 mockUnitConverterConstructor沒有被呼叫
    // 應該創建 UnitConverter 實例一次
    expect(mockUnitConverterConstructor).toHaveBeenCalledTimes(1);
    // UnitConverter 建構子應該以正確的預設參數被呼叫：100, "cm", "m"
    expect(mockUnitConverterConstructor).toHaveBeenCalledWith(100, "cm", "m");

    // 應該調用 UnitConverter 實例上的 doConverter 方法一次
    expect(mockDoConverterMethod).toHaveBeenCalledTimes(1);
    expect(mockDoConverterMethod).toHaveBeenCalledWith();

    // 應該輸出轉換結果
    expect(consoleLogSpy).toHaveBeenCalledTimes(1);
    expect(consoleLogSpy).toHaveBeenCalledWith(expectedResult);

    // 不應該呼叫 process.exit
    expect(processExitSpy).not.toHaveBeenCalled();
  });
})