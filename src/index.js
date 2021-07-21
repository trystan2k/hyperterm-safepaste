// @flow

import filterPasteData from './filters';
import {fromObject as configFromObject} from './config';
import PasteDialog from './PasteDialog.react';

type State = {
  pastedData: ?string,
  pasteCallback: ?(string) => void,
}

type Props = {
  onActive: ?Function,
  onDecorated: ?Function,
  customChildren: ?Array<*>,
  activeSession: ?string
}

export function onWindow(win: any) {
  win.rpc.on('pasted-data', ({data, sessionId}) => {
    const session = win.sessions.get(sessionId);
    session.write(data);
  });
}

export function decorateTerms(Terms: any , { React }: any): any {
  return class SafePasteComponent extends React.Component<Props, State> {
    state: State;
    constructor(props: Props, context) {
      super(props, context);
      this._onDecorated = this._onDecorated.bind(this);
      this._onSafePaste = this._onSafePaste.bind(this);
      this._element = null;
      this.state = {};
    }
  

    _onDecorated: Function;
    _onDecorated(terms) {
      if (this.props.onDecorated) this.props.onDecorated(terms);
      this._terms = terms;
      
      window.addEventListener('paste', this._onSafePaste, {capture: true});
    }

    _onActive = terms=> {
      if (this.props.onActive) this.props.onActive(terms);

      this._element = document.activeElement;
    }

    _onSafePaste: Function;
    _onSafePaste(e) {

      const pastedData = e.clipboardData.getData('text');
      const filtered = filterPasteData(
        configFromObject(window.config.getConfig()),
        pastedData,
      );
      if (!filtered.includes('\n')) {
        return;
      }   

      e.stopPropagation();
      e.preventDefault();

      const pasteCallback = (saferData, noFocus) => {
        this.resetState();
        window.rpc.emit('pasted-data', {data: saferData, sessionId: this.props.activeSession});

        if (!noFocus && this._element) {
          this._element.focus();
        }        
      };
      
      this.setState({
        pastedData,
        pasteCallback,
      });
    }

    resetState = () => {
      this.setState({
        pastedData: null,
        pasteCallback: null,
      });
    }

    _onExit = () => {
      this.resetState();
      if (this._element) {
        this._element.focus();
      }
    }

    render() {
      const customChildren = Array.from(this.props.customChildren || [])
        .concat(React.createElement(PasteDialog, Object.assign({}, {pasteData: this.state.pastedData, continuePasting: this.state.pasteCallback,
          onExit: this._onExit})));

      return React.createElement(Terms, Object.assign({}, this.props, {onActive: this._onActive, onDecorated: this._onDecorated, customChildren: customChildren}));
    }
  };
}
