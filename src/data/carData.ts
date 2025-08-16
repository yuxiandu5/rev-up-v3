import { CarData } from '../types/carTypes';

export const carData: CarData = {
  BMW: {
    "320i": {
      "2013-2018": {
        image: "/car-sketch/bmw-320i-2013-2018.png",
        hp: 180,
        torque: 270,
        zeroTo100: 7.3,
        handling: 6.5,
      },
      "2019-2025": {
        image: "/car-sketch/bmw-320i-2019-2025.png",
        hp: 184,
        torque: 290,
        zeroTo100: 7.1,
        handling: 6.7,
      },
    },
    "420i": {
      "2013-2018": {
        image: "/car-sketch/bmw-4-2014.png",
        hp: 184,
        torque: 270,
        zeroTo100: 7.5,
        handling: 7.2,
      },
      "2019-2025": {
        image: "/car-sketch/bmw-4-2021-2025.png",
        hp: 255,
        torque: 400,
        zeroTo100: 5.8,
        handling: 7.5,
      },
    },
    "520i": {
      "2013-2018": {
        image: "/car-sketch/bmw-520i-2017.png",
        hp: 184,
        torque: 290,
        zeroTo100: 8.0,
        handling: 6.8,
      },
    },
  },
  Mercedes: {
    C300: {
      "2013-2018": {
        image: "/car-sketch/mercedes-c300-coupe-2016-2023.png",
        hp: 255,
        torque: 370,
        zeroTo100: 6.0,
        handling: 7.5,
      },
    },
  },
  Audi: {
    "A5-45": {
      "2017-2024": {
        image: "/car-sketch/audi-a5-45-2017-2024.png",
        hp: 248,
        torque: 370,
        zeroTo100: 6.0,
        handling: 7.3,
      },
    },
    "A7-45": {
      "2017-2024": {
        image: "/car-sketch/audi-a7-2017.png",
        hp: 340,
        torque: 500,
        zeroTo100: 5.3,
        handling: 7.8,
      },
    },
    RS3: {
      "2017-2024": {
        image: "/car-sketch/audi-rs3-2017.png",
        hp: 401,
        torque: 480,
        zeroTo100: 3.8,
        handling: 8.5,
      },
    },
  },
  Porsche: {
    "911-GT3-RS": {
      "2013-2018": {
        image: "/car-sketch/porsche-gt3-rs-2021.png",
        hp: 520,
        torque: 470,
        zeroTo100: 3.2,
        handling: 9.5,
      },
    },
  },
};
