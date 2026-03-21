import { useEffect, useState } from "react";

function ProfileForm({ profile, onSave }) {
  const [formValues, setFormValues] = useState(profile);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    setFormValues(profile);
  }, [profile]);

  function updateField(name, value) {
    setFormValues((current) => ({
      ...current,
      [name]: value,
    }));
  }

  function validate() {
    const nextErrors = {};

    if (!formValues.fullName.trim()) {
      nextErrors.fullName = "Full name is required.";
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formValues.email)) {
      nextErrors.email = "Enter a valid email address.";
    }

    if (!/^0\d{9}$/.test(formValues.mobile.replace(/\s+/g, ""))) {
      nextErrors.mobile = "Enter a valid Australian mobile number.";
    }

    if (!/^\d{4}$/.test(formValues.postcode)) {
      nextErrors.postcode = "Enter a valid postcode.";
    }

    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  }

  function handleSubmit(event) {
    event.preventDefault();

    if (!validate()) {
      return;
    }

    onSave(formValues);
  }

  function handleReset() {
    setFormValues(profile);
    setErrors({});
  }

  return (
    <form className="form-grid" id="profile-form" onSubmit={handleSubmit} data-testid="profile-form" noValidate>
      <div className="split-panels">
        <div className="form-grid">
          <div className="form-row">
            <label htmlFor="fullName">Full name</label>
            <input
              id="fullName"
              value={formValues.fullName}
              onChange={(event) => updateField("fullName", event.target.value)}
              aria-invalid={Boolean(errors.fullName)}
              aria-describedby={errors.fullName ? "fullName-error" : undefined}
            />
            {errors.fullName ? (
              <span className="form-error" id="fullName-error" role="alert">
                {errors.fullName}
              </span>
            ) : null}
          </div>
          <div className="form-row">
            <label htmlFor="preferredName">Preferred name</label>
            <input
              id="preferredName"
              value={formValues.preferredName}
              onChange={(event) => updateField("preferredName", event.target.value)}
            />
          </div>
          <div className="form-row">
            <label htmlFor="email">Email</label>
            <input
              id="email"
              value={formValues.email}
              onChange={(event) => updateField("email", event.target.value)}
              aria-invalid={Boolean(errors.email)}
              aria-describedby={errors.email ? "email-error" : undefined}
            />
            {errors.email ? (
              <span className="form-error" id="email-error" role="alert">
                {errors.email}
              </span>
            ) : null}
          </div>
          <div className="form-row">
            <label htmlFor="mobile">Mobile</label>
            <input
              id="mobile"
              value={formValues.mobile}
              onChange={(event) => updateField("mobile", event.target.value)}
              aria-invalid={Boolean(errors.mobile)}
              aria-describedby={errors.mobile ? "mobile-error" : undefined}
            />
            {errors.mobile ? (
              <span className="form-error" id="mobile-error" role="alert">
                {errors.mobile}
              </span>
            ) : null}
          </div>
          <div className="form-row">
            <label htmlFor="preferredContactMethod">Preferred contact method</label>
            <select
              id="preferredContactMethod"
              value={formValues.preferredContactMethod}
              onChange={(event) =>
                updateField("preferredContactMethod", event.target.value)
              }
            >
              <option value="Email">Email</option>
              <option value="Mobile">Mobile</option>
              <option value="Mail">Mail</option>
            </select>
          </div>
        </div>

        <div className="form-grid">
          <div className="form-row">
            <label htmlFor="addressLine1">Address</label>
            <input
              id="addressLine1"
              value={formValues.addressLine1}
              onChange={(event) => updateField("addressLine1", event.target.value)}
            />
          </div>
          <div className="form-row">
            <label htmlFor="suburb">Suburb</label>
            <input
              id="suburb"
              value={formValues.suburb}
              onChange={(event) => updateField("suburb", event.target.value)}
            />
          </div>
          <div className="inline-grid">
            <div className="form-row">
              <label htmlFor="state">State</label>
              <select
                id="state"
                value={formValues.state}
                onChange={(event) => updateField("state", event.target.value)}
              >
                <option value="ACT">ACT</option>
                <option value="NSW">NSW</option>
                <option value="NT">NT</option>
                <option value="QLD">QLD</option>
                <option value="SA">SA</option>
                <option value="TAS">TAS</option>
                <option value="VIC">VIC</option>
                <option value="WA">WA</option>
              </select>
            </div>
            <div className="form-row">
              <label htmlFor="postcode">Postcode</label>
              <input
                id="postcode"
                value={formValues.postcode}
                onChange={(event) => updateField("postcode", event.target.value)}
                aria-invalid={Boolean(errors.postcode)}
                aria-describedby={errors.postcode ? "postcode-error" : undefined}
              />
              {errors.postcode ? (
                <span className="form-error" id="postcode-error" role="alert">
                  {errors.postcode}
                </span>
              ) : null}
            </div>
          </div>
          <div className="form-row">
            <label htmlFor="employer">Employer</label>
            <input
              id="employer"
              value={formValues.employer}
              onChange={(event) => updateField("employer", event.target.value)}
            />
          </div>
          <div className="form-row">
            <label htmlFor="occupation">Occupation</label>
            <input
              id="occupation"
              value={formValues.occupation}
              onChange={(event) => updateField("occupation", event.target.value)}
            />
          </div>
        </div>
      </div>

      <div className="button-row">
        <button
          id="profile-save-button"
          type="submit"
          className="button-primary"
          data-testid="profile-save"
        >
          Save changes
        </button>
        <button id="profile-reset-button" type="button" className="button-secondary" onClick={handleReset}>
          Reset
        </button>
      </div>
    </form>
  );
}

export default ProfileForm;
