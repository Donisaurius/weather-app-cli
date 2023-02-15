import fs from "fs";
import axios from "axios";

export default class Searches {
  history = [];
  dbPath = "./db/db.json";

  constructor() {
    //TODO: Leer db si existe
    this.readDb();
  }

  get capitalizeHistory() {
    return this.history.map((history) => {
      let words = history.split(" ");

      words = words.map((word) => word[0].toUpperCase() + word.substring(1));

      return words.join(" ");
    });
  }

  get paramsMapBox() {
    return {
      access_token: process.env.MAPBOX_KEY,
      language: "es",
    };
  }

  get paramsWeather() {
    return { appid: process.env.OPENWEATHER_KEY, lang: "es" };
  }

  async town(direction = "") {
    try {
      const instance = axios.create({
        baseURL: `https://api.mapbox.com/geocoding/v5/mapbox.places/${direction}.json`,
        params: this.paramsMapBox,
      });

      const { data } = await instance.get();

      if (!data.features.length) return [];

      return data.features.map((feat) => {
        return {
          id: feat.id,
          name: feat.place_name,
          lng: feat.center[0],
          lat: feat.center[1],
        };
      });
    } catch (error) {
      return []; //Lugares con coincidan
    }
  }

  async weatherByTown(lat, lon) {
    try {
      const instance = axios.create({
        baseURL: "https://api.openweathermap.org/data/2.5/weather",
        params: {
          lat,
          lon,
          ...this.paramsWeather,
        },
      });

      const { data } = await instance.get();
      const { weather, main } = data;
      const { temp_min: min, temp_max: max, temp } = main;

      return {
        description: weather[0].description,
        temp,
        min,
        max,
      };
    } catch (error) {
      return {};
    }
  }

  async addHistory(site = "") {
    //TODO: prevenir duplicado

    if (this.history.includes(site.toLowerCase())) {
      return;
    }

    this.history.unshift(site.toLowerCase());
    this.saveDb();
  }

  saveDb() {
    const payload = {
      history: this.history,
    };

    fs.writeFileSync(this.dbPath, JSON.stringify(payload));
  }

  readDb() {
    //Debe existir...
    const info = fs.readFileSync(this.dbPath, {
      encoding: "utf-8",
    });

    if (!info) return;
    //Si existe cargar la informacion

    const { history } = JSON.parse(info);

    this.history = [...history];
  }
}
