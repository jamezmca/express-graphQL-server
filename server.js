const express = require('express');
const expressGraphQL = require('express-graphql').graphqlHTTP;
const {
    GraphQLSchema,
    GraphQLObjectType,
    GraphQLString,
    GraphQLList,
    GraphQLInt,
    GraphQLNonNull
} = require('graphql')

const app = express();

// in place of a database
const authors = [
    { id: 1, name: 'J. K. Rowling' },
    { id: 2, name: 'J. R. R. Tolkien' },
    { id: 3, name: 'Brent Weeks' }
];

const books = [
    { id: 1, name: 'Harry Potter and the Chamber of Secrets', authorId: 1},
    { id: 2, name: 'Harry Potter and the Prisoner of Azkaban', authorId: 1},
    { id: 3, name: 'Harry Potter and the Goblet of Fire', authorId: 1},
    { id: 4, name: 'The Fellowship of the Ring', authorId: 2},
    { id: 5, name: 'The Two Towers', authorId: 2},
    { id: 6, name: 'The Return of the King', authorId: 2},
    { id: 7, name: 'The Way of Shadows', authorId: 3},
    { id: 8, name: 'Beyond the Shadows', authorId: 3}
];

const BookType = new GraphQLObjectType({
    name: 'Book',
    description: 'This represents a book written by an author',
    fields: () => ({
        id: { type: GraphQLNonNull(GraphQLInt) },
        name: { type: GraphQLNonNull(GraphQLString)},
        authorId: { type: GraphQLNonNull(GraphQLInt) },
        author: { 
            type: new AuthorType,
            resolve: (book) => {
                return authors.find(author => author.id === book.authorId)
            }
        }
    })
})

const RootQueryType = new GraphQLObjectType({
    name: 'Query',
    description: 'Root Query',
    fields: () => ({
        books: {
            type: new GraphQLList(BookType),
            description: 'List of All Books',
            resolve: () => books
        }
    }) //the parenthesis can be used instead of a multi-line return statement
});

const schema = new GraphQLSchema({
    query: RootQueryType
})

app.use('/graphql', expressGraphQL({
    schema: schema,
    graphiql: true
}));
app.listen(5000., () => { });