import * as fs from "node:fs/promises";
import * as path from "node:path"; 
import { select,input } from "@inquirer/prompts";

const file = "notes.json";

async function loadNotes(){
  try {
    // 檢查檔案是否存在，如果存在則讀取內容
    const data = await fs.readFile(file, "utf8");
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
 * create a note
 * 
 * @param {string} title 
 * @param {string} content 
 */
async function createNote(title,content){
  let now = new Date();
  let createDate = now.toDateString();
  // let id = Date.now();

  // 陣列
  const notes = await loadNotes();
  // 物件
  const newNote = {title, createDate, content };
  // 將物件加入到陣列中
  notes.push(newNote);
  // 陣列轉成json
  await saveNote(notes);

  console.log(`筆記 "${title}" 已成功儲存。`);
}

/**
 * Save a note.
 * @param {*} notes 
 */
async function saveNote(notes){
  try {
    const data = JSON.stringify(notes, null, 2);
    await fs.writeFile(file, data, "utf8");
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
    console.log(`- Created At: ${element.createDate} ${element.title}`)
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
  let notes = await loadNotes();


  while(true){
    const answer = await select({
      message: '請選擇',
      choices: [
        {
          name: '新增筆記',
          value: 'add',
          description: 'Create a new note.',
        },
        {
          name: '列出所有筆記',
          value: 'list',
          description: 'Show all notes.',
        },
        {
          name: '查找筆記',
          value: 'search',
          description: 'Find a note if exist.',
        },
        {
          name: "離開",
          value: 'exit',
          description: 'Leave the command note tool.'
        }
      ],
    });
  
    console.log(answer.choices);

    // switch(answer.choices) {
    //   case '新增筆記':
    //     await addNote(notes);
    //     break;
    //   case '列出所有筆記':
    //     await listNotes(notes);
    //     break;
    //   case '刪除筆記':
    //     await deleteNote(notes);
    //     break;
    //   case '離開':
    //     console.log('感謝使用簡易筆記工具！');
    //     return;
    // }
  }
}

// async function main(){

//   const choices = ["新增筆記","列出所有筆記","查找筆記","離開"];

//   if(process.argv.length < 3){
//     console.log("請使用以下指令：");
//     console.log("新增筆記 -  add <標題> <內容>");
//     console.log("檢視所有筆記 -  list");
//     console.log("查找筆記 -  find <標題>");
//     return;
//   }
//   const command = process.argv[2];
//   const title = process.argv[3];
//   const checkType = checkParam(title)

//   if(command === "add" && checkType){
//     // 新增筆記
//     const content = process.argv.slice(4).join(" ");
//     if(content !== null || content !== undefined){
//       createNote(title,content);
//     }else{
//       console.log("請輸入筆記內容");
//     }

//   }else if(command === "list"){
//     // 檢視所有筆記
//     await listNotes();

//   }else if(command === "find" && checkType){
//     // 搜尋某筆記是否存在
//     await searchNote(title);
//   }else{
//     console.log("請使用 add ,list 或 find");
//   }
// }
main();