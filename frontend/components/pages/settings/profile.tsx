import * as React from 'react'
import { IUser } from 'core/interfaces'
import { IJsonResponse } from 'core/JsonApiSerializer'
import { userService } from 'core/services'
import SettingsLayout from 'components/layouts/SettingsLayout'
import ProfilePanelUserForm from 'components/pages/settings/ProfilePanelUserForm'
import ProfilePanelAuthenticationStatus from 'components/pages/settings/ProfilePanelAuthenticationStatus'
import ProfilePanelAccountForm from 'components/pages/settings/ProfilePanelAccountForm'

interface IProps {
  user: IJsonResponse
  profileRequired: boolean
}

const Profile: React.FC<IProps> = props => {
  const { user: initialUser } = userService.getUserFromJson(props.user)
  const [user, setUser] = React.useState<IUser>(initialUser)

  return (
    <SettingsLayout
      user={user}
      main={
        <div>
          <section className="mt-8 first:mt-0">
            <ProfilePanelUserForm
              user={user}
              setUser={setUser}
              profileRequired={props.profileRequired}
            />
          </section>
          <section className="mt-8 first:mt-0">
            <ProfilePanelAccountForm user={user} setUser={setUser} />
          </section>
          <section className="mt-8 first:mt-0">
            <ProfilePanelAuthenticationStatus user={user} />
          </section>
        </div>
      }
    />
  )
}

export default Profile
