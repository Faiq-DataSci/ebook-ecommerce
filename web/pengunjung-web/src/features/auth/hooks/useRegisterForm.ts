import { useState, type FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { ROUTES } from '../../../constants/routes';
import { isValidEmail, validatePassword } from '../../../utils/validators';
import { useAuth } from './useAuth';

export interface RegisterFormErrors {
  fullName?: string | null;
  email?: string | null;
  password?: string | null;
  confirmPassword?: string | null;
  acceptTerms?: string | null;
  form?: string | null;
}

export function useRegisterForm() {
  const { register } = useAuth();
  const navigate = useNavigate();

  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [acceptTerms, setAcceptTerms] = useState(false);

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [errors, setErrors] = useState<RegisterFormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const passwordStrengthLevel =
    password.length === 0
      ? 0
      : password.length < 8
        ? 1
        : /[A-Z]/.test(password) && /[0-9]/.test(password)
          ? 3
          : 2;

  const passwordStrengthLabel =
    passwordStrengthLevel === 0
      ? 'Belum diisi'
      : passwordStrengthLevel === 1
        ? 'Kurang dari 8 karakter'
        : passwordStrengthLevel === 2
          ? 'Memenuhi syarat dasar (8+ karakter)'
          : 'Kuat (Huruf besar & angka)';

  const validateAll = (): boolean => {
    const nextErrors: RegisterFormErrors = {};

    if (fullName.trim().length < 3) {
      nextErrors.fullName = 'Nama lengkap minimal terdiri dari 3 karakter.';
    }
    if (!isValidEmail(email)) {
      nextErrors.email =
        'Masukkan alamat email yang valid (contoh: nama@domain.com).';
    }
    const pwdError = validatePassword(password);
    if (pwdError) {
      nextErrors.password = pwdError;
    }
    if (!confirmPassword || confirmPassword !== password) {
      nextErrors.confirmPassword = 'Konfirmasi kata sandi harus sama persis.';
    }
    if (!acceptTerms) {
      nextErrors.acceptTerms =
        'Centang persetujuan syarat pembelian digital untuk melanjutkan.';
    }

    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!validateAll()) return;

    setIsSubmitting(true);
    try {
      await register({
        fullName,
        email,
        password,
        confirmPassword,
        acceptTerms,
      });
      navigate(ROUTES.LIBRARY);
    } catch (err) {
      setErrors({
        form:
          err instanceof Error
            ? err.message
            : 'Pendaftaran akun gagal diproses.',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handlePreviewErrors = () => {
    setErrors({
      fullName: 'Contoh validasi: Nama lengkap minimal terdiri dari 3 karakter.',
      email: 'Contoh validasi: Format alamat email belum lengkap.',
      password: 'Contoh validasi: Kata sandi minimal terdiri dari 8 karakter.',
      confirmPassword: 'Contoh validasi: Konfirmasi kata sandi tidak cocok.',
      acceptTerms: 'Contoh validasi: Persetujuan ketentuan wajib dicentang.',
    });
  };

  return {
    fullName,
    setFullName,
    email,
    setEmail,
    password,
    setPassword,
    confirmPassword,
    setConfirmPassword,
    acceptTerms,
    setAcceptTerms,
    showPassword,
    setShowPassword,
    showConfirmPassword,
    setShowConfirmPassword,
    errors,
    setErrors,
    isSubmitting,
    passwordStrengthLevel,
    passwordStrengthLabel,
    handleSubmit,
    handlePreviewErrors,
  };
}
