class Axios {
  defaults: AxiosRequestOptions
  create(options: AxiosConfig): Axios { }
  get(url: string, options?: AxiosRequestOptions): Promise<AxiosResponse | AxiosError>
  post(url: string, payload: any, options?: AxiosRequestOptions): Promise<AxiosResponse | AxiosError>
  put(url: string, payload: any, options?: AxiosRequestOptions): Promise<AxiosResponse | AxiosError>
  delete(url: string, options?: AxiosRequestOptions): Promise<AxiosResponse | AxiosError>
}

declare const axios = new Axios

interface AxiosConfig extends AxiosRequestOptions {
  baseURL: string
  timeout?: number = 8000
  withCredentials?: boolean = false
}

interface AxiosRequestOptions {
  headers?: Expando
  params?: Expando
  query?: Expando
}

interface AxiosResponse {
  data: Expando
}

interface AxiosError {
  status: number
  message: string
  response: AxiosResponse
}

interface Expando {
  [key: string]: any
}