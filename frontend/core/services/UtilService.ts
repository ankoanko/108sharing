import { AxiosInstance } from 'axios'
import { IJsonApiSerializer } from '../JsonApiSerializer'

class UtilService {
  public httpClient: AxiosInstance
  public serializer: IJsonApiSerializer

  constructor(httpClient: AxiosInstance, serializer: IJsonApiSerializer) {
    this.httpClient = httpClient
    this.serializer = serializer
  }

  public getDataFromJson(resource) {
    const data = this.serializer.parseResourceData(resource, resource.data)
    const pagination = { ...resource.meta }
    return { data, pagination }
  }
}

export default UtilService
