const path = require('path');
const Koa = require('koa');
const app = new Koa();

app.use(require('koa-static')(path.join(__dirname, 'public')));
app.use(require('koa-bodyparser')());

const Router = require('koa-router');
const router = new Router();

const initialUsers = {};
let users = {};

router.get('/subscribe', async (ctx, next) => {
  let id = ctx.request.query.r;
  if (!id || id in users) {
    id = Math.random();
  }

  ctx.req.on('close', () => {
    delete users[id];
  });

  return await new Promise((resolve) => {
    users[id] = (message) => {
      ctx.body = message;
      resolve();
    };
  });
});

router.post('/publish', async (ctx, next) => {
  const body = ctx.request.body;
  const errors = validatePublish(body);
  if (errors) {
    ctx.status = 400;
    ctx.body = {
      data: errors,
      status: 400,
      message: 'Bad request',
    };
    return;
  }

  for (const id in users) {
    users[id](body.message);
  }

  users = initialUsers;

  ctx.status = 201;
  ctx.body = {
    data: null,
    status: 201,
    message: 'Created',
  };
});

function validatePublish({message}) {
  return !(typeof message === 'string' && message.trim().length > 0) ?
    ['Message is required'] :
    null;
}

app.use(router.routes());

module.exports = app;
