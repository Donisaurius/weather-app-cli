import dotenv from "dotenv";
dotenv.config();

import {
  inquirerMenu,
  listSites,
  pause,
  readInput,
} from "./helpers/inquirer.js";
import Searches from "./models/searches.js";

const main = async () => {
  let opt = 0;
  const searches = new Searches();

  do {
    const menu = await inquirerMenu();
    opt = menu;

    switch (opt) {
      case 1:
        //Mostrar msg para escribir
        const site = await readInput("Ciudad: ");

        //Buscar lugar
        const sites = await searches.town(site);
        //Mostrar los lugares

        //Seleccionar el lugar
        const id = await listSites(sites);

        if (id === "0") continue;

        const siteSelected = sites.find((site) => site.id === id);
        //Guardar en db
        searches.addHistory(siteSelected.name);

        //Con el lugar mostrar el clima

        const { description, temp, min, max } = await searches.weatherByTown(
          siteSelected.lat,
          siteSelected.lng
        );

        console.clear();
        console.log("\nInformación de la ciudad\n".green);
        console.log("Ciudad:", siteSelected.name);
        console.log("Lat:", siteSelected.lat);
        console.log("Lng:", siteSelected.lng);
        console.log("Temperatura: ", temp);
        console.log("Min: ", min);
        console.log("Max: ", max);
        console.log("Hoy tenemos: ", description);
        break;

      case 2:
        searches.capitalizeHistory.forEach((search, i) => {
          const idx = `${i + 1}`.green;
          console.log(`${idx}. ${search}`);
        });
        break;
    }

    if (opt !== 0) await pause();
  } while (opt !== 0);
};

main();
