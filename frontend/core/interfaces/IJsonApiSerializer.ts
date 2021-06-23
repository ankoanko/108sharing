import { IJsonResponse } from '.'
import { IJsonResource } from './IJson'

export default interface IJsonApiSerializer {
  parseResourceData(response: IJsonResponse, data: IJsonResource | IJsonResource[]): any
  parseResourceDataObject(response: IJsonResponse, data: IJsonResource | IJsonResource[]): any
}
