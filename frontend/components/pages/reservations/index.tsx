/** @jsx jsx */
import * as React from 'react'
import I18n from 'core/i18n'
import { CheckBox, Pagination, Spinner, FilterType } from 'components/atoms'
import { useReservations } from 'hooks/useReservations'
import * as camelcaseKeysDeep from 'camelcase-keys-deep'
import ReservationItems from 'components/pages/reservations/ReservationItems'
import { RESERVATION_WORKFLOW_STATE_CONFIG } from 'constants/reservation_workflow_state'
import { HEADER_HEIGHT } from 'constants/constants'
import { css, jsx } from '@emotion/core'

interface IProps {
  isHost: boolean
}

const ReservationsIndex: React.FC<IProps> = props => {
  const {
    loading,
    reservations,
    meta,
    setStates,
    showPast,
    getReservations,
    cancelReservation,
    approveReservation,
    declineReservation,
  } = useReservations({ isHost: props.isHost, runInitialEffect: true })

  const onChangePageHandler = React.useCallback(
    async page => {
      await getReservations({ params: { page } })
    },
    [getReservations]
  )

  const onChangeShowPastHandler = async event => {
    // FIXME FilterTypeとstatesをリンクするのがしんどいのでlocation.hrefしている。本当はここもAPI
    const checked = !!event.target.checked
    location.href = location.pathname + (checked ? '?past=true' : '')
  }

  const onSubmitStates = async ({ states }) => {
    await setStates(states)
    await getReservations({ params: { states }, replaceHistory: true })
  }

  return (
    <div
      className="p-4 bg-texture"
      css={css`
        min-height: calc(var(--inner-height) - ${HEADER_HEIGHT}px);
      `}
    >
      <div className="max-w-screen-sm m-auto">
        <div className="flex justify-between items-center">
          <h2 className="font-bold text-lg">{I18n.t('reservation.index')}</h2>
          <div className="flex-1 flex justify-end items-center -mx-1">
            <div className="whitespace-no-wrap">
              <FilterType
                name={I18n.t('generic.status')}
                field="states"
                handleOnSubmit={onSubmitStates}
                types={Object.entries(RESERVATION_WORKFLOW_STATE_CONFIG).map(([k, v]) => ({
                  id: k,
                  name: v.name,
                }))}
                maxLabelItemCount={2}
              />
            </div>
            <div className="w-40 ml-2">
              <CheckBox
                name="show_passed_reservation"
                label={I18n.t('reservation.show_passed_reservation')}
                defaultChecked={showPast}
                onChangeHandler={onChangeShowPastHandler}
              />
            </div>
          </div>
        </div>

        <div className="my-6 py-4 bg-white rounded-xlg shadow-colored-lg">
          {loading ? (
            <Spinner className="py-6" />
          ) : (
            <React.Fragment>
              {!reservations.length ? (
                <div className="text-lg font-bold text-center py-6">
                  {I18n.t('reservation.no_reservations')}
                </div>
              ) : (
                <ReservationItems
                  isHost={props.isHost}
                  reservations={reservations}
                  showPast={showPast}
                  approveReservation={approveReservation}
                  declineReservation={declineReservation}
                  cancelReservation={cancelReservation}
                />
              )}
            </React.Fragment>
          )}
          {meta?.total_pages > 1 && (
            <div className="border-t border-neutral-300 pt-6">
              <Pagination onChangePageHandler={onChangePageHandler} {...camelcaseKeysDeep(meta)} />
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default ReservationsIndex
