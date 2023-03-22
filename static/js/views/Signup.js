import AbstractView from './AbstractView.js';

export default class extends AbstractView {
  constructor(params) {
    super(params);
    this.setTitle('Signup | Imagespot');
  }

  async getHTML() {
    return `
      <link rel="stylesheet" href="./static/css/pages/login.css" />

       <section
          class="section login has-bg-image"
          aria-labelledby="uploaded images"
          style="background-image: url('./static/images/image-bg.png')"
        >
          <div class="login-container">
            <form action="" class="login-form">
              <h2 class="headline-sm" id="login-label">Signup</h2>

              <label for="username" class="label">Username</label>
              <input
                type="text"
                name="username"
                id="username"
                placeholder="Enter username"
                class="input-field"
                required
              />

              <label for="username" class="label">Password</label>
              <input
                type="text"
                name="username"
                id="username"
                placeholder="Enter password"
                class="input-field"
                required
              />

              <a href="#" class="btn btn-tertiary">Signup</a>
            </form>
          </div>
        </section>
    `;
  }
}
