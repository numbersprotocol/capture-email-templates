# Capture Email Templates Repository

This repository is designed to manage email templates and test data for the `capture` service. It provides a structured way to organize, validate, and preview email templates.

## Repository Structure

### `./templates`

- Contains all email templates, organized by service, template name, and language.
- **Path structure:**

  ```sh
  ./templates/<service-name>/<template-name>/<language>.html
  ```

- **Defaults:**
  - `service-name`: `capture`
  - `language`: `en-us`

Example:

```sh
./templates/capture/password-reset/en-us.html
```

### `./test`

- Contains test data for templates.
- **Path structure:**

  ```sh
  ./test/<template-name>/data.json
  ```

- Test data is shared across all services and languages for a given template.

Example:

```sh
./test/password-reset/data.json
```

Sample content for `data.json`:

```json
{
  "actionUrl": "https://api.numbersprotocol.io/account/password-reset/0/0",
  "service_info": {
    "display_name": "The Capture Team",
    "service_logo": "https://static-cdn.numbersprotocol.io/Capture+GradWhite+App.png"
  }
}
```

## How to Add or Modify Templates

### Creating a New Set of Templates for a Service

1. **Create the Directory Structure:**

   Run the following command to create a new directory for the service and copy the existing templates from the `capture` service:

   ```bash
   mkdir -p ./templates/<new-service-name> && cp -r ./templates/capture/* ./templates/<new-service-name>/
   ```

   Replace `<new-service-name>` with the name of your new service.

2. **Edit the Templates:**
   Navigate to the new service's directory and update the templates as needed.
   Example:

   ```sh
   nano ./templates/<new-service-name>/password-reset/en-us.html
   ```

3. **Add or Modify Test Data:**
   Test data is shared across services. If necessary, update the corresponding test data in `./test/<template-name>/data.json`.
   Example:

   ```sh
   nano ./test/password-reset/data.json
   ```

4. **Validate Your HTML:**
   Run `npm run test` to ensure your templates are valid.

### Modifying an Existing Template

1. Locate the template in `./templates/<service-name>/<template-name>/<language>.html`.
2. Make your changes.
3. Update the corresponding test data in `./test/<template-name>/data.json` if needed.
4. Run `npm run test` to validate the changes.
5. Preview your changes using `npm run build` and `npm run dev`.

## Commands

### `npm run test`

Validates all HTML templates using the `html-validate` tool to ensure they meet the required standards.

### `npm run build`

Generates a preview webpage (`index.html`) for all templates.

### `npm run dev`

Starts a local development server at `http://localhost:3000` to preview email content in a browser.

## Previewing Email Content

1. Run `npm run build` to generate the preview webpage.
2. Start the development server using `npm run dev`.
3. Open `http://localhost:3000` in your browser.
4. Select a template from the sidebar to view its content on the right-hand side.

## Defaults

- **Service:** `capture`
- **Language:** `en-us`

When adding or modifying templates, these defaults will be used unless specified otherwise.
