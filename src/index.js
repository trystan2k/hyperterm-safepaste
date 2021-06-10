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
  customChildren: ?Array,
}

export function decorateTerms(Terms, { React }) {
  return class extends React.Component {
    state: State;
    constructor(props: Props, context) {
      super(props, context);
      this._onDecorated = this._onDecorated.bind(this);
      this._onSafePaste = this._onSafePaste.bind(this);
      this._element = null;
      this.state = {};
    }

    _onDecorated(terms) {
      if (this.props.onDecorated) this.props.onDecorated(terms);
      
      window.addEventListener('paste', this._onSafePaste, {capture: true});
    }

    _onActive = terms=> {
      if (this.props.onActive) this.props.onActive(terms);

      this._element = document.activeElement;
    }

    _onSafePaste(e) {

      if (e.hypertermSafePasteMockPasteEvent) {
        return;
      }
      const pastedData = e.clipboardData.getData('text');
      e.stopPropagation();
      e.preventDefault();
      const pasteCallback = (saferData, noFocus) => {
        const modifiedPasteEvent = Object.assign(new Event('paste'), {
          clipboardData: {
            getData: _ => saferData,
          },
          hypertermSafePasteMockPasteEvent: true,
        });
        this.resetState();
        e.target.dispatchEvent(modifiedPasteEvent);

        if (!noFocus && this._element) {
          this._element.focus();
        }
      };
      const filtered = filterPasteData(
        configFromObject(window.config.getConfig()),
        pastedData,
      );
      if (!filtered.includes('\n')) {
        return pasteCallback(filtered, true);
      }
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
