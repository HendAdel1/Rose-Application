import {  DynamicFormConfig } from '@org/shared-components';

 export const accountFormConfig: DynamicFormConfig = {
    columns: 12,
    submitLabel: 'Save Changes',
    showCancel: false,
    fields: [
      {
        key: 'avatar',
        label: 'Upload Photo',
        type: 'file',
        // accept: 'image/jpeg,image/png,image/gif',
        colSpan: 12,
        validators: { maxSizeMb: 5 }
      },
      {
        key: 'firstName',
        label: 'First name',
        type: 'text',
        colSpan: 6,
        validators: { required: 'First name is required' }
      },
      {
        key: 'lastName',
        label: 'Last name',
        type: 'text',
        colSpan: 6,
        validators: { required: 'Last name is required' }
      },
      {
        key: 'email',
        label: 'Email',
        type: 'text',
        colSpan: 12,
        validators: {
          required: 'Email is required',
          pattern: '^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$',
          patternMessage: 'Please enter a valid email address'
        }
      },
      {
        key: 'phone',
        label: 'Phone',
        type: 'text',
        colSpan: 12,
        validators: { required: 'Phone number is required' }
      },
      {
        key: 'gender',
        label: 'Gender',
        type: 'select',
        colSpan: 12,
        options: [
          { label: 'Male', value: 'male' },
          { label: 'Female', value: 'female' },
          { label: 'Other', value: 'other' }
        ],
        validators: { required: 'Gender is required' }
      }
    ]
  };


 export const passwordFormConfig: DynamicFormConfig = {
    columns: 12,
    submitLabel: 'Update Password',
    showCancel: true,
    cancelLabel: 'Back to Settings',
    fields: [
      {
        key: 'currentPassword',
        label: 'Current Password',
        type: 'password',
        colSpan: 12,
        validators: { required: 'Current password is required' }
      },
      {
        key: 'newPassword',
        label: 'New Password',
        type: 'password',
        colSpan: 12,
        validators: {
          required: 'New password is required',
          minLength: 8
        },
        helperText: 'Must be at least 8 characters long.'
      },
      {
        key: 'confirmPassword',
        label: 'Confirm New Password',
        type: 'password',
        colSpan: 12,
        validators: { required: 'Please confirm your new password' }
      }
    ]
  };
