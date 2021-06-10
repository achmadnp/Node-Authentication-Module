const express = require('express');
const { graphqlHTTP } = require('express-graphql');

// TODO CREATE GRAPQLSCHEMA


const app = express();

// TODO multer: file management: download upload


// CORS
app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader(
        'Access-Control-Allow-Methods',
        'OPTIONS, GET, POST, PUT, PATCH, DELETE'
    );
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    if (req.method === 'OPTIONS') {
        return res.sendStatus(200);
    }
    next();
});

// TODO create auth middleware
app.use(auth);

// TODO create graphql schema and resolver
app.use('/graphql', graphqlHTTP({
    schema: graphqlSchema,

}))