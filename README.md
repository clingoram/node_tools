# node_tools

學習 Node.js 並做成 side-project，目前有兩個小專案，分別是 cmd_note 和 cmd_unit_converter。

<h2>cmd_note</h2>
使用command line，藉由輸入指令在本機端新增、刪除、搜尋、列表JSON檔筆記。
指令：
node index.js list ➡️ 列表現有筆記
node index.js add [標題] [內容] ➡️ 新增筆記
node index.js search [id] ➡️ 搜尋筆記
node index.js delete [id] ➡️ 刪除筆記
<br>
<h2>cmd_unit_converter 單位換算</h2>
使用command line進行單位換算，目前可換算重量、長度。
指令：
node index.js from 數字 原始單位 to 欲轉換單位
EG. node index.js 20 cm to m
⚠️若缺少欲轉換的單位資料則自動帶入預設的。
<h3>測試單一檔案： npm test file_name</h3>
<h3>執行所有測試檔案： npm test</h3>
