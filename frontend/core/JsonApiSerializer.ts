import memoize from 'lodash-es/memoize'

interface IAttributes {
  [key: string]: any
}

interface IRelationship {
  id: string
  type: string
}

interface IRelationships {
  [key: string]: {
    data: IRelationship | IRelationship[]
  }
}

export interface IJsonResource {
  attributes: IAttributes
  id: string
  relationships?: IRelationships
  type: string
}

export interface IJsonResponse {
  data: IJsonResource | IJsonResource[]
  included: IJsonResource[]
  meta?: any
}

export interface IJsonApiSerializer {
  parseResourceData(response: IJsonResponse, data: IJsonResource | IJsonResource[]): any
  parseResourceDataObject(response: IJsonResponse, data: IJsonResource | IJsonResource[]): any
}

export default class JsonApiSerializer implements IJsonApiSerializer {
  public parseResourceData(response, data) {
    if (!data) {
      return data
    } else if (Array.isArray(data)) {
      return data.map(dataObj => this.parseResourceDataObject(response, dataObj))
    } else {
      return this.parseResourceDataObject(response, data)
    }
  }

  public parseResourceDataObject(response, data) {
    const result = {}

    Object.keys(data.attributes).forEach(attributeName => {
      Object.defineProperty(result, attributeName, {
        value: data.attributes[attributeName],
        enumerable: true,
      })
    })

    if (!data.relationships) {
      return result
    }

    Object.keys(data.relationships).forEach(relationshipName => {
      const relationshipData = data.relationships[relationshipName].data

      if (Array.isArray(relationshipData)) {
        Object.defineProperty(result, relationshipName, {
          get: memoize(() => {
            const related = relationshipData.map(relationshipItem => {
              const resdata = response.included.find(
                included =>
                  included.id === relationshipItem.id && included.type === relationshipItem.type
              )
              if (resdata) {
                return this.parseResourceDataObject(response, resdata)
              }
            })
            return related.filter(relatedItem => relatedItem !== undefined)
          }),
          enumerable: true,
        })
      } else if (relationshipData) {
        Object.defineProperty(result, relationshipName, {
          get: memoize(() => {
            const resdata = response.included.find(
              included =>
                included.id === relationshipData.id && included.type === relationshipData.type
            )
            return resdata ? this.parseResourceDataObject(response, resdata) : null
          }),
          enumerable: true,
        })
      }
    })

    return result
  }
}
