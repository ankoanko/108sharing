import { IPager } from 'core/interfaces'
import * as React from 'react'
import I18n from '../../core/i18n'
import Pagination from '../atoms/Pagination'
import classNames from 'classnames'

interface IColumn {
  name: string
  field: string | ((record) => React.ReactElement)
  required?: boolean
  readOnly?: boolean
  minWidth?: string
  truncate?: boolean
  preWrap?: boolean
}

interface IProps {
  title?: string | React.ReactElement
  columns: IColumn[]
  records: any[]
  editable: boolean
  pagination?: IPager
  handleDelete?(id: number): void
  getEditLink?(id: number): string
}

const EditTable: React.FC<IProps> = ({
  columns,
  records,
  editable,
  pagination,
  handleDelete,
  getEditLink,
}) => {
  const onChangePageHandler = React.useCallback(page => {
    location.href = `${location.pathname}?page=${page}`
  }, [])
  return (
    <div>
      <div className="text-sm -mx-6 overflow-x-auto">
        <table className="text-left min-w-full">
          <thead>
            <tr className="border-t border-b border-neutral-300">
              {columns.map(field => (
                <th key={field.name} className="py-2 px-6 min-w-15 min-h-10 whitespace-no-wrap">
                  {field.name}
                </th>
              ))}
              {editable && (
                <th className="py-2 px-6 px-2 min-w-15 min-h-10 whitespace-no-wrap">
                  {I18n.t('generic.action')}
                </th>
              )}
            </tr>
          </thead>
          <tbody>
            {records.map(record => (
              <EditTableRow
                key={record.id}
                editable={editable}
                columns={columns}
                record={record}
                handleDelete={handleDelete}
                getEditLink={getEditLink}
              />
            ))}
          </tbody>
        </table>
      </div>

      {pagination && (
        <Pagination
          className="mt-6"
          onChangePageHandler={onChangePageHandler}
          currentPage={pagination.current_page}
          prevPage={pagination.prev_page}
          nextPage={pagination.next_page}
          totalPages={pagination.total_pages}
          totalCount={pagination.total_count}
        />
      )}
    </div>
  )
}

interface ICategory {
  id: number
  name_i18n: string
  position: number
}

interface IEditTableRowProps {
  editable: boolean
  columns: IColumn[]
  record: ICategory
  handleDelete?(id: number): void
  getEditLink(id: number): string
}

