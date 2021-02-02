import * as React from 'react'
import * as ReactDOM from 'react-dom'
import {useMemo} from 'react'
import {
  BrowserRouter as Router,
  Switch,
  Route,
} from "react-router-dom";


import {ZAFClientContextProvider, Client} from '@zendesk/sell-zaf-app-toolbox'
import {ThemeProvider} from '@zendeskgarden/react-theming'

import EntryView from './EntryView'

declare var ZAFClient: {
  init: () => Client
}

const Form = () => {
  return (
    <div>This is form</div>
  )
}

const App = () => {
  const client = useMemo(() => ZAFClient.init(), [])
  return (
    <ZAFClientContextProvider value={client}>
      <ThemeProvider>
        <Router>
          <Switch>
            <Route exact path="/new" component={Form} />
            <Route component={EntryView} />
          </Switch>
        </Router>
      </ThemeProvider>
    </ZAFClientContextProvider>
  )
}

ReactDOM.render(<App />, document.getElementById('app'))
