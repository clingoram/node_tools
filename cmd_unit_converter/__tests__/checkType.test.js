import {expect, jest, test} from '@jest/globals';
import {checkType} from "../index.js";

describe("Sholud run checktype function test",() => {
  let consoleWarnSpy;
  beforeEach(() => {
    consoleWarnSpy = jest.spyOn(console, 'warn').mockImplementation(() => {});
  });
  afterEach(() => {
    consoleWarnSpy.mockRestore();
  });

  test('參數為正值且有轉換單位', () => {
    expect(checkType(10, 'm', 'ft')).toBe(10);
    expect(checkType(0, 'kg', 'lb')).toBe(0);
  });

  test('負數該回傳null', () => {
    expect(checkType(-5, 'm', 'cm')).toBeNull();
    expect(consoleWarnSpy).toHaveBeenCalledWith("範圍錯誤: 不能是負數");
  });

  test('非數值value，回傳null', () => {
    expect(checkType('abc', 'm', 'ft')).toBeNull();
    expect(consoleWarnSpy).toHaveBeenCalledWith("型態錯誤: 請確認輸入數值或字串");
  });
})