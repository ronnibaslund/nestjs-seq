<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://avatars.githubusercontent.com/u/28507035?s=200&v=4" width="120" alt="Nest Logo" /></a>
  <a href="https://datalust.co/" target="blank"><img src="https://datalust.co/img/seq-logo-dark.svg" height="120"  alt="datalust Logo" /></a>
</p>

# nestjs-seq

Seq logging module for Nest framework (node.js) 🐷

[![NPM version][npm-img]][npm-url]
[![NPM Downloads][downloads-image]][npm-url]
[![License][license-img]][license-url]

### Installation

```bash
$ npm i --save @ronnibaslund/nestjs-seq
```

### Quick Start

> Once the installation process is complete, we can import the SeqLoggerModule into the root AppModule.

```js
import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
/**
 * Import the SeqLoggerModule into the root AppModule
 */
import { SeqLoggerModule } from '@ronnibaslund/nestjs-seq';

@Module({
  imports: [
    /**
     * we can import the SeqLoggerModule. Typically, we'll import it into the root AppModule and control its behavior using the .forRoot() static method.
     */
    SeqLoggerModule.forRoot({
      /** Customize a log name to facilitate log filtering */
      serviceName: 'product-service',
      /** The HTTP endpoint address of the Seq server */
      serverUrl: 'http://localhost:5341',
      /** The API Key to use when connecting to Seq */
      apiKey: 'K7iUhZ9OSp6oX5EOCfPt',
      /**
       * Use module globally
       * When you want to use SeqLoggerModule in other modules,
       * you'll need to import it (as is standard with any Nest module).
       * Alternatively, declare it as a global module by setting the options object's isGlobal property to true, as shown below.
       * In that case, you will not need to import SeqLoggerModule in other modules once it's been loaded in the root module
       */
      isGlobal: true,
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
```

```js
/**
 * Async configuration
 * When you need to pass module options asynchronously instead of statically, use the forRootAsync() method.
 * Like other factory providers, our factory function can be async and can inject dependencies through inject.
 */
SeqLoggerModule.forRootAsync({
  imports: [ConfigModule],
  useFactory: async (configService: ConfigService) => ({
    /** Customize a log name to facilitate log filtering */
    serviceName: configService.get('SEQ_SERVICE_NAME'),
    /** The HTTP endpoint address of the Seq server */
    serverUrl: configService.get('SEQ_SERVER_URL'),
    /** The API Key to use when connecting to Seq */
    apiKey: configService.get('SEQ_API_KEY'),
  }),
  inject: [ConfigService],
}),
```

```js
import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
/**
 * import the SeqLogger
 */
import { SeqLogger } from '@ronnibaslund/nestjs-seq';

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    /**
     * Inject the SeqLogger logger
     * We can also inject SeqLogger into controllers and services, etc.
     */
    private readonly logger: SeqLogger,
  ) {}

  @Get()
  getHello(): string {
    this.logger.info('getHello - start');

    const result = this.appService.getHello();
    this.logger.info('getHello - call {service}', {
      service: 'appService',
      result,
      remark: 'Record the returned result',
    });

    try {
      throw new Error('Wow, I reported an error');
    } catch (error) {
      this.logger.error('Record the error', error);
    }
    return result;
  }
}

```

### Seq

> Seq is a centralized log file with superpowers. Check out the logs we collected

![log rendering](https://github.com/ronnibaslund/nestjs-seq/raw/main/rendering.jpg)

[npm-img]: https://img.shields.io/npm/v/@ronnibaslund/nestjs-seq.svg?style=flat-square
[npm-url]: https://npmjs.org/package/@ronnibaslund/nestjs-seq
[license-img]: https://img.shields.io/badge/license-MIT-green.svg?style=flat-square
[license-url]: LICENSE
[downloads-image]: https://img.shields.io/npm/dt/@ronnibaslund/nestjs-seq.svg?style=flat-square
[project-icon]: https://avatars.githubusercontent.com/u/22167571?v=4
