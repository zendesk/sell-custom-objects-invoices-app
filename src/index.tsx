import * as React from 'react'
import * as ReactDOM from 'react-dom'
import {useMemo} from 'react'
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link
} from "react-router-dom";


import {ZAFClientContextProvider, Client} from '@zendesk/sell-zaf-app-toolbox'
import {ThemeProvider} from '@zendeskgarden/react-theming'

import EntryView from './EntryView'

declare var ZAFClient: {
  init: () => Client
}

const App = () => {
  const client = useMemo(() => ZAFClient.init(), [])
  return (
    <ZAFClientContextProvider value={client}>
      <ThemeProvider>
        <Router>
          <nav>
            <ul>
              <li>
                <Link to="/">Home</Link>
              </li>
              <li>
                <Link to="/users">Users</Link>
              </li>
            </ul>
          </nav>
          <Switch>
            <Route path="/">
              <EntryView />
            </Route>
            <Route path="/users">
              <div>Janek</div>
            </Route>
          </Switch>
        </Router>
      </ThemeProvider>
    </ZAFClientContextProvider>
  )
}

ReactDOM.render(<App />, document.getElementById('app'))
