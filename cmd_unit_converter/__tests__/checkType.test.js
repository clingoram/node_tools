import {expect, jest, test} from "@jest/globals";
import {checkType} from "../index.js";

describe("Sholud run checktype function test",() => {

  test("參數為正值且有轉換單位", () => {
    expect(checkType(10, "m","to",  "ft")).toBe(10);
    expect(checkType(0, "kg", "to", "lb")).toBe(0);
  });

 test("當數值為負數時，應拋出 RangeError", () => {
    expect(() => checkType(-5, "m", "to", "cm"))
      .toThrow(RangeError);
    expect(() => checkType(-5, "m", "to", "cm"))
      .toThrow("數值不能是負數"); // 精確檢查錯誤訊息
  });

  test("當數值為非數字型態時，應拋出 TypeError", () => {
    expect(() => checkType("abc", "m", "to", "ft"))
      .toThrow(TypeError);
    expect(() => checkType("abc", "m", "to", "ft"))
      .toThrow("請確認輸入的數值或單位型態正確。數值必須是數字，單位必須是字串。");

    // NaN 也是非有效數字
    expect(() => checkType(NaN, "cm", "to", "m"))
      .toThrow(TypeError);
    expect(() => checkType(NaN, "cm", "to", "m"))
      .toThrow("請確認輸入的數值或單位型態正確。數值必須是數字，單位必須是字串。");
  });

  test("當 fromUnit 或 toUnit 非字串時，應拋出 TypeError", () => {
    expect(() => checkType(10, null, "to", "ft")) // fromUnit is null
      .toThrow(TypeError);
    expect(() => checkType(10, "m", "to", 123)) // toUnit is number
      .toThrow(TypeError);
  });

  test("當 'to' 關鍵字拼錯或不存在時，應拋出 SyntaxError", () => {
    expect(() => checkType(10, "m", "till", "ft"))
      .toThrow(SyntaxError);
    expect(() => checkType(10, "m", "till", "ft"))
      .toThrow("請在原始單位和目標單位之間使用 'to' 關鍵字。");

    // 測試關鍵字為 undefined 的情況（例如參數數量不足）
    expect(() => checkType(10, "m", undefined, "ft"))
      .toThrow(SyntaxError);
    expect(() => checkType(10, "m", undefined, "ft"))
      .toThrow("請在原始單位和目標單位之間使用 'to' 關鍵字。");
  });
})