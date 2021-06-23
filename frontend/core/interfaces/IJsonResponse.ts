import { IPager } from '.'
import { IJsonResource } from './IJson'

export default interface IJsonResponse {
  data: IJsonResource | IJsonResource[]
  included: IJsonResource[]
  meta?: IPager
}
