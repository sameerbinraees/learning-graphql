const express = require('express');
const app = express();
const { graphqlHTTP } = require('express-graphql');
const { buildSchema } = require('graphql');

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/', (req, res) => {
  res.send('Yup, Working');
});
const events = [];
app.use(
  '/graphql',
  graphqlHTTP({
    schema: buildSchema(`

      type Event {
        _id: ID!
        title: String!
        description: String!
        price: Float!
        date: String!
      }

      input EventInput {
        title: String!
        description: String!
        price: Float!
        date: String!
      }

      type RootQuery {
        events:  [Event!]!
      }

      type RootMutation {
        createEvent(eventInput: EventInput): Event
      }

      schema {
        query: RootQuery
        mutation: RootMutation
      }

    `),
    rootValue: {
      events: () => {
        return events;
      },
      createEvent: ({ eventInput }) => {
        const event = {
          _id: Math.random().toString(),
          title: eventInput.title,
          description: eventInput.description,
          price: +eventInput.price,
          date: new Date().toISOString(),
        };
        events.push(event);
        return event;
      },
    },
    graphiql: true,
  }),
);

app.listen(3000, () => {
  console.log('Server is up!');
});
