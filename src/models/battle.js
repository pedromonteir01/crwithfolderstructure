const battle = (life1, life2, damage1, damage2, id1, id2) => {
    while(life1 > 0 && life2 > 0) {
        life1 -= damage2;
        life2 -= damage1;
    }

    if(life1 > life2) {
        return id1
    } else if(life2 > life1) {
        return id2;
    } else {
        return null;
    }
    
}

module.exports = battle;