import {readFile,writeFile} from "node:fs/promises";

// import * as path from "node:path";
// import { select,input } from "@inquirer/prompts";

const file = "notes.json";

async function loadNotes(){
  try {
    // 檢查檔案是否存在，如果存在則讀取內容
    const data = await readFile(file, {encoding:"utf8"});
    return JSON.parse(data);

  } catch (error) {
    // 如果檔案不存在或內容不是有效的 JSON，返回一個空陣列
    if (error.code === "ENOENT") {
      return [];
    }
    console.error("讀取筆記檔案時發生錯誤:", error);
    process.exit(1);
  }
}

/**
 * 新增筆記
 * 
 * @param {string} title 
 * @param {string} content 
 */
async function createNote(title,content){
  try {
    let now = new Date();
    let createDate = now.toDateString();
    let id = await handleNoteId();

    // 陣列
    const notes = await loadNotes();
    // 物件
    const newNote = { id, title, createDate, content};
    // 將物件加入到陣列中
    notes.push(newNote);
    // 陣列轉成json
    await saveNote(notes);

    console.log(`筆記 "${title}" 已成功儲存。`);
  } catch (error) {
    console.log("發生錯誤",error);
  }
}

/**
 * 儲存筆記.
 * @param {*} notes 
 */
async function saveNote(notes){
  try {
    const data = JSON.stringify(notes, null, 2);
    await writeFile(file, data, {encoding: "utf8"});

  } catch (error) {
    console.error("儲存筆記檔案時發生錯誤:", error);
    process.exit(1);
  }
}

/**
 * Read 
 * 
 * list all notes.
 * @returns 
 */
async function listNotes(){
  const notesList = await loadNotes();

  if(notesList.length === 0){
    console.log("沒有任何筆記");
    return;
  }
  notesList.forEach(element => {
    console.log(`- Created At: ${element.createDate}. Title: ${element.title}`)
  });
}

/**
 * get note title 
 * @param {string} noteTitle 
 */
async function searchNote(noteTitle) {
  const note = await loadNotes();
  // const find = note.find(({title}) => title === noteTitle);
  const find = note.find(({title}) => {
   return title === noteTitle;
  });
  if(find){
    console.log(`- ${find.title},${find.createDate} -\n${find.content}`);
  }else{
    console.log(`找不到標題 ${noteTitle} 的筆記`);
  }
}

/**
 * 刪除筆記
 * 
 * @param {number} id 
 */
async function deleteNoteById(deleteId){
  // [x]: 增加刪除筆記功能(DONE)
  try {
    const note = await loadNotes();
    const find = note.findIndex(({id}) => {
      return id === parseInt(deleteId)
    });
    if(find === -1){
      console.log(`找不到 id 為 ${deleteId} 的資料。`);
      return;
    }
    // 刪除資料
    note.splice(find, 1);
    await saveNote(note);

    console.log(`已成功刪除 id 為 ${deleteId} 的資料。`);
  } catch (error) {
    console.log("發生錯誤。",error);
  }
  
}

/**
 * 建立id序號
 */
async function handleNoteId(){
  const notesList = await loadNotes();
  let startId = 0;
  // [x]: 判斷現有筆記有幾則(DONE)
  return Promise.all([notesList]).then((values) => {
    values.forEach((item) => {
      // 若長度不等於0，則計算目前共有幾筆資料再加1
      if(Object.keys(item).length !== 0){
        startId = Object.keys(item).length + 1;
      }else{
        // 否則以id = 1為起始
        startId = 1;
      }
    })
    return startId;
  });
}


/**
 * 檢查參數型態
 * @param {string} param 
 * @returns {boolean}
 */
function isString(param){
  return typeof param === "string";
}

// main
async function main(){

  if(process.argv.length < 3){
    console.log("請使用以下指令：");
    console.log("新增筆記 -  add <標題> <內容>");
    console.log("檢視所有筆記 -  list");
    console.log("查找筆記 -  find <標題>");
    return;
  }
  
  const command = process.argv[2];
  const title = process.argv[3];
  const checkType = isString(title)

  if(command === "add" && checkType === true){
    // 新增筆記
    const content = process.argv.slice(4).join(" ");

    // [x]: 檢查輸入值型別以及是否為空(DONE)
    if(content.trim() !== "" && title.trim() !== ""){
      await createNote(title,content);
    }else{
      console.log("請輸入標題或筆記內容。");
    }

  }else if(command === "list"){
    // 檢視所有筆記
    await listNotes();

  }else if(command === "find" && checkType){
    // 搜尋某筆記是否存在
    await searchNote(title);

  }else if(command === "delete"){
    // 刪除筆記
    const id = process.argv[3];
    await deleteNoteById(id);

  }else{
    console.log("請使用 add ,list 或 find");
  }
}
main();