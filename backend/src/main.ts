import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import helmet from 'helmet';
import compression from 'compression';
import { AppModule } from './app.module';

function getPort(configService: ConfigService): number {
  const raw = configService.get('PORT', 3001);
  return typeof raw === 'string' ? parseInt(raw, 10) || 3001 : raw;
}

/**
 * Boot a minimal "degraded mode" HTTP server on the same port.
 * Used when full NestJS bootstrap fails (e.g. DB init error on Render):
 * - Service still answers Render's health check, so deploy goes "live".
 * - /health returns 503 with the error JSON for diagnosis via curl/dashboard.
 * - Other routes return 503 with a hint.
 * This is critical: without it we can't read the runtime error from outside
 * the Render dashboard.
 */
async function bootDegradedMode(startupError: unknown, port: number) {
  // Use Express directly so we don't need the Nest DI container.
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  const express = require('express');
  const app = express();
  app.disable('x-powered-by');
  app.get('/', (_req: any, res: any) => {
    res.status(503).json({
      status: 'degraded',
      message: 'App boot failed. See /health for the error.',
      hint: 'Check Render dashboard logs for the full stack trace.',
    });
  });
  app.get('/health', (_req: any, res: any) => {
    const err = startupError as any;
    const payload = {
      status: 'degraded',
      error: err?.name || 'BootstrapError',
      message: err?.message || String(startupError || 'unknown'),
      stack: typeof err?.stack === 'string' ? err.stack.split('\n').slice(0, 20).join('\n') : undefined,
      code: err?.code,
    };
    res.status(503).json(payload);
  });
  // Use the HTTP server directly so we can bind to 0.0.0.0 like Nest does.
  return new Promise<void>((resolve) => {
    const server = app.listen(port, '0.0.0.0', () => {
      // eslint-disable-next-line no-console
      console.error(
        `[DEGRADED MODE] HTTP server listening on port ${port} after boot failure. ` +
          `Startup error name=${(startupError as any)?.name}, message=${(startupError as any)?.message}`,
      );
      resolve();
    });
    // If listen itself errors, fall back to logging and exiting 0 so the
    // container is marked as crashed (Render will then surface the deploy
    // as update_failed with stderr).
    server.on('error', (listenErr: any) => {
      // eslint-disable-next-line no-console
      console.error('[DEGRADED MODE] HTTP listen failed:', listenErr);
      resolve();
    });
  });
}

async function bootstrap() {
  let app: any;
  let configService: ConfigService;
  let port: number;
  let apiPrefix: string;

  // PHASE 1: Construct app + capture config. If this throws (DB, Bull, etc.
  // init failure), fall through to degraded mode so the process stays alive
  // and Render's health check returns 503 instead of marking the deploy as
  // update_failed with no way to see the actual error.
  try {
    process.stdout.write('[boot] phase=construct start\n');
    app = await NestFactory.create(AppModule, { abortOnError: false });
    configService = app.get(ConfigService);
    port = getPort(configService);
    apiPrefix = configService.get('API_PREFIX', 'api/v1');
    process.stdout.write(`[boot] phase=construct ok port=${port}\n`);
  } catch (err) {
    // eslint-disable-next-line no-console
    console.error('[boot] phase=construct FAILED:', err);
    const cfgSvc = app?.get?.(ConfigService);
    const fallbackPort = cfgSvc ? getPort(cfgSvc) : Number(process.env.PORT) || 3001;
    await bootDegradedMode(err, fallbackPort);
    return;
  }

  // PHASE 2: Configure middleware, pipes, swagger. Errors here are also
  // caught so we still get a degraded boot rather than a crash.
  try {
    process.stdout.write('[boot] phase=configure start\n');
    const expressApp = app.getHttpAdapter().getInstance();
    expressApp.set('trust proxy', 1);
    app.use(compression());
    app.use(helmet());

    // CORS — browser sends Origin; it must match exactly (including localhost vs 127.0.0.1).
    const primaryFrontend = configService.get('FRONTEND_URL', 'http://localhost:3000');
    const isDev = configService.get('NODE_ENV') !== 'production';
    const devOrigins = Array.from(
      new Set([
        primaryFrontend,
        'http://localhost:3000',
        'http://localhost:3002',
        'http://127.0.0.1:3000',
        'http://127.0.0.1:3002',
      ].filter(Boolean)),
    );
    app.enableCors({
      origin: isDev ? devOrigins : primaryFrontend,
      credentials: true,
    });

    app.setGlobalPrefix(apiPrefix, { exclude: ['/', '/health'] });

    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
        transform: true,
        transformOptions: {
          enableImplicitConversion: true,
        },
      }),
    );

    if (configService.get('NODE_ENV') !== 'production') {
      const config = new DocumentBuilder()
        .setTitle('Nita Clinic API')
        .setDescription('REST API for Nita Clinic services and administration')
        .setVersion('1.0')
        .addBearerAuth()
        .addTag('auth', 'Authentication endpoints')
        .addTag('doctors', 'Doctor management')
        .addTag('appointments', 'Appointment booking')
        .addTag('departments', 'Department management')
        .addTag('services', 'Services management')
        .addTag('blog', 'Blog posts')
        .addTag('enquiries', 'Contact enquiries')
        .addTag('media', 'Media uploads')
        .addTag('content', 'CMS content')
        .build();

      const document = SwaggerModule.createDocument(app, config);
      SwaggerModule.setup('docs', app, document);
    }

    process.stdout.write('[boot] phase=configure ok\n');
  } catch (err) {
    // eslint-disable-next-line no-console
    console.error('[boot] phase=configure FAILED:', err);
    await bootDegradedMode(err, port);
    return;
  }

  // PHASE 3: Listen. If THIS fails (port in use, etc.), the deploy should
  // still go "live" so we can see the error.
  try {
    process.stdout.write('[boot] phase=listen start\n');
    await app.listen(port, '0.0.0.0');
    // eslint-disable-next-line no-console
    console.log(`
  Nita Clinic API Server
  ============================
  Environment: ${configService.get('NODE_ENV', 'development')}
  Port: ${port}
  API: http://localhost:${port}/${apiPrefix}
  Docs: http://localhost:${port}/docs
  `);
  } catch (err) {
    // eslint-disable-next-line no-console
    console.error('[boot] phase=listen FAILED:', err);
    await bootDegradedMode(err, port);
  }
}

bootstrap().catch((err) => {
  // eslint-disable-next-line no-console
  console.error('[boot] UNHANDLED TOP-LEVEL ERROR:', err);
  // Don't process.exit(1) — let Render's health check see the process
  // still alive. The error is in stderr.
});
