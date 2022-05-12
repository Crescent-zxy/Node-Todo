const db = require("./db.js");
const inquirer = require("inquirer");

const add = async (title) => {
  const list = await db.read();
  list.push({ title, done: false });
  await db.write(list);
};

const clear = async () => {
  await db.write([]);
};

const markAsDone = async (list, index) => {
  list[index].done = true;
  await db.write(list);
  showAll();
};

const markAsUndone = async (list, index) => {
  list[index].done = false;
  await db.write(list);
  showAll();
};

const updateTitle = (list, index) => {
  inquirer
    .prompt({
      type: "input",
      name: "title",
      message: "新的标题",
      default: list[index].title,
    })
    .then(async (answer) => {
      list[index].title = answer.title;
      await db.write(list);
      showAll();
    });
};

const remove = async (list, index) => {
  list.splice(index, 1);
  await db.write(list);
  showAll();
};

const askForAction = (list, index) => {
  const actions = { markAsDone, markAsUndone, updateTitle, remove };
  inquirer
    .prompt({
      type: "list",
      name: "action",
      message: "请选择操作",
      choices: [
        { name: "退出", value: "quit" },
        { name: "已完成", value: "markAsDone" },
        { name: "未完成", value: "markAsUndone" },
        { name: "改标题", value: "updateTitle" },
        { name: "删除", value: "remove" },
      ],
    })
    .then((answer) => {
      const action = actions[answer.action];
      action && action(list, index);
    });
};

const askForCreateTask = (list) => {
  inquirer
    .prompt({
      type: "input",
      name: "title",
      message: "输入任务标题",
    })
    .then((answer) => {
      list.push({
        title: answer.title,
        done: false,
      });
      db.write(list).then(showAll());
    });
};

const printTask = (list) => {
  inquirer
    .prompt({
      type: "list",
      name: "index",
      message: "请选择你想操作的任务",
      choices: [
        { name: "退出", value: "-1" },
        ...list.map((task, index) => ({
          name: `${task.done ? "[x]" : "[_]"} ${index + 1} - ${task.title}`,
          value: index.toString(),
        })),
        { name: "+ 创建任务", value: "-2" },
      ],
    })
    .then((answer) => {
      const index = parseInt(answer.index);
      if (index >= 0) {
        askForAction(list, index);
      } else if (index === -2) {
        askForCreateTask(list);
      }
    });
};

const showAll = async (title) => {
  const list = await db.read();
  printTask(list);
};

module.exports = { add, clear, showAll };
