// ES Modules
import {expect, jest, test} from '@jest/globals';
import {main,checkType,showDescriptions} from "../index.js";
import UnitConverter from "../converter/UnitConverter.js"

// 模擬 UnitConverter
jest.mock('../converter/UnitConverter.js', () => {
  return jest.fn().mockImplementation(() => {
    return {
      value: 0,
      fromUnit: '',
      toUnit: '',
      doConverter: jest.fn(() => 'Mocked Conversion Result') // 模擬 doConverter 返回一個字串
    };
  });
});

// 說明單元測試，類似群組的概念，將多個 test 包在一起，讓程式看起來更有結構性。
describe('Run main function test',() => {
  let consoleLogSpy;
  let consoleWarnSpy;
  let consoleErrorSpy;
  let processExitSpy;
  let originalArgv; // 用於儲存原始的 process.argv

  beforeAll(() => {
    // 儲存原始的 process.argv
    originalArgv = process.argv;
  });

  beforeEach(() => {
    // 每次測試前，模擬 console 方法和 process.exit
    consoleLogSpy = jest.spyOn(console, 'log').mockImplementation(() => {});
    consoleWarnSpy = jest.spyOn(console, 'warn').mockImplementation(() => {});
    consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
    // 模擬 process.exit，並確保它拋出錯誤以中斷測試流，而不是真的退出 Node 進程
    processExitSpy = jest.spyOn(process, 'exit').mockImplementation((code) => {
      throw new Error(`process.exit: ${code}`); // 拋出錯誤來停止測試
    });

    // 清除 UnitConverter 模擬的呼叫紀錄
    UnitConverter.mockClear();
    // 清除 UnitConverter 實例的 doConverter 呼叫紀錄
    if (UnitConverter.mock.instances[0]) { // 確保實例存在
      UnitConverter.mock.instances[0].doConverter.mockClear();
    }
  });

  afterEach(() => {
    // 每次測試後，恢復 console 方法和 process.exit
    consoleLogSpy.mockRestore();
    consoleWarnSpy.mockRestore();
    consoleErrorSpy.mockRestore();
    processExitSpy.mockRestore();

    // 恢復 process.argv 到其原始值
    process.argv = originalArgv;
  });

  // test
  test('沒有參數時，顯示說明涵式', async () => {
    // 模擬命令行參數：只有 node 和 index.js (沒有使用者輸入)
    process.argv = ['node', 'index.js'];

    // 期望 main 函式在呼叫 process.exit 時拋出錯誤
    await expect(main()).rejects.toThrow('process.exit: 1');

    // 呼叫 showDescriptions
    // showDescriptions 會呼叫 console.log，檢查 console.log
    expect(consoleLogSpy).toHaveBeenCalledWith(expect.stringContaining("請使用以下指令："));
    expect(consoleLogSpy).toHaveBeenCalledTimes(5);
    expect(consoleWarnSpy).not.toHaveBeenCalled();
    expect(consoleErrorSpy).not.toHaveBeenCalled();
    expect(processExitSpy).toHaveBeenCalledWith(1);
    expect(UnitConverter).not.toHaveBeenCalled(); 
  });

})