import express from 'express';
import * as trpc from '@trpc/server';
import * as trcpExpress from '@trpc/server/adapters/express';
import cors from 'cors';
import { z } from 'zod';

interface ChatMessage {
  user: string;
  message: string;
}

const message: ChatMessage[] = [
  { user: 'user1', message: 'Hello' },
  { user: 'user2', message: 'Hi' },
];

const appRouter = trpc
  .router()
  .query('hello', {
    resolve() {
      return 'Hello World III';
    },
  })
  .query('getMessages', {
    input: z.number().default(10),
    resolve({ input }) {
      return message.slice(-input);
    },
  })
  .mutation('addMessages', {
    input: z.object({
      user: z.string(),
      message: z.string(),
    }),
    resolve({ input }) {
      message.push(input);
      return input;
    },
  });

export type AppRouter = typeof appRouter;

const app = express();
app.use(cors());
const port = 8080;

app.use(
  '/trpc',
  trcpExpress.createExpressMiddleware({
    router: appRouter,
    createContext: () => null,
  })
);

app.get('/', (req, res) => {
  res.send('Hello from api-server');
});

app.listen(port, () => {
  console.log(`api-server listening at http://localhost:${port}`);
});
