import { buildSchema } from "graphql";
const graphqlSchema = buildSchema(`
    type Outlet{
        _id:ID!
        name: String!              
        products:[Product]     
        size: String!
        year: String!
        locationType: String!
        sales: Float!
        created_at: String!
        updated_at: String!
    }
    type Product{
        _id:ID!
        name: String!       
        type: String
        weight: String
        mrp:  String
        created_at: String!
        updated_at: String!     
    }
    type Types{
        _id:ID!
        name: String!       
        created_at: String!
        updated_at: String!   
    }
    type OutleSize{
        _id:ID!
        name: String!        
    }
    input ProductInput{
        name: String!
        description: String!
        price: Float!
        discount: Int        
    }
    type OutletData {
        outlet: [Outlet]
    } 
    input OutletInput {
        name: String!
        description: String!       
    }
    type RootQuery {
        outlets: OutletData
    }
    type RootMutation {
        createOutlet(outletInput:OutletInput,product:[ProductInput]): Outlet!
        updateProduct(id: ID!, product:ProductInput): Product!
        deleteProduct(id: ID!): Product!
    }
    schema {
        query: RootQuery
        mutation: RootMutation
    }
`);

export default graphqlSchema;
