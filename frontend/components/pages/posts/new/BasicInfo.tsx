import * as React from 'react'
import I18n from 'core/i18n'
import { IMasterItem, IPost, ITag } from 'core/interfaces'
import { Button, CheckBox, InputText, InputTextArea, Select } from 'components/atoms'
import { Form } from 'components/molecules'
import { PAYMENT_REQUIRED } from 'constants/paymentRequired'

const BASIC_INFO_FIELDS = {
  category_id: 'category_id',
  name: 'name',
  description: 'description',
  price: 'price',
  tag_ids: 'tag_ids',
  note: 'note',
}

interface IErrors {
  [key: string]: string | null
}

interface IProps {
  post: IPost
  isNew: boolean
  categories: any
  tags: ITag[]
  conditions: IMasterItem[]
  handleFormSubmit(initialValues: any, values: any): void
  setIsNew(isNew: boolean): void
}

const formatSelectOptions = options => {
  return options.map((option: { id: number; name: string }) => ({
    value: option.id,
    label: option.name,
  }))
}

const BasicInfo: React.FC<IProps> = props => {
  const [isSubmitEnabled, setIsSubmitEnabled] = React.useState(false)
  const [errors, setErrors] = React.useState<IErrors>({})

  const handleUpdateForm = React.useCallback((updatedErrors, updatedIsSubmitEnabled) => {
    setErrors(updatedErrors)
    setIsSubmitEnabled(updatedIsSubmitEnabled)
  }, [])

  return (
    <Form
      fields={BASIC_INFO_FIELDS}
      handleUpdateForm={handleUpdateForm}
      handleSubmit={props.handleFormSubmit}
    >
      <ul>
        <div className="mt-4">
          <Select
            required={true}
            name="category_id"
            label={I18n.t('generic.category')}
            options={formatSelectOptions(props.categories)}
            defaultValue={String(props.post.category_id)}
            error={errors.category_id}
          />
        </div>
        <div className="mt-4">
          <InputText
            required={true}
            name="name"
            label={I18n.t('post.post_name')}
            placeholder={I18n.t('post.post_name')}
            defaultValue={props.post.name}
            error={errors.name}
          />
        </div>
        <div className="mt-4">
          <InputTextArea
            required={true}
            name="description"
            label={I18n.t('post.post_description')}
            placeholder={I18n.t('post.post_description')}
            defaultValue={props.post.description}
            error={errors.description}
          />
        </div>
        <div className="mt-4">
          <InputTextArea
            required={false}
            name="note"
            label={I18n.t('generic.note')}
            placeholder={I18n.t('generic.note')}
            defaultValue={props.post.note}
            error={errors.note}
          />
        </div>
        {PAYMENT_REQUIRED ? (
          <div className="mt-4">
            <InputText
              required={true}
              name="price"
              label={I18n.t('generic.price')}
              placeholder={I18n.t('placeholder.post_price')}
              defaultValue={String(props.post.price)}
              error={errors.price}
            />
          </div>
        ) : (
          <div className="mt-4">
            <input type="hidden" name="price" defaultValue={String(props.post.price)} />
          </div>
        )}
        <div className="mt-4">
          <div>
            <p className="text-sm">{I18n.t('generic.tag')}</p>
            <div className="mt-2">
              {props.tags.map(tag => (
                <div className="mt-3 first:mt-0" key={tag.id}>
                  <CheckBox
                    value={tag.id}
                    name="tag_ids"
                    defaultChecked={props.post.tags.map(tagItem => tagItem.id).includes(tag.id)}
                    label={tag.name}
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      </ul>
      <div className="flex justify-center mt-4">
        <Button type="submit" disabled={!isSubmitEnabled}>
          {props.isNew ? I18n.t('generic.create') : I18n.t('generic.update')}
        </Button>
      </div>
    </Form>
  )
}

export default BasicInfo