const EditTableRow: React.FC<IEditTableRowProps> = ({
  editable,
  columns,
  record,
  handleDelete,
  getEditLink,
}) => (
  <tr>
    {columns.map(column => (
      <td
        key={column.name}
        className={classNames([
          'py-2 px-6 px-2 min-w-15 min-h-10 whitespace-no-wrap border-b border-neutral-300',
        ])}
      >
        <div
          className={classNames([
            column.truncate && 'truncate w-60',
            column.preWrap && 'whitespace-pre-wrap w-120',
          ])}
        >
          {(typeof column.field === 'string' || typeof column.field === 'number') && (
            <span>{record[column.field]}</span>
          )}
          {typeof column.field === 'function' && <div>{column.field(record)}</div>}
        </div>
      </td>
    ))}
    {editable && (
      <td
        className={classNames([
          'flex items-center',
          'py-2 px-6 px-2 min-w-15 min-h-10 whitespace-no-wrap border-b border-neutral-300',
        ])}
      >
        {typeof getEditLink === 'function' && (
          <div className="flex items-center ml-6 first:ml-0">
            <a href={getEditLink(record.id)}>
              <svg
                width="16"
                height="17"
                viewBox="0 0 16 17"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M15.3427 5.5075L5.24129 15.6089L1.76388 15.9936C0.756048 16.1051 -0.101764 15.255 0.00979025 14.2395L0.394459 10.7621L10.4959 0.660669C11.3768 -0.220223 12.8 -0.220223 13.6771 0.660669L15.3388 2.32244C16.2197 3.20333 16.2197 4.63045 15.3427 5.5075ZM11.5422 6.69612L9.30724 4.4612L2.16009 11.6122L1.87928 14.1241L4.39117 13.8433L11.5422 6.69612ZM14.0348 3.63031L12.3731 1.96854C12.2153 1.81083 11.9576 1.81083 11.8037 1.96854L10.6151 3.15717L12.85 5.3921L14.0387 4.20347C14.1925 4.04191 14.1925 3.78803 14.0348 3.63031Z"
                  fill="#08C4B3"
                />
              </svg>
            </a>
          </div>
        )}
        {handleDelete && (
          <div className="flex items-center ml-6 first:ml-0">
            <button type="button" onClick={() => handleDelete(record.id)}>
              <svg
                width="15"
                height="18"
                viewBox="0 0 15 18"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M8.97321 13.9286H9.77679C9.88335 13.9286 9.98554 13.8862 10.0609 13.8109C10.1362 13.7355 10.1786 13.6333 10.1786 13.5268V6.29464C10.1786 6.18808 10.1362 6.08589 10.0609 6.01054C9.98554 5.93519 9.88335 5.89286 9.77679 5.89286H8.97321C8.86665 5.89286 8.76446 5.93519 8.68911 6.01054C8.61376 6.08589 8.57143 6.18808 8.57143 6.29464V13.5268C8.57143 13.6333 8.61376 13.7355 8.68911 13.8109C8.76446 13.8862 8.86665 13.9286 8.97321 13.9286ZM14.4643 2.67857H11.705L10.5666 0.780134C10.4238 0.542081 10.2217 0.345098 9.98003 0.208378C9.7384 0.0716593 9.46547 -0.000132033 9.18783 1.82292e-07H5.81216C5.53465 -1.6365e-05 5.26185 0.0718299 5.02035 0.208543C4.77884 0.345257 4.57685 0.542179 4.43404 0.780134L3.29498 2.67857H0.535714C0.393634 2.67857 0.257373 2.73501 0.156907 2.83548C0.0564412 2.93595 0 3.07221 0 3.21429L0 3.75C0 3.89208 0.0564412 4.02834 0.156907 4.12881C0.257373 4.22927 0.393634 4.28572 0.535714 4.28572H1.07143V15.5357C1.07143 15.962 1.24075 16.3707 1.54215 16.6721C1.84355 16.9735 2.25233 17.1429 2.67857 17.1429H12.3214C12.7477 17.1429 13.1565 16.9735 13.4578 16.6721C13.7592 16.3707 13.9286 15.962 13.9286 15.5357V4.28572H14.4643C14.6064 4.28572 14.7426 4.22927 14.8431 4.12881C14.9436 4.02834 15 3.89208 15 3.75V3.21429C15 3.07221 14.9436 2.93595 14.8431 2.83548C14.7426 2.73501 14.6064 2.67857 14.4643 2.67857ZM5.75357 1.70458C5.77148 1.67477 5.79681 1.65013 5.82709 1.63305C5.85738 1.61597 5.89157 1.60705 5.92634 1.60714H9.07366C9.10837 1.6071 9.1425 1.61606 9.17272 1.63313C9.20294 1.65021 9.22822 1.67482 9.24609 1.70458L9.83069 2.67857H5.16931L5.75357 1.70458ZM12.3214 15.5357H2.67857V4.28572H12.3214V15.5357ZM5.22321 13.9286H6.02679C6.13335 13.9286 6.23554 13.8862 6.31089 13.8109C6.38624 13.7355 6.42857 13.6333 6.42857 13.5268V6.29464C6.42857 6.18808 6.38624 6.08589 6.31089 6.01054C6.23554 5.93519 6.13335 5.89286 6.02679 5.89286H5.22321C5.11665 5.89286 5.01446 5.93519 4.93911 6.01054C4.86376 6.08589 4.82143 6.18808 4.82143 6.29464V13.5268C4.82143 13.6333 4.86376 13.7355 4.93911 13.8109C5.01446 13.8862 5.11665 13.9286 5.22321 13.9286Z"
                  fill="#08C4B3"
                />
              </svg>
            </button>
          </div>
        )}
      </td>
    )}
  </tr>
)

export default EditTable
