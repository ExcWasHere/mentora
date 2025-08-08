import type { MetaFunction } from '@remix-run/node';
import RegisterComponent from '~/Frontend/auth/register';

export const meta: MetaFunction = () => {
  return [
    { title: 'MenTora | Register' },
    { name: 'Greetings', content: 'Welcome to MenTora!' },
  ];
};

export default function RegisterPage() {
  interface RegisterFormData {
    name: string;
    email: string;
    role: string;
    password: string;
    passwordConfirmation: string;
    nip?: string;
    strImage?: File;
  }

  const handleRegister = async (formData: RegisterFormData) => {
  const form = new FormData();
  form.append('name', formData.name);
  form.append('email', formData.email);
  form.append('role', formData.role);
  form.append('password', formData.password);
  form.append('password_confirmation', formData.passwordConfirmation);

  if (formData.role === 'Pemerintah' && formData.nip) {
    form.append('nip', formData.nip);
  }

  if (formData.role === 'Psikolog' && formData.strImage) {
    form.append('str_proof', formData.strImage);
  }

  try {
    const response = await fetch('http://localhost:5000/api/auth/register', {
      method: 'POST',
      body: form,
    });

    const result = await response.json();
    console.log("Register response:", result);

    if (response.ok) {
      const role = formData.role;

      switch (role) {
        case 'User':
          window.location.href = '/personalize/user';
          break;
        case 'Psikolog':
          window.location.href = '/personalize/psikolog';
          break;
        case 'Pemerintah':
          window.location.href = '/personalize/pemerintah';
          break;
        default:
          window.location.href = '/dashboard';
      }
    } else {
      alert(result.message || 'Registrasi gagal');
    }
  } catch (error) {
    console.error('Error:', error);
    alert('Terjadi kesalahan saat mendaftar');
  }
};

  return <RegisterComponent onSubmit={handleRegister} />;
}