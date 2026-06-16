# Sponsor Management Module

This module handles the creation, updating, deletion, and querying of sponsor projects, along with file management and form validation. Below is a list of the key functions and helpers within the module.

---

## Functions

### `createSponsorProject(options)`

- **Description**: Creates a new sponsor project.
- **API Endpoint**: `/api/sponsor/createSponsorProject`
- **Parameters**:
  - `options`: Contains file, `onSuccess` callback, and `onError` callback.
- **Flow**:
  1. Validates the form.
  2. Prepares form data (including file).
  3. Sends a `POST` request to the backend API.
  4. If successful, triggers the `onSuccess` callback and resets the form.

### `submitUpload()`

- **Description**: Handles the form submission, validating and submitting the form data for upload.
- **Flow**:
  1. Validates the form.
  2. If valid, submits the upload using the `uploadRef`.

### `fetchData()`

- **Description**: Queries the backend for all active sponsor projects.
- **Flow**:
  1. Calls the backend API.
  2. Maps the API response to the table format.
  3. Populates the table with sponsor project data.

### `handleFileDownload(row)`

- **Description**: Handles file download for a selected sponsor project.
- **Parameters**:
  - `row`: The selected row containing project details.
- **Flow**:
  1. Collects the `sponsorId` from the selected project.
  2. Sends a request to download the application file.
  3. Creates a Blob URL for the file and triggers the download.

### `updateSponsorProject()`

- **Description**: Updates the details of a selected sponsor project.
- **Flow**:
  1. Validates the form data.
  2. Sends a request to update the project details.
  3. Refetches the updated sponsor list and resets the form.

### `deleteSelectedRows()`

- **Description**: Deletes selected sponsor projects after user confirmation.
- **Flow**:
  1. Shows a confirmation dialog.
  2. Sends a request to delete the selected projects.
  3. Refetches the sponsor list and clears the selected rows.

---

## Helpers

### `projectTypeMap`

- **Description**: A mapping of project types to their corresponding labels.
- **Type**: Object
- **Usage**: Maps project type values to labels for display in the UI.

### `handleSelectionChange(val)`

- **Description**: Handles the selection of rows in the sponsor project table.
- **Parameters**:
  - `val`: The selected rows.
- **Usage**: Updates the `selectedRows` with the newly selected rows.

### `filterTableData`

- **Description**: Filters the sponsor projects table based on the search criteria.
- **Flow**:
  1. Checks if the search value matches any field in the project data.
  2. Filters the table data accordingly.

### `openDialog()`

- **Description**: Opens the sponsor creation form.
- **Flow**:
  1. Resets the form.
  2. Opens the form in non-editing mode.

### `openEditDialog()`

- **Description**: Opens the sponsor update form with pre-filled data.
- **Flow**:
  1. Verifies that exactly one row is selected.
  2. Populates the form with the selected project's data.

### `resetForm()`

- **Description**: Resets the form to its initial state.
- **Flow**:
  1. Clears form values.
  2. Clears uploaded files.
  3. Resets validation and form state.

### `validateFile(rule, value, callback)`

- **Description**: Validates the uploaded file in the form.
- **Flow**:
  1. Checks if a file exists in the form or if a file has been uploaded.
  2. If no file is uploaded, triggers a validation error.

### `handleFileChange(file, updatedFileList)`

- **Description**: Manages the update of the file list.
- **Flow**:
  1. Updates the `fileList` with the newly uploaded files.

---

## Variables

### `rules`

- **Description**: Stores form validation rules.
- **Type**: Object
- **Usage**: Defines validation rules for form fields like project name, type, URL, and file.

### `pageSize`

- **Description**: Stores the number of items to display per page.
- **Type**: Ref
- **Usage**: Controls pagination for the table data.

### `currentPage`

- **Description**: Stores the current page number for pagination.
- **Type**: Ref
- **Usage**: Tracks the current page when paginating the table.

### `selectedRows`

- **Description**: Stores the selected rows in the sponsor project table.
- **Type**: Ref
- **Usage**: Used for operations such as editing and deleting selected sponsor projects.

---

## Watchers

### `permissionStore.needAccountRefresh`

- **Description**: Watches for changes in account permission after refresh.
- **Flow**: If permission needs to be refreshed, it triggers `fetchData` to reload the sponsor projects.

### `filteredDataLength`

- **Description**: Monitors the filtered table data length.
- **Flow**: Ensures that if the number of filtered items changes, the pagination adjusts accordingly.

---
