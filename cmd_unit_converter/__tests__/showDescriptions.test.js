import {expect, jest, test} from "@jest/globals";
import {showDescriptions} from "../index.js";

/**
 * 測試說明涵式
 */
describe("Run showDescriptions function",() => {
  let consoleLogSpy;
  let consoleWarnSpy;
  
  beforeEach(() => {
    // console.log
    consoleLogSpy = jest.spyOn(console, "log").mockImplementation(() => {});
    // console.warn
    consoleWarnSpy = jest.spyOn(console, "warn").mockImplementation(() => {});
    // 模擬 process.exit，並確保它拋出錯誤以中斷測試流，而不是真的退出 Node 進程
    processExitSpy = jest.spyOn(process, "exit").mockImplementation((code) => {
      throw new Error(`process.exit: ${code}`); // 拋出錯誤來停止測試
    });
  });
  afterEach(() => {
    consoleLogSpy.mockRestore();
    consoleWarnSpy.mockRestore();
  });

  test("參數不足時，顯示showDescriptions涵式", () => {
    const args = []; // 參數不足
    const result = showDescriptions(args);
    expect(result).toBe(true);
    expect(consoleWarnSpy).toHaveBeenCalledWith(expect.stringContaining("請使用以下指令："));
    expect(consoleWarnSpy).toHaveBeenCalledTimes(5);
  });

  // test("若too拼錯，顯示錯誤訊息", () => {
  //   const args = ["10", "m", "tioo", "ft"]; // "to" 拼錯

  //   expect(args[2].toLowerCase()).not.toMatch(/to/);
  //   expect(consoleWarnSpy).toHaveBeenCalledWith(expect.stringContaining("錯誤：請在原始單位和目標單位之間使用 'to' 關鍵字。"));
  //   expect(consoleWarnSpy).toHaveBeenCalledTimes(1);
  //   consoleWarnSpy.mockClear();

  //   // expect(result).toBe(true);
  //   // expect(consoleWarnSpy).toHaveBeenCalledWith(expect.stringContaining("請使用以下指令："));
  //   // expect(consoleWarnSpy).toHaveBeenCalledTimes(5);
  //   // consoleLogSpy.mockClear();
  //   consoleWarnSpy.mockClear();
  // });
})