import identifications from '../../../test/fixtures/identifications'
import IJsonApiSerializer from '../../JsonApiSerializer'

export default class Mock {
  public serializer: IJsonApiSerializer

  constructor(serializer: IJsonApiSerializer) {
    this.serializer = serializer
  }

  public getIdentificationsFromJson(data) {
    return { identifications, pagination: null }
  }

  public async approveIdentification(id) {
    const identification = {
      ...identifications[0],
      workflow_state: 'approved',
    }
    const flush = {
      message: 'success',
      type: 'success',
    }

    return { identification, flush }
  }

  public async declineIdentification(id) {
    const identification = {
      ...identifications[0],
      workflow_state: 'declined',
    }
    const flush = {
      message: 'success',
      type: 'success',
    }

    return { identification, flush }
  }
}
