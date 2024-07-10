<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="200" alt="Nest Logo" /></a>
</p>

# Products Microservice

## Dev

1. Clone repository
2. Install dependencies
3. Create `.env` file based on `.env.template`
4. Execute Prisma migration `npx prisma migrate dev`
5. Run NATS server

```
docker run -d --name nats-main -p 4222: 4222 -p 6222: 6222 -p 8222: 8222 nats
```

6. Run `npm run start:dev`

In case of Prisma error run

```
npx prisma generate
```
