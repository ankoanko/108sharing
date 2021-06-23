/** @jsx jsx */
import * as React from 'react'
import SearchPanel from 'components/organisms/SearchPanel'
import I18n from 'core/i18n'
import { jsx } from '@emotion/core'
import { IJsonResource } from 'core/interfaces/IJson'
import { postService } from 'core/services'
import { ICategory } from 'core/interfaces'
import { AreaSelect } from 'components/organisms'

interface IProps {
  categories: IJsonResource
}

const Top: React.FC<IProps> = props => {
  const categories = postService.getDataFromJson(props.categories).data as ICategory[]
  return (
    <div>
      <section className="relative h-130 lg:h-135 flex items-center w-full">
        <div className="absolute inset-0">
          <img className="w-full h-full object-cover" src="/images/top/img_cover_top.jpg" alt="" />
        </div>

        <div className="relative flex items-center container">
          <SearchPanel />
        </div>
      </section>
      <div className="py-10">
        <section className="mt-12 first:mt-0">
          <div className="container">
            <AreaSelect title={I18n.t('search_pan.title_recommend')} />
          </div>
        </section>
        <section className="mt-12 first:mt-0">
          <div className="container">
            <h1 className="text-2xl font-bold mb-6">{I18n.t('search_pan.title_type')}</h1>
            <ul className="flex flex-col lg:flex-row -my-2 lg:my-0 -mx-2">
              {categories.slice(0, 3).map(category => (
                <li className="w-full lg:w-1/3 my-2 lg:my-0 px-2 h-44" key={category.id}>
                  <a
                    className="flex items-center justify-center w-full h-full bg-primary-light"
                    href={`/posts/search?category_ids[]=${category.id}&area=${I18n.t(
                      'search_pan.tokyo'
                    )}`}
                  >
                    <span className="text-primary font-bold text-lg">{category.name}</span>
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </section>
      </div>
    </div>
  )
}

export default Top
