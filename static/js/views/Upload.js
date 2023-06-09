import AbstractView from './AbstractView.js';

export default class extends AbstractView {
  constructor() {
    super();
    this.setTitle('Upload Image | Imagespot');
  }

  async getHTML() {
    return `
        <section
          class="section upload has-bg-image"
          aria-labelledby="uploaded images"
          style="background-image: url('./static/images/image-bg.png')"
        >
          <div class="upload-container">
            <form class="upload-form" onsubmit="event.preventDefault(); uploadImage();">
              <h2 class="headline-sm" id="upload-label">Upload</h2>

              <div class="file-area-container">
                <div class="file-area">
                  <input type="file" aria-label="Upload image" id="image_input_field" accept="image/*" required>
                  <p class="default">Drag image here or click in this area.</p>
                  <p class="success">File selected successfully</p>
                </div>
              </div>
              
              <label for="description" class="label">Description (3-35 characters)</label>
              <textarea
                type="text"
                name="description"
                id="description"
                placeholder="Enter image description"
                class="input-field"
                maxlength="35"
                minlength="3"
                required
              ></textarea>


              <button type="submit" class="btn btn-tertiary">Upload Image</a>
            </form>
          </div>
        </section>
    `;
  }
}
