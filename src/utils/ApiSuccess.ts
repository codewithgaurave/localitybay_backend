import { Response } from 'express';
import httpStatus from 'http-status';

/**
 * This class is used to send success responses.
 * @class SuccessResponse
 * @description This class contains methods to send success responses in a consistent format.
 */
class SuccessResponse {
  /**
   * This method is used to send a success response.
   * @param {Response} res
   * @param {Object} options
   * @returns {Response}
   */
  static send(res: Response, { code = httpStatus.OK, message = 'Success', data = {} }: {
    code?: number;
    message?: string;
    data?: any;
  }) {
    return res.status(code).json({ status: true, code, message, data });
  }

  /**
   * Created - 201
   * This response code indicates that the request has succeeded and
   * a new resource has been created as a result.
   * @param {Response} res
   * @param {any} data
   * @param {string} message
   * @returns {Response}
   */
  static created(res: Response, data: any, message = 'Resource created') {
    return this.send(res, { code: httpStatus.CREATED, message, data });
  }

  /**
   * OK - 200
   * This response code indicates that the request has succeeded.
   * @param {Response} res
   * @param {any} data
   * @param {string} message
   * @returns {Response}
   */
  static ok(res: Response, data: any, message = 'Success') {
    return this.send(res, { code: httpStatus.OK, message, data });
  }

  /**
   * No Content - 204
   * This response code indicates that the server successfully
   * processed the request and is not returning any content as 204 omits the body.
   * @param {Response} res
   * @param {string} message
   * @returns {Response}
   */
  static noContent(res: Response, message = 'No Content') {
    return this.send(res, { code: httpStatus.NO_CONTENT, message });
  }

  /**
   * Accepted - 202
   * This response code indicates that the request has been accepted for async processing,
   * but the processing has not been completed.
   * @param {Response} res
   * @param {any} data
   * @param {string} message
   * @returns {Response}
   */
  static accepted(res: Response, data: any, message = 'Request accepted') {
    return this.send(res, { code: httpStatus.ACCEPTED, message, data });
  }
}

export default SuccessResponse; 