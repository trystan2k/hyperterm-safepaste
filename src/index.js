import filterPasteData from './filters';
import {fromObject as configFromObject} from './config';

export function decorateTerm(Term, { React }) {
  return class extends React.Component {
    constructor(props, context) {
      super(props, context);
      this._onTerminal = this._onTerminal.bind(this);
      this._onPaste = this._onPaste.bind(this);
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
      const clipboardData = e.clipboardData || this._window.clipboardData;
      const pastedData = clipboardData.getData('text');
      e.stopPropagation();
      e.preventDefault();
      const modifiedPaste = Object.assign(new Event('paste'), {
        clipboardData: {
          getData: _ => filterPasteData(
              configFromObject(this._window.config),
              pastedData,
          ),
        },
        hypertermSafePasteMockPasteEvent: true,
      });
      e.target.dispatchEvent(modifiedPaste);
    }

    render() {
      return React.createElement(Term, Object.assign({}, this.props, {
        onTerminal: this._onTerminal
      }));
    }

  };
}
