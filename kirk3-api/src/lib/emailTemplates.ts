
export const SIGN_UP_NOTIFICATION_TEMPLATE = `<div>
  <h1>Activate Your Account</h1>
  <p>Hi [[NAME]],</p>
  <p>We are glad that you want to sign up for [[APP_NAME]] 🙂</p>
  <p>Before you start using the app, please complete the sign-up for this email address. You have 24 hours left to do that. After this time, the link will no longer be active.</p>
  <div><a href="[[SIGN_UP_URL]]" style="display:inline-block; color:#fff; background-color:#D396FF; padding: 8px 16px;text-decoration: none;text-align: center;">COMPLETE SIGN-UP</a></div>
  <p>Best regards,</p>
  <p>[[APP_NAME]] Team</p>
</div>`;

export const SIGN_UP_CONFIRMATION_TEMPLATE = `<div>
  <h1>Account Activated</h1>
  <p>Hi [[NAME]],</p>
  <p>Thanks for signing up for [[APP_NAME]]</p>
  <p>Your account is now up and running.😁</p>
  <div><a href="[[LOGIN_URL]]" style="display:inline-block; color:#fff; background-color:#D396FF; padding: 8px 16px;text-decoration: none;text-align: center;">LOGIN</a></div>
  <p>Best regards,</p>
  <p>[[APP_NAME]] Team</p>
</div>`;

export const PASSWORD_RESET_INITIATION_TEMPLATE = `<div>
  <h1>Reset Your Password</h1>
  <p>Hi [[NAME]],</p>
  <p>We received a request for your [[APP_NAME]] account.</p>
  <div><a href="[[CHANGE_PASSWORD_URL]]" style="display:inline-block; color:#fff; background-color:#D396FF; padding: 8px 16px;text-decoration: none;text-align: center;">RESET PASSWORD</a></div>
  <p>If you ignore this message, your password won't be changed.</p>
  <div>
    <p>If you didn't initiate this process, you can safely ignore this message. We take your privacy very seriously. You can review our complete Privacy Policy at:- </p>
    <div><a href="[[PRIVACY_POLICY_URL]]">[[PRIVACY_POLICY_URL]]</a></div>
  </div>
  <p>Best regards,</p>
  <p>[[APP_NAME]] Team</p>
</div>`;

export const PASSWORD_RESET_COMPLETION_TEMPLATE = `<div>
  <h1>Password Reset</h1>
  <p>Hi [[NAME]],</p>
  <p>Your password has been updated. You can now login with the new password.</p>
  <div><a href="[[LOGIN_URL]]" style="display:inline-block; color:#fff; background-color:#D396FF; padding: 8px 16px;text-decoration: none;text-align: center;">LOGIN</a></div>
  <p>Best regards,</p>
  <p>[[APP_NAME]] Team</p>
</div>`;

export const NEW_EXPENSE_NOTIFICATION_TEMPLATE = `<div>
  <h1>New Expense</h1>
  <p>Hi,</p>
  <p>A new expense has been created by [[NAME]].</p>
  <div><a href="[[EXPENSES_URL]]" style="display:inline-block; color:#fff; background-color:#D396FF; padding: 8px 16px;text-decoration: none;text-align: center;">SEE EXPENSES</a></div>
  <p>Best regards,</p>
  <p>[[APP_NAME]] Team</p>
</div>`;

export const UPDATED_EXPENSE_NOTIFICATION_TEMPLATE = `<div>
  <h1>Updated Expense</h1>
  <p>Hi,</p>
  <p>An existing expense has been updated by [[NAME]].</p>
  <div><a href="[[EXPENSES_URL]]" style="display:inline-block; color:#fff; background-color:#D396FF; padding: 8px 16px;text-decoration: none;text-align: center;">SEE EXPENSES</a></div>
  <p>Best regards,</p>
  <p>[[APP_NAME]] Team</p>
</div>`;

export const SUPPORTING_DOCUMENT_NOTIFICATION_TEMPLATE = `<div>
  <h1>Supporting Document Uploaded</h1>
  <p>Hi,</p>
  <p>Supporting documents have been uploaded for a bank transaction by [[TRANSACTION_DETAILS]].</p>
  <div><a href="[[BANK_TRANSACTIONS_URL]]" style="display:inline-block; color:#fff; background-color:#D396FF; padding: 8px 16px;text-decoration: none;text-align: center;">SEE EXPENSES</a></div>
  <p>Best regards,</p>
  <p>[[APP_NAME]] Team</p>
</div>`;
