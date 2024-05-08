const pool = require('../config/db.config');
const { types, rarityCards } = require('../models/types&raritys');

async function getAllCards(req, res) {
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
}

async function getCardById(req, res) {
    try {
        const { id } = req.params;
        const card = await pool.query('SELECT * FROM cards WHERE id=$1;', [id]);
        return card.rowCount > 0 ?
        res.status(200).send(card.rows[0]) : res.status(404).send({ message: 'Não há carta com este id' });
    } catch(e) {
        console.error('Erro ao obter a carta', e);
        res.status(500).send({ mensagem: 'Erro ao obter a carta' }); 
    }
}

async function postCard(req, res) {
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
}

async function putCard(req, res) {
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
}

async function deleteCard(req, res) {
    try {
        const { id } = req.params;

        await pool.query('DELETE FROM cards WHERE id=$1', [id]);
        return res.status(200).send({ message: `card with id: ${id} deleted` });
    } catch(e) {
        console.error('Erro ao excluir a carta', e);
        res.status(500).send({ mensagem: 'Erro ao excluir a carta' });   
    }
}

async function getCardByName(req, res) {
    try {
        const { name } = req.params;
        const card = await pool.query('SELECT * FROM cards WHERE name LIKE $1', [`${name}%`]);
        return card.rowCount > 0 ?
        res.status(200).send(card.rows) : res.status(404).send({ message: 'Não foi encontrada carta com esse nome' }); 
    } catch(e) {
        console.error('Erro ao obter a carta pelo nome', e);
        res.status(500).send({ mensagem: 'Erro ao obter carta pelo nome' }); 
    }
}

module.exports ={ getAllCards, getCardById, postCard, putCard, deleteCard, getCardByName };