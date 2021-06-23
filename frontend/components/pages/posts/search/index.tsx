import * as React from 'react'
import { IPager } from 'core/interfaces'
import { IJsonResponse } from 'core/JsonApiSerializer'
import PostSearchWithMap from '../search/withMap'
import PostSearchWithoutMap from '../search/withoutMap'

interface IProps {
  isSignedIn: boolean
  favorite: boolean
  posts: any
  meta: IPager
  tags: IJsonResponse
  categories: IJsonResponse
}

// GppgleMapApiKeyの有無をチェック
const element: Element = document.querySelector('meta[name="google-api-key"]')
const apiKey: string = element.getAttribute('content')

const SearchIndex: React.FC<IProps> = props => {
  if (apiKey) {
    return <PostSearchWithMap {...props} />
  } else {
    return <PostSearchWithoutMap {...props} />
  }
}
export default SearchIndex
