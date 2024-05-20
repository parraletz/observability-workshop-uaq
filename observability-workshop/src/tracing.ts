import { NodeSDK } from '@opentelemetry/sdk-node'
import { diag, DiagConsoleLogger, DiagLogLevel } from '@opentelemetry/api'

import { PeriodicExportingMetricReader } from '@opentelemetry/sdk-metrics'
import { Resource } from '@opentelemetry/resources'
import {
  SEMRESATTRS_SERVICE_NAME,
  SEMATTRS_HTTP_METHOD,
  SEMATTRS_HTTP_URL,
  SEMRESATTRS_SERVICE_VERSION,
} from '@opentelemetry/semantic-conventions'
import { Span } from '@opentelemetry/api'
import {
  ExpressInstrumentation,
  ExpressRequestInfo,
  ExpressLayerType,
} from '@opentelemetry/instrumentation-express'
import { HttpInstrumentation } from '@opentelemetry/instrumentation-http'
import { OTLPMetricExporter } from '@opentelemetry/exporter-metrics-otlp-http'
import { OTLPTraceExporter } from '@opentelemetry/exporter-trace-otlp-http'
import { OTLPLogExporter } from '@opentelemetry/exporter-logs-otlp-http'

import {
  LoggerProvider,
  BatchLogRecordProcessor,
} from '@opentelemetry/sdk-logs'

class Tracer {
  private sdk: NodeSDK | null = null

  private otelTracesExporter = new OTLPTraceExporter({})

  private otelMetricsExporter = new PeriodicExportingMetricReader({
    exporter: new OTLPMetricExporter({}),
  })

  private otelLogsExporter = new OTLPLogExporter({
    concurrencyLimit: 10,
    url: 'http://localhost:4318/v1/logs',
  })

  private otelLogsProvider = new LoggerProvider()

  public init() {
    try {
      diag.setLogger(new DiagConsoleLogger(), DiagLogLevel.DEBUG)

      this.otelLogsProvider.addLogRecordProcessor(
        new BatchLogRecordProcessor(this.otelLogsExporter)
      )

      this.sdk = new NodeSDK({
        resource: new Resource({
          [SEMRESATTRS_SERVICE_NAME]: 'tars',
          [SEMRESATTRS_SERVICE_VERSION]: '1.0-BETA',
        }),

        metricReader: this.otelMetricsExporter,
        traceExporter: this.otelTracesExporter,

        instrumentations: [
          new HttpInstrumentation(),
          new ExpressInstrumentation({
            requestHook: function (span: Span, info: ExpressRequestInfo) {
              if (info.layerType === ExpressLayerType.REQUEST_HANDLER) {
                span.setAttribute(SEMATTRS_HTTP_METHOD, info.request.method)
                span.setAttribute(SEMATTRS_HTTP_URL, info.request.baseUrl)
              }
            },
          }),
        ],
      })

      this.sdk.start()
      console.info('The tracer has been initialized')
    } catch (e) {
      console.error('Failed to initialize the tracer', e)
    }
  }
}

const tracer = new Tracer()
tracer.init()
