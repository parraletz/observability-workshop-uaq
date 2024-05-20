FROM node:20-bullseye-slim AS base
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN corepack enable
COPY . /app
WORKDIR /app

FROM base AS prod-deps
RUN --mount=type=cache,id=pnpm,target=/pnpm/store pnpm install --prod --no-frozen-lockfile

FROM base AS build
RUN --mount=type=cache,id=pnpm,target=/pnpm/store pnpm install --no-frozen-lockfile
RUN pnpm run build

FROM base
COPY --from=prod-deps /app/node_modules /app/node_modules
COPY --from=build /app/dist /app/dist
RUN apt update --yes && apt install --yes curl
RUN addgroup --gid 1001 nonroot && \
    adduser --uid 1001 --ingroup nonroot --disabled-password --gecos "" nonroot
RUN chown -R nonroot:nonroot /app
USER nonroot
EXPOSE 3000
CMD [ "pnpm", "start" ]