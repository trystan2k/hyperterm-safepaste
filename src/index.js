import filterPasteData from './filters';
import {fromObject as configFromObject} from './config';
import PasteDialog from './PasteDialog.react';

type State = {
  pastedData: ?string,
  pasteCallback: ?(string) => void,
}

type Props = {
  onTerminal: ?Function,
  customChildren: ?Array,
}

export function decorateTerm(Term, { React }) {
  return class extends React.Component {
    state: State;
    constructor(props: Props, context) {
      super(props, context);
      this._onTerminal = this._onTerminal.bind(this);
      this._onPaste = this._onPaste.bind(this);
      this.state = {};
    }

    _onTerminal(term) {
      if (this.props && this.props.onTerminal) {
        this.props.onTerminal(term);
      }

      this._window = term.document_.defaultView;
      this._window.addEventListener('paste', this._onPaste, {capture: true});
    }

    _onPaste(e) {
      if (e.hypertermSafePasteMockPasteEvent) {
        return;
      }
      const pastedData = e.clipboardData.getData('text');
      e.stopPropagation();
      e.preventDefault();
      const pasteCallback = (saferData) => {
        const modifiedPasteEvent = Object.assign(new Event('paste'), {
          clipboardData: {
            getData: _ => saferData,
          },
          hypertermSafePasteMockPasteEvent: true,
        });
        this.resetState();
        e.target.dispatchEvent(modifiedPasteEvent);
      };
      const filtered = filterPasteData(
        configFromObject(window.config.getConfig()),
        pastedData,
      );
      if (!filtered.includes('\n')) {
        return pasteCallback(filtered);
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

    render() {
      const customChildren = Array.from(this.props.customChildren || [])
        .concat(
          <PasteDialog
            pasteData={this.state.pastedData}
            continuePasting={this.state.pasteCallback}
            onExit={this.resetState}
          />
        );
      return <Term
          {...this.props}
          onTerminal={this._onTerminal}
          customChildren={customChildren}
        />;
    }

  };
}
