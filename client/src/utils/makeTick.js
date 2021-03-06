import React from 'react';

export default (Comp, interval) => {
	return class extends React.Component {
		state = { n: 0 }
		componentDidMount() { this.timerID = setInterval(() => this._tick(), interval); }
	  componentWillUnmount() { clearInterval(this.timerID); }
	  _tick() { this.setState((state) => ({ n: state.n >= 3 ? 0 : state.n + 1 })) }
	  render() { return <Comp tick={this.state.n} {...this.props} />; }
	}
}