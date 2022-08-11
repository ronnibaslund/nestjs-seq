import { Logger } from 'seq-logging';

/**
 * Seq Logger Options interface
 */
export interface SeqLoggerOptions {
  /**
   * App Service Name
   */
  serviceName: string;
  /**
   * Seq Logger
   */
  logger: Logger;
}
