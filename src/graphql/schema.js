import { buildSchema } from "graphql";
const graphqlSchema = buildSchema(`
    type Shop{
        _id:ID!
        name: String!
        description: String!        
        product:[Product]
        created_at: String!
        updated_at: String!
    }    

    type Product{
        name: String!
        description: String!
        price: Float!
        discount: Int        
    }
    input ProductInput{
        name: String!
        description: String!
        price: Float!
        discount: Int        
    }

    type ShopData {
        shop: [Shop]
    }

 
    input ProductInputData {
        name: String!
        description: String!       
        
    }
    type RootQuery {
        shops: ShopData
    }
    type RootMutation {
        createShop(productInput:ProductInputData,product:[ProductInput]): Shop!
        updateProduct(id: ID!, productInput:ProductInputData): Product!
        deleteProduct(id: ID!): Product!
    }
    schema {
        query: RootQuery
        mutation: RootMutation
    }
`);

export default graphqlSchema;
