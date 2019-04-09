import Product from '../models/product.model';

export const Products: Product[] = [
  {
    "id": 1,
    "title": "Drinks",
    "isCategory": true,
    "categoryId": null,
    "image": "assets/imgs/products/drinks.jpg"
  },
  {
    "id": 101,
    "title": "Coffee",
    "isCategory": true,
    "categoryId": 1,
    "image": "assets/imgs/products/coffee.jpg"
  },
  {
    "id": 101001,
    "title": "Cappuccino",
    "isCategory": false,
    "categoryId": 101,
    "price": 2.80,
    "image": "assets/imgs/products/cappucino.jpg"
  },
  {
    "id": 101002,
    "title": "Espresso",
    "isCategory": false,
    "categoryId": 101,
    "price": 2.20,
    "image": "assets/imgs/products/espresso.jpg"
  },
  {
    "id": 101003,
    "title": "Normal Coffee",
    "isCategory": false,
    "categoryId": 2.50,
    "image": "assets/imgs/products/filtercoffee.jpg"
  },
  {
    "id": 102,
    "title": "Softdrink",
    "isCategory": true,
    "categoryId": 1,
    "image": "assets/imgs/products/softdrink.jpg"
  },
  {
    "id": 102001,
    "title": "Coca Cola",
    "isCategory": false,
    "categoryId": 102,
    "price": 2.7,
    "image": "assets/imgs/products/coke.jpg"
  },
  {
    "id": 102002,
    "title": "Sparkling Water",
    "isCategory": false,
    "categoryId": 102,
    "price": 2.3,
    "image": "assets/imgs/products/sparklingwater.jpg"
  },
  {
    "id": 102003,
    "title": "Orange Juice",
    "isCategory": false,
    "categoryId": 102,
    "price": 2.7,
    "image": "assets/imgs/products/orangejuice.jpg"
  },
  {
    "id": 103,
    "title": "Beer",
    "isCategory": true,
    "categoryId": 1,
    "image": "assets/imgs/products/beer.jpg"
  },
  {
    "id": 103001,
    "title": "Wheat Beer",
    "isCategory": false,
    "categoryId": 103,
    "price": 3.8,
    "image": "assets/imgs/products/wheatbeer.jpg"
  },
  {
    "id": 103002,
    "title": "Pils Beer",
    "isCategory": false,
    "categoryId": 103,
    "price": 2.8,
    "image": "assets/imgs/products/pils.jpg"
  },
  {
    "id": 103003,
    "title": "Oktoberfest Beer",
    "isCategory": false,
    "categoryId": 103,
    "price": 0.01,
    "image": "assets/imgs/products/massbeer.jpg"
  },
  {
    "id": 104,
    "title": "Wine",
    "isCategory": true,
    "categoryId": 1,
    "image": "assets/imgs/products/wine.jpg"
  },
  {
    "id": 104001,
    "title": "Red Wine",
    "isCategory": false,
    "categoryId": 104,
    "price": 4.9,
    "image": "assets/imgs/products/redwine.jpg"
  },
  {
    "id": 104002,
    "title": "White Wine",
    "isCategory": false,
    "categoryId": 104,
    "price": 4.5,
    "image": "assets/imgs/products/whitewine.jpg"
  },
  {
    "id": 2,
    "title": "Food",
    "isCategory": true,
    "categoryId": null,
    "image": "assets/imgs/products/food.jpg"
  },
  {
    "id": 201001,
    "title": "Sausages",
    "isCategory": false,
    "categoryId": 2,
    "price": 4.0,
    "image": "assets/imgs/products/sausage.jpg"
  },
  {
    "id": 201002,
    "title": "Pizza",
    "isCategory": false,
    "categoryId": 2,
    "price": 5.2,
    "image": "assets/imgs/products/pizza.jpg"
  },
  {
    "id": 202,
    "title": "Fruits",
    "isCategory": true,
    "categoryId": 2,
    "image": "assets/imgs/products/fruits.jpg"
  },
  {
    "id": 202001,
    "title": "Apple",
    "isCategory": false,
    "categoryId": 202,
    "price": 0.5,
    "image": "assets/imgs/products/apple.jpg"
  },
  {
    "id": 202002,
    "title": "Banana",
    "isCategory": false,
    "categoryId": 202,
    "price": 0.6,
    "image": "assets/imgs/products/banana.jpg"
  },
  {
    "id": 3,
    "title": "Dessert",
    "isCategory": true,
    "categoryId": null,
    "image": "assets/imgs/products/desserts.jpg"
  },
  {
    "id": 301001,
    "title": "Cake",
    "isCategory": false,
    "categoryId": 3,
    "price": 2.8,
    "image": "assets/imgs/products/strawberrycake.jpg"
  },
  {
    "id": 301002,
    "title": "Tiramisu",
    "isCategory": false,
    "categoryId": 3,
    "price": 2.5,
    "image": "assets/imgs/products/tiramisu.jpg"
  },
  {
    "id": 999,
    "title": "Snacks",
    "isCategory": false,
    "categoryId": 2,
    "image": "assets/imgs/products/pizza.jpg",
    "price": 10,
    "options": [
      {
        "title": "Option One",
        "price": 11
      },
      {
        "title": "Option Two",
        "price": 12
      },
      {
        "title": "Option Three",
        "price": 13
      },
      {
        "title": "Option Four",
        "price": 14
      },
      {
        "title": "Option Five",
        "price": 15
      }
    ]
  },
  {
    "id": 4,
    "title": "Mobile Topup",
    "isCategory": true,
    "categoryId": null,
    "image": "assets/imgs/products/mobile_topup.jpg"
  },
  {
    "id": 401,
    "title": "T-Mobile",
    "isCategory": true,
    "categoryId": 4,
    "image": "assets/imgs/products/telekom.jpg"
  },
  {
    "id": 401001,
    "title": "T-Mobile XtraCash 15€",
    "isCategory": false,
    "categoryId": 401,
    "price": 15,
    "color": "#e6007e"
  },
  {
    "id": 401002,
    "title": "T-Mobile XtraCash 30€",
    "isCategory": false,
    "categoryId": 401,
    "price": 30,
    "color": "#e6007e"
  },
  {
    "id": 401003,
    "title": "T-Mobile XtraCash 50€",
    "isCategory": false,
    "categoryId": 401,
    "price": 50,
    "color": "#e6007e"
  },
  {
    "id": 402,
    "title": "Vodafone",
    "isCategory": true,
    "categoryId": 4,
    "image": "assets/imgs/products/vodafone.jpg"
  },
  {
    "id": 402001,
    "title": "Vodafone CallYa 15€",
    "isCategory": false,
    "categoryId": 402,
    "price": 15,
    "color": "#e60001"
  },
  {
    "id": 402002,
    "title": "Vodafone CallYa 25€",
    "isCategory": false,
    "categoryId": 402,
    "price": 25,
    "color": "#e60001"
  },
  {
    "id": 403,
    "title": "o2",
    "isCategory": true,
    "categoryId": 4,
    "image": "assets/imgs/products/o2.jpg"
  },
  {
    "id": 403001,
    "title": "o2 LOOP 15€",
    "isCategory": false,
    "categoryId": 403,
    "price": 15,
    "color": "#1c2574"
  },
  {
    "id": 403002,
    "title": "o2 LOOP 20€",
    "isCategory": false,
    "categoryId": 403,
    "price": 20,
    "color": "#1c2574"
  },
  {
    "id": 403003,
    "title": "o2 LOOP 30€",
    "isCategory": false,
    "categoryId": 403,
    "price": 30,
    "color": "#1c2574"
  },
  {
    "id": 5,
    "title": "Gift Card",
    "isCategory": true,
    "categoryId": null,
    "image": "assets/imgs/products/giftcard.jpg"
  },
  {
    "id": 501001,
    "title": "Geschenkkarte 20€",
    "isCategory": false,
    "categoryId": 5,
    "price": 20,
    "color": "#f00"
  },
  {
    "id": 501002,
    "title": "Geschenkkarte 50€",
    "isCategory": false,
    "categoryId": 5,
    "price": 50,
    "color": "#f00"
  }
]



