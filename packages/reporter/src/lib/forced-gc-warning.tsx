import { round } from 'lodash'
import React from 'react'

interface Props {
  forcingGc: boolean
}

class ForcedGcWarning extends React.Component<Props> {
  gcStartMs: number | null = null
  gcTotalMs: number = 0

  state = {
    expanded: false,
  }

  _toggleExpando () {
    if (this.state.expanded) {
      // user is toggling it to closed, persist this to preferences
    }

    this.setState({ expanded: !this.state.expanded })
  }

  render () {
    const { forcingGc } = this.props

    if (!forcingGc) {
      if (this.gcStartMs) {
        const duration = Date.now() - this.gcStartMs

        this.gcStartMs = null
        this.gcTotalMs += duration
      }
    }

    if (forcingGc && !this.gcStartMs) {
      this.gcStartMs = Date.now()
    }

    return (
      <div className='forced-gc-warning'>
        <div className={`gc-expando ${this.state.expanded ? 'expanded' : ''}`}>
          <div>
            <strong>
              <i className='fas fa-exclamation-triangle'></i>{' '}
              Why is Cypress freezing between tests?
            </strong>
            <i className='fas fa-times clickable' onClick={() => this._toggleExpando()}></i>
          </div>
          <div>
            Due to <a href='https://bugzilla.mozilla.org/show_bug.cgi?id=1608501' target='_blank' rel='noopener noreferrer'>Firefox bug #1608501</a>, Cypress must force the browser to run garbage collection routines periodically, which causes the UI to freeze. See <a href='https://github.com/cypress-io/cypress/issues/XXXX' target='_blank' rel='noopener noreferrer'>Cypress bug #XXXX</a> for details.
          </div>
        </div>
        <div className={`gc-status-bar ${forcingGc ? 'gc-running' : 'gc-not-running'}`}>
          <span className='status'>
            <i className='fa fa-trash'></i> Forced GC is {!forcingGc && 'not '}currently running
          </span>
          <span className='total-time' title='Total time spent in forced GC during this session'>
            GC timer: {round(this.gcTotalMs / 1000, 2)}s
            <i className='fas fa-info-circle clickable' onClick={() => this._toggleExpando()}></i>
          </span>
        </div>
      </div>
    )
  }
}

export default ForcedGcWarning