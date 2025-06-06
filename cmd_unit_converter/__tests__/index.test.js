
// import {describe, expect, test} from '@jest/globals';
// import {showDescriptions} from '../index';
import {UnitConverter} from "../converter/converter";

// 說明單元測試，類似群組的概念，將多個 test 包在一起，讓程式看起來更有結構性。
describe('Run test',() => {
  let convertData;

  // beforeEach 會在每個測試案例執行前運行
  // 這是初始化測試環境的理想場所，確保每個測試案例都是獨立的
  beforeEach(() => {
    cart = new UnitConverter(); // 為每個測試建立一個全新的實例
  });

  // test定義一個單元測試
  // 測試 cm to m 方法。cenimeterToMetetr()
  test('shlud convert cm to m', () => {
    convertData.cenimeterToMetetr();
    expect(convertData).toBe(0.1)
  });
})