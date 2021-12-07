## MEAN STACK - Aplollo GraphQL

This documentation will contain the setup guide to set up a simple NodeJS backend with a graphql service.
We will be using the MEAN stack, backend being MongoDB and using Mongoose to do the ORM operations.


### Prerequisites

These are some of the technologies used:

 - [Apollo GraphQL](https://www.apollographql.com/docs/)
 - [Express.js](https://expressjs.com/en/starter/hello-world.html)

### Initialize the project

Run ``npm i`` to install the dependencies.

Create a .env file and populate it with the configs, follow the example:

```
MONGO_URI='mongodb://localhost:27017/test'
PORT=3000
PGHOST='localhost'
PGUSER='postgres'
PGDATABASE='xml'
PGPASSWORD='root'
PGPORT=5432
```

to run the server, run this command on your terminal:

```
npm run dev
```

and access the serve at this uri https://localhost:3000 and  https://localhost:3000/graphql for the graqphql playground

#### GraphQL Schema

This file [schema.js](graphql/schema.js) contains the business logic and CRUD functionality.
#### GraphQL Resolvers

This file [resolvers.js](graphql/resolvers.js) contains the business logic and CRUD functionality.


#### CREAT Product Mutation:

To create a new product, run this mutation on the graphQl console.

```

mutation {
  createProduct(productInput: { name: "Test Product 1",description: "Test Product",price: 7000.50,discount: 10}){
      _id,
      name,
      description,
      price,
      discount,
      created_at,
      updated_at
  }
}

```

response should be:

```
{
  "data": {
    "createProduct": {
      "_id": "6054a67820f5c5716e99b657",
      "name": "Test Product 1",
      "description": "Test Product",
      "price": 7000.5,
      "discount": 10,
      "created_at": "1616160376613",
      "updated_at": "1616159865675"
    }
  }
}

```


#### READ: Query Product:

To read all product, run this query on the graphQl console.


```
{
  products{products{_id, description, price, discount,created_at,updated_at}}
}

```

response should be (close to this):

```
{
  "data": {
    "products": {
      "products": [
        {
          "_id": "605496c1e3ad5c614f21c291",
          "description": "Test Product",
          "price": 7000.5,
          "discount": 10,
          "created_at": "1616156353503",
          "updated_at": "1616156297912"
        },
        {
          "_id": "6054a67820f5c5716e99b657",
          "description": "Test Product1",
          "price": 7030.5,
          "discount": 10,
          "created_at": "1616160376613",
          "updated_at": "1616159865675"
        }
      ]
    }
  }
}

```



#### UPDATE Product Mutation:

To update a product, run this mutation on the graphQl console.


```
mutation {
  updateProduct(id:"6054a67820f5c5716e99b657",productInput: { name: "Test Product 2",description: "Test Product",price: 7500.50,discount: 8}){
      _id,
      name,
      description,
      price,
      discount,
      created_at,
      updated_at
  }
}

```

response should be (close to this):

```
{
  "data": {
    "updateProduct": {
      "_id": "6054a67820f5c5716e99b657",
      "name": "Test Product 2",
      "description": "Test Product",
      "price": 7500.5,
      "discount": 8,
      "created_at": "1616160376613",
      "updated_at": "1616159865675"
    }
  }
}

```

#### DELETE Product Mutation:

To delete a product, run this mutation on the graphQl console.


```

mutation {
  deleteProduct(id:"6054a67820f5c5716e99b657"){
      _id,
      name,
      description,
      price,
      discount,
      created_at,
      updated_at
  }
}


```

response should be (close to this):

```
{
  "data": {
    "deleteProduct": {
      "_id": "6054a67820f5c5716e99b657",
      "name": "Test Product 2",
      "description": "Test Product",
      "price": 7500.5,
      "discount": 8,
      "created_at": "1616160376613",
      "updated_at": "1616159865675"
    }
  }
}

```



**Conclusion**

This is a simple REST API/GraphQL server that was built for a lab class and the main objective is to explore graphql and mongoDB. 