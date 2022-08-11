import { Inject, Injectable } from '@nestjs/common';
import { SeqLoggerOptions } from './interfaces';
import { SEQ_LOGGER } from './seq-logger.constants';
import * as os from 'os';
import { SeqLogLevel, SeqEvent } from 'seq-logging';

/**
 * Seq Logger Service
 */
@Injectable()
export class SeqLogger {
  constructor(
    @Inject(SEQ_LOGGER)
    private readonly seqLoggerOptions: SeqLoggerOptions,
  ) {}

  public verbose(messageTemplate: string, properties?: object): void {
    this.commit('Verbose', messageTemplate, properties);
  }

  public debug(messageTemplate: string, properties?: object): void {
    this.commit('Debug', messageTemplate, properties);
  }

  public info(messageTemplate: string, properties?: object): void {
    this.commit('Information', messageTemplate, properties);
  }

  public warn(messageTemplate: string, properties?: object): void {
    this.commit('Warning', messageTemplate, properties);
  }

  public error(messageTemplate: string, properties?: object | Error): void {
    this.commit('Error', messageTemplate, properties);
  }

  public fatal(messageTemplate: string, properties?: object): void {
    this.commit('Fatal', messageTemplate, properties);
  }

  /**
   * Fix the error that properties are not assigned
   * @param level
   * @param messageTemplate
   * @param properties
   */
  private commit(
    level: SeqLogLevel,
    messageTemplate: string,
    properties?: any,
  ) {
    const { stack, logger, ...props } = properties || {};
    const seqEvent: SeqEvent = {
      timestamp: new Date(),
      level,
      messageTemplate,
      properties: {
        serviceName: this.seqLoggerOptions.serviceName,
        hostname: os.hostname(),
        logger: logger || 'seq',
        ...props,
      },
      exception: stack ? stack : undefined,
    };
    try {
      this.seqLoggerOptions.logger.emit(seqEvent);
    } catch (error) {
      console.error(error, seqEvent);
    }
  }
}
