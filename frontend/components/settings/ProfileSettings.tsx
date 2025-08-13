export const firstName = eternalVar("profileSettings.firstName") ?? $("John");
export const lastName = eternalVar("profileSettings.lastName") ?? $("Doe");
export const email = eternalVar("profileSettings.email") ?? $("john.doe@company.com");
export const phone = eternalVar("profileSettings.phone") ?? $("+1 (555) 123-4567");
export const bio = eternalVar("profileSettings.bio") ?? $("Product Manager with 5+ years of experience in task management and team collaboration.");
export const company = eternalVar("profileSettings.company") ?? $("TechCorp Inc.");
export const jobTitle = eternalVar("profileSettings.jobTitle") ?? $("Senior Product Manager");
export const location = eternalVar("profileSettings.location") ?? $("San Francisco, CA");

export function ProfileSettings() {
  function handleSave() {
    alert("Profile updated!");
    // Die Daten sind bereits persistent gespeichert!
  }

  return (
    <div class="profile-settings">
      <div class="card profile-picture-card">
        <div class="card-header">
          <h2 class="card-title">Profile Picture</h2>
          <p class="card-desc">Upload a photo to personalize your account</p>
        </div>
        <div class="card-content">
          <div class="avatar-row">
            <div class="avatar">
              <img src="/placeholder-avatar.jpg" alt="Avatar" />
              <div class="avatar-fallback">
                {(firstName.val?.[0] ?? "")}
                {(lastName.val?.[0] ?? "")}
              </div>
            </div>
            <div class="avatar-actions">
              <button type="button" class="btn-outline btn-photo">
                <i class="fa fa-camera"></i> Change Photo
              </button>
              <p class="avatar-hint">JPG, GIF or PNG. Max size 2MB.</p>
            </div>
          </div>
        </div>
      </div>

      <div class="card personal-info-card">
        <div class="card-header">
          <h2 class="card-title">Personal Information</h2>
          <p class="card-desc">Update your personal details and contact information</p>
        </div>
        <div class="card-content">
          <div class="form-grid">
            <div>
              <label for="firstName" class="form-label">First Name</label>
              <input
                id="firstName"
                class="form-input"
                value={firstName}
                oninput={e => {
                  const target = e.target as HTMLInputElement | null;
                  if (target) firstName.val = target.value;
                }}
              />
            </div>
            <div>
              <label for="lastName" class="form-label">Last Name</label>
              <input
                id="lastName"
                class="form-input"
                value={lastName}
                oninput={e => {
                  const target = e.target as HTMLInputElement | null;
                  if (target) lastName.val = target.value;
                }}
              />
            </div>
          </div>
          <div>
            <label for="email" class="form-label">Email Address</label>
            <input
              id="email"
              type="email"
              class="form-input"
              value={email}
              oninput={e => {
                const target = e.target as HTMLInputElement | null;
                if (target) email.val = target.value;
              }}
            />
          </div>
          <div>
            <label for="phone" class="form-label">Phone Number</label>
            <input
              id="phone"
              class="form-input"
              value={phone}
              oninput={e => {
                const target = e.target as HTMLInputElement | null;
                if (target) phone.val = target.value;
              }}
            />
          </div>
          <div>
            <label for="bio" class="form-label">Bio</label>
            <textarea
              id="bio"
              rows={3}
              class="form-input"
              value={bio}
              oninput={e => {
                const target = e.target as HTMLTextAreaElement | null;
                if (target) bio.val = target.value;
              }}
            />
          </div>
        </div>
      </div>

      <div class="card work-info-card">
        <div class="card-header">
          <h2 class="card-title">Work Information</h2>
          <p class="card-desc">Your professional details and work location</p>
        </div>
        <div class="card-content">
          <div class="work-form-grid">
            <div>
              <label for="company" class="work-form-label">Company</label>
              <input
                id="company"
                class="work-form-input"
                value={company}
                oninput={e => {
                  const target = e.target as HTMLInputElement | null;
                  if (target) company.val = target.value;
                }}
              />
            </div>
            <div>
              <label for="jobTitle" class="work-form-label">Job Title</label>
              <input
                id="jobTitle"
                class="work-form-input"
                value={jobTitle}
                oninput={e => {
                  const target = e.target as HTMLInputElement | null;
                  if (target) jobTitle.val = target.value;
                }}
              />
            </div>
          </div>
          <div>
            <label for="location" class="work-form-label">Location</label>
            <input
              id="location"
              class="work-form-input"
              value={location}
              oninput={e => {
                const target = e.target as HTMLInputElement | null;
                if (target) location.val = target.value;
              }}
              placeholder="City, State/Country"
            />
          </div>
        </div>
      </div>

      <div class="flex-end">
        <button type="button" class="btn-primary" onclick={handleSave}>
          <i class="fa fa-save"></i> Save Changes
        </button>
      </div>
    </div>
  );
}