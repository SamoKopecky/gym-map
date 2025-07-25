import { isArray } from "@/utils/other"
import { useKeycloak } from "@dsb-norge/vue-keycloak-js"
import type { AxiosProgressEvent } from "axios"
import axios, {
  AxiosError,
  type AxiosRequestConfig,
  type AxiosResponse,
  type ResponseType,
} from "axios"

export const API_BASE_URL = import.meta.env.VITE_APP_BACKEND ?? "http://localhost:2001"
export enum Route {
  Machines = "/machines",
  Exercises = "/exercises",
  Instructions = "/instructions",
  Users = "/users",
  Media = "/media",
  Map = "/map",
}

export interface PatchBase {
  id: number
}

export enum Method {
  GET = "GET",
  PUT = "PUT",
  POST = "POST",
  DELETE = "DELETE",
  PATCH = "PATCH",
}

export abstract class ServiceBase<
  PatchObj extends PatchBase,
  PostObj extends object,
  T extends object,
> {
  protected route: Route

  constructor(routeBase: Route) {
    this.route = routeBase
  }

  private get_api_url(route: string) {
    return `${API_BASE_URL}${route}`
  }

  private jsonHeaders() {
    return { "Content-Type": "application/json" }
  }

  private mediaHeaders() {
    return { "Content-Type": "multipart/form-data" }
  }

  protected async handleRequest<
    JsonParamsT extends object,
    PathParamsT extends object,
    QueryParamsT extends object,
    ResponseT,
  >({
    method,
    pathParams,
    queryParams,
    jsonParams,
    postBody,
    responseType,
    onUploadProgress,
    route,
  }: {
    method: Method
    pathParams?: PathParamsT
    queryParams?: QueryParamsT
    jsonParams?: JsonParamsT
    postBody?: FormData
    responseType?: ResponseType
    onUploadProgress?: (progressEvent: AxiosProgressEvent) => void
    route: string
  }): Promise<ResponseT> {
    let url = this.get_api_url(route)
    if (pathParams) url = replacePathParams(url, pathParams)
    if (queryParams) url = addQueryParams(url, queryParams)

    let data: string | FormData | undefined = undefined
    let headers = this.jsonHeaders()
    if (jsonParams) {
      data = JSON.stringify(jsonParams)
    } else if (postBody) {
      data = postBody
      headers = this.mediaHeaders()
    }

    const request: AxiosRequestConfig = {
      method: method.toString().toLowerCase(),
      headers,
      data,
      url,
      responseType,
      onUploadProgress,
    }

    return axios(request)
      .then((response: AxiosResponse) => {
        return response.data
      })
      .catch((error: AxiosError) => {
        return Promise.reject(
          Error(`Error status: ${error.status} and text: ${error.response?.statusText}`),
        )
      })
  }

  public async get(): Promise<T[]> {
    return this.handleRequest({
      method: Method.GET,
      route: this.route,
    })
  }

  public async post(jsonParams: PostObj): Promise<T> {
    return this.handleRequest({
      jsonParams,
      method: Method.POST,
      route: this.route,
    })
  }

  public async patch(jsonParams: PatchObj): Promise<void> {
    return this.handleRequest({
      jsonParams,
      pathParams: { id: jsonParams.id },
      method: Method.PATCH,
      route: `${this.route}/:id`,
    })
  }

  public async delete(id: number): Promise<void> {
    return this.handleRequest({
      pathParams: { id },
      method: Method.DELETE,
      route: `${this.route}/:id`,
    })
  }
}

export function replacePathParams<T extends object>(url: string, params: T): string {
  Object.keys(params).forEach((key) => {
    url = url.replace(`:${key}`, params[key])
  })
  return url
}

export function addQueryParams<T extends object>(url: string, params: T): string {
  const urlObj = new URL(url)
  Object.keys(params).forEach((key) => {
    const paramVal = params[key]
    if (isArray(paramVal)) {
      paramVal.forEach((val) => {
        urlObj.searchParams.append(key, String(val))
      })
    } else {
      urlObj.searchParams.append(key, params[key])
    }
  })

  return urlObj.toString()
}

export function tokenInterceptor() {
  axios.interceptors.request.use(
    (config) => {
      const keycloak = useKeycloak()
      if (keycloak.authenticated) {
        config.headers.Authorization = `Bearer ${keycloak.token}`
      }
      return config
    },
    (error) => {
      return Promise.reject(error)
    },
  )
}
