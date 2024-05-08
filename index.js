const express = require('express');
const { Pool } = require('pg');

const app = express();
app.use(express.json());

const port = 4000;

const pool = new Pool({
    user: 'postgres',
    host: 'localhost',
    port: 7007,
    password: 'ds564',
    database: 'clashroyaledb'
});

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

app.get('/cards', async (req, res) => {
    try {
        const allCards = await pool.query('SELECT * FROM cards;');
        return allCards.rowCount > 0 ? 
        res.status(200).json({
            total: allCards.rowCount,
            cards: allCards.rows
        }) : 
        res.status(200).json({ message: 'Não há cartas cadastradas'});
    } catch(e) {
        console.error('Erro ao obter todas as cartas', e);
        res.status(500).send({ mensagem: 'Erro ao obter todas as cartas' });
    }
});

app.get('/cards/:id', async(req, res) => {
    try {
        const { id } = req.params;
        const card = await pool.query('SELECT * FROM cards WHERE id=$1;', [id]);
        return card.rowCount > 0 ?
        res.status(200).send(card.rows[0]) : res.status(404).send({ message: 'Não há carta com este id' });
    } catch(e) {
        console.error('Erro ao obter a carta', e);
        res.status(500).send({ mensagem: 'Erro ao obter a carta' }); 
    }
});

app.get('/cards/name/:name', async(req, res) => {
    try {
        const { name } = req.params;
        const card = await pool.query('SELECT * FROM cards WHERE name LIKE $1', [`${name}%`]);
        return card.rowCount > 0 ?
        res.status(200).send(card.rows) : res.status(404).send({ message: 'Não foi encontrada carta com esse nome' }); 
    } catch(e) {
        console.error('Erro ao obter a carta pelo nome', e);
        res.status(500).send({ mensagem: 'Erro ao obter carta pelo nome' }); 
    }
});

//variables for includes
const types = ['construction', 'troop', 'spell'];
const rarityCards = ['commum', 'rare', 'epic', 'legendary', 'champion'];

app.post('/cards', async(req, res) => {
    try {
        const { name, level, rarity, type, life, damage } = req.body;

        if(name < 3) {
            return res.status(400).send({ message: 'invalid_name' });

        } else if(level < 1 || level > 15) {
            return res.status(400).send({ message: 'invalid_level' });

        } else if(!rarityCards.includes(rarity.toLowerCase())) {
            return res.status(400).send({ message: 'invalid_rarity' });

        } else if(!types.includes(type.toLowerCase())) {
            return res.status(400).send({ message: 'invalid_type' });

        } else if(typeof level !== 'number' || typeof life !== 'number' || typeof damage !== 'number') {
            return res.status(400).send({ message: 'invalid_type_number' });

        } else {
            await pool.query('INSERT INTO cards(name, level, rarity, type, life, damage) VALUES ($1, $2, $3, $4, $5, $6);',
            [name, level, rarity, type, life, damage]);
            return res.status(201).send({ message: `card ${name} registered` });
        }
    } catch(e) {
        console.error('Erro ao postar a carta', e);
        res.status(500).send({ mensagem: 'Erro ao postar a carta' });   
    }
});

app.put('/cards/:id', async(req, res) => {
    try {
        const { name, level, rarity, type, life, damage } = req.body;
        const { id } = req.params;
        
        if(name < 3) {
            return res.status(400).send({ message: 'invalid_name' });

        } else if(level < 1 || level > 15) {
            return res.status(400).send({ message: 'invalid_level' });

        } else if(!rarityCards.includes(rarity.toLowerCase())) {
            return res.status(400).send({ message: 'invalid_rarity' });

        } else if(!types.includes(type.toLowerCase())) {
            return res.status(400).send({ message: 'invalid_type' });

        } else if(typeof level !== 'number' || typeof life !== 'number' || typeof damage !== 'number') {
            return res.status(400).send({ message: 'invalid_type_number' });

        } else {
            await pool.query('UPDATE cards SET name=$1, level=$2, rarity=$3, type=$4, life=$5, damage=$6 WHERE id=$7;',
            [name, level, rarity, type, life, damage, id]);
            return res.status(200).send({ message: `card ${name}, with id:${id} updated` });
        }
    } catch(e) {
        console.error('Erro ao editar a carta', e);
        res.status(500).send({ mensagem: 'Erro ao editar a carta' });   
    }
});

app.delete('/cards/:id', async(req, res) => {
    try {
        const { id } = req.params;

        await pool.query('DELETE FROM cards WHERE id=$1', [id]);
        return res.status(200).send({ message: `card with id: ${id} deleted` });
    } catch(e) {
        console.error('Erro ao excluir a carta', e);
        res.status(500).send({ mensagem: 'Erro ao excluir a carta' });   
    }
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