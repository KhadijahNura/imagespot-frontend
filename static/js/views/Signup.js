import AbstractView from './AbstractView.js';

export default class extends AbstractView {
  constructor() {
    super();
    this.setTitle('Signup | Imagespot');
  }

  async getHTML() {
    return `
       <section
          class="section login has-bg-image"
          aria-labelledby="uploaded images"
          style="background-image: url('./static/images/image-bg.png')"
        >
          <div class="login-container">
            <form onsubmit="event.preventDefault(); signup();" class="login-form">
              <h2 class="headline-sm" id="login-label">Signup</h2>

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

              <button type="submit" class="btn btn-tertiary" id="signup-btn">Signup</button>

              <p class="form-text">Already have an account? <a href="/login" data-link>Login</a></p>
            </form>
          </div>
        </section>
    `;
  }
}
