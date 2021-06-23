// TODO 現在route的には未使用、仕様時にstyled->tailwind作業必要
import * as React from 'react'
import styled from '@emotion/styled'
import I18n from '../../../../core/i18n'
import { IPayments } from '../../../../core/interfaces'
import { payments } from '../../../../test/fixtures'
import { IconCard } from '../../../../icon'
import { Button, Panel } from '../../../atoms'
import { EditTable } from '../../../organisms'
import { userService } from 'core/services'
import SettingsLayout from 'components/layouts/SettingsLayout'

interface IProps {
  payments: IPayments[]
  user: any
}
const COLUMNS = [
  {
    name: I18n.t('payment_history.day'),
    field: 'paid_date',
  },
  {
    name: I18n.t('payment_history.method'),
    field: record => (
      <S.Method>
        <IconCard />
        <span>{record.card}</span>
      </S.Method>
    ),
  },
  {
    name: I18n.t('payment_history.price'),
    field: record => <span>¥{record.amount}</span>,
  },
  {
    name: I18n.t('generic.receipt'),
    field: record => (
      <Button>
        <a href={record.id}>{I18n.t('generic.download')}</a>
      </Button>
    ),
  },
]

const PaymentHistory: React.FC<IProps> = props => {
  const { user: initialUser } = userService.getUserFromJson(props.user)

  return (
    <SettingsLayout
      user={initialUser}
      main={
        <S.Main>
          <Panel title={I18n.t('payment_history.history')}>
            {/* TODO: propsに値が渡ってくるようになったらrecords={props.payments}に変更 */}
            <EditTable editable={false} columns={COLUMNS} records={props?.payments ?? payments} />
          </Panel>
        </S.Main>
      }
    />
  )
}

const S: any = {}
S.Main = styled.div`
  table {
    border-collapse: collapse;
    width: 100%;
  }
  table td,
  table th {
    border-width: 1px 0px; /* 上下だけ引く */
  }
`
S.Method = styled.p`
  align-items: center;
  display: flex;
  svg {
    width: 24px;
    margin-right: 12px;
    object-fit: cover;
  }
`
export default PaymentHistory
