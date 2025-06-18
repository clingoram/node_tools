import {expect, jest, test} from "@jest/globals";
import {checkType} from "../index.js";

describe("Sholud run checktype function test",() => {
  let consoleWarnSpy;

  beforeEach(() => {
    consoleWarnSpy = jest.spyOn(console, "warn").mockImplementation(() => {});
  });
  afterEach(() => {
    consoleWarnSpy.mockRestore();
    // consoleWarnSpy.mockClear();
  });

  test("參數為正值且有轉換單位", () => {
    expect(checkType(10, "m","to",  "ft")).toBe(10);
    expect(checkType(0, "kg", "to", "lb")).toBe(0);
  });

  test("負數該回傳null", () => {
    expect(checkType(-5, "m","to", "cm")).toBeNull();
    expect(consoleWarnSpy).toHaveBeenCalledWith("範圍錯誤: 不能是負數");
    expect(consoleWarnSpy).toHaveBeenCalledTimes(1);
  });

  test("非數值value，回傳null", () => {
    // 2個測試參數，因此呼叫2次
    expect(checkType("abc", "m","to" ,"ft")).toBeNull();
    expect(checkType("12","cm","to","m")).toBeNull();
    expect(consoleWarnSpy).toHaveBeenCalledWith("型態錯誤: 請確認輸入數值或字串");
    expect(consoleWarnSpy).toHaveBeenCalledTimes(2);
  });

  // "to" 拼錯
  test("若too拼錯，顯示錯誤訊息", () => {
    expect(checkType(10,"m","till","ft")).toBeNull();
    expect(consoleWarnSpy).toHaveBeenCalledWith("錯誤： 請在原始單位和目標單位之間使用 'to' 關鍵字。")
    expect(consoleWarnSpy).toHaveBeenCalledTimes(1);
  });
})