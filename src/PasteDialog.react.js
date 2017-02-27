// @flow

import React from 'react';
import AriaModal from 'react-aria-modal';
import invariant from 'invariant';
import color from 'color';

type Props = {
  continuePasting?: (string) => void,
  onExit?: () => void,
  pasteData?: string,
}

type State = {
  editedPaste: string,
}

export default class PasteDialog extends React.Component {
  state: State;

  constructor(props: Props) {
    super(props);
    this.state = {
      editedPaste: props.pasteData || '',
    };
  }

  componentWillReceiveProps(props: Props) {
    this.setState({
      editedPaste: props.pasteData || '',
    });
  }

  doPaste = () => {
    const data = this.state.editedPaste;
    const paste = this.props.continuePasting;
    invariant(data, 'paste data must be set');
    invariant(paste, 'paste function must be set');
    paste(data);
  }

  render() {
    if (this.props.pasteData == null || this.props.continuePasting == null) {
      return <div />;
    }

    const config = window.config.getConfig();
    return <AriaModal
      titleText='You have pasted!'
      onExit={this.props.onExit}
      verticallyCenter={true}
      initialFocus='button#paste'
      >
        <div style={{
          borderRadius: '2px',
          padding: '8px 14px 9px',
          marginLeft: '10px',
          transition: '150ms opacity ease',
          fontSize: config.fontSize + 'px',
          background: color(config.backgroundColor).lighten(0.4).fade(0.3).string(),
          display: 'flex',
          flexDirection: 'column',
        }}>
          <span style={{
            fontSize: config.fontSize * 1.2 + 'px',
            fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", "Roboto", "Oxygen", "Ubuntu", "Cantarell", "Fira Sans", "Droid Sans", "Helvetica Neue", sans-serif',
            color: config.foregroundColor,
          }}>
            You have a chance to edit your multiline paste
            before it reaches the terminal. Esc cancels.
          </span>
          <textarea id='paste-data'
            rows={this.state.editedPaste.split('\n').length}
            style={{
              margin: '1em 0',
              background: config.backgroundColor,
              color: config.foregroundColor,
              fontSize: config.fontSize,
              borderColor: config.borderColor,
              fontFamily: config.fontFamily,
            }}
            onChange={e => this.setState({editedPaste: e.target.value})}
            value={this.state.editedPaste}
          />
          <div style={{textAlign: 'center'}} >
            <button id='paste' onClick={this.doPaste} style={{
              background: 'transparent',
              border: 'none',
              width: '20px',
              height: '20px',
            }}>
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1000 1000" fill={config.foregroundColor}><g><path d="M720.9,396.3c-13.3-8.4-30.9-4.5-39.3,8.8L477.2,728.2L343.8,620.8c-12.2-9.9-30.2-7.9-40,4.5c-9.8,12.4-7.8,30.4,4.4,40.3l158.1,127.2c5.1,4.1,11.3,6.3,17.8,6.3c1.6,0,3.1-0.1,4.7-0.4c8-1.3,15-6,19.3-12.9l221.4-350C738,422.5,734.1,404.8,720.9,396.3z"/><path d="M768.8,141.4h-84.3v-26h-78.2C593.4,60.7,547,10,488.8,10c-58.2,0-108,50.7-120.8,105.4h-78.2v26h-58.5c-85.4,0-155,65.8-155,151.8v540.9c0,85.9,69.5,155.9,155,155.9h537.6c85.4,0,155-70,155-155.9V293.2C923.8,207.2,854.3,141.4,768.8,141.4z M419.9,166.9v-32.8c0-36.8,32.3-71.7,68.9-71.7c36.6,0,63.9,34.9,63.9,71.7v32.8h79.1v133.6H340V166.9H419.9z M869.4,834.1c0,54.4-46.5,102.8-100.5,102.8H231.2c-54.1,0-104.7-48.4-104.7-102.8V293.2c0-54.4,50.6-98.6,104.7-98.6h58.5v159.1h394.9V194.6h84.3c54.1,0,100.5,44.3,100.5,98.6L869.4,834.1L869.4,834.1z"/></g></svg>
            </button>
          </div>
        </div>
      </AriaModal>;
  }
}
