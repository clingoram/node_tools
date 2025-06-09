import {expect, jest, test} from '@jest/globals';
import {showDescriptions} from "../index.js";

/**
 * 測試說明涵式
 */
describe("Run showDescriptions description function",() => {
  let consoleLogSpy;
  let consoleErrorSpy;
  let consoleWarnSpy;
  let processExitSpy;
  
  beforeEach(() => {
    consoleLogSpy = jest.spyOn(console, 'log').mockImplementation(() => {});
    consoleWarnSpy = jest.spyOn(console, 'warn').mockImplementation(() => {});
    consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
    // 模擬 process.exit，並確保它拋出錯誤以中斷測試流，而不是真的退出 Node 進程
    processExitSpy = jest.spyOn(process, 'exit').mockImplementation((code) => {
      throw new Error(`process.exit: ${code}`); // 拋出錯誤來停止測試
    });
  });
  afterEach(() => {
    consoleLogSpy.mockRestore();
  });

  test('參數不足時，顯示說明涵式', () => {
    const args = []; // 參數不足
    const result = showDescriptions(args);
    expect(result).toBe(true);
    expect(consoleLogSpy).toHaveBeenCalledWith(expect.stringContaining('請使用以下指令：'));
    expect(consoleLogSpy).toHaveBeenCalledTimes(5);
  });

  test('too拼錯', () => {
    const args1 = ['10', 'm', 'tooo', 'ft']; // 'to' 拼錯

    let result = showDescriptions(args1);
    expect(result).toBe(true);
    expect(consoleLogSpy).toHaveBeenCalledWith(expect.stringContaining('請使用以下指令：'));
    consoleLogSpy.mockClear();
  });

  test('參數正確，不會呼叫showDsecription()', () => {
    const args = ['10', 'm', 'to', 'ft'];
    const result = showDescriptions(args);
    expect(result).toBe(false);
    expect(consoleLogSpy).not.toHaveBeenCalled(); 
  });
})