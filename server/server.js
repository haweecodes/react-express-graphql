const express = require("express");
var graphqlHTTP = require('express-graphql');
var { buildSchema } = require('graphql');
var cors = require('cors')
const fs = require('fs');
var schema = buildSchema(`
  type Mutation {
    setPost(post: String): Query
  }
  type Query {
    post: String
  }
`);

var get = {
  post: async () => {
    const arr =  await fs.readFileSync('./public/inputs.txt', 'utf-8');
    console.log(arr)
    return JSON.stringify(JSON.parse(arr));
  },
  setPost: async (data) => {
    await fs.writeFileSync('./public/inputs.txt', JSON.stringify(data.post), function (err) {
      if (err) throw err;
    });
    return data;
  }
};

const app = express(); // create express app
const path = require("path");
app.use(cors());
app.use(express.static(path.join(__dirname, "..", "build")));
app.use(express.static("public"));

app.use('/graphql', graphqlHTTP({
  schema: schema,
  rootValue: get,
  graphiql: true,
}));

// start express server on port 5000
app.listen(5000, () => {
  console.log("server started on port 5000");
});