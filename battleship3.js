var model = {
    pool: 7,
    shipsQ: 4,
    shipsLen: 3,
    ships: {},
    tries: 0,
    check: 0,
    addresses: [],
    firedAddresses: [],
    countFire: 0,
    checkEveryShip: 0,
    generateShip: function() {
        var direction = Math.floor(Math.random() * 2);
        var ship = { coordinates: [], hits: [] };
        if (direction === 0) {
            var col = Math.floor(Math.random() * (model.pool - model.shipsLen + 1));
            var row = Math.floor(Math.random() * model.pool);
            for (var i = 0; i < model.shipsLen; i++) {
                ship.coordinates.push(row + "" + (col + i));
            }
        } else {
            var row = Math.floor(Math.random() * (model.pool - model.shipsLen + 1));
            var col = Math.floor(Math.random() * model.pool);
            for (var i = 0; i < model.shipsLen; i++) {
                ship.coordinates.push(row + i + "" + col);
            }
        }
        return ship;
    },
    isCollision: function(newShip) {
        for (var i = 0; i < model.shipsLen; i++) {
            if (model.addresses.indexOf(newShip.coordinates[i]) !== -1) {
                return true;
            }
        }
        return false;
    },
    generateShips: function() {
        model.check = -model.shipsQ;
        for (createNext = 0; createNext < model.shipsQ; createNext++) {
            while(true) {
                if(model.check > 100) {
                    alert("Корабли не помещаются на поле, задайте другие значения");
                    return false;
                }
                model.check++;
                var newShip = model.generateShip();
                if (model.isCollision(newShip) === false) {
                    model.ships["ship" + createNext] = newShip;
                    for (var i = 0; i < model.shipsLen; i++) {
                        for (var x = -1; x < 2; x++) {
                            for (var y = -1; y < 2; y++) {
                                model.addresses.push(parseInt(newShip.coordinates[i][0]) + x + "" + (parseInt(newShip.coordinates[i][1]) + y));
                            }
                        }
                    }
                    break;
                }
            }
        }
    },
    fire: function(coor) {
        model.tries++;
        for (ship in model.ships) {
            if (model.ships[ship].coordinates.indexOf(coor) !== -1) {
                view.hit(coor);
                model.firedAddresses.push(coor);
                model.ships[ship].hits.push(coor);
                if(model.ships[ship].hits.length === model.shipsLen) {
                    model.checkEveryShip++;
                    alert("Корабль потоплен, капитан!");
                }
                if(model.checkEveryShip === model.shipsQ) {
                    alert("Победа! Все корабли потоплены! Произведено выстрелов: " + model.tries + ". Результативность: " +
                        Math.floor((model.shipsLen * model.shipsQ) / model.tries * 100) + "%");
                }
                break;
            } else {
                view.miss(coor);
                model.firedAddresses.push(coor);
            }
        }
    },
    startButton: function() {
         model.shipsQ = parseInt(document.getElementById("shipsQ").value);
         model.shipsLen = parseInt(document.getElementById("shipsLen").value);
         model.ships = {};
         for(var i = 0; i < model.firedAddresses.length; i++) {
            if (document.getElementById(model.firedAddresses[i]) != null) {
                view.makeNull(model.firedAddresses[i]);
            }
         }
         model.addresses = [];
         model.checkEveryShip = 0;
         model.tries = 0;
         if (model.generateShips() != false) {
            alert("К бою готов!");
         }
     }
};

var view = {
    hit: function(coor) {
        document.getElementById(coor).innerHTML = '<img src="ship.png">';
    },
    miss: function(coor) {
        document.getElementById(coor).innerHTML = '<img src="miss.png">';
    },
    makeNull: function(coor) {
        document.getElementById(coor).innerHTML = '';
    }
}

var controller = {
    fireConstructor: function(coor) {
        return function() {
            model.fire(coor);
        }
    },
    makeFunctions: function() {
        for (var cols = 0; cols < 8; cols++) {
            for(var rows = 0; rows < 8; rows++) {
                this["fire" + rows + cols] = new this.fireConstructor(rows + "" + cols);
            }
        }
    },
    start: function() {
        model.startButton();
    }
};

model.generateShips();
controller.makeFunctions();
console.log(model.addresses);
console.log(model.check);
