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
  relationships: IRelationships
  type: string
}
