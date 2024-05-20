import { getNodeAutoInstrumentations } from '@opentelemetry/auto-instrumentations-node'
import { OTLPTraceExporter } from '@opentelemetry/exporter-trace-otlp-http'
import { Resource } from '@opentelemetry/resources'
import { NodeSDK } from '@opentelemetry/sdk-node'
import {
  BasicTracerProvider,
  ConsoleSpanExporter,
  SimpleSpanProcessor,
} from '@opentelemetry/sdk-trace-node'
import {
  SEMRESATTRS_SERVICE_NAME,
  SEMRESATTRS_SERVICE_VERSION,
} from '@opentelemetry/semantic-conventions'

import { OTLPMetricExporter } from '@opentelemetry/exporter-metrics-otlp-http'
import { PeriodicExportingMetricReader } from '@opentelemetry/sdk-metrics'

class Tracer {
  private sdk: NodeSDK | null = null

  // url is optional and can be omitted - default is http://localhost:4318/v1/traces
  private exporter = new OTLPTraceExporter({
    url: 'http://localhost:4318/v1/traces',
  })

  private metrics = new PeriodicExportingMetricReader({
    exporter: new OTLPMetricExporter({
      url: 'http://localhost:4318/v1/metrics',
    }),
  })

  private provider = new BasicTracerProvider({
    resource: new Resource({
      [SEMRESATTRS_SERVICE_VERSION]: '1.0-BETA',
      [SEMRESATTRS_SERVICE_NAME]: 'tars',
    }),
  })

  public init() {
    try {
      // export spans to console (useful for debugging)
      this.provider.addSpanProcessor(
        new SimpleSpanProcessor(new ConsoleSpanExporter())
      )
      console.log('The tracer has been initialized')
      // export spans to opentelemetry collector
      this.provider.addSpanProcessor(new SimpleSpanProcessor(this.exporter))
      this.provider.register()

      this.sdk = new NodeSDK({
        metricReader: this.metrics,
        traceExporter: this.exporter,
        instrumentations: [getNodeAutoInstrumentations()],
      })

      this.sdk.start()

      console.info('The tracer has been initialized')
    } catch (e) {
      console.error('Failed to initialize the tracer', e)
    }
  }
}

export const OtelTracer = new Tracer()
