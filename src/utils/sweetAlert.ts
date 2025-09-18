import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';

const MySwal = withReactContent(Swal);

export const confirmDialog = {
  // Delete confirmation
  delete: (itemName: string = 'item') => {
    return MySwal.fire({
      title: 'Are you sure?',
      html: `You are about to delete <strong>"${itemName}"</strong>.<br/>This action cannot be undone.`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#ef4444',
      cancelButtonColor: '#6b7280',
      confirmButtonText: 'Yes, delete it!',
      cancelButtonText: 'Cancel',
      reverseButtons: true,
      customClass: {
        popup: 'font-lora',
        title: 'text-slate-800 font-semibold',
        htmlContainer: 'text-slate-600',
        confirmButton: 'font-medium px-6 py-2 rounded-lg',
        cancelButton: 'font-medium px-6 py-2 rounded-lg',
      },
      buttonsStyling: false,
      backdrop: 'rgba(0,0,0,0.4)',
    });
  },

  // Create confirmation
  create: (itemType: string = 'task') => {
    return MySwal.fire({
      title: `Create New ${itemType}?`,
      text: `Are you sure you want to create this ${itemType}?`,
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#3b82f6',
      cancelButtonColor: '#6b7280',
      confirmButtonText: 'Yes, create it!',
      cancelButtonText: 'Cancel',
      reverseButtons: true,
      customClass: {
        popup: 'font-lora',
        title: 'text-slate-800 font-semibold',
        htmlContainer: 'text-slate-600',
        confirmButton: 'font-medium px-6 py-2 rounded-lg',
        cancelButton: 'font-medium px-6 py-2 rounded-lg',
      },
      buttonsStyling: false,
      backdrop: 'rgba(0,0,0,0.4)',
    });
  },

  // Update confirmation
  update: (itemName: string = 'item') => {
    return MySwal.fire({
      title: 'Save Changes?',
      html: `Do you want to save the changes to <strong>"${itemName}"</strong>?`,
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#10b981',
      cancelButtonColor: '#6b7280',
      confirmButtonText: 'Save Changes',
      cancelButtonText: 'Cancel',
      reverseButtons: true,
      customClass: {
        popup: 'font-lora',
        title: 'text-slate-800 font-semibold',
        htmlContainer: 'text-slate-600',
        confirmButton: 'font-medium px-6 py-2 rounded-lg',
        cancelButton: 'font-medium px-6 py-2 rounded-lg',
      },
      buttonsStyling: false,
      backdrop: 'rgba(0,0,0,0.4)',
    });
  },

  // Success notification
  success: (title: string, message?: string) => {
    return MySwal.fire({
      title,
      text: message,
      icon: 'success',
      timer: 3000,
      timerProgressBar: true,
      showConfirmButton: false,
      customClass: {
        popup: 'font-lora',
        title: 'text-slate-800 font-semibold',
        htmlContainer: 'text-slate-600',
      },
      backdrop: 'rgba(0,0,0,0.4)',
    });
  },

  // Error notification
  error: (title: string, message?: string) => {
    return MySwal.fire({
      title,
      text: message,
      icon: 'error',
      confirmButtonColor: '#ef4444',
      confirmButtonText: 'OK',
      customClass: {
        popup: 'font-lora',
        title: 'text-slate-800 font-semibold',
        htmlContainer: 'text-slate-600',
        confirmButton: 'font-medium px-6 py-2 rounded-lg',
      },
      buttonsStyling: false,
      backdrop: 'rgba(0,0,0,0.4)',
    });
  },
};

export default MySwal;
