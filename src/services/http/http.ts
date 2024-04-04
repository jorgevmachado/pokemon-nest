import { serialize } from '../object';

export abstract class Http {
  private url: string;
  private config: RequestInit;

  protected constructor(url: string, config: RequestInit) {
    this.url = url;
    this.config = config;
  }

  protected get<T>(path: string, params?: Record<string, any>): Promise<T> {
    const url = this.formatUrl(path, params);
    return this.send<T>(url, { method: 'GET' });
  }

  protected async post<B, T = any>(
    path: string,
    body: B = {} as B,
  ): Promise<T> {
    this.config.body = JSON.stringify(body);
    const url = this.formatUrl(path);
    return this.send(url, { method: 'POST' });
  }

  protected formatUrl(path: string, params = {}) {
    const query = serialize(params);
    const url = [this.url, path].filter((i) => i).join('/');

    return `${url}${query || ''}`;
  }

  private static async handle(response: Response) {
    const status = response.status;
    const success = response.ok;

    let json: any;

    try {
      json = await response.json();
    } catch (error) {
      json = undefined;
    }

    const data = { status, response: json };

    if (!success) {
      throw data;
    }

    return data;
  }

  private async send<T>(
    url: string,
    { body, method }: RequestInit,
  ): Promise<T> {
    this.config.method = method;

    if (body) {
      this.config.body = body;
    }

    return fetch(url, this.config as any)
      .then((response) => Http.handle(response as unknown as Response))
      .then((handle) => handle && handle.response)
      .catch((e) => {
        throw e;
      });
  }
}