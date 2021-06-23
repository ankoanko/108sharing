import { post, posts } from '../../../test/fixtures/'
import IJsonApiSerializer from '../../JsonApiSerializer'

export default class Mock {
  public serializer: IJsonApiSerializer

  constructor(serializer: IJsonApiSerializer) {
    this.serializer = serializer
  }

  public getDataFromJson(data) {
    return { data: [] }
  }

  public getPostFromJson(data) {
    return { post }
  }

  public getPostsFromJson(data) {
    return { posts, pagination: null }
  }

  public async search(params) {
    return { posts, pagination: null }
  }

  public async getFavorites(params) {
    return { posts, pagination: null }
  }
}
