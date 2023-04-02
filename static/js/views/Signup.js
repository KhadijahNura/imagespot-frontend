import AbstractView from './AbstractView.js';

export default class extends AbstractView {
  constructor() {
    super();
    this.setTitle('Signup | Imagespot');
  }

  async getHTML() {
    return `
       <section
          class="section signup has-bg-image"
          aria-labelledby="uploaded images"
          style="background-image: url('./static/images/image-bg.png')"
        >
          <div class="signup-container">
            <form onsubmit="event.preventDefault(); signup();" class="signup-form">
              <h2 class="headline-sm" id="signup-label">Signup</h2>

              <div class="input-container">

                <div>
                  <label for="first_name" class="label">First Name</label>
                  <input
                    type="text"
                    name="first_name"
                    id="first_name"
                    placeholder="Enter First Name"
                    class="input-field"
                    minlength="3"
                    required
                  />
                </div>

                <div>
                  <label for="last_name" class="label">Last Name</label>
                  <input
                    type="text"
                    name="last_name"
                    id="last_name"
                    placeholder="Enter Last Name"
                    class="input-field"
                    minlength="3"
                    required
                  />
                </div>

                <div>
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
                </div>

                <div>
                  <label for="email" class="label">Email</label>
                  <input
                    type="email"
                    name="email"
                    id="email"
                    placeholder="Enter email"
                    class="input-field"
                    minlength="3"
                    required
                  />
                </div>

                <div>
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
                </div>

              </div>

              <button type="submit" class="btn btn-tertiary" id="signup-btn">Signup</button>

              <p class="form-text">Already have an account? <a href="/login" data-link>Login</a></p>
            </form>
          </div>
        </section>
    `;
  }
}
