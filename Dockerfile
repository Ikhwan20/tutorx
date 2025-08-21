FROM node:18-alpine

WORKDIR /app

COPY package*.json yarn.lock* ./

RUN yarn install --frozen-lockfile

COPY . .

RUN addgroup -g 1001 -S nodejs
RUN adduser -S nextjs -u 1001 node

RUN chown -R nextjs:nodejs /app
USER nextjs

EXPOSE 5000

ENV PORT=5000
ENV NODE_ENV=production

CMD ["yarn", "start"]