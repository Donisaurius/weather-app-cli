import inquirer from "inquirer";
import "colors";

const questions = [
  {
    type: "list",
    name: "options",
    message: "¿Que desea hacer?",
    choices: [
      {
        value: 1,
        name: `${"1.".bgGreen} Buscar ciudad`,
      },
      {
        value: 2,
        name: `${"2.".bgGreen} Historial`,
      },
      {
        value: 0,
        name: `${"0.".bgGreen} Salir`,
      },
    ],
  },
];

const pauseMenu = [
  {
    type: "input",
    name: "pause",
    message: `\nPRESIONE ${"ENTER".green} PARA CONTINUAR`,
  },
];

export const inquirerMenu = async () => {
  // console.clear();
  console.log("========================".green);
  console.log(" Selecciones una opción".white);
  console.log("========================".green);

  const { options } = await inquirer.prompt(questions);
  return options;
};

export const readInput = async (message) => {
  const question = [
    {
      type: "input",
      name: "desc",
      message,
      validate(value) {
        if (!value.length) {
          return "Por favor ingrese un valor";
        }
        return true;
      },
    },
  ];

  const { desc } = await inquirer.prompt(question);

  return desc;
};

export const listSites = async (sites = []) => {
  const questions = [
    {
      type: "list",
      name: "id",
      message: "Seleccione dirección",
    },
  ];
  const choices = [];

  sites.forEach((site, index) => {
    const ch = {
      value: site.id,
      name: `${(index + 1).toString().green}. ${site.name}`,
    };

    choices.push(ch);
  });

  choices.unshift({
    value: "0",
    name: "0. ".green + "Cancelar",
  });
  questions[0].choices = choices;

  const { id } = await inquirer.prompt(questions);
  return id;
};

export const showChecklist = async (todos = []) => {
  const choices = todos.map((todo, index) => {
    const ch = {
      value: todo.id,
      name: `${(index + 1).toString().green}. ${todo.description}`,
      checked: todo.finishedAt ? true : false,
    };

    return ch;
  });

  const questions = [
    {
      type: "checkbox",
      name: "ids",
      message: "¿Cual tarea desea completar?",
      choices,
    },
  ];

  const { ids } = await inquirer.prompt(questions);
  return ids;
};

export const confirm = async (message) => {
  const question = [
    {
      type: "confirm",
      name: "ok",
      message,
    },
  ];

  const { ok } = await inquirer.prompt(question);
  return ok;
};

export const pause = async () => {
  const pause = await inquirer.prompt(pauseMenu);

  return pause;
};
