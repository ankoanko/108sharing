import * as React from 'react'

interface IProps {}

const AdminFormItem: React.FC<IProps> = props => {
  return <div className="mt-4 first:mt-0">{props.children}</div>
}

export default AdminFormItem
