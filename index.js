const express = require('express');

const app = express();
app.use(express.json());

const port = 4000;


app.get('/cards', async (req, res) => {

});

app.get('/cards/:id', async(req, res) => {

});

app.get('/cards/name/:name', async(req, res) => {

});


app.post('/cards', async(req, res) => {

});

app.put('/cards/:id', async(req, res) => {

});

app.delete('/cards/:id', async(req, res) => {

});

app.get('/battle', async(req, res) => {
    try {
        const allBattles = await pool.query('SELECT * FROM battles;');
        return allBattles.rowCount > 0 ? res.status(200).json({ total: allBattles.rowCount, battles: allBattles.rows  }) :
        res.status(200).send({ message: 'nenhuma batalha realizada' });
    } catch(e) {
        console.error('Erro ao obter batalhas', e);
        return res.status(500).send({ message: 'Erro ao obter todas as batalhas'});
    }
});

app.get('/battle/:id1/:id2', async(req, res) => {
    try {
        const { id1, id2 } = req.params;
        const cards = await pool.query('SELECT * FROM cards WHERE id=$1 OR id=$2;', [id1, id2]);

        const cardLife1 = cards.rows[0].life;
        const cardLife2 = cards.rows[1].life;
    
        const cardDamage1 = cards.rows[0].damage;
        const cardDamage2 = cards.rows[1].damage;

        const winnerid = battle(cardLife1, cardLife2, cardDamage1, cardDamage2, id1, id2);

        await pool.query('INSERT INTO battles(winnerid, loserid, cardoneid, cardtwoid, namecardone, namecardtwo) VALUES ($1, $2, $3, $4, $5, $6)',
        [winnerid, winnerid == id1 ? id2 : id1, id1, id2, cards.rows[0].name, cards.rows[1].name]);

        const winner = await pool.query('SELECT * FROM cards WHERE id=$1', [winnerid]);

        return winnerid == null ? res.status(200).send({ message: 'empate' }) : res.status(200).send({ message: `vencedor é ${winner.rows[0].name}` }); 
    } catch(e) {
        console.error('Erro ao batalhar', e);
        return res.status(500).send({ message: 'Erro ao batalhar as cartas'});
    }
});

app.get('/battlesbyname/:name', async(req, res) => {
    try {
        const { name } = req.params;

        const battles = await pool.query('SELECT * FROM battles WHERE namecardone LIKE $1 OR namecardtwo LIKE $1', [`${name}%`]);

        return battles.rowCount > 0 ? res.status(200).json({ total: battles.rowCount, battles: battles.rows }) : res.status(404).send({ message: 'Esta carta ainda não batalhou' }); 
    } catch(e) {
        console.error('Erro ao obter batalhas', e);
        return res.status(500).send({ message: 'Erro ao obter batalhas'});
    }
});



app.listen(port, () => console.log(`Server starred in http://localhost:${port}`));