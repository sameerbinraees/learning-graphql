require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const { graphqlHTTP } = require('express-graphql');
const { buildSchema } = require('graphql');

const Event = require('./models/event');
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
const URI = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@graphql-learning.sby7e.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;

(async () => {
  try {
    mongoose.connect(URI);
    console.log(`DB connected`);
  } catch (err) {
    console.log(error);
  }
})();

app.get('/', (req, res) => {
  res.send('Yup, Working');
});

app.use(
  '/graphql',
  graphqlHTTP({
    schema: buildSchema(`

      type Event {
        _id: String!
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
      events: async () => {
        const events = await Event.find().exec();
        console.log(events);
        return events;
      },
      createEvent: async ({ eventInput }) => {
        const event = new Event({
          title: eventInput.title,
          description: eventInput.description,
          price: +eventInput.price,
          date: new Date().toISOString(),
        });
        const { _doc: createdEvent } = await event.save();
        return createdEvent;
      },
    },
    graphiql: true,
  }),
);

app.listen(3000, () => {
  console.log('Server is up!');
});
