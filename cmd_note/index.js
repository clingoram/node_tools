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
 * 建立id序號
 */
function createId(){
  let startId = 0;
  let notesList = loadNotes();
  // TODO: 判斷現有筆記有幾則
  // console.log(Object.keys(notesList).length);


  // if(notesList.length === 0){
  //   startId = 1;
  // }else{
  //   startId++;
  // }
  // return startId;
}

/**
 * create a note
 * 
 * @param {string} title 
 * @param {string} content 
 */
async function createNote(title,content){
  let now = new Date();
  let createDate = now.toDateString();
  let id = createId();

  // 陣列
  // const notes = await loadNotes();
  // // 物件
  // const newNote = { id, title, createDate, content};
  // // 將物件加入到陣列中
  // notes.push(newNote);
  // // 陣列轉成json
  // await saveNote(notes);

  // console.log(`筆記 "${title}" 已成功儲存。`);
}

/**
 * Save a note.
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
  // console.log(notesList);
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
  const find = note.find(({title}) => title === noteTitle);
  if(find){
    console.log(`- ${find.title},${find.createDate} -\n${find.content}`);
  }else{
    console.log(`找不到標題 ${noteTitle} 的筆記`);
  }
}

/**
 * 
 * @param {number} id 
 */
async function deleteNote(id){
  // TODO: 增加刪除筆記功能
}

/**
 * 檢查參數型態
 * @param {string} param 
 * @returns {boolean}
 */
function checkParam(param){
  if(typeof param  === "string" || param instanceof String){
    return true;
  }
  return false;
}

// main
async function main(){

  const choices = ["新增筆記","列出所有筆記","查找筆記","離開"];

  if(process.argv.length < 3){
    console.log("請使用以下指令：");
    console.log("新增筆記 -  add <標題> <內容>");
    console.log("檢視所有筆記 -  list");
    console.log("查找筆記 -  find <標題>");
    return;
  }
  const command = process.argv[2];
  const title = process.argv[3];
  const checkType = checkParam(title)

  if(command === "add" && checkType){
  
    // 新增筆記
    const content = process.argv.slice(4).join(" ");
    // FIXME: 檢查輸入值型別,是否為空
    if(content !== null || content !== undefined){
      createNote(title,content);
    }else{
      console.log("請輸入筆記內容");
    }

  }else if(command === "list"){
    // 檢視所有筆記
    await listNotes();

  }else if(command === "find" && checkType){
    // 搜尋某筆記是否存在
    await searchNote(title);
  }else{
    console.log("請使用 add ,list 或 find");
  }
}
main();