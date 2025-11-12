class ContactForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      name: '',
      email: '',
      message: '',
      status: null,
      loading: false,
    };

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleChange(e) {
    this.setState({ [e.target.name]: e.target.value, status: null });
  }

  async handleSubmit(e) {
    e.preventDefault();
    const { name, email, message } = this.state;
    if (!name || !email || !message) {
      this.setState({
        status: { type: 'error', text: 'All fields are required' },
      });
      return;
    }
    this.setState({ loading: true });
    try {
      const res = await fetch('/api/entries', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, message }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Server error');
      this.setState({
        name: '',
        email: '',
        message: '',
        status: { type: 'success', text: 'Message sent!' },
      });
    } catch (err) {
      this.setState({
        status: { type: 'error', text: err.message || 'Error sending' },
      });
    } finally {
      this.setState({ loading: false });
    }
  }

  render() {
    return (
      <form onSubmit={this.handleSubmit}>
        <label>
          Name
          <input
            name="name"
            value={this.state.name}
            onChange={this.handleChange}
          />
        </label>

        <label>
          Email
          <input
            name="email"
            value={this.state.email}
            onChange={this.handleChange}
          />
        </label>

        <label>
          Message
          <textarea
            name="message"
            rows="6"
            value={this.state.message}
            onChange={this.handleChange}
          />
        </label>

        <button type="submit" disabled={this.state.loading}>
          {this.state.loading ? 'Sending...' : 'Send'}
        </button>

        {this.state.status && (
          <div
            className={
              this.state.status.type === 'success' ? 'success' : 'error'
            }
            style={{ marginTop: '1rem' }}
          >
            {this.state.status.text}
          </div>
        )}
      </form>
    );
  }
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(React.createElement(ContactForm));
