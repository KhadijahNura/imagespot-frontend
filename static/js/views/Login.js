import AbstractView from './AbstractView.js';

export default class extends AbstractView {
  constructor() {
    super();
    this.setTitle('Login | Imagespot');
  }

  async getHTML() {
    return `
       <section
          class="section login has-bg-image"
          aria-labelledby="uploaded images"
          style="background-image: url('./static/images/image-bg.png')"
        >
          <div class="login-container">
            <form onsubmit="event.preventDefault(); login();" class="login-form">
              <h2 class="headline-sm" id="login-label">Login</h2>

              <label for="username" class="label">Username</label>
              <input
                type="text"
                name="username"
                id="username"
                placeholder="Enter username"
                class="input-field"
                minlength="3"
                required
              />

              <label for="password" class="label">Password</label>
              <input
                type="password"
                name="password"
                id="password"
                placeholder="Enter password"
                class="input-field"
                minlength="3"
                required
              />

              <button type="submit" class="btn btn-tertiary" id="login-btn">Login</button>

              <p class="form-text">Don't have an account? <a href="/signup" data-link>Sign Up</a></p>
            </form>
          </div>
        </section>
    `;
  }
}
