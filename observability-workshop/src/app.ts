import { ServerApp } from './server/server'
//import { OtelTracer } from './instrumetation'
;(() => {
  main()
})()

function main() {
  const server = new ServerApp({ port: 3000 })
  server.start()
}
